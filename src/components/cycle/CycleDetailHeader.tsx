// import classNames from 'classnames';
// import dayjs from 'dayjs';
// import HyvorTalk from 'hyvor-talk-react';
// import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
// import { useRouter } from 'next/router';
import { CycleWork, Work } from '@prisma/client';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useState } from 'react';
// import Button from 'react-bootstrap/Button';

// import Nav from 'react-bootstrap/Nav';
// import NavItem from 'react-bootstrap/NavItem';
// import NavLink from 'react-bootstrap/NavLink';
import { Col, Row,Spinner } from 'react-bootstrap';
// import Spinner from 'react-bootstrap/Spinner';
// import TabContainer from 'react-bootstrap/TabContainer';
// import TabContent from 'react-bootstrap/TabContent';
// import TabPane from 'react-bootstrap/TabPane';
import Link from 'next/link';
// import { useMutation } from 'react-query';
// import { Work } from '@prisma/client';
import Rating from 'react-rating';
import { GiBrain } from 'react-icons/gi';
import {BsChevronUp, BsX} from 'react-icons/bs';
// import { useCycleContext, CycleContext } from '../../useCycleContext';

// import globalModalsAtom from '../../atoms/globalModals';

// import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MySocialInfo, Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';

// import LocalImageComponent from '../LocalImage';
// import PostDetailComponent from '../post/PostDetail';
import CycleSummary from './CycleSummary';
// import HyvorComments from '../common/HyvorComments';
// import SocialInteraction from '../common/SocialInteraction';
// import PostsMosaic from './PostsMosaic';
// import WorksMosaic from './WorksMosaic';
// import UnclampText from '../UnclampText';
// import detailPagesAtom from '../../atoms/detailPages';
import styles from './CycleDetailHeader.module.css';
import MosaicItem from './MosaicItem';
import TagsInput from '../forms/controls/TagsInput';
import UserAvatar from '../common/UserAvatar';
import CarouselStatic from '../CarouselStatic';
// import globalSearchEngineAtom from '../../atoms/searchEngine';
import { MosaicContext } from '../../useMosaicContext';
import { useCycleContext } from '../../useCycleContext';
import useWorks from '@/src/useWorks'
import useCycle from '@/src/useCycle'
import LocalImageComponent from '@/src/components/LocalImage'
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
  const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');

  const {data:cycle,isLoading:isLoadingCycle} = useCycle(cycleId,{enabled:!!cycleId})

  const { data: works } = useWorks({ cycles: { some: { id: cycleId} } }, {
    enabled:!!cycleId
  })
  // const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;

  // const openSignInModal = () => {
  //   setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  // };

  // const {
  //   // mutate: execJoinCycle,
  //   // isLoading: isJoinCycleLoading,
  //   isSuccess: isJoinCycleSuccess,
  // } = useMutation(async () => {
  //   await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
  // });
  // const {
  //   // mutate: execLeaveCycle,
  //   // isLoading: isLeaveCycleLoading,
  //   isSuccess: isLeaveCycleSuccess,
  // } = useMutation(async () => {
  //   await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
  // });

  // const handleSubsectionChange = (key: string | null) => {
  //   if (key != null) {
  //     setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
  //   }
  // };

  // const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   if (!session) openSignInModal();
  //   execJoinCycle();
  // };

  // const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   execLeaveCycle();
  // };

  // useEffect(() => {
  //   if (isJoinCycleSuccess === true) {
  //     router.replace(router.asPath); // refresh page
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isJoinCycleSuccess]);

  // useEffect(() => {
  //   if (isLeaveCycleSuccess === true) {
  //     router.replace(router.asPath); // refresh page
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLeaveCycleSuccess]);

  // const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //   ev.preventDefault();
  //   router.push(`/cycle/${router.query.id}/edit`);
  // };

  // const canEditCycle = (): boolean => {
  //   if (session) {
  //     if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
  //   }
  //   return false;
  // };

  // type Item = WorkMosaicItem | PostMosaicItem;
  // const seeAll = async (data: Item[], q: string, showFilterEngine = true): Promise<void> => {
  //   setGlobalSearchEngineState({
  //     ...globalSearchEngineState,
  //     itemsFound: data as WorkMosaicItem[],
  //     q: `${t('Works on Cycle')} ${cycle.id}`,
  //     show: showFilterEngine,
  //   });

  //   router.push('/search');
  // };

  
  const getFullSymbol = () => {
    if (cycle && cycle.currentUserRating) return <GiBrain style={{ color: 'var(--eureka-blue)' }} />;
    // if (cycle) {
    //   // const s = session as unknown as Session;
    //   // const ratingByMe = cycle.ratings.findIndex((r) => r.userId === s.user.id);
    // }

    return <GiBrain style={{ color: 'var(--eureka-green)' }} />;
  };

  const getRatingQty = () => {
    if (cycle) {
      return cycle._count.ratings;
    }
    return 0;
  };

  const getRatingAvg = () => {
    if (cycle) {
      return cycle.ratingAVG
    }
    return 0;
  };

  const getWorksSorted = () => {
    const res: Work[] = [];
    if(!cycle)return []
    if(!cycle.cycleWorksDates)return works||[];
    cycle.cycleWorksDates
      .sort((f, s) => {
        const fCD = dayjs(f.startDate!);
        const sCD = dayjs(s.startDate!);
        const isActive = (w: {startDate:Date|null;endDate:Date|null}) => {
          if (w.startDate && w.endDate) return dayjs().isBetween(w.startDate!, w.endDate);
          if (w.startDate && !w.endDate) return dayjs().isAfter(w.startDate);
          return false;
        };

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
        <Col className='mt-3 mt-lg-0 col-12 col-lg-8 d-none d-lg-flex flex-column justify-content-center justify-content-lg-start'>
          <h1 className="d-none d-lg-block mb-1 fw-bold text-secondary">
            {cycle.title}
          </h1>
          <div className='d-flex flex-row justify-content-start'>
          <Rating
            readonly
            initialRating={getRatingAvg()}
            // onChange={handlerChangeRating}
            className={`d-flex flex-nowrap ${styles.rating}`}
            stop={5}
            emptySymbol={<GiBrain style={{ color: 'var(--eureka-grey)' }} />}
            fullSymbol={getFullSymbol()}
          />{' '}
          <div className='d-flex flex-nowrap ms-2'>
          {getRatingAvg()}
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
            {t('Content calendar')} ({works && works.length})
          </h4>
          {/* <CycleSummary cycle={cycle} /> */}
          {/* <Button className={`${styles.seeParticipantsBtn}`} onClick={onParticipantsAction}>
            {cycle.participants.length} participants
          </Button> */}
          {/* <CycleContext.Provider value={{ cycle }}> */}
            <CarouselStatic
            cacheKey={['CYCLE',cycle.id.toString()]}
              showSocialInteraction={false}
              // onSeeAll={async () => seeAll(works as WorkMosaicItem[], t('Eurekas I created'))}
              onSeeAll={onCarouselSeeAllAction}
              title={<CycleSummary cycle={cycle} />}
              data={getWorksSorted() as WorkMosaicItem[]}
              iconBefore={<></>}
              customMosaicStyle={{ height: '16em' }}
              tiny
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
                {t('Content calendar')} ({works && works.length})
              </h4>
                <CarouselStatic
                  cacheKey={['CYCLE',cycle.id.toString()]}
                  showSocialInteraction={false}
                  onSeeAll={onCarouselSeeAllAction}
                  title={<CycleSummary cycle={cycle} />}
                  data={getWorksSorted() as WorkMosaicItem[]}
                  iconBefore={<></>}
                  customMosaicStyle={{ height: '16em' }}
                  tiny
                  mosaicBoxClassName="pb-5"
                  // iconAfter={<BsCircleFill className={styles.infoCircle} />}
                />
          </div>
          {/* </CycleContext.Provider> */}
        </Col>
        )}
        <Col className="d-none d-lg-flex col-12 col-lg-4 justify-content-center justify-content-lg-end">
          <aside className='d-flex flex-column'>
            <UserAvatar width={42} height={42} userId={cycle.creatorId}  showFullName />
            <MosaicContext.Provider value={{ showShare: true, cacheKey: ['CYCLE', `${cycle.id}`] }}>
              <MosaicItem cycleId={cycle.id} showTrash showParticipants={true} className="mt-4" cacheKey={['CYCLE', `${cycle.id}`]} />
            </MosaicContext.Provider>
          </aside>
        </Col>
        {show && (
        <Col className='col-12 d-flex justify-content-center d-lg-none' >
            <aside className='d-flex flex-column'>
              <MosaicContext.Provider value={{ showShare: true,cacheKey: ['CYCLE', `${cycle.id}`] }}>
                <MosaicItem cycleId={cycle.id} showTrash showParticipants={true} className="mt-2" cacheKey={['CYCLE', `${cycle.id}`]} />
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
              <span className={`cursor-pointer text-primary me-1 ${styles.closeButton}`}
                      role="presentation" onClick={() => setShow(false)}> {t('Close')} <BsX style={{ color: 'var(--eureka-green)' }} /> </span> 
              )}
              {!show && (
              <span className={`cursor-pointer text-primary me-1 ${styles.closeButton}`}
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
                    <Rating
                      readonly
                      initialRating={getRatingAvg()}
                      // onChange={handlerChangeRating}
                      className={styles.rating}
                      stop={5}
                      emptySymbol={<GiBrain style={{ color: 'var(--eureka-grey)' }} />}
                      fullSymbol={getFullSymbol()}
                    />{' '}
                    <div className='ms-2'>
                    {getRatingAvg()}
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
