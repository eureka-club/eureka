// import classNames from 'classnames';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent } from 'react';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
import Row from 'react-bootstrap/Row';
import TabContainer from 'react-bootstrap/TabContainer';
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane';
import { Button } from 'react-bootstrap';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { MySocialInfo, Session } from '../../types';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
// import LocalImageComponent from '../LocalImage';
import CombinedMosaic from './CombinedMosaic';
import CyclesMosaic from './CyclesMosaic';
import PostDetailComponent from '../post/PostDetail';
import PostsMosaic from './PostsMosaic';
// import SocialInteraction from '../common/SocialInteraction';
import UnclampText from '../UnclampText';
import WorkSummary from './WorkSummary';
import detailPagesAtom from '../../atoms/detailPages';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './WorkDetail.module.css';
import TagsInput from '../forms/controls/TagsInput';
import MosaicItem from './MosaicItem';

interface Props {
  work: WorkMosaicItem;
  post?: PostMosaicItem;
  cyclesCount: number;
  postsCount: number;
  mySocialInfo: MySocialInfo;
}

const WorkDetailComponent: FunctionComponent<Props> = ({ work, post, cyclesCount, postsCount }) => {
  const router = useRouter();

  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { t } = useTranslation('workDetail');
  const [session] = useSession() as [Session | null | undefined, boolean];
  const handleSubsectionChange = (key: string | null) => {
    if (key != null) {
      setDetailPagesState({ ...detailPagesState, selectedSubsectionWork: key });
    }
  };

  const handleEditClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setGlobalModalsState({ ...globalModalsState, ...{ editWorkModalOpened: true } });
  };

  const canEditWork = (): boolean => {
    if (session && session.user.roles === 'admin') return true;
    return false;
  };

  return (
    <>
      {!router.query.postId && canEditWork() && (
        <Button variant="warning" onClick={handleEditClick} size="sm">
          {t('edit')}
        </Button>
      )}
      <Row className="mb-5">
        {post == null ? (
          <>
            <Col md={{ span: 3 }}>
              <MosaicItem work={work} showTrash />
              {/* <div className={classNames(styles.imgWrapper, 'mb-3')}>
                <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
              </div>
              <SocialInteraction cacheKey={['WORKS', `${work.id}`]} entity={work} showCounts showShare showTrash /> */}
            </Col>
            <Col md={{ span: 9 }}>
              <section className="mb-4">
                <h1>{work.title}</h1>
                <h2 className={styles.author}>{work.author}</h2>
                <WorkSummary work={work} />
                {work.tags && <TagsInput tags={work.tags} readOnly label="" />}
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

export default WorkDetailComponent;
