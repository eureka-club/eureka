import { Cycle, Work } from '@prisma/client';
import { FunctionComponent,useState } from 'react';
import Masonry from 'react-masonry-css';

import { v4 } from 'uuid';
import {Row, Col, Container,Button} from 'react-bootstrap';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem, isCommentMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import MosaicItemUser from './user/MosaicItem';
import MosaicItemComment from './comment/MosaicItem';
import styles from './Mosaic.module.css';
import { CycleMosaicItem } from '../types/cycle';
import { WorkMosaicItem } from '../types/work';
import { PostMosaicItem } from '../types/post';
import { CycleContext } from '../useCycleContext';
import { CommentMosaicItem } from '../types/comment';
import {BiChevronRight,BiChevronLeft} from 'react-icons/bi'
// import { WorkContext } from '../useWorkContext';

const renderMosaicItem = (
  item: MosaicItem,
  parent: CycleMosaicItem | WorkMosaicItem | undefined,
  showButtonLabels: boolean,
  display: 'h' | 'v',
  showComments: boolean,
  cacheKey: [string,string],
) => {
  if (isCycleMosaicItem(item)) {
    return (
      <CycleContext.Provider value={{ cycle: item as CycleMosaicItem }}>
        <MosaicItemCycle cycleId={item.id} detailed className="mb-2"/>
      </CycleContext.Provider>
    );
  }
  else if (isPostMosaicItem(item)) {
    let pp = parent;
    if (!pp) {
      const it: PostMosaicItem = item as PostMosaicItem;
      if (it.works && it.works.length > 0) pp = it.works[0] as WorkMosaicItem;
      else if (it.cycles && it.cycles.length > 0) pp = it.cycles[0] as CycleMosaicItem;
    }
    const cycleId = isCycleMosaicItem(pp!) ? pp.id : undefined;
    const workId = isWorkMosaicItem(pp!) ? pp.id : undefined;

    return (
      <MosaicItemPost
        showComments={showComments}
        postId={item.id}
        display={display}
        cacheKey={cacheKey}
        className="mb-2"
      />
    );
  }
  else if (isWorkMosaicItem(item)) {
    return (
      // <WorkContext.Provider value={{ linkToWork: true }}>
      <MosaicItemWork 
      linkToWork showShare={false} showButtonLabels={showButtonLabels} workId={item.id} className="mb-2"/>
      // </WorkContext.Provider>
    );
  }
  else if (isUserMosaicItem(item)) {
    return <MosaicItemUser  user={item} className="mb-2" />;
  }
  else if(isCommentMosaicItem(item)){
    const it: CommentMosaicItem = item as CommentMosaicItem;
    let pp: CycleMosaicItem|WorkMosaicItem|PostMosaicItem|undefined = undefined;
    if(it.workId)
      pp = it.work as WorkMosaicItem;
    else if(it.cycleId){

      pp = it.cycle as CycleMosaicItem;
    }
    else if(it.postId)
      pp = it.post as PostMosaicItem;

      if(pp){
        return <MosaicItemComment detailed commentId={it.id} cacheKey={cacheKey} commentParent={pp} />;
      }
  }

  return <></>;
};
interface Props {
  stack: MosaicItem[];
  showButtonLabels?: boolean;
  display?: 'h' | 'v';
  showComments?: boolean;
  cacheKey: [string,string];
  className?: string;
  parent?: CycleMosaicItem | WorkMosaicItem;
}

const Mosaic: FunctionComponent<Props> = ({
  stack,
  showButtonLabels = true,
  display = 'v',
  showComments = false,
  cacheKey,
  className,
  parent,
}) => {
  const count = +(process.env.NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT||10)
  const [page,setPage] =useState<number>(0)
  // const next = ()=>{
  //   setPage(p=>p+1)
  // }
  // const previous = ()=>{
  //   setPage(p=>p-1)
  // }
  const renderMosaic = () => {
    /* return (
      <Row>
        {stack.map((item: MosaicItem) => (
            <Col className={` ${className}`} key={`${v4()}`}>
              {renderMosaicItem(item, postsLinksTo, showButtonLabels, display, showComments, cacheKey)}
            </Col>
          ))}
      </Row>
      
    ); */
    /*return <Masonry
    breakpointCols={{
      default: display === 'v' ? 4 : 1,
      1199: display === 'v' ? 3 : 1,
      926: display === 'v' ? 2: 1,
      812: display === 'v' ? 2: 1,
      768: display === 'v' ? 2: 1,
      640: 1,
      428: 1,
    }}
    className={`d-flex ${styles.masonry}`}
    columnClassName={styles.masonryColumn}
  >
    {stack && stack.length &&
      stack.map((item: MosaicItem) => (
        <aside className={` ${className}`} key={`${v4()}`}>
          {renderMosaicItem(item, parent, showButtonLabels, display, showComments, cacheKey)}
        </aside>
      )) || ''}
  </Masonry>*/
  return <section data-cy="mosaic-items" className="container d-flex flex-wrap flex-column flex-lg-row justify-content-center justify-content-lg-start">
    {stack.slice(page*count,count*(page+1)).map((item: MosaicItem) => (
        <aside className={` ${className} p-4`} key={v4()}>
          {renderMosaicItem(item, parent, showButtonLabels, display, showComments, cacheKey)}
        </aside>
      ))}
  </section>


  }
  const renderPagesLinks = ()=>{
    const pages = stack.length / count
    const res = []
    for(let i=0;i<pages;i++)
      res.push(<Button key={v4()} className={`rounded-circle me-1 shadow ${page===i ? 'text-white bg-secondary':''}`} size="sm" onClick={()=>setPage(i)}>{i+1}</Button>)
    return <>
    {res}
    </>
  }
  return <>
    <div className="d-none d-lg-block">
        {renderMosaic()}
    </div>
    <div className="d-lg-none">
      {renderMosaic()}
     </div>
     <aside className="d-flex justify-content-center">
       {renderPagesLinks()}
     {/* <Button disabled={page==0} onClick={previous}><BiChevronLeft/></Button>
     <Button disabled={(page+1)*count == stack.length} onClick={next}><BiChevronRight/></Button> */}

     </aside>
    </>
};


export default Mosaic;