import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState,useEffect } from 'react';
import Rating from '@/src/components/common/Rating'
import { FiTrash2 } from 'react-icons/fi';
import { GiBrain } from 'react-icons/gi';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MySocialInfo } from '../../types';
import { PostDetail } from '../../types/post';
import { WorkDetail } from '../../types/work';
import CycleSummary from './CycleSummary';
import MosaicItem from './MosaicItem';
import WorkMosaicItem from '@/src/components/work/MosaicItem';
import TagsInput from '../forms/controls/TagsInput';
import useCycle from '@/src/useCycleDetail'
import { Alert, Box, IconButton, Stack, Typography } from '@mui/material';
import { CycleWork } from '@/src/types/cycleWork';
import useExecRatingCycle from '@/src/hooks/mutations/useExecRatingCycle';
import useTopics, { TopicItem } from '@/src/useTopics';
import { TagsLinks } from '../common/TagsLinks';
import Skeleton from '../Skeleton';
import { useShareCycle } from './useShareCycle';
import { useSaveCycleForLater } from './useSaveCycleForLater';
interface Props {
  cycleId:number;
  post?: PostDetail;
  work?: WorkDetail;
  isCurrentUserJoinedToCycle?: boolean;
  participantsCount?: number;
  postsCount?: number;
  worksCount?: number;
  mySocialInfo?: MySocialInfo;
  show?: boolean;
  onCarouselSeeAllAction?: () => Promise<void>;
  onParticipantsAction?: () => Promise<void>;
}
dayjs.extend(isBetween);
const CycleDetailHeader: FunctionComponent<Props> = ({
  cycleId,
  onCarouselSeeAllAction,
  show: s = true
}) => {
  const [show, setShow] = useState<boolean>(s);
  const {data:session} = useSession();
  const { t } = useTranslation('cycleDetail');
  const {data:cycle,isLoading:isLoadingCycle} = useCycle(cycleId
    // ,{enabled:!!cycleId}
  );
  
  const{data:topicsAll}=useTopics();
  const topics:TopicItem[] =  cycle?.topics?.split(',').map(ts=>{
    const topic = topicsAll?.find(t=>t.code==ts);
    return {code:ts,emoji:topic ? topic.emoji: '',label:ts};
  })??[];
  
  const works = cycle?.cycleWorksDates?.length 
    ? cycle?.cycleWorksDates?.map(c=>c.work)
    : cycle?.works

  const [qty, setQty] = useState(cycle?.ratingAVG||0);
  const [qtyByUser,setqtyByUser] = useState(0);

  const {ShareCycle}=useShareCycle(cycleId);
  const {SaveForLater}=useSaveCycleForLater(cycleId);
  useEffect(()=>{
    if(cycle){
      setQty(cycle?.ratingAVG||0);
      const currentRating = cycle?.ratings.filter(c=>c.userId==session?.user.id);
      setqtyByUser(currentRating?.length ? currentRating[0].qty : 0);
    }
  },[cycle])

  const getFullSymbol = () => {
    if (cycle && cycle.currentUserRating) return <GiBrain style={{ color: 'var(--eureka-blue)' }} />;

    return <GiBrain style={{ color: 'var(--eureka-green)' }} />;
  };

  const getRatingQty = () => {
    if (cycle) {
      return cycle._count?.ratings || 0;
    }
    return 0;
  };

  const getRatingAvg = () => {
    if (cycle) {
      return cycle.ratingAVG || 0;
    }
    return 0;
  };
  
  const {mutate:execRating} = useExecRatingCycle({
    cycle:cycle!,
  });

  const handlerChangeRating = (value: number) => {
    setQty(value);
    setqtyByUser(value);
    execRating({
      ratingQty: value,
      doCreate: value ? true : false,
    });
  };

  const clearRating = () => {
    setQty(0);
    execRating({
      ratingQty: 0,
      doCreate: false,
    });
  };

  const getWorksSorted = () => {
    const res: CycleWork[] = [];
    if(!cycle)return []
    if(!cycle.cycleWorksDates)return works||[];
    (cycle.cycleWorksDates as CycleWork[])
      .sort((f, s) => {
        const fCD = dayjs(f.startDate!);
        const sCD = dayjs(s.startDate!);

        const isActive = (w: {startDate:Date|null;endDate:Date|null}) => {
          if (w.startDate && w.endDate) return dayjs().isBetween(w.startDate!, w.endDate);
          if (w.startDate && !w.endDate) return dayjs().isAfter(w.startDate);
          return false;
        };
        const isPast = (w: {startDate:Date|null;endDate:Date|null})  => {
          if (w.endDate) return dayjs().isAfter(w.endDate);
          return false;
        };
        // orden en Curso, Siguientes y por ultimo visto/leido
        if (!isPast(f) && isPast(s)) return -1;
        if (isPast(f) && !isPast(s)) return 1;
        if (isActive(f) && !isActive(s)) return -1;
        if (!isActive(f) && isActive(s)) return 1;
        if (fCD.isAfter(sCD)) return 1;
        if (fCD.isSame(sCD)) return 0;
       
        return -1;
      })
      .forEach((cw) => {
        if (works) {
          const idx = works?.findIndex((w) => w!.id === cw.workId);
          res.push(works[idx]! as unknown as CycleWork);          
        }
      });
    if (cycle.cycleWorksDates.length) return res;

    return works;
  };

  if(isLoadingCycle) return <Skeleton type='card'/>
  if(!cycle)return <Alert color='warning'>{t('common:Not found')}</Alert>;

  return <Box>
      <Stack direction={{xs:'column',sm:'row'}} gap={2}>
        <Stack flex={1} gap={1}>
          <Stack gap={1} sx={{display:{xs:'flex',sm:'none'}}} paddingBottom={1}>
            <Typography color={'secondary'} variant='h1' fontSize={'1.7rem'} fontWeight={'bold'}>{cycle.title}</Typography>
            <Stack direction={{xs:'column',md:'row'}} gap={1}>
              <Stack direction={'row'} gap={1}>
                <Rating
                  readonly
                  qty={qty}
                  OnChange={handlerChangeRating}
                  stop={5}
                  size="small"
                />
                {getRatingAvg().toFixed(1)}
                {' - '}
                {getRatingQty()}
                <Typography>{t('common:ratings')}</Typography>
              </Stack>
              {cycle.topics && (
                <Stack direction={'row'} flexWrap={'wrap'}>
                  <TagsLinks topics={topics??[]}/>
                  <TagsInput className="d-flex flex-row ms-1" tags={cycle.tags!} readOnly label="" />
                </Stack>
              )}
            </Stack>
          </Stack>
          <MosaicItem cycleId={cycle.id} sx={{
                          'img':{
                            xs:{maxWidth:'100%'},
                            sm:{maxWidth:'250px',height:'auto'},
                          }
                        }}
          />
          <Stack direction={'row'} alignItems={'center'} justifyItems={'center'} paddingTop={1}>
            <Rating
              qty={qtyByUser}
              OnChange={handlerChangeRating}
              size="medium"
              iconColor="var(--bs-danger)"
            />
            {
            qtyByUser > 0 
              ? <IconButton
              type="button"
              size='small'
              title={t('common:clearRating')}
              color='warning'
              onClick={clearRating}
              // disabled={loadingSocialInteraction}
            >
              <FiTrash2 />
            </IconButton>
              : <></>  
            }
          </Stack>
          <ShareCycle sx={{textTransform:'none',width:'250px'}}/>
          <SaveForLater sx={{textTransform:'none',width:'250px'}}/>
        </Stack>
        <Stack flex={3} gap={1}>

          <Stack gap={1} sx={{display:{xs:'none',sm:'flex'}}}>
            <Typography color={'secondary'} variant='h1' fontSize={'1.7rem'} fontWeight={'bold'}>{cycle.title}</Typography>
            <Stack direction={{xs:'column'}} gap={1}>
              <Stack direction={'row'} gap={1}>
                <Rating
                  readonly
                  qty={qty}
                  OnChange={handlerChangeRating}
                  stop={5}
                  size="small"
                />
                {getRatingAvg().toFixed(1)}
                {' - '}
                {getRatingQty()}
                <Typography>{t('common:ratings')}</Typography>
              </Stack>
              {cycle.topics && (
                <Stack direction={'row'} flexWrap={'wrap'}>
                  <TagsLinks topics={topics??[]}/>
                  <TagsInput className="d-flex flex-row ms-1" tags={cycle.tags!} readOnly label="" />
                </Stack>
              )}
            </Stack>
          </Stack>

          <Stack gap={1}>
            <h2 className="mt-4 mb-1 text-dark" style={{ fontSize: '1.4rem' }}>
              {t('Content calendar')} ({works && works.length})
            </h2>
            <CycleSummary cycleId={cycle.id} />
            <Stack direction={'row'} gap={1}  flexWrap={'wrap'} justifyContent={{xs:'center',md:'left'}}>
                {
                  getWorksSorted()?.map(w=><WorkMosaicItem Width={160} Height={160*1.36} key={`work-${w?.id!}`} workId={w?.id!} />)??<></>
                }
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>;
};
export default CycleDetailHeader;
