"use client"

import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useAtom } from 'jotai';
import {
  Nav,
  NavItem,
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  NavLink,
  Button,
  ButtonGroup,
} from 'react-bootstrap';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { BiArrowBack } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { PostMosaicItem } from '@/src/types/post';
import UnclampText from '@/components/UnclampText';
import WorkReadOrWatched from '@/src/components/work/WorkReadOrWatched';
import detailPagesAtom from '@/src/atoms/detailPages';
import styles from './Work.module.css';
import TagsInput from '@/components/forms/controls/TagsInput';
import { MosaicContext } from '@/src/hooks/useMosaicContext';
import WorkDetailPost from '@/src/components/work/WorkDetailPost';
import CMI from '@/src/components/cycle/MosaicItem';
import MosaicItemPost from '@/src/components/post/MosaicItem';
import { useInView } from 'react-intersection-observer';
import { Session } from '@/src/types';
import HyvorComments from '@/src/components/common/HyvorComments';
import useExecRatingWork from '@/src/hooks/mutations/useExecRatingWork';
import { Box } from '@mui/material';
import { FiTrash2 } from 'react-icons/fi';
import { useDictContext } from '@/src/hooks/useDictContext';
import { WorkMosaicItem } from '@/src/types/work';
import { CycleMosaicItem } from '@/src/types/cycle';
import { t } from '@/src/get-dictionary';
import { WorkContext } from '@/src/hooks/useWorkContext';
import WorkSummary from '@/src/components/work/WorkSummary';
import Rating from '@/src/components/common/Rating';
import MosaicItem from '@/src/components/work/MosaicItem';


// const PostDetailComponent = lazy(() => import('@/components/post/PostDetail'));

interface Props {
  work: WorkMosaicItem;
  workCycles: CycleMosaicItem[];
  workPosts:PostMosaicItem[];
//post?: PostMosaicItem;
  session: Session;
}

const Work: FunctionComponent<Props> = ({ work,workCycles,workPosts, session }) => {
  const router = useRouter();
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const {dict}=useDictContext();
  const [qty, setQty] = useState(work?.ratingAVG || 0);
  const [qtyByUser, setqtyByUser] = useState(0);

  useEffect(() => {
    if (work && session) {
      let ratingCount = work.ratings.length;
      const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
      setQty(ratingAVG);

      const currentRating = work?.ratings.filter((w) => w.userId == session?.user.id);
      setqtyByUser(currentRating?.length ? currentRating[0].qty : 0);
    }
  }, [work, session]);

  const [defaultActiveKey, setDefaultActiveKey] = useState<string>('posts');

  const { mutate: execRating } = useExecRatingWork({
    work: work!,
  });

  if (!work) return <></>;

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDefaultActiveKey(key);
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    localStorage.setItem('redirect', `/work/${work.id}`);
    router.push(`/work/${work.id}/edit`);
  };

  const canEditWork = (): boolean => {
    if (session && session.user.roles === 'admin') return true;
    return false;
  };

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
    setqtyByUser(0);
    execRating({
      ratingQty: 0,
      doCreate: false,
    });
  };

  const getRatingQty = () => {
    if (work && work.ratings) {
      return work.ratings.length || 0;
    }
    return 0;
  };

  const getRatingAvg = () => {
    if (work) {
      return work.ratingAVG || 0;
    }
    return 0;
  };

  return (
    <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
          {canEditWork() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t(dict,'edit')}
            </Button>
          )}
        </ButtonGroup>
        {
          <>
            <Row className="mb-5 d-flex flex-column flex-lg-row">
                <Col className="col-md-12 col-lg-4 col-xl-3   d-none d-lg-block">
                <MosaicItem
                    workId={work.id}
                    showTrash
                    linkToWork={false}
                    size={'lg'}
                    showCreateEureka={false}
                    showSaveForLater={true}
                />
                <Box className="d-flex flex-row align-items-baseline" mt={1}>
                    <Rating
                    qty={qtyByUser}
                    onChange={handlerChangeRating}
                    size="medium"
                    iconColor="var(--bs-danger)"
                    /> { qtyByUser > 0 && <Button
                    type="button"
                    title={t(dict,'clearRating')}
                    className="text-warning p-0 ms-2"
                    onClick={clearRating}
                    variant="link"
                    //disabled={loadingSocialInteraction}
                    >
                    <FiTrash2 />
                    </Button>}
                </Box>
                <Box mt={1}>
                    <WorkReadOrWatched work={work} session={session} />
                </Box>
                </Col>
                <Col className="col-md-12 col-lg-8 col-xl-9">
                <section className="mx-md-4">
                    <h1 className="fw-bold text-secondary">{work.title}</h1>
                    <h2 className={`${styles.author}`}>{work.author}</h2>
                    <WorkSummary work={work} />
                    <div className="d-flex flex-wrap flex-row mt-2 mb-2">
                    <Box sx={{ display: 'flex' }}>
                        <Rating qty={qty} onChange={handlerChangeRating} size="medium" readonly />
                        <div className="d-flex flex-nowrap ms-2">
                        {getRatingAvg().toFixed(1)}
                        {' - '}
                        {getRatingQty()}
                        </div>
                        <span className="ms-1 text-gray">{t(dict,'ratings')}</span>
                    </Box>
                    {work.topics && (
                        <TagsInput
                        className="ms-0 ms-lg-2 d-flex flex-row"
                        formatValue={(v: string) => t(dict,`${v}`)}
                        tags={work.topics}
                        readOnly
                        />
                    )}
                    {work.tags && <TagsInput className="ms-0 ms-lg-2 d-flex flex-row" tags={work.tags} readOnly />}
                    </div>
                    {work.link != null && (
                    <a
                        href={work.link}
                        className={classNames(styles.workLink, 'mb-5')}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t(dict,'workLinkLabel')} <BsBoxArrowUpRight />
                    </a>
                    )}
                    <div className="container d-sm-block d-lg-none mt-4 mb-4 position-relative">
                    <MosaicItem
                        className="postition-absolute start-50 translate-middle-x"
                        work={work}
                        workId={work.id}
                        showTrash
                        linkToWork={false}
                        size={'lg'}
                        showCreateEureka={false}
                        showSaveForLater={true}
                    />
                    <Box className="d-flex flex-row justify-content-center align-items-baseline" mt={2}>
                        <Rating
                        qty={qtyByUser}
                        onChange={handlerChangeRating}
                        size="medium"
                        iconColor="var(--bs-danger)"
                        /> {qtyByUser > 0 && <Button
                        type="button"
                        title={t(dict,'clearRating')}
                        className="text-warning p-0 ms-2"
                        onClick={clearRating}
                        variant="link"
                        //disabled={loadingSocialInteraction}
                        >
                        <FiTrash2 />
                        </Button>}
                    </Box>
                    <Box className="d-flex justify-content-center" mt={1}>
                        <WorkReadOrWatched work={work} session={session} />
                    </Box>
                    </div>
                    <Box className="" mt={1}>
                    {work.contentText != null && (
                    <UnclampText isHTML={false} text={work.contentText} clampHeight="8rem" />
                    )}
                </Box>
                </section>
                <HyvorComments entity="work" id={`${work.id}`} session={session} />
            </Col>
        </Row>

          <Row className="mb-5">
            <Col>
              {detailPagesState.selectedSubsectionWork != null && (
                <TabContainer
                  activeKey={defaultActiveKey}
                  onSelect={handleSubsectionChange}
                  transition={true}
                >
                  <style jsx global>
                    {`
                          .nav-tabs .nav-item.show .nav-link,
                          .nav-tabs .nav-link.active,
                          .nav-tabs .nav-link:hover {
                            cursor: pointer;
                            background-color: var(--bs-primary);
                            color: white !important;
                            border: none !important;
                            border-bottom: solid 2px var(--bs-primary) !important;
                          }
                          .nav-tabs {
                            border-bottom: solid 1px var(--bs-primary) !important;
                          }
                        `}
                  </style>
                  <Row className="mb-4">
                    <Col>
                      <div className="">
                        <Nav variant="tabs" className="scrollNav" fill>
                          <NavItem>
                            <NavLink eventKey="posts" data-cy="posts">
                              {t(dict,'tabHeaderPosts')} ({workPosts?.length})
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink eventKey="cycles">
                              {t(dict,'tabHeaderCycles')} ({workCycles.length})
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <TabContent>
                        <TabPane eventKey="posts">
                            <>
                              <WorkDetailPost
                                workId={work.id}
                                className="mb-2"
                                cacheKey={['POSTS', `WORK-${work.id}`]}
                              ></WorkDetailPost>
                              <Row className="mt-5">
                                {workPosts.map((p) => (
                                  <Col
                                    key={p.id}
                                    xs={12}
                                    sm={6}
                                    lg={3}
                                    xxl={2}
                                    className="mb-5 d-flex justify-content-center  align-items-center"
                                  >
                                    <MosaicItemPost
                                      cacheKey={['POST', `${p.id}`]}
                                      postId={p.id}
                                      size={'md'}
                                      showSaveForLater={false}
                                    />

                                  </Col>
                                ))}
                              </Row>
                            </>
                        
                        </TabPane>
                        <TabPane eventKey="cycles">
                          {workCycles?.length ? (
                            <Row className="mt-5">
                              {workCycles.map((c) => (
                                <Col
                                  xs={12}
                                  sm={6}
                                  lg={3}
                                  xxl={2}
                                  className="mb-5 d-flex justify-content-center  align-items-center"
                                  key={c.id}
                                >
                                  <CMI
                                    cycleId={c.id}
                                    cacheKey={['CYCLES', `WORK-${work.id}`]}
                                    size={'md'}
                                    showSaveForLater={false}
                                  />
                                </Col>
                              ))}
                            </Row>
                          ) : (
                            <></>
                          )}
                        </TabPane>
                      </TabContent>
                    </Col>
                  </Row>
                </TabContainer>
              )}
            </Col>
          </Row>
      </>
        }
    </MosaicContext.Provider>
    </WorkContext.Provider >
  );
};

export default Work;
