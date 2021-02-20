import classNames from 'classnames';
import { CommentCount, DiscussionEmbed } from 'disqus-react';
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
import { AiFillHeart } from 'react-icons/ai';
import { BsBookmarkFill } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';
import { useMutation } from 'react-query';

import { DISQUS_SHORTNAME, WEBAPP_URL } from '../../constants';
import { CycleDetail } from '../../types/cycle';
import { PostDetail } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import PostDetailComponent from '../post/PostDetail';
import CycleSummary from './CycleSummary';
import PostsMosaic from './PostsMosaic';
import WorksMosaic from './WorksMosaic';
import UnclampText from '../UnclampText';
import styles from './CycleDetail.module.css';

interface Props {
  cycle: CycleDetail;
  post?: PostDetail;
  isCurrentUserJoinedToCycle: boolean;
  participantsCount: number;
  postsCount: number;
  worksCount: number;
}

const CycleDetailComponent: FunctionComponent<Props> = ({
  cycle,
  post,
  isCurrentUserJoinedToCycle,
  participantsCount,
  postsCount,
  worksCount,
}) => {
  const router = useRouter();
  const [session] = useSession();
  const { t } = useTranslation('cycleDetail');
  const disqusConfig = {
    identifier: router.asPath,
    title: cycle.title,
    url: `${WEBAPP_URL}${router.asPath}`,
  };

  const { mutate: execJoinCycle, isLoading: isJoinCycleLoading, isSuccess: isJoinCycleSuccess } = useMutation(
    async () => {
      await fetch(`/api/cycle/${cycle.id}/join`, { method: 'POST' });
    },
  );
  const { mutate: execLeaveCycle, isLoading: isLeaveCycleLoading, isSuccess: isLeaveCycleSuccess } = useMutation(
    async () => {
      await fetch(`/api/cycle/${cycle.id}/join`, { method: 'DELETE' });
    },
  );

  const handleJoinCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execJoinCycle();
  };

  const handleLeaveCycleClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    execLeaveCycle();
  };

  useEffect(() => {
    if (isJoinCycleSuccess === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJoinCycleSuccess]);

  useEffect(() => {
    if (isLeaveCycleSuccess === true) {
      router.replace(router.asPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaveCycleSuccess]);

  return (
    <>
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
                  <div>
                    <span>
                      <BsBookmarkFill /> #
                    </span>
                    <span>
                      <AiFillHeart /> #
                    </span>
                    <span>
                      <FiShare2 /> #
                    </span>
                  </div>
                  <div>
                    <small className={styles.participantsCount}>
                      {t('participantsCount', { count: participantsCount })}
                    </small>
                    {session != null && (
                      <>
                        <div className="d-inline-block mx-3" />
                        {(isJoinCycleLoading || isLeaveCycleLoading) && <Spinner animation="border" size="sm" />}
                        {isCurrentUserJoinedToCycle ? (
                          <Button onClick={handleLeaveCycleClick} variant="link">
                            {t('leaveCycleLabel')}
                          </Button>
                        ) : (
                          <Button onClick={handleJoinCycleClick}>{t('joinCycleLabel')}</Button>
                        )}
                      </>
                    )}
                  </div>
                </section>
              </div>
            </Col>
          </>
        ) : (
          <PostDetailComponent post={post} />
        )}
      </Row>

      <Row className="mb-5">
        <Col>
          <TabContainer defaultActiveKey="cycle-content" transition={false}>
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
                      {t('tabHeaderForum')} (<CommentCount config={disqusConfig} shortname={DISQUS_SHORTNAME!} />)
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
                  </TabPane>
                  <TabPane eventKey="posts">
                    <h2 className="mb-5">{t('postsCountHeader', { count: postsCount })}</h2>
                    {postsCount > 0 && <PostsMosaic cycle={cycle} />}
                  </TabPane>
                  <TabPane eventKey="forum">
                    <DiscussionEmbed config={disqusConfig} shortname={DISQUS_SHORTNAME!} />
                  </TabPane>
                </TabContent>
              </Col>
            </Row>
          </TabContainer>
        </Col>
      </Row>
    </>
  );
};

export default CycleDetailComponent;
