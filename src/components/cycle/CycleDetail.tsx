import dayjs from 'dayjs';
// import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useState, useRef, useEffect } from 'react';
import {
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  NavItem,
  NavLink,
} from 'react-bootstrap';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { BiArrowBack } from 'react-icons/bi';
import { MosaicContext } from '../../useMosaicContext';

// import UserAvatar from '../common/UserAvatar';
import Mosaic from '../Mosaic';
// import globalModals from '../../atoms/globalModals';

import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR /* , HYVOR_WEBSITE_ID, WEBAPP_URL */ } from '../../constants';
import { Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import { CommentMosaicItem } from '../../types/comment';
import { UserMosaicItem } from '../../types/user';

// import LocalImageComponent from '../LocalImage';
import PostDetailComponent from '../post/PostDetail';
// import CycleSummary from './CycleSummary';
// import HyvorComments from '../common/HyvorComments';
// import SocialInteraction from '../common/SocialInteraction';
import PostsMosaic from './PostsMosaic';
import WorksMosaic from './WorksMosaic';
import ComentMosaic from '../comment/MosaicItem';
// import UnclampText from '../UnclampText';
import detailPagesAtom from '../../atoms/detailPages';
import globalModalsAtom from '../../atoms/globalModals';

import styles from './CycleDetail.module.css';
import { useCycleContext, CycleContext } from '../../useCycleContext';
import CycleDetailHeader from './CycleDetailHeader';
import CycleDetailDiscussion from './CycleDetailDiscussion';
// import useCycles from '../../useCycles';

interface Props {
  // cycle: CycleMosaicItem;
  post?: PostMosaicItem;
  work?: WorkMosaicItem;
  // isCurrentUserJoinedToCycle: boolean;

  // mySocialInfo: MySocialInfo;
}

const CycleDetailComponent: FunctionComponent<Props> = ({
  // cycle,
  post,
  work,
  // isCurrentUserJoinedToCycle,

  // mySocialInfo,
}) => {
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModals);
  const cycleContext = useCycleContext();
  const [cycle, setCycle] = useState<CycleMosaicItem | null>();
  useEffect(() => {
    if (cycleContext) setCycle(cycleContext.cycle);
  }, [cycleContext]);
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const router = useRouter();

  const [session, isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  const [tabKey, setTabKey] = useState<string>();
  const tabContainnerRef = useRef<HTMLDivElement>(null);
  // const hyvorId = `${WEBAPP_URL}cycle/${router.query.id}`;

  // const { data } = useCycles(1);
  // const [cycle, setCycle] = useState<CycleDetail>();
  // useEffect(() => {
  //   if (data) {
  //     setCycle(() => data as CycleDetail);
  //   }
  // }, [data]);

  // const openSignInModal = () => {
  //   setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  // };

  // const {
  //   mutate: execJoinCycle,
  //   isLoading: isJoinCycleLoading,
  //   isSuccess: isJoinCycleSuccess,
  // } = useMutation(async () => {
  //   await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
  // });
  // const {
  //   mutate: execLeaveCycle,
  //   isLoading: isLeaveCycleLoading,
  //   isSuccess: isLeaveCycleSuccess,
  // } = useMutation(async () => {
  //   await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
  // });

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setTabKey(key);

      setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
    }
  };

  const onCarouselSeeAllAction = async () => {
    setTabKey('cycle-about');
    if (tabContainnerRef)
      tabContainnerRef.current!.scrollIntoView({
        behavior: 'smooth',
      });
  };

  const onParticipantsAction = async () => {
    setTabKey('participants');
    if (tabContainnerRef)
      tabContainnerRef.current!.scrollIntoView({
        behavior: 'smooth',
      });
  };

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

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    router.push(`/cycle/${router.query.id}/edit`);
  };

  const canEditPost = (): boolean => {
    if (session && post && session.user.id === post.creatorId) return true;
    return false;
  };

  const canEditCycle = (): boolean => {
    if (session && cycle) {
      if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
    }
    return false;
  };

  const renderCycleOwnComments = () => {
    if (cycle && cycle.comments)
      return cycle.comments
        .filter((c) => !c.workId && !c.postId && !c.commentId)
        .sort((p, c) => (p.id > c.id && -1) || 1)
        .map((c) => {
          return (
            <ComentMosaic
              key={c.id}
              comment={c as CommentMosaicItem}
              detailed
              showComments
              commentParent={cycle}
              cacheKey={['CYCLE', `${cycle.id}`]}
              className="mb-4"
            />
          );
        });
    return null;
  };

  // if (!session || !session.user) {
  //   if (cycle && cycle.access === 2) {
  //     return (
  //       <CycleDetailHeader
  //         cycle={cycle}
  //         onParticipantsAction={onParticipantsAction}
  //         onCarouselSeeAllAction={onCarouselSeeAllAction}
  //       />
  //     );
  //   }
  // }

  const renderCycleDetailHeader = () => {
    if (cycle) {
      const res = (
        <CycleDetailHeader
          onParticipantsAction={onParticipantsAction}
          onCarouselSeeAllAction={onCarouselSeeAllAction}
        />
      );
      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if (cycle.access === 2) return res;
    }
    return '';
  };

  const [gldView, setgldView] = useState<Record<string, boolean>>({});
  const toggleGuidelineDesc = (key: string) => {
    if (key in gldView) {
      setgldView((res) => {
        return { ...res, [`${key}`]: !res[key] };
      });
    } else setgldView((res) => ({ ...res, [`${key}`]: true }));
  };
  const renderGuidelines = () => {
    if (cycle) {
      const glc = Math.ceil(cycle.guidelines.length / 2);
      const gll = cycle.guidelines.slice(0, glc);
      const glr = cycle.guidelines.slice(glc);
      let IDX = 0;
      const renderLI = (g: { title: string; contentText: string | null }, idx: number, gl: string) => {
        const key = `${gl}!${g.title}${idx + 1}`;
        IDX += 1;
        return (
          <aside key={key} className="mb-3 bg-light">
            <h5 className="h6 fw-bold mb-0 pl-3 py-1 d-flex text-secondary">
              <span className="py-1 fw-bold">{`${IDX}. `}</span>
              <span className="py-1 fw-bold h6 mb-0 pl-3 d-flex">{`${g.title}`}</span>
              <Button className="ml-auto" size="sm" onClick={() => toggleGuidelineDesc(key)}>
                {!gldView[key] ? <RiArrowDownSLine /> : <RiArrowUpSLine />}
              </Button>
            </h5>
            {gldView[key] && <p className="px-3 pt-0 pb-3">{g.contentText}</p>}
          </aside>
        );
      };

      return (
        <Row>
          {gll.length && (
            <Col xs={12} md={6}>
              <section className="">{gll.map((g, idx) => renderLI(g, idx, 'gll'))}</section>
            </Col>
          )}
          {glr.length && (
            <Col>
              <section className="">{glr.map((g, idx) => renderLI(g, idx, 'glr'))}</section>
            </Col>
          )}
        </Row>
      );
    }
    return '';
  };

  const renderRestrictTabs = () => {
    if (cycle) {
      const res = (
        <>
          <TabPane eventKey="cycle-discussion">
            <CycleDetailDiscussion cycle={cycle} className="mb-5" />
            {(cycle.posts && cycle.posts.length && (
              <MosaicContext.Provider value={{ showShare: true }}>
                <PostsMosaic display="h" cycle={cycle} showComments cacheKey={['CYCLE', `${cycle.id}`]} />
              </MosaicContext.Provider>
            )) ||
              null}
            {renderCycleOwnComments()}
          </TabPane>
          {/* <TabPane eventKey="my_milestone">
            <h2 className="mb-3">{t('My milestones')}</h2>
            <p />
          </TabPane> */}
          <TabPane eventKey="guidelines">
            <section className="text-primary">
              <h4 className="h5 mt-4 mb-3 fw-bold text-gray-dark">{t('guidelinesMP')}</h4>
              {/* <p className="fst-italic fs-6">({t('guidelinesByInfo')})</p> */}
            </section>
            <section className=" pt-3">{cycle.guidelines && renderGuidelines()}</section>
            <p />
          </TabPane>
          <TabPane eventKey="participants">
            {/* {cycle.participants && cycle.participants.map((p) => <UserAvatar className="mb-3 mr-3" user={p} key={p.id} />)} */}
            {cycle.participants && (
              <Mosaic showButtonLabels={false} stack={[...cycle.participants, cycle.creator] as UserMosaicItem[]} />
            )}
            <p />
          </TabPane>
        </>
      );
      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if (cycle.access === 2 && cycleContext.currentUserIsParticipant) return res;
    }
    return '';
  };

  const renderRestrictTabsHeaders = () => {
    if (cycle) {
      const res = (
        <>
          <NavItem className={`${styles.tabBtn}`}>
            <NavLink eventKey="cycle-discussion">
              <span className="mb-3">{t('Discussion')}</span>
            </NavLink>
          </NavItem>
          {/* <NavItem className={`${styles.tabBtn}`}>
            <NavLink eventKey="my_milestone">{t('My milestones')}</NavLink>
          </NavItem> */}
          <NavItem className={`${styles.tabBtn}`}>
            <NavLink eventKey="guidelines">
              <span className="mb-3">{t('Guidelines')}</span>
            </NavLink>
          </NavItem>

          <NavItem className={`${styles.tabBtn}`}>
            <NavLink eventKey="participants">
              <span className="mb-3">{t('Participants')}</span>
            </NavLink>
          </NavItem>
        </>
      );
      if (cycle.access === 3) return '';
      if (cycle.access === 1) return res;
      if (cycle.access === 2 && cycleContext.currentUserIsParticipant) return res;
    }
    return '';
  };

  const handleEditPostClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: true } });
  };

  const getDefaultActiveKey = () => {
    if (cycle) {
      if (cycle.access === 1) return 'cycle-discussion';
      if (cycle.access === 2 && cycleContext.currentUserIsParticipant) return 'cycle-discussion';
      if (cycle.access === 3 && cycleContext.currentUserIsParticipant) return 'cycle-discussion';
    }
    return 'cycle-about';
  };

  return (
    <>
      <ButtonGroup className="mb-1">
        <Button variant="primary" onClick={() => router.back()} size="sm">
          <BiArrowBack />
        </Button>
        {!router.query.postId && canEditCycle() && (
          <Button variant="warning" onClick={handleEditClick} size="sm">
            {t('Edit')}
          </Button>
        )}

        {post && cycle && canEditPost() && (
          <Button variant="warning" onClick={handleEditPostClick} size="sm">
            {t('Edit')}
          </Button>
        )}
      </ButtonGroup>

      {!post && renderCycleDetailHeader()}
      {post && cycle && (
        <MosaicContext.Provider value={{ showShare: true }}>
          <PostDetailComponent post={post} work={work} />
        </MosaicContext.Provider>
      )}
      {cycle && post == null && (
        <Row className="mb-5" ref={tabContainnerRef}>
          <Col>
            {detailPagesState.selectedSubsectionCycle != null && (
              <TabContainer
                defaultActiveKey={getDefaultActiveKey()}
                onSelect={handleSubsectionChange}
                // activeKey={tabKey}
                transition={false}
              >
                {/* language=CSS */}
                <style jsx global>
                  {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active,
                    .nav-tabs .nav-link:hover {
                      background-color: var(--primary);
                      color: white;
                      border: none !important;
                      border-bottom: solid 2px var(--primary) !important;
                    }
                    .nav-tabs {
                      border: none !important;
                    }
                  `}
                </style>
                <Row className="mb-4">
                  <Col>
                    <Nav variant="tabs" fill>
                      <NavItem className={styles.tabBtn}>
                        <NavLink eventKey="cycle-about">
                          <span className="mb-3">
                            {t('About')} ({cycle.works && cycle.works.length})
                          </span>
                        </NavLink>
                      </NavItem>
                      {renderRestrictTabsHeaders()}
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TabContent>
                      <TabPane eventKey="cycle-about">
                        <h5 className="mt-4 mb-3 fw-bold text-gray-dark">{t('Why does this cycle matter')}?</h5>
                        {cycle.contentText != null && (
                          <div className="">
                            <div
                              className={styles.dangerouslySetInnerHTML}
                              dangerouslySetInnerHTML={{ __html: cycle.contentText }}
                            />
                            {/* <UnclampText text={cycle.contentText} clampHeight="7rem" /> */}
                          </div>
                        )}
                        {cycle.works && (
                          <h5 className="mt-5 mb-3 fw-bold text-gray-dark">
                            {t('worksCountHeader', { count: cycle.works.length })}
                          </h5>
                        )}
                        {cycle.works && cycle.works.length > 0 && (
                          <MosaicContext.Provider value={{ showShare: true }}>
                            <WorksMosaic cycle={cycle} className="mb-5" />
                          </MosaicContext.Provider>
                        )}
                        {cycle.complementaryMaterials && cycle.complementaryMaterials.length > 0 && (
                          <Row className="mt-5 mb-5">
                            <Col>
                              <h5 className="mt-5 mb-3 fw-bold text-gray-dark">{t('complementaryMaterialsTitle')}</h5>
                              <ul className={styles.complementaryMaterials}>
                                {cycle.complementaryMaterials.map((cm) => (
                                  <li key={cm.id}>
                                    <a
                                      href={cm.link || `${ASSETS_BASE_URL}/${cm.storedFile}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <h5>{cm.title}</h5>
                                      <p>
                                        {cm.author} ({dayjs(cm.publicationDate).format(DATE_FORMAT_SHORT_MONTH_YEAR)})
                                      </p>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </Col>
                            <Col />
                          </Row>
                        )}
                      </TabPane>
                      {renderRestrictTabs()}
                    </TabContent>
                  </Col>
                </Row>
              </TabContainer>
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default CycleDetailComponent;
