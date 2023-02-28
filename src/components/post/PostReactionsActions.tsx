import { PostMosaicItem } from '@/src/types/post';
import { Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { FunctionComponent, MouseEvent, SyntheticEvent } from 'react';
import usePostEmojiPicker from './hooks/usePostEmojiPicker';
import { VscReactions } from 'react-icons/vsc';

import { Toast as T } from 'react-bootstrap';
import { useRouter } from 'next/router';

interface Props {
  post:PostMosaicItem;
  cacheKey:string[]|[string,string];
}
const MAX_REACTIONS = 2;
const PostReactionsActions: FunctionComponent<Props> = ({post,cacheKey}) => {
  const {data:session} = useSession();
  const router = useRouter();
  const { EmojiPicker, setShowEmojisPicker } = usePostEmojiPicker({post,cacheKey});

  
  const getReactionsGrouped = ()=>{
    const rgo:Record<string,{emoji:string,unified:string,qty:number}> = {};
    for(let i=0;i<post.reactions.length;i++){
        const {emoji,unified} = post.reactions[i];
        if(emoji in rgo)
          rgo[emoji].qty+=1;
        else{
        const {emoji,unified} = post.reactions[i];
          rgo[emoji] = {qty:1,unified,emoji};
        }
    }
    return Object.values(rgo);
  }

  const currentUserCanReact = ()=>{
    const reactionsQty = post.reactions.filter(r=>r.userId==session?.user.id).length;
    const isPostDetailPage = router.asPath.match(/\/post\//);
    const q1 = reactionsQty<MAX_REACTIONS;
    const q2 = !isPostDetailPage && getReactionsGrouped().length < 2;
    if(isPostDetailPage)return q1;
    return q1 && q2;
  }
  const RenderReactionAction = ()=>{
    if(post && session?.user && currentUserCanReact())
     return (
      <div>
      {/* <div style={{ position: 'relative' }}> */}
        <EmojiPicker cacheKey={cacheKey} post={post as PostMosaicItem} onSaved={console.log} />
      {/* </div> */}
      
      </div>
    )
    return <></>;
  }
  return <div className='d-flex justify-content-between align-items-center'>
    {RenderReactionAction()} 
  </div>
};

export default PostReactionsActions;
