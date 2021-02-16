import classNames from 'classnames';
import { CommentCount, DiscussionEmbed } from 'disqus-react';
import { useRouter } from 'next/router';
import { FunctionComponent } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import { AiFillHeart } from 'react-icons/ai';
import { BsBookmarkFill } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';

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
  postsCount: number;
  worksCount: number;
}

const CycleDetailComponent: FunctionComponent<Props> = ({ cycle, post, postsCount, worksCount }) => {
  const { asPath } = useRouter();
  const disqusConfig = {
    identifier: asPath,
    title: cycle.title,
    url: `${WEBAPP_URL}${asPath}`,
  };

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
              <div className="pt-3 px-4">
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
                <section className={styles.socialInfo}>
                  <span>
                    <BsBookmarkFill /> #
                  </span>
                  <span>
                    <AiFillHeart /> #
                  </span>
                  <span>
                    <FiShare2 /> #
                  </span>
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
                    <NavLink eventKey="cycle-content">Cycle content ({worksCount})</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="posts">Posts ({postsCount})</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink eventKey="forum">
                      Forum (<CommentCount config={disqusConfig} shortname={DISQUS_SHORTNAME!} />)
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
                    {worksCount === 0 && <h2>No Works in cycle</h2>}
                    {worksCount === 1 && <h2>1 Work in cycle</h2>}
                    {worksCount > 1 && <h2>{worksCount} Works in cycle</h2>}
                    {worksCount > 0 && <WorksMosaic cycle={cycle} />}
                  </TabPane>
                  <TabPane eventKey="posts">
                    {postsCount === 0 && <h2>No Posts in cycle</h2>}
                    {postsCount === 1 && <h2>1 Post in cycle</h2>}
                    {postsCount > 1 && <h2>{postsCount} Posts in cycle</h2>}
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
