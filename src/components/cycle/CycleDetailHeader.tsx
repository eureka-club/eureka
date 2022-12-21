import { useSession } from 'next-auth/react';
import { Work } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState,useEffect } from 'react';
import { Col, Row,Spinner } from 'react-bootstrap';
import Rating from '@/components/common/Rating'

import { GiBrain } from 'react-icons/gi';
import {BsChevronUp, BsX} from 'react-icons/bs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MySocialInfo } from '../../types';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import CycleSummary from './CycleSummary';
import styles from './CycleDetailHeader.module.css';
import MosaicItem from './NewMosaicItem';
import TagsInput from '../forms/controls/TagsInput';
import UserAvatar from '../common/UserAvatar';
import CarouselStatic from '../CarouselStatic';
import { MosaicContext } from '../../useMosaicContext';
import useWorks from '@/src/useWorks'
import useCycle from '@/src/useCycle'
interface Props {
  // cycle: CycleMosaicItem;
  cycleId:number;
  post?: PostMosaicItem;
  work?: WorkMosaicItem;
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
  // onParticipantsAction,
  // post,
  // work,
  // isCurrentUserJoinedToCycle,
  // participantsCount,
  // postsCount,
  // worksCount,
  // mySocialInfo,
}) => {
  // const [globalSearchEngineState, setGlobalSearchEngineState] = useAtom(globalSearchEngineAtom);
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  // const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  // const router = useRouter();
  const [show, setShow] = useState<boolean>(s);

  const {data:session} = useSession();
  const { t } = useTranslation('cycleDetail');

  const {data:cycle,isLoading:isLoadingCycle} = useCycle(cycleId,{enabled:!!cycleId})

  const { data: dataWorks } = useWorks({ where:{cycles: { some: { id: cycleId} }} }, {
    enabled:!!cycleId
  })
  const [works,setWorks] = useState(dataWorks?.works)
  useEffect(()=>{
    if(dataWorks)setWorks(dataWorks.works)
  },[dataWorks])

  const [qty, setQty] = useState(cycle?.ratingAVG||0);
  useEffect(()=>{
    setQty(cycle?.ratingAVG||0)
  },[cycle])

  const getFullSymbol = () => {
    if (cycle && cycle.currentUserRating) return <GiBrain style={{ color: 'var(--eureka-blue)' }} />;

    return <GiBrain style={{ color: 'var(--eureka-green)' }} />;
  };

  const getRatingQty = () => {
    if (cycle) {
      return cycle._count.ratings || 0;
    }
    return 0;
  };

  const getRatingAvg = () => {
    if (cycle) {
      return cycle.ratingAVG || 0;
    }
    return 0;
  };

  const getWorksSorted = () => {
    const res: Work[] = [];
    if(!cycle)return []
    if(!cycle.cycleWorksDates)return works||[];
    //console.log(cycle.cycleWorksDates,'cycle.cycleWorksDates')
    cycle.cycleWorksDates
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
          const idx = works.findIndex((w) => w.id === cw.workId);
          res.push(works[idx]);          
        }
      });
    if (cycle.cycleWorksDates.length) return res;

    return works;
  };

  if(isLoadingCycle) return <Spinner animation='grow'/>
  
  if(!cycle)return <></>

  return (
      cycle && <Row className="d-flex flex-column-reverse flex-lg-row mb-1 mb-lg-5">
        {/* xs={{ span: 12, order: 2 }} md={{ span: 7, order: 1 }} lg={{ span: 8 }}*/}
         <Col className="d-none d-lg-flex col-12 col-lg-3 justify-content-center justify-content-lg-start">
          <aside className='d-flex flex-column'>            
            <MosaicContext.Provider value={{ showShare: true, cacheKey: ['CYCLE', `${cycle.id}`] }}>
              <MosaicItem cycleId={cycle.id} showTrash detailed={false} showSaveForLater={true} className="mt-1" cacheKey={['CYCLE', `${cycle.id}`]} size={'lg'} />
            </MosaicContext.Provider>
            <div className="mt-3"><UserAvatar  width={42} height={42} userId={cycle.creatorId}  showFullName /></div>
          </aside>
        </Col>
        <Col className='mt-3 mt-lg-0 col-12 col-lg-9 d-none d-lg-flex flex-column justify-content-center justify-content-lg-start'>
          <h1 className="d-none d-lg-block mb-1 fw-bold text-secondary">
            {cycle.title}
          </h1>
          <div className='d-flex flex-row justify-content-start'>
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
              onClick={(val)=>{setQty(val)}}
              stop={5}
            />
          {' '}
          <div className='d-flex flex-nowrap ms-2'>
          {getRatingAvg().toFixed(1)}
          {' - '}
          {getRatingQty()}
          </div>
          <span className="ms-1 text-gray">{t('ratings')}</span>
          
          {cycle.topics && (
            <aside className=" d-flex flex-wrap ms-3">
              <TagsInput
                formatValue={(v: string) => t(`topics:${v}`)}
                className=""
                tags={cycle.topics}
                readOnly
              />
              <TagsInput className="ms-1 d-inline-block" tags={cycle.tags!} readOnly label="" />
            </aside>
          )}
          </div>
          <div className="">
          <h4 className="mt-4 mb-1 text-dark">
            {t('Content calendar')} ({works && (works.length)})
          </h4>
          
            <CarouselStatic
             cacheKey={['CYCLE',cycle.id.toString()]}
              showSocialInteraction={false}
              // onSeeAll={async () => seeAll(works as WorkMosaicItem[], t('Eurekas I created'))}
              onSeeAll={onCarouselSeeAllAction}
              title={<CycleSummary cycle={cycle} />}
              data={getWorksSorted() as WorkMosaicItem[]}
              iconBefore={<></>}
              customMosaicStyle={{ height: '16em' }}
              size='sm'
              mosaicBoxClassName="pb-5"
              // iconAfter={<BsCircleFill className={styles.infoCircle} />}
            />
          </div>
          {/* </CycleContext.Provider> */}
        </Col>
        {/*xs={{ span: 12, order: 1 }} md={{ span: 5, order: 2 }} lg={{ span: 4 }}*/}
      
        {show && (
      <Col className='mt-3 col-12  d-flex flex-column justify-content-center d-lg-none'>
            <div className="">
              <h4 className="mt-3 mb-1 text-dark">
                {t('Content calendar')} ({works && (works.length)})
              </h4>
                <CarouselStatic
                  cacheKey={['CYCLE',cycle.id.toString()]}
                  showSocialInteraction={false}
                  onSeeAll={onCarouselSeeAllAction}
                  title={<CycleSummary cycle={cycle} />}
                  data={getWorksSorted() as WorkMosaicItem[]}
                  iconBefore={<></>}
                  customMosaicStyle={{ height: '16em' }}
                  size={'sm'}
                  mosaicBoxClassName="pb-5"
                  // iconAfter={<BsCircleFill className={styles.infoCircle} />}
                />
          </div>
          {/* </CycleContext.Provider> */}
        </Col>
        )}
       
        {show && (
        <Col className='col-12 d-flex justify-content-center d-lg-none' >
            <aside className='d-flex flex-column'>
              <MosaicContext.Provider value={{ showShare: true,cacheKey: ['CYCLE', `${cycle.id}`] }}>
                <MosaicItem cycleId={cycle.id} showTrash detailed={false} showSaveForLater={true} className="mt-2" cacheKey={['CYCLE', `${cycle.id}`]} size={'lg'} />
              </MosaicContext.Provider>
            </aside>
        </Col>
        )}
        <Col className='col-12 d-flex justify-content-between align-items-baseline d-lg-none' >
          <Row>
          <UserAvatar width={42} height={42} userId={cycle.creatorId}  showFullName />
          </Row>
            <Row>
              {show && (
              <span className={`cursor-pointer text-primary me-1 mb-2 ${styles.closeButton}`}
                      role="presentation" onClick={() => setShow(false)}> {t('Close')} <BsX style={{ color: 'var(--eureka-green)' }} /> </span> 
              )}
              {!show && (
              <span className={`cursor-pointer text-primary me-1 mb-2 ${styles.closeButton}`}
                      role="presentation" onClick={() => setShow(true)}> {t('Details')} <BsChevronUp style={{ color: 'var(--eureka-green)' }} /> </span> 
              )}
            </Row>
        </Col>
        <Col className='col-12 d-lg-none'>
          <h1 className=" mb-1 fw-bold text-secondary">
              {cycle.title}
            </h1>
            {cycle.topics && (
            <aside className="d-inline-block mb-4">
              <TagsInput
                formatValue={(v: string) => t(`topics:${v}`)}
                className="d-inline-block"
                tags={cycle.topics}
                readOnly
              />
              <TagsInput className="ms-1 d-inline-block" tags={cycle.tags!} readOnly label="" />
              <div className='mt-2 d-flex flex-row justify-content-start'>
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
                      onClick={(val)=>{setQty(val)}}
                      stop={5}
                    />
                    {' '}
                    <div className='ms-2'>
                    {getRatingAvg()!.toFixed(1)}
                    {' - '}
                    {getRatingQty()}
                    </div>
                    <span className="ms-1 text-gray">{t('ratings')}</span>
                    </div>
            </aside>
          )}
        </Col>

      </Row>
    );
};

export default CycleDetailHeader;
