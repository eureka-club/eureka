import React,{useEffect,useRef,useState} from 'react'
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem, isCommentMosaicItem, isPost } from '@/src/types';
import { FixedSizeList as List } from 'react-window';
import MosaicItemCycle from './cycle/MosaicItem';
import MosaicItemPost from './post/MosaicItem';
import MosaicItemWork from './work/MosaicItem';
import MosaicItemUser from './user/MosaicItem';
import MosaicItemComment from './comment/MosaicItem';

import { v4 } from 'uuid';
import { CycleMosaicItem } from '../types/cycle';
import { WorkMosaicItem } from '../types/work';
import { PostMosaicItem } from '../types/post';
import { CycleContext } from '../useCycleContext';
import { CommentMosaicItem } from '../types/comment';
import res from '../lib/getApiHandler';

interface Props{
    items:MosaicItem[];
    cacheKey: string[];
    parent?: CycleMosaicItem | WorkMosaicItem;
    itemSize?:number
    width?:string
}
const ListWindow:React.FC<Props> = ({items:it,parent,cacheKey,itemSize=400,width="100%"})=>{
    const [mosaics,setMosaics] = useState<JSX.Element[]>([])
    const [innerHeight,setinnerHeight]=useState<number>(300)


    useEffect(()=>{
      setinnerHeight(globalThis.window.innerHeight)
    },[])

      const items = React.useMemo<JSX.Element[]>(()=>{
        const res:JSX.Element[] = []
        if(it){
            let aux = [...it]
            while(aux.length){
              const a = aux.splice(0,4)
              const rows = []
              for(let item of a){
                  if (isCycleMosaicItem(item)) {
                    rows.push(
                    // <CycleContext.Provider value={{ cycle: item as CycleMosaicItem }}>
                        <MosaicItemCycle key={`${v4()}`} cycleId={item.id} detailed className="me-3 my-6"/>
                      // </CycleContext.Provider>
                      )
                  }
                  else if (isPostMosaicItem(item)) {
                    // let pp = parent;
                    // if (!pp) {
                    //   const it: PostMosaicItem = item as PostMosaicItem;
                    //   if (it.works && it.works.length) pp = it.works[0] as WorkMosaicItem;
                    //   else if (it.cycles && it.cycles.length > 0) pp = it.cycles[0] as CycleMosaicItem;
                    // }
                    // const cycleId = isCycleMosaicItem(pp!) ? pp.id : undefined;
                    // const workId = isWorkMosaicItem(pp!) ? pp.id : undefined;
                
                    rows.push(<MosaicItemPost
                        key={`${v4()}`}
                        showComments={true}
                        postId={item.id}
                        display={'v'}
                        cacheKey={cacheKey}
                        className="me-3 my-6"
                      />)
                    
                  }
                  else if (isWorkMosaicItem(item)) {
                    
                      // <WorkContext.Provider value={{ linkToWork: true }}>
                      rows.push(<MosaicItemWork 
                        linkToWork showShare={false} showButtonLabels={true} key={`${v4()}`} workId={item.id} className="me-3 my-6"/>)
                      // </WorkContext.Provider>
                    
                  }
                  else if (isUserMosaicItem(item)) {
                    rows.push(<MosaicItemUser key={`${v4()}`} user={item} className="me-3 my-6" />);
                  }
                  else if(isCommentMosaicItem(item)){
                    const it: CommentMosaicItem = item as CommentMosaicItem;
                    rows.push(<MosaicItemComment detailed commentId={it.id} cacheKey={cacheKey} />);                      
                  }
                }
                res.push(
                  <section className="d-flex flex-column flex-md-row justify-content-center">{rows.map(
                    r=><section className="my-2" key={v4()}>{r}</section>
                    )}</section>
                )
            }            
        }
        return res;
      },[it,cacheKey])


    const renderItem = (props:{ index:number, style:Record<string,any> }) => {
      const {index,style} = props;
      return  <section className="" style={style}>
        <aside className={`p-4 mb-3`} key={`${v4()}`}>
              {items[index]}
        </aside>
      </section>
    };


      
        return <List
          height={globalThis.window.innerHeight}
          itemCount={mosaics.length}
          itemSize={itemSize+16}//+16 because->post mosaic: my-6(12px) and row section: my-2(4px)
          //layout="vertical"
          width={width}
        >
          {renderItem}
        </List>

}
export default ListWindow;