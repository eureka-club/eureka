"use client"

import { FunctionComponent } from 'react';
import SignInForm from '@/src/components/forms/SignInForm';
import { Button } from 'react-bootstrap';
import { PostMosaicItem } from '@/src/types/post';
import { useSession } from 'next-auth/react';
import usePostReactionCreateOrEdit from '@/src/hooks/mutations/usePostReactionCreateOrEdit';
import { useModalContext } from '@/src/hooks/useModal';
import { useDictContext } from '@/src/hooks/useDictContext';
import { usePathname } from 'next/navigation';
interface Props {
  post:PostMosaicItem;
  cacheKey:string[];
}
const MAX_REACTIONS = 2;
const PostReactionsDetail: FunctionComponent<Props> = ({post,cacheKey}) => {
  const{dict}=useDictContext()
  const {data:session} = useSession();
  // const { t } = useTranslation('common');
  const asPath = usePathname();
  const {mutate,isPending:isMutating} = usePostReactionCreateOrEdit({post,cacheKey});
  const { show } = useModalContext();

  const currentUserCanReact = ()=>{
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
    let reactionsGrouped = Object.values(rgo)
    .sort((a,b)=>{
      if(a.unified<b.unified)return 1;
      return -1;       
    })
    if(!asPath.match(/\/post\//)){
      reactionsGrouped = reactionsGrouped.slice(0,2);
    }

    const openSignInModal = () => {
      show(<SignInForm />);
    };

    return reactionsGrouped.map((r)=>{
      const {emoji,qty,unified}=r;
      return <Button
      key={unified}
      variant='light' 
      role="img" 
      size="sm"
      className="d-flex align-items-center justify-content-around py-0 px-1 mx-1 bg-light bg-gradient border rounded-pill" 
      style={{fontSize: "1.2em",textDecoration:'none'}} 
      aria-label="emoji-ico" 
      dangerouslySetInnerHTML={{__html: `<span class="">${emoji}</span><span>&nbsp;</span><b class="fs-6 text-primary">${qty}</b>`}}
      onClick={(e)=>{
        e.preventDefault();
        if (!session) {
          openSignInModal();
          return null;
        }
        else{
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
