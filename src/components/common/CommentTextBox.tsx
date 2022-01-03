import { FunctionComponent } from 'react';
import { Comment } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation';
import {CommentMosaicItem,} from '@/types/comment';

interface Props {
  className?: string;
  comment: Comment & {comments: Comment[];}
}

const CommentTextBox: FunctionComponent<Props> = ({ comment, className = '' }) => {
  const { t } = useTranslation('common');
  return <aside className={className}>
    <div
                  className="p-1 bg-light border rounded d-inline-block"
                  dangerouslySetInnerHTML={{ __html: comment.contentText }}
    />{(comment.comments && comment.comments.length) && comment.status ? <span className="ms-2 fs-6 text-muted">({t('edited')})</span>:''}
  </aside>
};

export default CommentTextBox;
