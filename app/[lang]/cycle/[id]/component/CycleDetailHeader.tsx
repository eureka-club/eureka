import { useSession } from 'next-auth/react';
import { Cycle, Work } from '@prisma/client';
import { FunctionComponent, useState,useEffect } from 'react';
import { Col, Row,Spinner,Button } from 'react-bootstrap';
import Rating from '@/src/components/common/Rating'
import { FiTrash2 } from 'react-icons/fi';
import { GiBrain } from 'react-icons/gi';
import {BsChevronUp, BsX} from 'react-icons/bs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MySocialInfo } from '@/src/types';
import { PostMosaicItem } from '@/src/types/post';
import { WorkMosaicItem } from '@/src/types/work';
import CycleSummary from '@/src/components/cycle/CycleSummary';
import styles from './CycleDetailHeader.module.css';
import MosaicItem from '@/src/components/cycle/MosaicItem';
import TagsInput from '@/src/components/forms/controls/TagsInput';
import UserAvatar from '@/src/components/common/UserAvatar';
import { MosaicContext } from '@/src/hooks/useMosaicContext';
import useCycle from '@/src/hooks/useCycle'
import CarouselStatic from '@/src/components/CarouselStatic';
import { Box } from '@mui/material';
import useExecRatingCycle, { ExecRatingPayload } from '@/src/hooks/mutations/useExecRatingCycle';
import { UserMosaicItem } from '@/src/types/user';
import useUser from '@/src/hooks/useUser';
import { CycleDetail } from '@/src/types/cycle';
import { useDictContext } from '@/src/hooks/useDictContext';

import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
interface Props {
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
  const queryClient = useQueryClient();

  const {data:session} = useSession();
  const{t,dict}=useDictContext();
  //const {data:cycle,isLoading:isLoadingCycle} = useCycle(cycleId,{enabled:!!cycleId})
  const {id} = useParams<{id:string}>()!;
  const {data:cycle}=useCycle(+id!);
  
  const works = cycle?.cycleWorksDates?.length 
    ? cycle?.cycleWorksDates?.map(c=>c.work)
    : cycle?.works
  // const [works,setWorks] = useState(dataWorks?.works)
  // useEffect(()=>{
  //   if(dataWorks)setWorks(dataWorks.works)
  // },[dataWorks])

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
          const idx = works?.findIndex((w) => w!.id === cw.workId);
          res.push(works[idx]!);          
        }
      });
    if (cycle.cycleWorksDates.length) return res;

    return works;
  };

  //if(isLoadingCycle) return <Spinner animation='grow'/>
  if(!cycle)return <></>

  return (
    cycle && (
      <section className="d-flex flex-column-reverse flex-xl-row mb-1 mb-lg-5">
        {/* xs={{ span: 12, order: 2 }} md={{ span: 7, order: 1 }} lg={{ span: 8 }}*/}
        <Col className="d-none d-xl-flex col-12 col-md-2 col-lg-3 justify-content-center justify-content-lg-start">
          <aside className="d-flex flex-column">
            <div className="mt-3 d-flex justify-content-start">
              <UserAvatar width={42} height={42} userId={cycle.creatorId} showFullName />
            </div>
            <MosaicContext.Provider value={{ showShare: true, cacheKey: ['CYCLE', `${cycle.id}`] }}>
              <MosaicItem
                cycleId={cycle.id}
                showTrash
                detailed={false}
                showSaveForLater={true}
                showCreateEureka={false}
                className="mt-1"
                cacheKey={['CYCLE', `${cycle.id}`]}
                size={'lg'}
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
                title={t(dict,'clearRating')}
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
            <span className="ms-1 text-gray">{t(dict,'common:ratings')}</span>
            {cycle.topics && (
              <section className=" d-flex flex-nowrap ms-2">
                <TagsInput
                  formatValue={(v: string) => t(dict,v)}
                  className="d-flex flex-row"
                  tags={cycle.topics}
                  readOnly
                />
                <TagsInput className="d-flex flex-row ms-1" tags={cycle.tags!} readOnly label="" />
              </section>
            )}
          </div>
          <div className="">
            <h2 className="mt-4 mb-1 text-dark" style={{ fontSize: '1.4rem' }}>
              {t(dict,'Content calendar')} ({works && works.length})
            </h2>

            <CarouselStatic
              cacheKey={['CYCLE', cycle.id.toString()]}
              showSocialInteraction={false}
              // onSeeAll={async () => seeAll(works as WorkMosaicItem[], t(dict,'Eurekas I created'))}
              onSeeAll={onCarouselSeeAllAction}
              title={<CycleSummary cycle={cycle} />}
              data={getWorksSorted() as WorkMosaicItem[]}
              iconBefore={<></>}
              customMosaicStyle={{ height: '16em' }}
              size="sm"
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
                {t(dict,'Content calendar')} ({works && works.length})
              </h4>
              <CarouselStatic
                cacheKey={['CYCLE', cycle.id.toString()]}
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
          <Col className="col-12 d-flex justify-content-center d-xl-none">
            <aside className="d-flex flex-column">
              <MosaicContext.Provider value={{ showShare: true, cacheKey: ['CYCLE', `${cycle.id}`] }}>
                <MosaicItem
                  cycleId={cycle.id}
                  showTrash
                  detailed={false}
                  showSaveForLater={true}
                  className="mt-2"
                  cacheKey={['CYCLE', `${cycle.id}`]}
                  size={'lg'}
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
                  title={t(dict,'common:clearRating')}
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
            <UserAvatar width={42} height={42} userId={cycle.creatorId} showFullName />
          </Row>
          <Row>
            {show && (
              <span
                className={`cursor-pointer text-primary me-1 mb-2 ${styles.closeButton}`}
                role="presentation"
                onClick={() => setShow(false)}
              >
                {' '}
                {t(dict,'Close')} <BsX style={{ color: 'var(--eureka-green)' }} />{' '}
              </span>
            )}
            {!show && (
              <span
                className={`cursor-pointer text-primary me-1 mb-2 ${styles.closeButton}`}
                role="presentation"
                onClick={() => setShow(true)}
              >
                {' '}
                {t(dict,'Details')} <BsChevronUp style={{ color: 'var(--eureka-green)' }} />{' '}
              </span>
            )}
          </Row>
        </Col>
        <Col className="col-12 d-xl-none">
          <h1 className=" mb-1 fw-bold text-secondary">{cycle.title}</h1>
          {cycle.topics && (
            <aside className="d-flex flex-wrap d-lg-inline-block mb-4">
              <TagsInput
                formatValue={(v: string) => t(dict,v)}
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
                <span className="ms-1 text-gray">{t(dict,'common:ratings')}</span>
              </div>
            </aside>
          )}
        </Col>
      </section>
    )
  );
};

export default CycleDetailHeader;
