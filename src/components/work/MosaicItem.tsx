// import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent /*  useEffect, useState */, useEffect, useState } from 'react';
import { Card, Badge, Spinner } from 'react-bootstrap';
// import { MySocialInfo } from '@/src/types';
// import { PostDetail } from '../../types/post';
import { useQuery,useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
// import { useSession } from 'next-auth/client';
import { CgMediaLive } from 'react-icons/cg';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isBetween from 'dayjs/plugin/isBetween';
import { CycleMosaicItem,CycleDetail } from '../../types/cycle';
import { /* WorkWithImages, */ WorkMosaicItem } from '../../types/work';
import LocalImageComponent from '../LocalImage';
import styles from './MosaicItem.module.css';
import SocialInteraction from '../common/SocialInteraction';
// import { Session } from '../../types';
// import { useCycleContext } from '../../useCycleContext';
// import { useWorkContext } from '../../useWorkContext';
import { DATE_FORMAT_SHORT } from '../../constants';
import useWork from '@/src/useWork'
import usePosts from '@/src/usePosts'
dayjs.extend(isBetween);
dayjs.extend(utc);
interface Props {
  // workWithImages: WorkWithImages;
  workId: number;
  showButtonLabels?: boolean;
  showShare?: boolean;
  showSocialInteraction?: boolean;
  style?: { [k: string]: string };
  cacheKey?: [string,string];
  showTrash?: boolean;
  linkToWork?: boolean;
  tiny?: boolean;
  className?:string;
  // isOnDiscussion?: boolean;
}
const MosaicItem: FunctionComponent<Props> = ({
  workId,
  showButtonLabels = false,
  // showShare = false,
  showSocialInteraction = true,
  style = undefined,
  cacheKey = undefined,
  showTrash = false,
  linkToWork = true,
  tiny = false,
  className = '',
  // isOnDiscussion = false,
}) => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient()
  // const cycleContext = useCycleContext();
  const [cycle, setCycle] = useState<CycleDetail | null>();
  // useEffect(() => {
  //   if (cycleContext) setCycle(cycleContext.cycle);
  // }, [cycleContext]);
  const [loading, setLoading] = useState<boolean>(false);
  // const { linkToWork = true, work: workFromContext } = useWorkContext();
  // const [WORK] = useState<WorkMosaicItem>(work!);
  const router = useRouter();
  
  const {data:work} = useWork(workId,{
    enabled:!!workId
  })

  const { data: posts, isLoading: isLoadingPosts } = usePosts(
    work ? {works:{some:{id:work.id}}}:undefined,
    undefined,
    { enabled: !!(work && work.id) }
  )
  
  useEffect(()=>{
    if(work && posts){
      posts.forEach(p => {
        queryClient.setQueryData(['POST',`${p.id}`],p)
      });
    }
  },[work,queryClient])
  
  
  if(!work)return <></>
  
  const { id, /* author, */ title, localImages, type } = work;

  const isActive = () => {
    if (cycle && cycle.cycleWorksDates) {
      if (cycle.cycleWorksDates.length) {
        const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
        if (idx > -1) {
          const cw = cycle.cycleWorksDates[idx];
          if (cw.startDate && cw.endDate)
            return dayjs().utc().isBetween(dayjs(cw.startDate), dayjs(cw.endDate), 'day', '[]');
          if (cw.endDate) return dayjs().isBefore(cw.endDate);
        }
      }
    }
    return false;
  };

  const renderOngoinOrUpcomingDate = () => {
    if (cycle && cycle.cycleWorksDates) {
      if (cycle.cycleWorksDates.length) {
        const idx = cycle.cycleWorksDates.findIndex((cw) => cw.workId === work.id);
        if (idx > -1) {
          const cw = cycle.cycleWorksDates[idx];
          if (cw.endDate) {
            const sd = cw.startDate ? dayjs(cw.startDate).utc().format(DATE_FORMAT_SHORT) : '-';
            const ed = dayjs(cw.endDate).utc().format(DATE_FORMAT_SHORT);

            const isPast = dayjs().isAfter(cw.endDate);

            const res = () => {
              const dateOut = (
                <span>
                  <em style={{ fontSize: '.8em' }}>{`${sd} - ${ed}`}</em>
                </span>
              );
              const labelOut = (label: string) => <span className="d-block">{`${t(label)}`}</span>;
              if (isActive())
                return (
                  <>
                    {labelOut('Ongoing')}
                    {dateOut}
                  </>
                );
              if (!isPast)
                return (
                  <>
                    {labelOut('Upcoming')}
                    {dateOut}
                  </>
                );
              return (
                <>
                  {labelOut('Past')}
                  {dateOut}
                </>
              );
            };
            return (
              <h6 className="d-block w-100 text-center mt-2 text-gray-dark position-absolute" style={{ top: '100%' }}>
                {res()}
              </h6>
            );
          }
        }
      }
    }
    return <></>;
  };


  // const [work, setWork] = useState<WorkDetail>();
  // const s
  // const { data: workData } = useQuery(['WORKS', id]);
  // useEffect(() => {
  //   if (workData) {
  //     setWork(workData as WorkDetail);
  //   }
  // }, [workData]);
  const canNavigate = () => {
    return !loading;
  };
  const onImgClick = () => {
    if (canNavigate()) router.push(`/work/${id}`);
    setLoading(true);
  };
  const renderLocalImageComponent = () => {
    const img = localImages 
      ? <LocalImageComponent width={258} height={384} filePath={localImages[0].storedFile} alt={title} />
      : undefined;
    if (linkToWork) {
      return (
        <div
          className={`${styles.imageContainer} ${!loading ? 'cursor-pointer' : ''}`}
          onClick={onImgClick}
          role="presentation"
          style={style}
        >
          {/* <Link href={`/work/${id}`}> */}
          {/* <a className={`cursor-pointer ${!loading ? 'pe-auto' : ''}`} aria-disabled="true"> */}
          {!canNavigate() && <Spinner className="position-absolute top-50 start-50" animation="grow" variant="info" />}
          {img}
          {/* </a> */}
          {/* </Link> */}
        </div>
      );
    }
    return img;
  };
  return (
    <Card className={`${tiny ? 'mosaic-tiny' : 'mosaic'} ${isActive() ? 'my-1 isActive' : ''} ${className}`} data-cy={`mosaic-item-work-${id}`}>
      <div className={`${styles.imageContainer} ${tiny ? styles.imageContainerTiny : ''}`}>
        {renderLocalImageComponent()}
        {isActive() && <CgMediaLive className={`${styles.isActiveCircle}`} />}
        <Badge bg="orange" className={`fw-normal fs-6 text-black px-2 rounded-pill ${styles.type}`}>
          {t(type)}
        </Badge>
      </div>
      {renderOngoinOrUpcomingDate()}
      {showSocialInteraction && work && (
        <Card.Footer className={styles.footer}>
          <SocialInteraction
            cacheKey={cacheKey || ['WORK',work.id.toString()]}
            showButtonLabels={showButtonLabels}
            showCounts
            entity={work}
            showTrash={showTrash}
          />
        </Card.Footer>
      )}
    </Card>
  );
};

export default MosaicItem;
