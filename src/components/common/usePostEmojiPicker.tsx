import { Modal } from 'react-bootstrap';
import React, { useState } from 'react'
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
    onSaved?: (emoji:EmojiClickData)=>void
}
const MAX_REACTIONS=2;

const usePostEmojiPicker = (props:Props)=>{
    const {post,onSaved} = props;
    
    const {data:session,status} = useSession();
    const user = session?.user;

    const [showEmojisPicker,setShowEmojisPicker] = useState(false)
    const {mutate,isLoading:isMutating} = usePostReactionCreateOrEdit({post});
    
    const EmojiPicker: React.FC<Props> = ()=>{
        if(!isPost(post))return <></>;

        const handleClose = ()=>setShowEmojisPicker(false)
        const handleSave = (emojiData: EmojiClickData, event: MouseEvent)=>{
            if(user){
                const doCreate = post.reactions.filter(r=>r.userId==+user.id).length<MAX_REACTIONS;
                // event.preventDefault();
                mutate({doCreate,unified:emojiData.unified,emoji:emojiData.emoji});
                onSaved ? onSaved(emojiData) : null;
            }
            handleClose();
        }
        return <Modal show={showEmojisPicker} onHide={handleClose} id={`modal-post-${post.id}`}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
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
            </Modal.Body>
        </Modal>
    }
    return {showEmojisPicker,setShowEmojisPicker, EmojiPicker}
}
export default usePostEmojiPicker