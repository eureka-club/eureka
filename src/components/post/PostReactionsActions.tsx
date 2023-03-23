import { PostMosaicItem } from '@/src/types/post';
import { Button } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { FunctionComponent, MouseEvent, SyntheticEvent } from 'react';
import usePostEmojiPicker from './hooks/usePostEmojiPicker';
import { VscReactions } from 'react-icons/vsc';
import toast from 'react-hot-toast'

import { Toast as T } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import usePostReactionCreateOrEdit from '@/src/hooks/mutations/usePostReactionCreateOrEdit';

interface Props {
  post: PostMosaicItem;
  cacheKey: string[] | [string, string];
}
const MAX_REACTIONS = 2;
const PostReactionsActions: FunctionComponent<Props> = ({ post, cacheKey }) => {
  const { data: session } = useSession();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { EmojiPicker, setShowEmojisPicker } = usePostEmojiPicker({ post, cacheKey });
  const { mutate, isLoading: isMutating } = usePostReactionCreateOrEdit({ post, cacheKey });


  const handleReactionClick = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (currentUserReachedMaxReactions()) {
      toast.error(t("max_reactions_reached"));
    }
    else {
      setShowEmojisPicker((r) => !r);
    }
  };
  const getReactionsGrouped = () => {
    const rgo: Record<string, { emoji: string, unified: string, qty: number }> = {};
    for (let i = 0; i < post.reactions.length; i++) {
      const { emoji, unified } = post.reactions[i];
      if (emoji in rgo)
        rgo[emoji].qty += 1;
      else {
        const { emoji, unified } = post.reactions[i];
        rgo[emoji] = { qty: 1, unified, emoji };
      }
    }
    return Object.values(rgo);
  }
  const currentUserReachedMaxReactions = () => {
    const reactionsQty = post.reactions.filter(r => r.userId == session?.user.id).length;
    return reactionsQty >= MAX_REACTIONS;
  }
  const isPostDetailPage = () => {
    return router.asPath.match(/\/post\//);
  }
  const RenderReactionAction = () => {
    if (post && session?.user && (isPostDetailPage() || getReactionsGrouped().length < MAX_REACTIONS))
      return (
        <div>
          {/* <div style={{ position: 'relative' }}> */}
          <EmojiPicker cacheKey={cacheKey} post={post as PostMosaicItem} onSaved={console.log} />
          {/* </div> */}
          <Button
            variant='link'
            className={`ms-1 p-0 text-primary`}
            title={t('Add reaction')}
            onClick={handleReactionClick}

          // disabled={loadingSocialInteraction}
          >

            <VscReactions style={{ fontSize: "1.5em", verticalAlign: "sub" }} />
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
    {RenderReactionAction()}
  </div>
};

export default PostReactionsActions;
