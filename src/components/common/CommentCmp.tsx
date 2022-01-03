// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useMutation, useQueryClient, useIsFetching } from 'react-query';
import { useSession } from 'next-auth/client';

import { Form, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

import { Comment } from '@prisma/client';
import CommentTextBox from './CommentTextBox'
import { MdReply, MdCancel } from 'react-icons/md';
import { BiTrash, BiEdit } from 'react-icons/bi';
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
import { useAtom } from 'jotai';
import globalModalsAtom from '../../atoms/globalModals';

// import { WEBAPP_URL } from '../../constants';

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
  // const [session, isLoadingSession] = useSession() as [Session | null | undefined, boolean];
  const [newCommentInput, setNewCommentInput] = useState<string>();
  const [editCommentInput, setEditCommentInput] = useState<string>();
  const [commentId, setCommentId] = useState<number>(comment.id);
  const [showCreateComment, setShowCreateComment] = useState<Record<string,boolean>>({
    [`${comment.id}`]:false,
  });
  const [showEditComment, setShowEditComment] = useState<Record<string,boolean>>({
    [`${comment.id}`]:false,
  });
  const [idSession, setIdSession] = useState<string>('');
  // const { data: comment, isLoading } = useComment(`${commentId}`);

  const queryClient = useQueryClient();
  const isFetching = useIsFetching(cacheKey);
  
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  
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

  const {
    isLoading:isEditLoading,
    // isError,
    mutate: editComment,
  } = useMutation(
    async (payload: {commentId:number, contentText:string}) => {
      const res = await fetch('/api/comment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json(); 
      if(!res.ok){
        setGlobalModalsState({
          ...globalModalsState,
          showToast: {
            show: true,
            type: 'warning',
            title: t(`common:${res.statusText}`),
            message: json.error,
          },
        });
        return;
      }
      if (json.comment) {
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


  const submitCreateForm = () => {
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

  const submitEditForm = () => {
    if (comment) {

      const payload = {
        commentId,
        contentText: editCommentInput || '',
      };
      editComment(payload);
      setEditCommentInput(() => '');
    }
  };

  const handlerCreateFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitCreateForm();
  };

  const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitEditForm();
  };

  const onKeyPressForm = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      submitCreateForm();
      e.preventDefault();
    }
  };

  const onKeyPressEditForm = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      submitEditForm();
      e.preventDefault();
    }
  };

  const handlerEditBtn = (commentChild?: Comment) => {
    setCommentId((commentChild || comment).id);
    
    setEditCommentInput(comment.contentText);
    if (commentChild)
      setEditCommentInput(commentChild.contentText);
    
    setShowEditComment((res) => ({[`${(commentChild||comment).id}`]: true}));    
    setShowCreateComment((res) => ({...res,[`${(comment || commentChild).id}`]: false}));
  }

  const handlerDeleteBtn = (commentChild?: Comment) => {
    debugger;
    setShowEditComment((res) => ({...res,[`${(commentChild||comment).id}`]: false}));    
    setShowCreateComment((res) => ({ ...res, [`${(comment || commentChild).id}`]: false }));
    
    const payload = {
      commentId: (commentChild || comment).id,
      contentText: '',
    };
    editComment(payload);
  }

  const handlerCreateBtn = () => {
    setShowCreateComment((res) => ({...res,[`${comment.id}`]: true}));
    setShowEditComment((res) => ({...res,[`${comment.id}`]: false})); 
  }

  const handlerCancelBtn = (commentChild?:Comment) => {
    setShowCreateComment((res) => ({...res,[`${comment.id}`]: false}));
    setShowEditComment((res) => ({...res,[`${(commentChild||comment).id}`]: false}));    
  }

  const getIsLoading = () => {
    return isLoading || isEditLoading || isFetching;
  }

  const canEditComment = (commentChild?: Comment) => {
    if(commentChild){
      if(session?.user.id !== commentChild.creatorId)
        return false;
      return true;
    }
    if(comment){
      if(session?.user.id !== comment.creatorId)
        return false;
      if(comment.comments && comment.comments.length)
        return false;
      return true;
    }
    return false;
  }

  const renderCommentActions = (commentChild?: Comment) => {
    
    if (comment.id == 139) {
      debugger;
    }
    const c = commentChild || comment;
    /* if(commentChild)
      setEditCommentInput(commentChild.contentText);
    else
      setEditCommentInput(comment.contentText); */
    if(idSession){
      return <aside className="mb-2">
        {!c.commentId && !getIsLoading() && (
          <Button
            variant="default"
            onClick={handlerCreateBtn}
            className={`p-0 border-top-0`}
          >
            <MdReply className="fs-6 text-primary" />
            <span className="fs-6 text-primary">{t('Reply')}</span>
          </Button>
        )}
        {canEditComment(commentChild) && !getIsLoading() && (
          <Button
            variant="default"
            onClick={()=>handlerEditBtn(commentChild)}
            className={`p-0 border-top-0 ms-2`}
          >
            <BiEdit className="fs-6 text-warning" />
            {/* <span className="fs-6 text-warning">{t('Edit')}</span> */}
          </Button>
        )}
        {canEditComment(commentChild) && !getIsLoading() && (
          <Button
            variant="default"
            onClick={()=>handlerDeleteBtn(commentChild)}
            className={`p-0 border-top-0 ms-2`}
          >
            <BiTrash className="fs-6 text-warning" />
            {/* <span className="fs-6 text-warning">{t('Edit')}</span> */}
          </Button>
        )}
        {!getIsLoading() && (showCreateComment[comment.id] || showEditComment[(commentChild||comment).id]) && (
          <Button
            variant="default"
            onClick={()=>handlerCancelBtn(commentChild)}
            className={`p-0 ms-2`}
          >
            <MdCancel className="text-secondary" />
          </Button>
        )}

        {!getIsLoading() && showCreateComment[comment.id] && (
          <Form onSubmit={handlerCreateFormSubmit}>
            <Form.Control
              value={newCommentInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommentInput(e.target.value)}
              onKeyPress={onKeyPressForm}
              className="border fs-6 rounded-pill bg-light"
              as="textarea"
              rows={1}
              placeholder={`${t('Write a replay')}...`}
            />
          </Form>
        )}
        {canEditComment(commentChild) && !getIsLoading() && showEditComment[(commentChild||comment).id] && (
          <Form onSubmit={handleEditFormSubmit}>
            <Form.Control
              value={editCommentInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditCommentInput(e.target.value)}
              onKeyPress={onKeyPressEditForm}
              className="border fs-6 rounded-pill bg-light"
              as="textarea"
              rows={1}
              placeholder={`${t('Edit the replay')}...`}
            />
          </Form>
        )}
      </aside>
    }
    return '';
  }

  return (
    <>
      {
        /* !isLoading &&  */ comment && (
          <Card key={comment.id} className="mt-1 bg-white border-0">
            <Row>
              <Col xs={2} md={1} className="pe-0 text-right">
                <Avatar user={comment.creator} size="xs" showName={false} />
              </Col>
              <Col xs={10} md={11} className="ps-0">
                <CommentTextBox comment={ comment} />
                {renderCommentActions()}
                {comment &&
                  comment.comments &&
                  comment.comments.map((commentChild) => (
                    <Row key={commentChild.id} className="mb-1">
                      <Col md={1} xs={2} className="pe-0">
                        <Avatar user={commentChild.creator} size="xs" showName={false} />
                      </Col>
                      <Col md={11} xs={10} className="ps-0">
                      <CommentTextBox comment={ commentChild} />    
                        {renderCommentActions(commentChild)}                    
                      </Col>
                    </Row>
                  ))}
                {getIsLoading() ? <Spinner animation="grow" variant="info" size="sm" /> : ''}
              </Col>
            </Row>
          </Card>
        )
      }
    </>
  );
};

export default CommentCmp;
