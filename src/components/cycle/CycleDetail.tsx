import classNames from 'classnames';
import dayjs from 'dayjs';
import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import { useMutation } from 'react-query';
import globalModalsAtom from '../../atoms/globalModals';

import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR, HYVOR_WEBSITE_ID, WEBAPP_URL } from '../../constants';
import { MySocialInfo, Session } from '../../types';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import PostDetailComponent from '../post/PostDetail';
import CycleSummary from './CycleSummary';
import HyvorComments from '../common/HyvorComments';
import SocialInteraction from '../common/SocialInteraction';
import PostsMosaic from './PostsMosaic';
import WorksMosaic from './WorksMosaic';
import UnclampText from '../UnclampText';
import detailPagesAtom from '../../atoms/detailPages';
import styles from './CycleDetail.module.css';

interface Props {
  cycle: CycleDetail;
  post?: PostDetail;
  isCurrentUserJoinedToCycle: boolean;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
  mySocialInfo: MySocialInfo;
}

const CycleDetailComponent: FunctionComponent<Props> = ({
  cycle,
  post,
  isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
  mySocialInfo,
}) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  const hyvorId = `${WEBAPP_URL}cycle/${cycle.id}`;

  const openSignInModal = () => {
    setGlobalModalsState({ ...globalModalsState, ...{ signInModalOpened: true } });
  };

  const {
    mutate: execJoinCycle,
    isLoading: isJoinCycleLoading,
    isSuccess: isJoinCycleSuccess,
  } = useMutation(async () => {
    await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
  });
  const {
    mutate: execLeaveCycle,
    isLoading: isLeaveCycleLoading,
    isSuccess: isLeaveCycleSuccess,
  } = useMutation(async () => {
    await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
  });

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDetailPagesState({ ...detailPagesState, selectedSubsectionCycle: key });
    }
  };

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if (!session) openSignInModal();
    execJoinCycle();
  };

  const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execLeaveCycle();
  };

  useEffect(() => {
    if (isJoinCycleSuccess === true) {
      router.replace(router.asPath); // refresh page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoinCycleSuccess]);

  useEffect(() => {
    if (isLeaveCycleSuccess === true) {
      router.replace(router.asPath); // refresh page
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaveCycleSuccess]);

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    router.push(`/cycle/${router.query.id}/edit`);
  };

  const canEditCycle = (): boolean => {
    if (session) {
      if (session.user.roles === 'admin' || session!.user.id === cycle.creatorId) return true;
    }
    return false;
  };

  return (
    <>
      {!router.query.postId && canEditCycle() && (
        <Button variant="warning" onClick={handleEditClick} size="sm">
          {t('Edit')}
        </Button>
      )}
      <Row className="mb-5">
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
                  <img
                    src={cycle.creator.image || '/img/default-avatar.png'}
                    alt="creator avatar"
                    className={classNames(styles.cycleCreatorAvatar, 'mr-2')}
                  />
                  {cycle.creator.name}
                </div>
                <h1>{cycle.title}</h1>
                <CycleSummary cycle={cycle} />

                <section className={classNames('d-flex justify-content-between', styles.socialInfo)}>
                  <SocialInteraction entity={cycle} mySocialInfo={mySocialInfo} showCounts />
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
          <PostDetailComponent post={post} cycle={cycle} mySocialInfo={mySocialInfo} />
        )}
      </Row>

      {post == null && (
        <Row className="mb-5">
          <Col>
            {detailPagesState.selectedSubsectionCycle != null && (
              <TabContainer
                defaultActiveKey={detailPagesState.selectedSubsectionCycle}
                onSelect={handleSubsectionChange}
                transition={false}
              >
                <Row className="mb-4">
                  <Col>
                    <Nav variant="tabs" fill>
                      <NavItem>
                        <NavLink eventKey="cycle-content">
                          {t('tabHeaderCycleContent')} ({worksCount})
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink eventKey="posts">
                          {t('tabHeaderPosts')} ({postsCount})
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink eventKey="forum">
                          {t('tabHeaderForum')} (
                          <HyvorTalk.CommentCount websiteId={Number(HYVOR_WEBSITE_ID!)} id={hyvorId} />)
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TabContent>
                      <TabPane eventKey="cycle-content">
                        {cycle.contentText != null && (
                          <div className="mb-5">
                            <UnclampText text={cycle.contentText} clampHeight="7rem" />
                          </div>
                        )}
                        <h2 className="mb-5">{t('worksCountHeader', { count: worksCount })}</h2>
                        {worksCount > 0 && <WorksMosaic cycle={cycle} />}

                        {cycle.complementaryMaterials.length > 0 && (
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
                      <TabPane eventKey="posts">
                        <h2 className="mb-3">{t('postsCountHeader', { count: postsCount })}</h2>
                        <p className={styles.explanatoryText}>{t('explanatoryTextPosts')}</p>
                        {postsCount > 0 && <PostsMosaic cycle={cycle} />}
                      </TabPane>
                      <TabPane eventKey="forum">
                        <h3>{t('tabHeaderForum')}</h3>
                        <p className={styles.explanatoryText}>{t('explanatoryTextComments')}</p>
                        <HyvorComments id={hyvorId} />
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
