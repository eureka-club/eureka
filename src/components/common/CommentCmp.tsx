// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';

import { Form, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

import { Comment } from '@prisma/client';
import { MdReply, MdCancel } from 'react-icons/md';
// import { useComment } from '../../useComment';
import {
  CreateCommentAboutCycleClientPayload as CCACCP,
  CreateCommentAboutWorkClientPayload as CCAWCP,
  CreateCommentAboutCommentClientPayload as CCACOCP,
  CreateCommentAboutPostClientPayload as CCAPCP,
  CommentMosaicItem,
} from '../../types/comment';
import { Session } from '../../types';
// import { CycleMosaicItem } from '../../types/cycle';
// import { PostMosaicItem } from '../../types/post';
// import { WorkMosaicItem } from '../../types/work';
// import { useUsers } from '../../useUsers';
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
              <Col xs={2} md={1} className="pr-0">
                <Avatar user={comment.creator} size="xs" showName={false} />
              </Col>
              <Col xs={10} md={11} className="pl-0">
                <div
                  className="p-1 bg-light border rounded"
                  dangerouslySetInnerHTML={{ __html: comment.contentText }}
                />
                {idSession && (
                  <aside className="mb-2">
                    {!comment.commentId && !isLoading && (
                      <Button
                        variant="default"
                        onClick={() => setShowComment(() => true)}
                        className={`p-0 border-top-0 ${styles.replyButton}`}
                      >
                        <MdReply className="fs-6 text-info" />
                        <span className="fs-6 text-info">{t('Reply')}</span>
                      </Button>
                    )}
                    {!isLoading && showComment && (
                      <Button
                        variant="default"
                        onClick={() => setShowComment(() => false)}
                        className={`p-0 ${styles.replyButton}`}
                      >
                        <MdCancel className="text-secondary" />
                      </Button>
                    )}

                    {!isLoading && showComment && (
                      <Form onSubmit={handleFormSubmit}>
                        <Form.Control
                          value={newCommentInput}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommentInput(e.target.value)}
                          className="border fs-6 rounded-pill bg-light"
                          type="text"
                          placeholder={`${t('Write a replay')}...`}
                        />
                      </Form>
                    )}
                  </aside>
                )}
                {comment &&
                  comment.comments &&
                  comment.comments.map((c) => (
                    <Row key={c.id} className="mb-1">
                      <Col md={1} className="pr-0">
                        <Avatar user={c.creator} size="xs" showName={false} />
                      </Col>
                      <Col md={11} className="pl-0">
                        <div
                          className="p-1 bg-light border rounded"
                          dangerouslySetInnerHTML={{ __html: c.contentText }}
                        />
                        {/* <div className={styles.dangerouslySetInnerHTML}>{c.contentText}</div> */}
                      </Col>
                    </Row>
                  ))}
                {isLoading && <Spinner animation="grow" variant="secondary" size="sm" />}
              </Col>
            </Row>
          </Card>
        )
      }
    </>
  );
};

export default CommentCmp;
