import { PostMosaicItem } from '@/src/types/post';
import { Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { FunctionComponent, MouseEvent, SyntheticEvent } from 'react';
import usePostEmojiPicker from './usePostEmojiPicker';
import { VscReactions } from 'react-icons/vsc';

import { Toast as T } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import usePostReactionCreateOrEdit from '@/src/hooks/mutations/usePostReactionCreateOrEdit';

interface Props {
  post:PostMosaicItem;
}

const PostReactionsDetail: FunctionComponent<Props> = ({post}) => {
  const {data:session} = useSession();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { EmojiPicker, setShowEmojisPicker } = usePostEmojiPicker({post});
  const {mutate,isLoading:isMutating} = usePostReactionCreateOrEdit({post});


  const handleReactionClick = (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      ev.stopPropagation();
      setShowEmojisPicker((r) => !r);
  };
  const RenderReactions = ()=>{
    
    const reactionsGrouped:Record<string,{unified:string,qty:number}> = {};
    for(let i=0;i<post.reactions.length;i++){
        const {emoji,unified} = post.reactions[i];
        if(emoji in reactionsGrouped)
          reactionsGrouped[emoji].qty+=1;
        else{
          reactionsGrouped[emoji] = {qty:1,unified};
        }
    }

    return Object.entries(reactionsGrouped).map(([emoji,{qty,unified}])=>{
      return <Button
      key={unified}
      variant='light' 
      role="img" 
      size="sm"
      className="p-0 mx-1 bg-red" 
      style={{fontSize: "1.2em",textDecoration:'none'}} 
      aria-label="emoji-ico" 
      dangerouslySetInnerHTML={{__html: `${emoji} <b class="fs-6 color-danger">${qty}</b>`}}
      onClick={(e)=>{
        e.preventDefault();
        if(session?.user){
          let doCreate = post.reactions.filter(r=>r.userId==+session?.user.id).length<+process.env.NEXT_PUBLIC_MAX_REACTIONS!;
          doCreate = post.reactions.findIndex(r=>r.unified==unified && r.userId==session.user.id)==-1;
          mutate({doCreate,unified,emoji});
        }
      }}
      disabled={!session?.user} 
      />
    })
  }
  const currentUserCanReact = ()=>{
    const reactionsQty = post.reactions.filter(r=>r.userId==session?.user.id).length;
    return reactionsQty<+process.env.NEXT_PUBLIC_MAX_REACTIONS!;
  }
  const RenderReactionAction = ()=>{
    if(post && session?.user && currentUserCanReact())
     return (
      <div>
      {/* <div style={{ position: 'relative' }}> */}
        <EmojiPicker post={post as PostMosaicItem} onSaved={console.log} />
      {/* </div> */}
      <Button
      variant='link'
      className={`ms-1 p-0 text-primary`}
      title={t('Add reaction')}
      onClick={handleReactionClick}
      
      // disabled={loadingSocialInteraction}
    >
      
      <VscReactions   style={{fontSize: "1.5em",verticalAlign:"sub"}}  />
        {/* <br />
         <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}> 
          {t('Add reaction')}
        </span> */}
      </Button>
      </div>
    )
    return <></>;
  }
  return <div className='d-flex justify-content-between align-items-center'>
    {RenderReactions()}
    {RenderReactionAction()} 
  </div>
};

export default PostReactionsDetail;
