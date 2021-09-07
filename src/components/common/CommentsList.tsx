// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, /* MouseEvent, */ useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';

import { Container, InputGroup, Form /* , Row, Col, Card, Popover, Button, */, Spinner } from 'react-bootstrap';

import { Cycle, Work, Post, Comment } from '@prisma/client';
// import { MdReply, MdCancel } from 'react-icons/md';
import {
  CreateCommentAboutCycleClientPayload as CCACCP,
  CreateCommentAboutWorkClientPayload as CCAWCP,
  CreateCommentAboutCommentClientPayload as CCACOCP,
  CreateCommentAboutPostClientPayload as CCAPCP,
  CommentMosaicItem,
} from '../../types/comment';
import { isCycle, isWork, isComment, Session, isPost } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import { useUsers } from '../../useUsers';
import CommentCmp from './CommentCmp';

// import globalModalsAtom from '../../atoms/globalModals';

// import { WEBAPP_URL } from '../../constants';

import styles from './CommentsList.module.css';
import Avatar from './UserAvatar';

interface Props {
  entity: CycleMosaicItem | CommentMosaicItem | WorkMosaicItem | PostMosaicItem;
  parent?: Cycle | Work | Post | Comment;
  showCounts?: boolean;
  showShare?: boolean;
  showButtonLabels?: boolean;
  cacheKey?: string[];
  showTrash?: boolean;
  showRating?: boolean;
}

const CommentsList: FunctionComponent<Props> = ({
  entity,
  parent,
  cacheKey,
  // showShare = false,
  // showCounts = false,
  // showButtonLabels = true,
  // showTrash = false,
  // showRating = true,
}) => {
  const { t } = useTranslation('common');
  // const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const [newCommentInput, setNewCommentInput] = useState<string>();
  const [idSession, setIdSession] = useState<string>('');
  const { /* isLoading, isError, error, */ data: user } = useUsers({ id: idSession });

  const queryClient = useQueryClient();

  useEffect(() => {
    const s = session as unknown as Session;
    if (s) setIdSession(s.user.id.toString());
  }, [session]);

  const {
    isLoading,
    // isError,
    mutate: createComment,
  } = useMutation(
    async (payload: CCACCP | CCAWCP | CCACOCP | CCAPCP): Promise<Comment | null> => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.ok) {
        return json.comment;
      }

      return null;
    },
    {
      onMutate: async () => {
        if (cacheKey) {
          const snapshot = queryClient.getQueryData(cacheKey);
          return { cacheKey, snapshot };
        }
        return { cacheKey: undefined, snapshot: null };
      },
      onSettled: (_comment, error, _variables, context) => {
        if (context) {
          const { cacheKey: ck, snapshot } = context;
          if (error && ck) {
            queryClient.setQueryData(ck, snapshot);
          }
          if (context) queryClient.invalidateQueries(ck);
        }
      },
    },
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let selectedCycleId = 0;
    let selectedPostId = 0;
    let selectedCommentId = 0;
    let selectedWorkId = 0;

    if (isCycle(entity)) selectedCycleId = entity.id;
    else if (isPost(entity)) {
      selectedPostId = entity.id;
      if (parent && isCycle(parent)) selectedCycleId = parent.id;
      if (parent && isWork(parent)) selectedWorkId = parent.id;
    } else if (isComment(entity)) {
      selectedCommentId = entity.id;
      if (parent && isCycle(parent)) selectedCycleId = parent.id;
      if (parent && isWork(parent)) selectedWorkId = parent.id;
    } else if (isWork(entity)) {
      selectedWorkId = entity.id;
      if (parent && isCycle(parent)) selectedCycleId = parent.id;
    }

    const payload = {
      selectedCycleId,
      selectedPostId,
      selectedCommentId,
      selectedWorkId,
      creatorId: +idSession,
      contentText: newCommentInput || '',
    };
    setNewCommentInput(() => '');
    createComment(payload);
  };

  const entityOwnsComment = () => {
    if (isCycle(entity)) {
      return entity.comments.filter((c) => !c.workId && !c.postId && !c.commentId);
    }
    if (isWork(entity)) {
      return entity.comments.filter((c) => c.workId && !c.postId && !c.commentId);
    }
    if (isPost(entity)) {
      return entity.comments.filter((c) => c.postId && !c.commentId);
    }

    return entity.comments.filter((c) => c.commentId);
  };

  const renderComment = () => {
    return entityOwnsComment()
      .sort((p, c) => (p.id > c.id && -1) || 1)
      .map((c) => {
        return <CommentCmp key={c.id} comment={c as CommentMosaicItem} cacheKey={cacheKey} />;
      });
  };

  return (
    <Container className={styles.container}>
      {user && (
        <Form onSubmit={handleFormSubmit}>
          <InputGroup className="mt-2">
            <Avatar user={user} size="sm" showName={false} />
            <Form.Control
              value={newCommentInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommentInput(e.target.value)}
              className={styles.newCommentInput}
              type="text"
              placeholder={`${t('Write a replay')}...`}
            />
          </InputGroup>
        </Form>
      )}
      <div className="ml-5">{renderComment()}</div>
      {isLoading && <Spinner animation="grow" variant="secondary" size="sm" />}
    </Container>
  );
};

export default CommentsList;
