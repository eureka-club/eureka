import { FunctionComponent,useState } from 'react';
import {Button} from 'react-bootstrap';
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem } from '../types';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/Old_MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import MosaicItemUser from './user/MosaicItem';
import { CycleDetail } from '../types/cycle';
import { WorkDetail } from '../types/work';

const renderMosaicItem = (
  item: MosaicItem,
  showButtonLabels: boolean,
  display: 'h' | 'v',
  showComments: boolean,
  cacheKey: string[],  
) => {
  if (isCycleMosaicItem(item)) {
    return (
        <MosaicItemCycle cycleId={item.id} detailed className="mb-2"/>
    );
  }
  else if (isPostMosaicItem(item)) {
    // let pp = parent;
    // if (!pp) {
    //   const it: PostDetail = item as PostDetail;
    //   if (it.works && it.works.length > 0) pp = it.works[0] as WorkDetail;
    //   else if (it.cycles && it.cycles.length > 0) pp = it.cycles[0] as CycleDetail;
    // }
    // const cycleId = isCycleMosaicItem(pp!) ? pp.id : undefined;
    // const workId = isWorkMosaicItem(pp!) ? pp.id : undefined;

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
    return <MosaicItemUser  user={item} />;
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
  parent?: CycleDetail | WorkDetail;
  enabledPagination?:boolean;
}

const Mosaic: FunctionComponent<Props> = ({
  stack,
  showButtonLabels = true,
  display = 'v',
  showComments = false,
  cacheKey,
  className,
  parent,
  enabledPagination = true,
}) => {
  const count = +(process.env.NEXT_PUBLIC_MOSAIC_ITEMS_COUNT||10)
  const [page,setPage] =useState<number>(0)
  
  const renderMosaic = () => {
    if(!stack)return <></>
    
  const items = enabledPagination && stack
    ? stack.slice(page*count,count*(page+1))
    : stack;
  return <section 
  data-cy="mosaic-items" 
  className={`d-flex justify-content-center ${display=='h' ? 'flex-column' : 'flex-row'} flex-wrap justify-content-start`}>
    {items
    .map((item: MosaicItem) => (
        <aside className={`${className} p-4`} key={`${item.type||'mosaic-item'}-${item.id}`}>
          {renderMosaicItem(item, showButtonLabels, display, showComments, cacheKey)}
        </aside>
      ))}
  </section>
  }
  const renderPagesLinks = ()=>{
    if(!stack)return <></>
    const pages = stack.length / count
    const res = []
    for(let i=0;i<pages;i++)
      res.push(<Button key={`page-${i}`} className={`rounded-circle me-1 shadow ${page===i ? 'text-white bg-secondary':''}`} size="sm" onClick={()=>setPage(i)}>{i+1}</Button>)
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
       {enabledPagination && renderPagesLinks()}
     {/* <Button disabled={page==0} onClick={previous}><BiChevronLeft/></Button>
     <Button disabled={(page+1)*count == stack.length} onClick={next}><BiChevronRight/></Button> */}

     </aside>
    </>
};


export default Mosaic;