import { Modal,Button, Overlay,Popover,OverlayTrigger } from 'react-bootstrap';
import { VscReactions } from 'react-icons/vsc';
import useTranslation from 'next-translate/useTranslation';

import React, { useState,useRef,MouseEvent,memo } from 'react'
import { PostMosaicItem } from '@/src/types/post'
import {} from 'react-query'
// import {default as EP, EmojiClickData} from 'emoji-picker-react'
import dynamic from 'next/dynamic';
import { EmojiClickData } from 'emoji-picker-react';
import usePostReactionCreateOrEdit from '@/src/hooks/mutations/usePostReactionCreateOrEdit';
import { useSession } from 'next-auth/react';
import { isPost } from '@/src/types';

const EP = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);
interface Props{
    post: PostMosaicItem;
    cacheKey:string[]|[string,string];
    onSaved?: (emoji:EmojiClickData)=>void
}
const MAX_REACTIONS=2;

const usePostEmojiPicker = (props:Props)=>{
    const {post,cacheKey,onSaved} = props;
  const { t } = useTranslation('common');
  const {data:session,status} = useSession();
  const user = session?.user;
  
  const [showEmojisPicker,setShowEmojisPicker] = useState(false)
  const {mutate,isLoading:isMutating} = usePostReactionCreateOrEdit({post,cacheKey});
  
  const handleReactionClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    setShowEmojisPicker((r) => !r);
  };
  
  
  
  
  const EmojiPicker: React.FC<Props> = ()=>{
    const ref = useRef<HTMLDivElement|null>(null);
    if(!isPost(post))return <></>;

        const handleClose = ()=>setShowEmojisPicker(false)
        const handleSave = (emojiData: EmojiClickData, event: any)=>{
            if(user){
                const doCreate = post.reactions.filter(r=>r.userId==+user.id).length<MAX_REACTIONS;
                // event.preventDefault();
                mutate({doCreate,unified:emojiData.unified,emoji:emojiData.emoji});
                onSaved ? onSaved(emojiData) : null;
            }
            handleClose();
        }
        const popover = (
          <Popover id="popover-basic">
            {/* <Popover.Header as="h3">Popover right</Popover.Header> */}
            <Popover.Body>
            <EP 
                        searchDisabled
                        // categories={[
                        //   {
                        //     name: "Smiles & Emotions",
                        //     category: Categories.SMILEYS_PEOPLE
                        //   },
                        // ]} 
                        onEmojiClick={handleSave}
                     width='auto' />
            </Popover.Body>
          </Popover>
        );

        return <div ref={ref}>
<style jsx global>{`
  .popover-body{
    width:25vw;
    
  }
`}</style>
  <OverlayTrigger container={ref}
 rootClose trigger="click" placement="top" overlay={popover}>
        <Button
      variant='link'
      className={`ms-1 p-0 text-primary`}
      title={t('Add reaction')}
      // onClick={handleReactionClick}
      // disabled={loadingSocialInteraction}
    >
      
      <VscReactions   style={{fontSize: "1.5em",verticalAlign:"sub"}}  />
        {/* <br />
         <span className={classnames(...[styles.info, ...[currentUserIsFav ? styles.active : '']])}> 
          {t('Add reaction')}
        </span> */}
      </Button>
    </OverlayTrigger>
                 {/* </Modal.Body>
             </Modal> */}
        </div>    
    };
    return {showEmojisPicker,setShowEmojisPicker, EmojiPicker}
}
export default usePostEmojiPicker