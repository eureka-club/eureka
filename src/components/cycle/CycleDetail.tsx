import dayjs from 'dayjs';
// import HyvorTalk from 'hyvor-talk-react';
import { useAtom } from 'jotai';
import {v4} from 'uuid';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useState, useRef, useEffect, ChangeEvent } from 'react';
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
  Form
} from 'react-bootstrap';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import {ImCancelCircle} from 'react-icons/im';
import { BiArrowBack } from 'react-icons/bi';
import { Work, Comment, Cycle, User, CycleWork } from '@prisma/client';
import { MosaicContext } from '../../useMosaicContext';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useQueryClient } from 'react-query';
// import UserAvatar from '../common/UserAvatar';
import Mosaic from '../Mosaic';
// import globalModals from '../../atoms/globalModals';

import { ASSETS_BASE_URL, DATE_FORMAT_SHORT_MONTH_YEAR /* , HYVOR_WEBSITE_ID, WEBAPP_URL */ } from '../../constants';
import { Session, MosaicItem, isCommentMosaicItem, isPostMosaicItem } from '../../types';
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
// import WorksMosaic from './WorksMosaic';
import WorkMosaic from '@/src/components/work/MosaicItem'
import CommentMosaic from '@/src/components/comment/MosaicItem';
import PostMosaic from '@/src/components/post/MosaicItem';
// import UnclampText from '../UnclampText';
import detailPagesAtom from '../../atoms/detailPages';
import globalModalsAtom from '../../atoms/globalModals';
import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import EditPostForm from '../forms/EditPostForm';

import styles from './CycleDetail.module.css';
import { useCycleContext, CycleContext } from '../../useCycleContext';
import CycleDetailHeader from './CycleDetailHeader';
import CycleDetailDiscussion from './CycleDetailDiscussion';
import useCycle from '@/src/useCycle';
import useCycleItem from '@/src/useCycleItems';

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
  // const [cycle, setCycle] = useState<CycleMosaicItem | null>();
  const router = useRouter();
  
  const queryClient = useQueryClient()

  const [cycleId,setCycleId] = useState<string>('')
  useEffect(()=>{
    if(router?.query && router.query.id)setCycleId(router.query.id?.toString())
  },[router])

  const {data:cycle,isLoading} = useCycle(+cycleId,{
    enabled:!!cycleId
  });

  const [page,setPage] = useState<number>(1);
  const [where,setWhere] = useState<{filtersWork:number[]}>()
  
  const {data} = useCycleItem(+cycleId,page,where,{
    enabled:!!cycleId
  })

  const [items,setItems] = useState<(CommentMosaicItem|PostMosaicItem)[]>();
  const [hasNextPage,setHasNextPage] = useState<boolean>();

  useEffect(()=>{
    if(data){
      setItems(data.items);
      setHasNextPage(data.hasNextPage);
    }
  },[data])


  // useEffect(()=>{
  //   if(cycle && posts){
  //     setItems((res)=>[...res,...posts])
      
  //     queryClient.setQueryData(['POSTS', `CYCLE-${cycle.id}`],{...cycle,...{
  //       posts:items
  //     }})
  //     setLastPostId(()=>items.slice(-1)[0].id)
  //   }
  // },[cycle,data,queryClient])
  

  const [detailPagesState, setDetailPagesState] = useAtom(detailPagesAtom);
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);
  
  const [session, isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');
  const [tabKey, setTabKey] = useState<string>();
  const tabContainnerRef = useRef<HTMLDivElement>(null);
  const refParticipants = useRef<Typeahead<User>>(null);
  const [filtersWork, setFiltersWork] = useState<number[]>([]);
  const [filterCycleItSelf, setFilterCycleItSelf] = useState<boolean>(false);  
  const [filtersParticipant,setFiltersParticipant] = useState<number[]>([]);
  const [filtersContentType, setFiltersContentType] = useState<string[]>([]);
  const [gldView, setgldView] = useState<Record<string, boolean>>({});
  const [comboboxChecked, setComboboxChecked] = useState<Record<string, boolean>>({
    post: false,
    comment: false,
    /*movie: false,
    documentary: false,
    book: false,
    'fiction-book': false, */
  });
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

  if(!cycle)return <></>

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

   const handleEditPostOnSmallerScreen = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: !editPostOnSmallerScreen.value } });
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

  // const getComments = () => {
  //   const getParent = (c: Comment): WorkMosaicItem | CycleMosaicItem |  CommentMosaicItem  => {
  //     const cmi = (c as CommentMosaicItem);
  //     if(!cmi.commentId && !cmi.postId){        
  //       if(cmi.workId) return (cmi.work as WorkMosaicItem);
  //       if(cmi.cycleId) return (cycle as CycleMosaicItem);
  //     }
  //     return cmi;
  //   };
  //   if (cycle && items.length){
      
  //     const fcf = items.filter((c) => !c.postId && !c.commentId);
  //     const fcfs = fcf.sort((p, c) => (p.id > c.id && -1) || 1)
  //     return fcfs
  //       // .map(c => <ComentMosaic
  //       //       key={v4()}
  //       //       comment={c as unknown as CommentMosaicItem}
  //       //       detailed
  //       //       showComments
  //       //       commentParent={getParent(c)}
  //       //       cacheKey={['CYCLE', `${cycle.id}`]}
  //       //       className="mb-4"
  //       //     />
        
  //       // );
  //   }
  //   return [];
  // };

  // const getPosts = () => {
  //   if(cycle && items.length)
  //     return items.sort((a,b)=>a.createdAt >= b.createdAt ? -1 : 1);
  //   return [];
  // };

  const renderItems = () => {
    const res = []
    if(cycle && items){
      // const items = [
      //   ... getComments() as CommentMosaicItem[],
      //   ... getPosts()
      // ]
      // .sort((a,b)=>a.createdAt >= b.createdAt ? -1 : 1);
      for(let i of items){
        if(isPostMosaicItem(i)){
          const ck = ['POST',i.id.toString()];
          queryClient.setQueryData(ck,i)
          res.push(
            <PostMosaic postId={i.id} display="h" cacheKey={ck} showComments className="mb-2" />
          )
        }
        else if(isCommentMosaicItem(i)){
          const ck = ['COMMENT',i.id.toString()];
          queryClient.setQueryData(ck,i)
          res.push(
            <CommentMosaic detailed commentId={i.id} 
            commentParent={i.post as PostMosaicItem || i.work as WorkMosaicItem || i.cycle as CycleMosaicItem}
            cacheKey={ck} className="mb-2" />
          )
        }
        
      }
      return <section data-cy="mosaic-items">
        {res}
         {/* <Mosaic
              display="h"
              stack={items}
              showComments={true}
              cacheKey={['ITEMS', `CYCLE-${cycle.id}-PAGE-${page}`]}
            />  */}
      </section>
    }
    return <></>
  }


  /* const renderCycleWorksComments = () => {
    if (cycle && cycle.comments)
      return cycle.comments
        .filter((c) => c.workId && !c.postId && !c.commentId)
        .sort((p, c) => (p.id > c.id && -1) || 1)
        .map((c) => {
          return (
            <ComentMosaic
              key={c.id}
              comment={c as unknown as CommentMosaicItem}
              detailed
              showComments
              commentParent={c.work!}
              cacheKey={['CYCLE', `${cycle.id}`]}
              className="mb-4"
            />
          );
        });
    return null;
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
              comment={c as unknown as CommentMosaicItem}
              detailed
              showComments
              commentParent={cycle}
              cacheKey={['CYCLE', `${cycle.id}`]}
              className="mb-4"
            />
          );
        });
    return null;
  }; */

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
            <h5 className="h6 fw-bold mb-0 ps-3 py-1 d-flex text-secondary">
              <span className="py-1 fw-bold">{`${IDX}. `}</span>
              <span className="py-1 fw-bold h6 mb-0 ps-3 d-flex">{`${g.title}`}</span>
              <Button className="ms-auto text-white" size="sm" onClick={() => toggleGuidelineDesc(key)}>
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
  
  const renderCycleWorksOrCycleFilters = () => {
    if(cycle && cycle.works){
      const res = cycle.works.map((w) => {
        queryClient.setQueryData(['WORK',`${w.id}`],w)
        return <Col key={v4()} xs={12}>
        <Form.Check label={w.title} 
          checked={comboboxChecked[`work-${w.id}`]}
          onChange={(e) => handlerComboxesChange(e, 'work', w.id)}
        />
      </Col>;
      });
      res.unshift(<Col key={v4()} xs={12}>
      <Form.Check label={t('common:cycle')} 
        checked={comboboxChecked[`cycle`]}
        onChange={(e) => handlerComboxesChange(e, 'cycle')}
      />
    </Col>);
      return res;
    }
    return '';
  };

  // const loadMorePosts = (e:MouseEvent<HTMLButtonElement>)=>{
  //   e.preventDefault()
  //   if(cycle?.posts.length){
  //     setLastPostId(cycle.posts.slice(-1)[0].id)
  //   }
  // }

  const renderRestrictTabs = () => {
    if (cycle) {
      const res = (
        <>
          <TabPane eventKey="cycle-discussion">
            <CycleDetailDiscussion cycle={cycle} className="mb-5" cacheKey={['ITEMS',`CYCLE-${cycle.id}-PAGE-${page}`]} />
            <Row>
              <Col xs={{span:12, order:'last'}} md={{span:9,order:'first'}}>
                <MosaicContext.Provider value={{ showShare: true }}>
                  {renderItems()}
                </MosaicContext.Provider>
                {page >1 && <Button 
                className="my-3 pe-3 rounded-pill text-white" 
                onClick={() => setPage(()=>page-1)} 
                >
                  <span>
                    <RiArrowDownSLine /> {t('common:previous')}
                  </span>
                </Button>}
                {hasNextPage && <Button 
                className="my-3 pe-3 rounded-pill text-white" 
                onClick={() => setPage(()=>page+1)} 
                >
                  <span>
                    <RiArrowDownSLine /> {t('common:next')}
                  </span>
                </Button>}
                {/* {(cycle.posts && cycle.posts.length && (
                    <PostsMosaic display="h" posts={items} showComments cacheKey={['CYCLE', `${cycle.id}`]} />
                )) ||
                null}
                {renderComments()} */}
                {/* {renderCycleWorksComments()} */}
                {/* {renderCycleOwnComments()} */}
              </Col>
              {/* <Col xs={{span:12, order:'first'}} md={{span:3,order:'last'}}>
                <Form as={Row} className="bg-white mt-0 mb-3">
                  <Form.Group as={Col} xs={12}>
                        <Row>
                          <Form.Label className="text-primary">{t('Filter by work')}</Form.Label>
                          {renderCycleWorksOrCycleFilters()}
                        </Row>
                  </Form.Group>
                  <Form.Group className="mt-3" as={Col} xs={12}>
                        <Row>
                          <Form.Label className="text-primary">{t('Filter by type of element')}</Form.Label>
                          <Col xs={5}>
                            <Form.Check label={t('common:post')} 
                              checked={comboboxChecked['post']}
                              onChange={(e) => handlerComboxesChange(e, 'post')}
                            />
                          </Col>
                          <Col xs={7}>
                            <Form.Check label={t('common:comment')} 
                              checked={comboboxChecked['comment']}
                              onChange={(e) => handlerComboxesChange(e, 'comment')}
                            />
                          </Col>
                        </Row>
                  </Form.Group>
                  <Form.Group className="mt-3" as={Col} xs={12}>
                        <Form.Label className="text-primary">{t('Filter by Participan')}</Form.Label>
                        <Typeahead
                        clearButton={true}
                          ref={refParticipants}
                          id="refParticipants"
                          filterBy={['label']}
                          labelKey={(u: User) => {
                            if(u?.name) return u.name;
                            return u?.email || `${u.id}`;
                          }}
                          onChange={onChangeParticipantFilters}                  
                          options={[...cycle.participants, cycle.creator]}
                          className="bg-light border border-info rounded"                  
                        />
                  </Form.Group>
                  <Form.Group className="mt-3" as={Col} xs={12}>
                    <Button title={t('Clean filters')} className="mt-3" variant="warning" size="sm" onClick={resetFilters}><ImCancelCircle/></Button>
                  </Form.Group>
                </Form>
              </Col> */}
              
            </Row>
            
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
              <Mosaic cacheKey={['CYCLE',cycle.id.toString()]} showButtonLabels={false} stack={[...cycle.participants, cycle.creator] as UserMosaicItem[]} />
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
          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="cycle-discussion">
              <span className="mb-3">{t('Discussion')}</span>
            </NavLink>
          </NavItem>
          {/* <NavItem className={`${styles.tabBtn}`}>
            <NavLink eventKey="my_milestone">{t('My milestones')}</NavLink>
          </NavItem> */}
          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="guidelines">
              <span className="mb-3">{t('Guidelines')}</span>
            </NavLink>
          </NavItem>

          <NavItem className={`cursor-pointer ${styles.tabBtn}`}>
            <NavLink eventKey="participants">
              <span className="mb-3">{t('Participants')} ({[...cycle.participants, cycle.creator].length})</span>
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
    setGlobalModalsState({ ...globalModalsState, ...{ 
      editPostModalOpened: true } });
  };

  const getDefaultActiveKey = () => {
    if (cycle) {
      if (cycle.access === 1) {
        if (cycleContext.currentUserIsParticipant) return 'cycle-discussion';
        return 'cycle-about';
      }
      if (cycle.access === 2 && cycleContext.currentUserIsParticipant) return 'cycle-discussion';
      if (cycle.access === 3 && cycleContext.currentUserIsParticipant) return 'cycle-discussion';
    }
    return 'cycle-about';
  };

  const resetComboboxFilters = () => {
    Object.keys(comboboxChecked).forEach(k => {
      comboboxChecked[k] = false;
    });
    setComboboxChecked(comboboxChecked);
  };

  const resetFilters = () => {
    refParticipants.current?.clear();
    resetComboboxFilters();
    setFiltersContentType([]);
    setFiltersParticipant([]);
    setFiltersWork([]);
    setFilterCycleItSelf(false);
  };

  const onChangeParticipantFilters = (p: User[]) => {
    if(p.length){
      const {id} = p[0];
      setFiltersParticipant([id]);
    }
    else {
      setFiltersParticipant([]);
    }
  };

  const onChangeContentTypeFilters = (type: string, checked: boolean) => {
    if(type){
      if(checked)
        filtersContentType.push(type);
      else {
        const idx = filtersContentType.indexOf(type);
        if(idx !== -1){
          filtersContentType.splice(idx,1);
        }        
      }
      setFiltersContentType([...filtersContentType]);
    }    
  };

  const onChangeWorkFilters = (id: number, checked: boolean) => {
    if(checked)
      filtersWork.push(id);
    else {
      const idx = filtersWork.indexOf(id);
      if(idx !== -1){
        filtersWork.splice(idx,1);
      }        
    }        
    setFiltersWork([...filtersWork]);
    setWhere((w)=>({...w,filtersWork}))
    console.log(filtersWork,'filtersWork')
  };

  const onChangeCycleFilters = (checked: boolean) => {
    setFilterCycleItSelf(checked);
  };

  // useEffect(() => {
  //   if(cycle && cycle.posts && cycle.comments){
  //     let posts = [...filteredPosts];
  //     let comments = cycle?.comments;

  //     if(filterCycleItSelf){
  //       posts = posts?.filter((p) => !p.works.length);
  //       comments = comments?.filter((c) => !c.workId && !c.commentId);  
  //     }
  //     if(filtersWork && filtersWork.length){
  //       posts = posts?.filter((p) => p.works.findIndex((w) => filtersWork.includes(w.id)) !== -1);
  //       comments = comments?.filter((c) => c.workId && filtersWork.includes(c.workId));
  //     }
  //     if(filtersParticipant && filtersParticipant.length){
  //       posts = posts?.filter((p) => filtersParticipant.findIndex(i => i  === p.creatorId) !== -1);            
  //       comments = comments?.filter((c) => filtersParticipant.findIndex(i => i  === c.creatorId) !== -1);
  //     }
  //     if(filtersContentType && filtersContentType.length){
  //       if(!filtersContentType.includes('post'))
  //         posts = [];
  //       if(!filtersContentType.includes('comment'))
  //         comments = [];  
  //     }
  //     setFilteredPosts(posts as PostMosaicItem[]);
  //     setFilteredComments(comments || []);
  //   }
  //   else {
  //     setFilteredPosts([]);
  //     setFilteredComments([]);
  //   }
  //   filteredPosts.forEach(p=>{queryClient.setQueryData(['POST',`${p.id}`],p)})
  // },[filtersWork,filtersParticipant,filtersContentType,filterCycleItSelf,cycle]);


  const handlerComboxesChange = (e: ChangeEvent<HTMLInputElement>, q: string, workId?: number) => {
    setComboboxChecked((res) => ({ ...res, [`${q}${workId ? `-${workId}`: ''}`]: e.target.checked }));
    
    switch(q){
      case 'post':
        onChangeContentTypeFilters('post', e.target.checked)
        /* if(e.target.checked){
          let posts = cycle?.posts;
          if(filtersParticipant?.length){
            posts = posts?.filter((p) => filtersParticipant.findIndex(i => i  === p.creatorId) !== -1);            
          }
          if(filtersWork.length){
            posts = posts?.filter((p) => p.works.findIndex((w) => filtersWork.includes(w.id)) !== -1);            
          }
          setItems(posts as PostMosaicItem[]);
        }
        else setItems([]);   */
        break;
      case 'comment':
        onChangeContentTypeFilters('comment', e.target.checked)
        /* if(e.target.checked){
          let comments = cycle?.comments;
          if(filtersParticipant?.length){
            comments = comments?.filter((c) => filtersParticipant.findIndex(i => i  === c.creatorId) !== -1);
          }
          if(filtersWork.length){
            comments = comments?.filter((c) => c.workId && filtersWork.includes(c.workId));
          }
          setFilteredComments(comments || []);
        }        
        else setFilteredComments([]); */  
        break;    
      case 'work':
        if(workId){
          setFilterCycleItSelf(false);
          setComboboxChecked((res)=>({...res,'cycle':false}));
          onChangeWorkFilters(workId,e.target.checked);
        }
        /* if(e.target.checked){
          if(workId){
            filtersWork.push(workId);
            setFiltersWork([...filtersWork]);            
          }
        }
        else {
          const idx = filtersWork.findIndex((id) => id === workId);
          if(idx > -1)
            filtersWork.splice(idx, 1);
          setFiltersWork(filtersWork);
        }
        let posts = cycle?.posts;
        let comments = cycle?.comments;
        if(filtersWork.length){
          posts = posts?.filter((p) => p.works.findIndex((w) => filtersWork.includes(w.id)) !== -1);
          comments = comments?.filter((c) => c.workId && filtersWork.includes(c.workId));
        }
        if(filtersParticipant?.length){
          posts = posts?.filter((p) => filtersParticipant.findIndex(i => i  === p.creatorId) !== -1);            
          comments = comments?.filter((c) => filtersParticipant.findIndex(i => i  === c.creatorId) !== -1);
        }
        setItems(posts as PostMosaicItem[]);
        setFilteredComments(comments || []); */
        break;      
        case 'cycle':
          if(e.target.checked){
            setComboboxChecked((res)=>{
              Object.keys(res).forEach((k) => {
                if(k.startsWith('work-'))
                  res[k] = false;
              });
              return {...res};
            });
            setFiltersWork([]);
          }
          onChangeCycleFilters(e.target.checked);
          break;
    }
  };
  
  const removeCycle = async (e:MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if(cycle){
      const res = await fetch(`/api/cycle/${cycle.id}`,{
        method:'delete',
      });
      if(res.ok){
        const json = await res.json();
        return json;
      }
      else{
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'warning',
            title: t(`common:${res.statusText}`),
            message: res.statusText,
          },
        });
      }
    }
    return null;
  };

  const getWorksSorted = () => {
    const res: Work[] = [];
    cycle!.cycleWorksDates
      .sort((f, s) => {
        const fCD = dayjs(f.startDate!);
        const sCD = dayjs(s.startDate!);
        const isActive = (w: CycleWork) => {
          if (w.startDate && w.endDate) return dayjs().isBetween(w.startDate!, w.endDate);
          if (w.startDate && !w.endDate) return dayjs().isAfter(w.startDate);
          return false;
        };

        if (isActive(f) && !isActive(s)) return -1;
        if (!isActive(f) && isActive(s)) return 1;
        if (fCD.isAfter(sCD)) return 1;
        if (fCD.isSame(sCD)) return 0;
        return -1;
      })
      .forEach((cw) => {
        const idx = cycle!.works.findIndex((w) => w.id === cw.workId);
        res.push(cycle!.works[idx]);
      });
    if (cycle!.cycleWorksDates.length) return res;
    return cycle!.works;
  };

  const renderWorks = ()=>{
    if(cycle && cycle.works && cycle.works.length){
      
      // <WorksMosaic cycle={cycle} className="d-flex mb-5 justify-content-center" />
      return <section className="d-flex">
          <MosaicContext.Provider value={{ showShare: true }}>  
          <div className='container d-flex flex-wrap flex-column flex-lg-row justify-content-center justify-content-lg-start '>      
            {getWorksSorted().map(w=>{
              queryClient.setQueryData(['WORK',`${w.id}`],w)
              return <div className='p-4' key={v4()}>
                             <WorkMosaic  workId={w.id} />
                        </div>
            })}
            </div>
          </MosaicContext.Provider>

      </section> 
    }
    return <></>
  }

  return (
    <>
    {(!editPostOnSmallerScreen.value) ? 
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={() => router.back()} size="sm">
          <BiArrowBack />
        </Button>
        
        {!router.query.postId && canEditCycle() && (
          <Button variant="warning" onClick={handleEditClick} size="sm">
            {t('Edit')}
          </Button>
        )}
       
        {/* <Button className="" variant="danger" onClick={e=>{removeCycle(e)}}>Remove Cycle</Button> */}

        {post && cycle && canEditPost() && (<>
          <Button className='d-none d-md-block' variant="warning" onClick={handleEditPostClick} size="sm">
            {t('Edit')}
          </Button>
            <Button className='d-block d-md-none' variant="warning" onClick={handleEditPostOnSmallerScreen} size="sm">
            {t('Edit')}
          </Button></>
        )}
      </ButtonGroup> : 
    
      <ButtonGroup className="mt-1 mt-md-3 mb-1">
        <Button variant="primary text-white" onClick={handleEditPostOnSmallerScreen} size="sm">
          <BiArrowBack />
        </Button>
      </ButtonGroup>
     }

{(!editPostOnSmallerScreen.value) ? <>
      {!post && renderCycleDetailHeader()}
      {post && cycle && (
        <MosaicContext.Provider value={{ showShare: true }}>
          <PostDetailComponent cacheKey={['CYCLE',cycle.id.toString()]} postId={post.id} work={work} />
        </MosaicContext.Provider>
      )}
      {cycle && post == null && (
        <Row className="mb-5" ref={tabContainnerRef}>
          <Col>
            {detailPagesState.selectedSubsectionCycle != null && (
              <TabContainer
                //defaultActiveKey={}
                onSelect={handleSubsectionChange}
                activeKey={tabKey || getDefaultActiveKey()}
                transition={false}
              >
                {/* language=CSS */}
                <style jsx global>
                  {`
                    .nav-tabs .nav-item.show .nav-link,
                    .nav-tabs .nav-link.active,
                    .nav-tabs .nav-link:hover {
                      background-color: var(--bs-primary);
                      color: white !important;
                      border: none !important;
                      border-bottom: solid 2px var(--bs-primary) !important;
                    }
                    .nav-tabs {
                      border: none !important;
                    }
                  `}
                </style>
                <Row className="mb-4">
                  <Col>
                    <Nav variant="tabs" className='scrollNav' fill>
                      <NavItem className={`border-primary border-bottom bcursor-pointer ${styles.tabBtn}`}>
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
                        {renderWorks()}
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
      )}</> : <EditPostForm noModal />}
    </>
  );
};

export default CycleDetailComponent;
