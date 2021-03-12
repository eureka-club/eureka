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
import { BsBoxArrowUpRight } from 'react-icons/bs';

import ActionButton from '../common/ActionButton';
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
  currentActions: object;
  currentActionsPost: object;
}

const WorkDetail: FunctionComponent<Props> = ({ 
  work,
  post,
  cyclesCount,
  postsCount,
  currentActions,
  currentActionsPost,
}) => {
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
              <ActionButton
                level={work}
                level_name="work"
                currentActions={currentActions}
                show_counts
              />
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
          <PostDetailComponent 
            post={post}
            work={work}
            currentActionsPost={currentActionsPost}
          />
        )}
      </Row>

      {post == null && (
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
                      <TabPane eventKey="posts">
                        <p className={styles.explanatoryText}>{t('explanatoryTextPosts')}</p>
                        {postsCount > 0 && <PostsMosaic work={work} />}
                      </TabPane>
                      <TabPane eventKey="cycles">{cyclesCount > 0 && <CyclesMosaic work={work} />}</TabPane>
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

export default WorkDetail;
