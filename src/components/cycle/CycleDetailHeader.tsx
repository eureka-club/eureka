import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState,useEffect } from 'react';
import { Col, Row,Button } from 'react-bootstrap';
import Rating from '@/src/components/common/Rating'
import { FiTrash2 } from 'react-icons/fi';
import { GiBrain } from 'react-icons/gi';
import {BsChevronUp, BsX} from 'react-icons/bs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MySocialInfo } from '../../types';
import { PostDetail } from '../../types/post';
import { WorkDetail, WorkSumary } from '../../types/work';
import CycleSummary from './CycleSummary';
import styles from './CycleDetailHeader.module.css';
import MosaicItem from './MosaicItem';
import TagsInput from '../forms/controls/TagsInput';
import UserAvatar from '../common/UserAvatar';
import { MosaicContext } from '../../useMosaicContext';
import useCycle from '@/src/useCycle'
import CarouselStatic from '../CarouselStatic';
import { Box } from '@mui/material';
import { CycleWork } from '@/src/types/cycleWork';
import useExecRatingCycle from '@/src/hooks/mutations/useExecRatingCycle';
import { CycleSumary } from '@/src/types/cycle';
import useTopics, { TopicItem } from '@/src/useTopics';
import { TagsLinks } from '../common/TagsLinks';
import Spinner from '@/components/common/Spinner';
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
    //console.log(cycle.cycleWorksDates,'cycle.cycleWorksDates')
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

  if(isLoadingCycle) return <Spinner/>
  if(!cycle)return <></>

  return (
    cycle && (
      <section className="d-flex flex-column-reverse flex-xl-row mb-1 mb-lg-5">
        {/* xs={{ span: 12, order: 2 }} md={{ span: 7, order: 1 }} lg={{ span: 8 }}*/}
        <Col className="d-none d-xl-flex col-12 col-md-2 col-lg-3 justify-content-center justify-content-lg-start">
          <aside className="d-flex flex-column">
            {/* <div className="mt-3">
              <UserAvatar userId={cycle.creatorId} name={cycle.creator.name!} size='small' />
            </div> */}
            <MosaicContext.Provider value={{ showShare: true, cacheKey: ['CYCLE', `${cycle.id}`] }}>
              <MosaicItem
                cycleId={cycle.id}
                size={'large'}
              />
            </MosaicContext.Provider>
            <Box className="d-flex flex-row align-items-baseline" mt={1}>
              <Rating
                qty={qtyByUser}
                onChange={handlerChangeRating}
                size="medium"
                iconColor="var(--bs-danger)"
              />{qtyByUser > 0 && <Button
                type="button"
                title={t('common:clearRating')}
                className="text-warning p-0 ms-2"
                onClick={clearRating}
                variant="link"
              >
                <FiTrash2 />
              </Button>}
            </Box>
          </aside>
        </Col>
        <Col className="mt-3 ms-lg-3 mt-lg-0 col-12 col-md-10 col-lg-9 d-none d-xl-flex flex-column justify-content-center justify-content-lg-start">
          <h1 className="d-none d-xl-block mb-1 fw-bold text-secondary">{cycle.title}</h1>
          <div className="d-flex flex-row justify-content-start">
            {/* @ts-ignore*/}
            {/* <Rating
            readonly
            initialRating={getRatingAvg()}
            // onChange={handlerChangeRating}
            className={`d-flex flex-nowrap ${styles.rating}`}
            stop={5}
            emptySymbol={<GiBrain style={{ color: 'var(--eureka-grey)' }} />}
            fullSymbol={getFullSymbol()}
          /> */}
            <Rating
              readonly
              qty={qty}
              onChange={handlerChangeRating}
              stop={5}
              size="small"
            />{' '}
            <div className="d-flex flex-nowrap ms-2">
              {getRatingAvg().toFixed(1)}
              {' - '}
              {getRatingQty()}
            </div>
            <span className="ms-1 text-gray">{t('common:ratings')}</span>
            {cycle.topics && (
              <section className=" d-flex flex-nowrap ms-2">
                <TagsLinks topics={topics??[]}/>
                {/* <TagsInput
                  avatarValue={getTopicEmoji(topicItem)}
                  formatValue={(v: string) => t(`topics:${v}`)}
                  className="d-flex flex-row"
                  tags={cycle.topics}
                  readOnly
                /> */}
                <TagsInput className="d-flex flex-row ms-1" tags={cycle.tags!} readOnly label="" />
              </section>
            )}
          </div>
          <div className="">
            <h2 className="mt-4 mb-1 text-dark" style={{ fontSize: '1.4rem' }}>
              {t('Content calendar')} ({works && works.length})
            </h2>

            <CarouselStatic
              cacheKey={['CYCLE', cycle.id.toString()]}
              showSocialInteraction={false}
              // onSeeAll={async () => seeAll(works as WorkDetail[], t('Eurekas I created'))}
              onSeeAll={onCarouselSeeAllAction}
              title={<CycleSummary cycleId={cycle.id} />}
              data={getWorksSorted() as WorkSumary[]}
              iconBefore={<></>}
              customMosaicStyle={{ height: '16em' }}
              size="small"
              mosaicBoxClassName="pb-5"
              // iconAfter={<BsCircleFill className={styles.infoCircle} />}
            />
          </div>
          {/* </CycleContext.Provider> */}
        </Col>
        {/*xs={{ span: 12, order: 1 }} md={{ span: 5, order: 2 }} lg={{ span: 4 }}*/}

        {show && (
          <Col className="mt-3 col-12  d-flex flex-column justify-content-center d-xl-none">
            <div className="">
              <h4 className="mt-3 mb-1 text-dark">
                {t('Content calendar')} ({works && works.length})
              </h4>
              <CarouselStatic
                cacheKey={['CYCLE', cycle.id.toString()]}
                showSocialInteraction={false}
                onSeeAll={onCarouselSeeAllAction}
                title={<CycleSummary cycleId={cycle.id} />}
                data={getWorksSorted() as WorkSumary[]}
                iconBefore={<></>}
                customMosaicStyle={{ height: '16em' }}
                size={'small'}
                mosaicBoxClassName="pb-5"
                // iconAfter={<BsCircleFill className={styles.infoCircle} />}
              />
            </div>
            {/* </CycleContext.Provider> */}
          </Col>
        )}

        {show && (
          <Col className="col-12 d-flex justify-content-center d-xl-none">
            <aside className="d-flex flex-column">
              <MosaicContext.Provider value={{ showShare: true, cacheKey: ['CYCLE', `${cycle.id}`] }}>
                <MosaicItem
                  cycleId={cycle.id}
                  size={'large'}
                />
              </MosaicContext.Provider>
              <Box className="d-flex flex-row justify-content-center align-items-baseline" mt={2}>
                <Rating
                  qty={qtyByUser}
                  onChange={handlerChangeRating}
                  size="medium"
                  iconColor="var(--bs-danger)"
                />{qtyByUser > 0 && <Button
                  type="button"
                  title={t('common:clearRating')}
                  className="text-warning p-0 ms-2"
                  onClick={clearRating}
                  variant="link"
                >
                  <FiTrash2 />
                </Button>}
              </Box>
            </aside>
          </Col>
        )}
        <Col className="col-12 d-flex justify-content-between align-items-baseline d-xl-none">
          <Row>
            <UserAvatar userId={cycle.creatorId} name={cycle.creator.name!} />
          </Row>
          <Row>
            {show && (
              <span
                className={`cursor-pointer text-primary me-1 mb-2 ${styles.closeButton}`}
                role="presentation"
                onClick={() => setShow(false)}
              >
                {' '}
                {t('Close')} <BsX style={{ color: 'var(--eureka-green)' }} />{' '}
              </span>
            )}
            {!show && (
              <span
                className={`cursor-pointer text-primary me-1 mb-2 ${styles.closeButton}`}
                role="presentation"
                onClick={() => setShow(true)}
              >
                {' '}
                {t('Details')} <BsChevronUp style={{ color: 'var(--eureka-green)' }} />{' '}
              </span>
            )}
          </Row>
        </Col>
        <Col className="col-12 d-xl-none">
          <h1 className=" mb-1 fw-bold text-secondary">{cycle.title}</h1>
          {cycle.topics && (
            <aside className="d-flex flex-wrap d-lg-inline-block mb-4">
              <TagsInput
                formatValue={(v: string) => t(`topics:${v}`)}
                className="d-flex flex-wrap d-lg-inline-block"
                tags={cycle.topics}
                readOnly
              />
              <TagsInput className="ms-1 d-flex flex-wrap d-lg-inline-block" tags={cycle.tags!} readOnly label="" />
              <div className="mt-2 d-flex flex-row justify-content-start">
                {/* @ts-ignore*/}
                {/* <Rating
                      readonly
                      initialRating={getRatingAvg()}
                      // onChange={handlerChangeRating}
                      className={styles.rating}
                      stop={5}
                      emptySymbol={<GiBrain style={{ color: 'var(--eureka-grey)' }} />}
                      fullSymbol={getFullSymbol()}
                    /> */}
                <Rating
                  readonly
                  qty={qty}
                  onChange={(val) => {
                    setQty(val||0);
                  }}
                  stop={5}
                  size="small"
                />{' '}
                <div className="ms-2">
                  {getRatingAvg()!.toFixed(1)}
                  {' - '}
                  {getRatingQty()}
                </div>
                <span className="ms-1 text-gray">{t('common:ratings')}</span>
              </div>
            </aside>
          )}
        </Col>
      </section>
    )
  );
};

export default CycleDetailHeader;
