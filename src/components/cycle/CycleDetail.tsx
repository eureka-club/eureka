import dayjs from 'dayjs';
// import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import { BiArrowBack } from 'react-icons/bi';

import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import UserAvatar from '../common/UserAvatar';
import Mosaic from '../Mosaic';
// import globalModalsAtom from '../../atoms/globalModals';

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
import CommnetMosaic from '../comment/MosaicItem';
import UnclampText from '../UnclampText';
import detailPagesAtom from '../../atoms/detailPages';
import styles from './CycleDetail.module.css';
import CycleDetailHeader from './CycleDetailHeader';
import CycleDetailDiscussion from './CycleDetailDiscussion';

// import useCycles from '../../useCycles';

interface Props {
  cycle: CycleMosaicItem;
  post?: PostMosaicItem;
  work?: WorkMosaicItem;
  // isCurrentUserJoinedToCycle: boolean;

  // mySocialInfo: MySocialInfo;
}

const CycleDetailComponent: FunctionComponent<Props> = ({
  cycle,
  post,
  work,
  // isCurrentUserJoinedToCycle,

  // mySocialInfo,
}) => {
  // const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
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

  const canEditCycle = (): boolean => {
    if (session && cycle) {
      if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
    }
    return false;
  };

  const renderCycleOwnComments = () => {
    if (cycle.comments)
      return cycle.comments
        .filter((c) => !c.workId && !c.postId && !c.commentId)
        .sort((p, c) => (p.id > c.id && -1) || 1)
        .map((c) => {
          return (
            <CommnetMosaic
              key={c.id}
              comment={c as CommentMosaicItem}
              detailed
              showComments
              commentParent={cycle}
              cacheKey={['CYCLES', `${cycle.id}`]}
            />
          );
        });
    return null;
  };

  return (
    <>
      {!router.query.postId && canEditCycle() && (
        <Button variant="warning" onClick={handleEditClick} size="sm">
          {t('Edit')}
        </Button>
      )}
      {!post && cycle && (
        <CycleDetailHeader
          cycle={cycle}
          onParticipantsAction={onParticipantsAction}
          onCarouselSeeAllAction={onCarouselSeeAllAction}
        />
      )}
      {/* <Row className="mb-5">
        {post == null ? (
          <>
            <Col md={{ span: 3 }}>
              <div className={classNames(styles.imgWrapper, 'mb-3')}>
                <LocalImageComponent filePath={cycle.localImages[0].storedFile} alt={cycle.title} />
              </div>
            </Col>
            <Col md={{ span: 9 }}>
              <div className="pt-2 pl-2">
                <div className={styles.cycleCreator}>
                  <Link href={`/mediatheque/${cycle.creator.id}`}>
                    <a>
                      <img
                        src={cycle.creator.image || '/img/default-avatar.png'}
                        alt="creator avatar"
                        className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
                      />
                      {cycle.creator.name}
                    </a>
                  </Link>
                </div>
                <h1>{cycle.title}</h1>
                <CycleSummary cycle={cycle} />

                <section className={classNames('d-flex justify-content-between', styles.socialInfo)}>
                  <SocialInteraction entity={cycle} showCounts />
                  <div>
                    <small className={styles.participantsCount}>
                      {t('participantsCount', { count: participantsCount })}
                    </small>

                    <>
                      <div className="d-inline-block mx-3" />
                      {(isJoinCycleLoading || isLeaveCycleLoading) && <Spinner animation="border" size="sm" />}
                      {isCurrentUserJoinedToCycle && session != null ? (
                        <Button onClick={handleLeaveCycleClick} variant="link">
                          {t('leaveCycleLabel')}
                        </Button>
                      ) : (
                        !isCurrentUserJoinedToCycle && (
                          <Button onClick={handleJoinCycleClick}>{t('joinCycleLabel')}</Button>
                        )
                      )}
                    </>
                  </div>
                </section>
              </div>
            </Col>
          </>
        ) : (
          <PostDetailComponent post={post} cycle={cycle} work={work} mySocialInfo={mySocialInfo} />
        )}
      </Row> */}
      {post && (
        <Button variant="info" onClick={() => router.push(`/cycle/${cycle.id}`)} size="sm">
          <BiArrowBack />
        </Button>
      )}
      {post && <PostDetailComponent post={post} cycle={cycle} work={work} />}
      {cycle && post == null && (
        <Row className="mb-5" ref={tabContainnerRef}>
          <Col>
            {detailPagesState.selectedSubsectionCycle != null && (
              <TabContainer
                // defaultActiveKey={detailPagesState.selectedSubsectionCycle}
                onSelect={handleSubsectionChange}
                activeKey={tabKey}
                transition={false}
              >
                {/* language=CSS */}
                <style jsx global>
                  {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active {
                      color: #495057;
                      background-color: #fff;
                      border: none !important;
                      border-bottom: solid 6px var(--eureka-green) !important;
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
                          {t('About')} ({cycle.works && cycle.works.length})
                        </NavLink>
                      </NavItem>
                      <NavItem className={styles.tabBtn}>
                        <NavLink eventKey="cycle-discussion">{t('Discussion')}</NavLink>
                      </NavItem>
                      <NavItem className={styles.tabBtn}>
                        <NavLink eventKey="my_milestone">{t('My milestones')}</NavLink>
                      </NavItem>
                      <NavItem className={styles.tabBtn}>
                        <NavLink eventKey="guidelines">{t('Guidelines')}</NavLink>
                      </NavItem>

                      <NavItem className={styles.tabBtn}>
                        <NavLink eventKey="participants">
                          {t('Participants')}{' '}
                          {/* (
                           <HyvorTalk.CommentCount websiteId={Number(HYVOR_WEBSITE_ID!)} id={hyvorId} />
                          ) */}
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TabContent>
                      <TabPane eventKey="cycle-about">
                        <h2 className="mb-3">{t('Why does this cycle matter')}?</h2>
                        {cycle.contentText != null && (
                          <div className="mb-5">
                            <UnclampText text={cycle.contentText} clampHeight="7rem" />
                          </div>
                        )}
                        {cycle.works && (
                          <h2 className="mb-5">{t('worksCountHeader', { count: cycle.works.length })}</h2>
                        )}
                        {cycle.works && cycle.works.length > 0 && <WorksMosaic cycle={cycle} />}

                        {cycle.complementaryMaterials && cycle.complementaryMaterials.length > 0 && (
                          <Row className="mt-4 mb-5">
                            <Col>
                              <h4 className="mb-4">{t('complementaryMaterialsTitle')}</h4>
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
                      <TabPane eventKey="cycle-discussion">
                        <CycleDetailDiscussion cycle={cycle} />
                        {(cycle.posts && cycle.posts.length && (
                          <PostsMosaic
                            display="horizontally"
                            cycle={cycle}
                            showComments
                            cacheKey={['CYCLES', `${cycle.id}`]}
                          />
                        )) ||
                          null}
                        {renderCycleOwnComments()}
                      </TabPane>
                      <TabPane eventKey="my_milestone">
                        <h2 className="mb-3">{t('My milestones')}</h2>
                        <p />
                      </TabPane>
                      <TabPane eventKey="guidelines">
                        <h2 className="mb-3">{t('Guidelines')}</h2>
                        <p />
                      </TabPane>
                      <TabPane eventKey="participants">
                        {/* {cycle.participants && cycle.participants.map((p) => <UserAvatar className="mb-3 mr-3" user={p} key={p.id} />)} */}
                        {cycle.participants && (
                          <Mosaic showButtonLabels={false} stack={cycle.participants as UserMosaicItem[]} />
                        )}
                        <p />
                      </TabPane>
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
