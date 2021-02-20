import classNames from 'classnames';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
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
import { BsBookmarkFill, BsBoxArrowUpRight } from 'react-icons/bs';
import { FiShare2 } from 'react-icons/fi';

import { WorkWithImages } from '../../types/work';
import { PostDetail } from '../../types/post';
import LocalImageComponent from '../LocalImage';
import CombinedMosaic from './CombinedMosaic';
import CyclesMosaic from './CyclesMosaic';
import PostDetailComponent from '../post/PostDetail';
import PostsMosaic from './PostsMosaic';
import UnclampText from '../UnclampText';
import WorkSummary from './WorkSummary';
import detailPagesAtom from '../../atoms/detailPages';
import styles from './WorkDetail.module.css';

interface Props {
  work: WorkWithImages;
  post?: PostDetail;
  cyclesCount: number;
  postsCount: number;
}

const WorkDetail: FunctionComponent<Props> = ({ work, post, cyclesCount, postsCount }) => {
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const { t } = useTranslation('workDetail');

  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  return (
    <>
      <Row className="mb-5">
        {post == null ? (
          <>
            <Col md={{ span: 4 }}>
              <div className={classNames(styles.imgWrapper, 'mb-3')}>
                <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
              </div>
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
            </Col>
            <Col md={{ span: 8 }}>
              <section className="mb-4">
                <h1>{work.title}</h1>
                <h2 className={styles.author}>{work.author}</h2>
                <WorkSummary work={work} />
                {work.link != null && (
                  <a href={work.link} className={styles.workLink} target="_blank" rel="noreferrer">
                    {t('workLinkLabel')} <BsBoxArrowUpRight />
                  </a>
                )}
              </section>
              {work.contentText != null && <UnclampText text={work.contentText} clampHeight="20rem" />}
            </Col>
          </>
        ) : (
          <PostDetailComponent post={post} work={work} />
        )}
      </Row>

      <Row className="mb-5">
        <Col>
          {detailPagesState.selectedSubsectionWork != null && (
            <TabContainer
              defaultActiveKey={detailPagesState.selectedSubsectionWork}
              onSelect={handleSubsectionChange}
              transition={false}
            >
              <Row className="mb-4">
                <Col>
                  <Nav variant="tabs" fill>
                    <NavItem>
                      <NavLink eventKey="all">
                        {t('tabHeaderAll')} ({cyclesCount + postsCount})
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink eventKey="posts">
                        {t('tabHeaderPosts')} ({postsCount})
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink eventKey="cycles">
                        {t('tabHeaderCycles')} ({cyclesCount})
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Col>
              </Row>
              <Row>
                <Col>
                  <TabContent>
                    <TabPane eventKey="all">
                      {(cyclesCount > 0 || postsCount > 0) && <CombinedMosaic work={work} />}
                    </TabPane>
                    <TabPane eventKey="posts">{postsCount > 0 && <PostsMosaic work={work} />}</TabPane>
                    <TabPane eventKey="cycles">{cyclesCount > 0 && <CyclesMosaic work={work} />}</TabPane>
                  </TabContent>
                </Col>
              </Row>
            </TabContainer>
          )}
        </Col>
      </Row>
    </>
  );
};

export default WorkDetail;
