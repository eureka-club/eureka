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

interface Props{
    items:MosaicItem[];
    cacheKey: string[];
    parent?: CycleMosaicItem | WorkMosaicItem;
}
const ListWindow:React.FC<Props> = ({items,parent,cacheKey})=>{
    const [mosaics,setMosaics] = useState<JSX.Element[]>([])

      useEffect(()=>{
          if(items){
            for(let item of items){
                let mosaic = <></>
                if (isCycleMosaicItem(item)) {
                  mosaics.push(<CycleContext.Provider value={{ cycle: item as CycleMosaicItem }}>
                      <MosaicItemCycle key={`${v4()}`} cycleId={item.id} detailed className="mb-2"/>
                    </CycleContext.Provider>)
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
              
                  mosaics.push(<MosaicItemPost
                      key={`${v4()}`}
                      showComments={true}
                      postId={item.id}
                      display={'h'}
                      cacheKey={cacheKey}
                      className="mb-2"
                    />)
                  
                }
                else if (isWorkMosaicItem(item)) {
                  
                    // <WorkContext.Provider value={{ linkToWork: true }}>
                    mosaic = <MosaicItemWork 
                    linkToWork showShare={false} showButtonLabels={true} key={`${v4()}`} workId={item.id} className="mb-2"/>
                    // </WorkContext.Provider>
                  
                }
                else if (isUserMosaicItem(item)) {
                  mosaics.push(<MosaicItemUser key={`${v4()}`} user={item} className="mb-2" />);
                }
                else if(isCommentMosaicItem(item)){
                  const it: CommentMosaicItem = item as CommentMosaicItem;
                  mosaics.push(<MosaicItemComment detailed commentId={it.id} cacheKey={cacheKey} />);
                    
                }
                
  
            }
            setMosaics(()=>[...mosaics]);
          }
      },[items])

    const renderItem = (props:{ index:number, style:Record<string,any> }) => {
        console.log(items)
        const {index,style} = props;
       return  <section
        className="container " style={style}
        >
        <aside className={`p-4`} key={`${v4()}`}>
             {mosaics[index]}
        </aside>
     </section>
      };
      const getSize = (index:number) => {
          if(isPostMosaicItem(items[index]))
            return 355;
          else return 200  
      };
      
        return <List
          className="d-flex flex-column"
          height={globalThis.window.innerHeight}
          itemCount={items.length}
          itemSize={344}
          layout="vertical"
          width={"100%"}
        >
          {renderItem}
        </List>

}
export default ListWindow;