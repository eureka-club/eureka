import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import React, { useState } from 'react'
import { PostMosaicItem } from '@/src/types/post'
import { } from 'react-query'
import { VscReactions } from 'react-icons/vsc';
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
interface Props {
    post: PostMosaicItem;
    cacheKey: string[] | [string, string];
    onSaved?: (emoji: EmojiClickData) => void
}
const MAX_REACTIONS = 2;

const usePostEmojiPicker = (props: Props) => {
    const { post, cacheKey, onSaved } = props;

    const { data: session, status } = useSession();
    const user = session?.user;

    const [showEmojisPicker, setShowEmojisPicker] = useState(false)
    const { mutate, isLoading: isMutating } = usePostReactionCreateOrEdit({ post, cacheKey });

    const EmojiPicker: React.FC<Props> = () => {
        if (!isPost(post)) return <></>;

        const handleClose = () => setShowEmojisPicker(false)
        const handleSave = (emojiData: EmojiClickData, event: MouseEvent) => {
            if (user) {
                const doCreate = post.reactions.filter(r => r.userId == +user.id).length < MAX_REACTIONS;
                // event.preventDefault();
                mutate({ doCreate, unified: emojiData.unified, emoji: emojiData.emoji });
                onSaved ? onSaved(emojiData) : null;
            }
            handleClose();
        }

        const popoverEmojisPicker = (
            <Popover id="popover-basic" style={{ width: 'zpx' }} >
                <Popover.Body style={{ width: 'zpx' }} >
                    <EP
                        searchDisabled
                        onEmojiClick={handleSave}
                        width='zpx' />
                </Popover.Body>
            </Popover>
        );


        return <>
            <section className='d-none d-md-flex'><OverlayTrigger trigger="click" rootClose={true} placement="top" overlay={popoverEmojisPicker}>
                <Button
                    variant='link'
                    className={`ms-1 p-0 text-primary`}
                    title='Add reaction'
                //onClick={handleReactionClick}
                >

                    <VscReactions style={{ fontSize: "1.5em", verticalAlign: "sub" }} />
                </Button>
            </OverlayTrigger>
            </section>
            <section className='d-flex d-md-none'>
                <Button
                    variant='link'
                    className={`ms-1 p-0 text-primary`}
                    title='Add reaction'
                    onClick={() => setShowEmojisPicker(true)}>

                    <VscReactions style={{ fontSize: "1.5em", verticalAlign: "sub" }} />
                </Button>
                <SwipeableDrawer
                    anchor="bottom"
                    open={showEmojisPicker}
                    onClose={() => setShowEmojisPicker(false)}
                    onOpen={() => setShowEmojisPicker(true)}
                >

                    <EP
                        searchDisabled
                        onEmojiClick={handleSave}
                        width='zpx' />
                </SwipeableDrawer>
            </section>
        </>
        /*<Modal show={showEmojisPicker} onHide={handleClose} id={`modal-post-${post.id}`}>
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
        </Modal>*/
    }
    return { showEmojisPicker, setShowEmojisPicker, EmojiPicker }
}
export default usePostEmojiPicker