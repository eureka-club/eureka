import classNames from 'classnames';
import { useAtom } from 'jotai';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState } from 'react';

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
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { MySocialInfo, Session } from '../../types';
import { PostDetail,PostMosaicItem } from '../../types/post';
import { WorkDetail } from '../../types/work';
import PostDetailComponent from '../post/PostDetail';

// import LocalImageComponent from '../LocalImage';
// import CombinedMosaic from './CombinedMosaic';
// import CyclesMosaic from './CyclesMosaic';
// import PostsMosaic from './PostsMosaic';
// import SocialInteraction from '../common/SocialInteraction';
import UnclampText from '../UnclampText';
import WorkSummary from './WorkSummary';
import detailPagesAtom from '../../atoms/detailPages';
import globalModalsAtom from '../../atoms/globalModals';
import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import styles from './WorkDetail.module.css';
import TagsInput from '../forms/controls/TagsInput';
import MosaicItem from './MosaicItem';
import { MosaicContext } from '../../useMosaicContext';
import { WorkContext } from '../../useWorkContext';
import EditPostForm from '../forms/EditPostForm';
import {useQueryClient} from 'react-query'
import useWork from '@/src/useWork'
import useCycles from '@/src/useCycles'
import usePosts from '@/src/usePosts'
// import CommentsList from '../common/CommentsList';
import ListWindow from '@/components/ListWindow'
import { CycleMosaicItem } from '@/src/types/cycle';
interface Props {
  workId: number;
  post?: PostMosaicItem;
}

const WorkDetailComponent: FunctionComponent<Props> = ({ workId, post }) => {
  const router = useRouter();
  const queryClient = useQueryClient()
  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const { t } = useTranslation('workDetail');
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  const [session] = useSession() as [Session | null | undefined, boolean];
  
  const {data:work} = useWork(workId,{
      enabled:!!workId
  })

  const workItemsWhere = {
    works:{
      some:{
        id:workId
      }
    }
  }
  const {data:cycles} = useCycles(workItemsWhere,{enabled:!!workId})
  const {data:posts} = usePosts(workItemsWhere,{enabled:!!workId})
  
  const [all,setAll] = useState<(CycleMosaicItem|PostMosaicItem)[]>()
  useEffect(()=>{
    if(cycles)setAll(prev=>prev ? [...prev,...cycles]:cycles)

    if(posts)setAll(prev=>prev ? [...prev,...posts]:posts)
  },[posts,cycles])

  let cyclesCount = 0;
  let postsCount = 0;
  if(posts)postsCount = posts.length
  if(cycles)cyclesCount = cycles.length
  
  if(!work)return <></>
  

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

  const canEditPost = (): boolean => {
    if (session && post && session.user.id === post.creatorId) return true;
    return false;
  };

  const handleEditPostClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: true } });
  };

  const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
      };
      
      return <>
    <WorkContext.Provider value={{ work, linkToWork: false }}>
      <MosaicContext.Provider value={{ showShare: true }}>
       
       {(!editPostOnSmallerScreen.value) ? 
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
          <Button variant="primary text-white" onClick={() => router.back()} size="sm">
            <BiArrowBack />
          </Button>
          {!router.query.postId && canEditWork() && (
            <Button variant="warning" onClick={handleEditClick} size="sm">
              {t('edit')}
            </Button>
          )}
          {post && work && canEditPost() && (<>
          <Button className='d-none d-md-block' variant="warning" onClick={handleEditPostClick} size="sm">
            {t('edit')}
          </Button>
            <Button className='d-block d-md-none' variant="warning" onClick={handleEditPostOnSmallerScreen} size="sm">
            {t('edit')}
          </Button></>
          )}
        </ButtonGroup> :
        
        <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={handleEditPostOnSmallerScreen} size="sm">
          <BiArrowBack />
        </Button>
      </ButtonGroup>
      }

     {(!editPostOnSmallerScreen.value) 
      ? <>
          <>
            {post == null ? (
              <Row className="mb-5 d-flex flex-column flex-md-row">
                <Col className='col-md-5 col-lg-4 col-xl-3   d-none d-md-block'>
                  <MosaicItem workId={work.id} showTrash linkToWork={false} />

                  {/* <div className={classNames(styles.imgWrapper, 'mb-3')}>
                  <LocalImageComponent filePath={work.localImages[0].storedFile} alt={work.title} />
                </div>
                <SocialInteraction cacheKey={['WORKS', `${work.id}`]} entity={work} showCounts showShare showTrash /> */}
                </Col>
                <Col className='col-md-7 col-lg-8 col-xl-9'>
                  <section className="mx-md-4">
                    <h1 className="fw-bold text-secondary">{work.title}</h1>
                    <h2 className={styles.author}>{work.author}</h2>
                    <WorkSummary workId={work.id} />
                    {work.tags && <TagsInput tags={work.tags} readOnly label="" />}
                    {work.link != null && (
                      <a href={work.link} className={classNames(styles.workLink,'mb-5')} target="_blank" rel="noreferrer">
                        {t('workLinkLabel')} <BsBoxArrowUpRight />
                      </a>
                    )}
                  
                  <div className='container d-sm-block d-md-none mt-4 mb-4 position-relative'>
                    <MosaicItem className='postition-absolute start-50 translate-middle-x'  workId={work.id} showTrash linkToWork={false} />
                  </div>
                  {work.contentText != null && <UnclampText isHTML={false} text={work.contentText} clampHeight="8rem" />}
                  </section>
                {/* <div className='container d-none d-lg-block mt-5'>
                  <CommentsList entity={work} parent={undefined}/>
                </div> */}
          </Col>
            {/* <div className='container d-sm-block d-lg-none mt-3'>
                  <CommentsList entity={work} parent={undefined}/>
            </div> */}
              </Row>
            ) : (
              <>{post && work && <PostDetailComponent postId={post.id} work={work} cacheKey={['POST',`${post.id}`]} />}</>
            )}
          </>

          {post == null && (
            <Row className="mb-5">
              <Col>
                {detailPagesState.selectedSubsectionWork != null && (
                  <TabContainer
                    defaultActiveKey={detailPagesState.selectedSubsectionWork}
                    onSelect={handleSubsectionChange}
                    transition={false}
                  >
                  
                    <style jsx global>
                      {`
                        .nav-tabs .nav-item.show .nav-link,
                        .nav-tabs .nav-link.active,
                        .nav-tabs .nav-link:hover {cursor:pointer;
                          background-color: var(--bs-primary);
                          color: white!important;
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
                      <div className=''>
                        <Nav variant="tabs" className='scrollNav' fill>
                          <NavItem>
                            <NavLink eventKey="all">
                              {t('tabHeaderAll')} ({cyclesCount+postsCount})
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
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <TabContent>
                          <TabPane eventKey="all">
                            {/* {(cyclesCount > 0 || postsCount > 0) && <CombinedMosaic work={work} />} */}
                            {all && <ListWindow items={all} cacheKey={['WORK',`${work.id}-ALL`]} />}{/* TODO both cycles and posts are in separated cache */}
                          </TabPane>
                          <TabPane eventKey="posts">
                            <p className={styles.explanatoryText}>{t('explanatoryTextPosts')}</p>

                            {/* {postsCount > 0 && <PostsMosaic work={work} />} */}
                            {posts && <ListWindow items={posts} cacheKey={['POSTS',JSON.stringify(workItemsWhere)]} />}
                          </TabPane>
                          <TabPane eventKey="cycles">
                            {/* {cyclesCount > 0 && <CyclesMosaic work={work} />} */}
                            {cycles && <ListWindow items={cycles} cacheKey={['CYCLES',JSON.stringify(workItemsWhere)]} />}
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
      : <EditPostForm noModal cacheKey={['POSTS',JSON.stringify(workItemsWhere)]} />}
      </MosaicContext.Provider>
    </WorkContext.Provider>
  </>
  ;
};

export default WorkDetailComponent;
