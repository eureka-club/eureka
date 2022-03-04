import React,{useEffect,useRef,useState} from 'react'
import { MosaicItem, isCycleMosaicItem, isWorkMosaicItem, isPostMosaicItem, isUserMosaicItem, isCommentMosaicItem, isPost } from '@/src/types';
import { VariableSizeList as List } from 'react-window';
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
import res from 'pages/api/auth/[...nextauth]';


interface Props{
    items:MosaicItem[];
    cacheKey: string[];
    parent?: CycleMosaicItem | WorkMosaicItem;
}
const ListWindow:React.FC<Props> = ({items,parent,cacheKey})=>{
    const [mosaics,setMosaics] = useState<JSX.Element[]>([])
    const arr = [1, 2, 3];
    const refItem = useRef(new Array())
      useEffect(()=>{
          if(items){
            const res = []
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
                      display={'v'}
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
       return  <section className="container d-flex flex-wrap flex-column flex-lg-row justify-content-center justify-content-lg-start" style={style}>
        <aside className={`p-4`} key={`${v4()}`} ref={el=> {refItem.current.push(el)}}>
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
          itemSize={getSize}
          layout="vertical"
          width={300}
        >
          {renderItem}
        </List>

}
export default ListWindow;