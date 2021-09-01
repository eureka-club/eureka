import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, MouseEvent, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';

import { Container, InputGroup, Form, Row, Col, Card, Popover, Button, Spinner } from 'react-bootstrap';

import { Cycle, User, Work, Post, Comment } from '@prisma/client';
import { MdReply, MdCancel } from 'react-icons/md';
import { useComment } from '../../useComment';
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
// import globalModalsAtom from '../../atoms/globalModals';

// import { WEBAPP_URL } from '../../constants';

import styles from './CommentsList.module.css';
import Avatar from './UserAvatar';

interface Props {
  comment: CommentMosaicItem;

  showCounts?: boolean;
  showShare?: boolean;
  showButtonLabels?: boolean;
  cacheKey?: string[];
  showTrash?: boolean;
  showRating?: boolean;
}

const CommentCmp: FunctionComponent<Props> = ({ comment, cacheKey }) => {
  const { t } = useTranslation('common');
  // const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const [newCommentInput, setNewCommentInput] = useState<string>();
  const [showComment, setShowComment] = useState<boolean>();
  const [idSession, setIdSession] = useState<string>('');
  // const { data: comment, isLoading } = useComment(`${commentId}`);

  const queryClient = useQueryClient();

  useEffect(() => {
    const s = session as unknown as Session;
    if (s) setIdSession(s.user.id.toString());
  }, [session]);

  const {
    // isLoading,
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
    if (comment) {
      const selectedCycleId = comment.cycleId || 0;
      const selectedPostId = comment.postId || 0;
      const selectedWorkId = comment.workId || 0;
      const selectedCommentId = comment.id;

      const payload = {
        selectedCycleId,
        selectedPostId,
        selectedCommentId,
        selectedWorkId,
        creatorId: +idSession,
        contentText: newCommentInput || '',
      };
      createComment(payload);
      setNewCommentInput(() => '');
    }
  };

  return (
    <>
      {
        /* !isLoading &&  */ comment && (
          <Card key={comment.id} className={`mt-3 ${styles.container}`}>
            <Row>
              <Col xs={2} md={1} className="pr-1">
                <Avatar userId={comment.creatorId} size="xs" showName={false} />
              </Col>
              <Col xs={10} md={11} className="pl-1">
                <div
                  className={styles.dangerouslySetInnerHTML}
                  dangerouslySetInnerHTML={{ __html: comment.contentText }}
                />
                <Button variant="default" onClick={() => setShowComment(() => true)} className={styles.replyButton}>
                  <MdReply />
                </Button>
                {showComment && (
                  <Button variant="default" onClick={() => setShowComment(() => false)} className={styles.replyButton}>
                    <MdCancel />
                  </Button>
                )}

                {showComment && (
                  <Form onSubmit={handleFormSubmit}>
                    <Form.Control
                      value={newCommentInput}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommentInput(e.target.value)}
                      className={styles.newCommentInput}
                      type="text"
                      placeholder={`${t('Write a replay')}...`}
                    />
                  </Form>
                )}
                {comment &&
                  comment.comments.map((c) => (
                    <div key={c.id} className="pl-3">
                      {c.contentText}
                    </div>
                  ))}
              </Col>
            </Row>
          </Card>
        )
      }
    </>
  );
};

export default CommentCmp;
