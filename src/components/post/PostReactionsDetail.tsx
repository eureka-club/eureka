import { PostMosaicItem } from '@/src/types/post';
import { Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { FunctionComponent, MouseEvent, SyntheticEvent, useMemo } from 'react';

import { VscReactions } from 'react-icons/vsc';

import { Toast as T } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import usePostReactionCreateOrEdit from '@/src/hooks/mutations/usePostReactionCreateOrEdit';
import usePostEmojiPicker from './hooks/usePostEmojiPicker';
import { PostReaction } from '@prisma/client';

interface Props {
  post:PostMosaicItem;
  cacheKey:[string,string];
}
const MAX_REACTIONS = 2;
const PostReactionsDetail: FunctionComponent<Props> = ({post,cacheKey}) => {
  const {data:session} = useSession();
  const { t } = useTranslation('common');
  const router = useRouter();
  // const { setShowEmojisPicker } = usePostEmojiPicker({post,cacheKey});
  const {mutate,isLoading:isMutating} = usePostReactionCreateOrEdit({post,cacheKey});

  // const handleReactionClick = (ev: MouseEvent<HTMLButtonElement>) => {
  //     ev.preventDefault();
  //     ev.stopPropagation();
  //     setShowEmojisPicker((r) => !r);
  // };
  const currentUserCanReact = ()=>{
    if(!session?.user)return false;
    const reactionsQty = post.reactions.filter(r=>r.userId==session?.user.id).length;
    return reactionsQty<MAX_REACTIONS;
  }
  const iCanRemoveReaction = (unified:string)=>{
    return post.reactions.findIndex(r=>r.userId==session?.user.id && r.unified==unified) > -1;
  }
  const RenderReactions = ()=>{
    
    const rgo:Record<string,{emoji:string,unified:string,qty:number,createdAt:Date}> = {};
    for(let i=0;i<post.reactions.length;i++){
        const {emoji,unified,createdAt} = post.reactions[i];
        if(emoji in rgo)
          rgo[emoji].qty+=1;
        else{
          rgo[emoji] = {qty:1,unified,emoji,createdAt};
        }
    }
    let reactionsGrouped = Object.values(rgo).sort((a,b)=>{
      if(a.qty<b.qty)return 1;
      else if(a.qty==b.qty && a.createdAt < b.createdAt) return 1; 
      return -1;       
    })
    if(!router.asPath.match(/\/post\//)){
      reactionsGrouped = reactionsGrouped.slice(0,2);
    }

    return reactionsGrouped.map((r)=>{
      const {emoji,qty,unified}=r;
      return <Button
      key={unified}
      variant='light' 
      role="img" 
      size="sm"
      className="py-0 px-1 mx-1 bg-light bg-gradient border rounded-pill" 
      style={{fontSize: "1.2em",textDecoration:'none'}} 
      aria-label="emoji-ico" 
      dangerouslySetInnerHTML={{__html: `${emoji} <b class="fs-6 text-primary  px-1">${qty}</b>`}}
      onClick={(e)=>{
        e.preventDefault();
        if(session?.user){
          let doCreate = post.reactions.filter(r=>r.userId==+session?.user.id).length<MAX_REACTIONS;
          doCreate = post.reactions.findIndex(r=>r.unified==unified && r.userId==session.user.id)==-1;
          mutate({doCreate,unified,emoji});
        }
      }}
      disabled={!iCanRemoveReaction(unified) && !currentUserCanReact()} 
      />
    })
  };

  
  return <div className='d-flex justify-content-between align-items-center'>
    {RenderReactions()}
  </div>
};

export default PostReactionsDetail;
