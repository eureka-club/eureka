import { Modal } from 'react-bootstrap';
import React, { useState } from 'react'
import { CycleMosaicItem } from '@/src/types/cycle'
import { PostMosaicItem } from '@/src/types/post'
import { WorkMosaicItem } from '@/src/types/work'
// import {default as EP, EmojiClickData} from 'emoji-picker-react'
import dynamic from 'next/dynamic';
import { EmojiClickData } from 'emoji-picker-react';
const EP = dynamic(
  () => {
    return import('emoji-picker-react');
  },
  { ssr: false }
);

const useEmojiPicker = ()=>{
    interface Props{
        entity: CycleMosaicItem|WorkMosaicItem|PostMosaicItem;
        onSaved: (emoji:EmojiClickData)=>void
    }
    const [showEmojisPicker,setShowEmojisPicker] = useState(false)
    
    const EmojiPicker: React.FC<Props> = ({entity,onSaved})=>{
        const handleClose = ()=>setShowEmojisPicker(false)
        const handleSave = (emojiData: EmojiClickData, event: MouseEvent)=>{
            event.preventDefault()
            onSaved(emojiData)
            handleClose()
        }
        return <Modal show={showEmojisPicker} onHide={handleClose} id={`modal-${entity.type}-${entity.id}`}>
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
export default useEmojiPicker