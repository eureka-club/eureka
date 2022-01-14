import { FunctionComponent, useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { MdReply, MdCancel } from 'react-icons/md';
import { BiTrash, BiEdit } from 'react-icons/bi';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import {useMutation, useQueryClient, useIsFetching} from 'react-query';
import {useAtom} from 'jotai'
import { Comment } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation';
import {
  CreateCommentAboutCycleClientPayload as CCACCP,
  CreateCommentAboutWorkClientPayload as CCAWCP,
  CreateCommentAboutCommentClientPayload as CCACOCP,
  CreateCommentAboutPostClientPayload as CCAPCP,
  CommentMosaicItem,
} from '@/src/types/comment';
import globalModalsAtom from '@/src/atoms/globalModals';
import { Session } from '@/src/types';
import {useSession} from 'next-auth/client'
import { EditorEvent } from 'tinymce';

type CommentWithComments = Comment & {comments?: Comment[];}
interface Props {
  cacheKey?: string[];
  className?: string;
  comment: CommentWithComments;
  showReplyBtn?: boolean;
}

const CommentActionsBar: FunctionComponent<Props> = ({
  comment, className = '', cacheKey, showReplyBtn = true }) => {
  const { t } = useTranslation('common');
  const [session] = useSession() as [Session | null | undefined, boolean];
  const queryClient = useQueryClient();
  const isFetching = useIsFetching(cacheKey);
  
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  
  const [newCommentInput, setNewCommentInput] = useState<string>();
  const [editCommentInput, setEditCommentInput] = useState<string>();
  const [showCreateComment, setShowCreateComment] = useState<boolean>(false);
  const [showEditComment, setShowEditComment] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  const getIsLoading = () => {
    return isLoading || isEditLoading || isFetching;
  }

  const canEditComment = () => {
    if(comment){
      // if(comment.comments && comment.comments.length)
      //   return false;
      if(session?.user.id !== comment.creatorId)
        return false;
      return true;
    }
   
    return false;
  }

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
    async (payload: {commentId:number, contentText:string, status:number}) => {
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
            title: t(`common:Error`),
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
          setShowEditComment(false);
          if (context) queryClient.invalidateQueries(ck);
        }
      },
    },
  );


  const submitCreateForm = () => {
    if (comment && editorRef.current.getContent()) {
      const selectedCycleId = comment.cycleId || 0;
      const selectedPostId = comment.postId || 0;
      const selectedWorkId = comment.workId || 0;
      const selectedCommentId = comment.id;

      const payload = {
        selectedCycleId,
        selectedPostId,
        selectedCommentId,
        selectedWorkId,
        creatorId: +session!.user.id,
        contentText: editorRef.current.getContent(),
      };
      createComment(payload);
      editorRef.current.setContent('');
      setNewCommentInput(() => '');
    }
  };

  const submitEditForm = () => {
    if (comment) {

      const payload = {
        commentId: comment.id,
        contentText: editorRef.current.getContent() || '',
        status:1,
      };
      editComment(payload);
      setEditCommentInput(() => '');
    }
  };

  // const handlerCreateFormSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   submitCreateForm();
  // };

  // const handleEditFormSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   submitEditForm();
  // };

  // const onKeyPressForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     submitCreateForm();
  //     e.preventDefault();
  //   }
  // };

  // const onKeyPressEditForm = (e: KeyboardEvent) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     submitEditForm();
  //     e.preventDefault();
  //   }
  // };

  const handlerEditBtn = () => {
    
    setEditCommentInput(comment.contentText);
    setShowEditComment(true);    
    setShowCreateComment(false);
  }

  const handlerDeleteBtn = () => {
    setShowEditComment(false);    
    setShowCreateComment(false);
    
    const payload = {
      commentId: comment.id,
      contentText: '',
      status: 1,
    };
    editComment(payload);
  }

  const handlerCreateBtn = () => {
    setShowCreateComment(true);
    setShowEditComment(false); 
  }

  const handlerCancelBtn = () => {
    setShowCreateComment(false);
    setShowEditComment(false);    
  }

  const onKeyUpEditorEdit = (e: EditorEvent<KeyboardEvent>)=>{
    if (e.key === 'Enter' && !e.shiftKey) {
      debugger;
      setEditCommentInput(()=>editorRef.current.getContent())
      submitEditForm();
      e.preventDefault();
    }
  }

  const onKeyUpEditorCreate = (e: EditorEvent<KeyboardEvent>)=>{
    if (e.key === 'Enter' && !e.shiftKey) {
      submitCreateForm();
      e.preventDefault();
    }
  }


  const renderEditorWYSWYG = (
    onKeyUp:(e: EditorEvent<KeyboardEvent>) => void,
    initialValue?:string,
    )=>{
    return <>
    <EditorCmp
          apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
          onInit={(_: any, editor) => {
            editor.editorContainer.classList.add(...[
              "rounded-pill",
            ])
            editorRef.current = editor;
          }}
          onKeyUp={onKeyUp}
          
          initialValue={initialValue}
          init={{
            max_height: 70,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help',
            ],
            relative_urls: false,
            // toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link  | help',
            toolbar:false,
            branding:false,
            statusbar:false,
            content_style: `body { 
              font-family:Helvetica,Arial,sans-serif; 
              font-size:14px; 
              background:#f7f7f7;
            }`,
            
          }}
        />
    </>
  }


  const renderCommentActions = () => {
    const c = comment;
    if(session?.user.id){
      return <aside className="mb-2">
        {showReplyBtn && !c.commentId && !getIsLoading() && (
          <Button
            variant="default"
            onClick={handlerCreateBtn}
            className={`p-0 border-top-0`}
          >
            <MdReply className="fs-6 text-primary" />
            <span className="fs-6 text-primary">{t('Reply')}</span>
          </Button>
        )}
        {canEditComment() && !getIsLoading() && (
          <Button
            variant="default"
            onClick={handlerEditBtn}
            className={`p-0 border-top-0 ms-2`}
          >
            <BiEdit className="fs-6 text-warning" />
            {/* <span className="fs-6 text-warning">{t('Edit')}</span> */}
          </Button>
        )}
        {canEditComment() && !getIsLoading() && (
          <Button
            variant="default"
            onClick={handlerDeleteBtn}
            className={`p-0 border-top-0 ms-2`}
          >
            <BiTrash className="fs-6 text-warning" />
            {/* <span className="fs-6 text-warning">{t('Edit')}</span> */}
          </Button>
        )}
        {!getIsLoading() && (showCreateComment || showEditComment) && (
          <Button
            variant="default"
          onClick={handlerCancelBtn}
            className={`p-0 ms-2`}
          >
            <MdCancel className="text-secondary" />
          </Button>
        )}

        {!getIsLoading() && showCreateComment && (
        <>
          {/* <Form onSubmit={handlerCreateFormSubmit}>
            <Form.Control
              value={newCommentInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommentInput(e.target.value)}
              onKeyPress={onKeyPressForm}
              className="border fs-6 rounded-pill bg-light"
              as="textarea"
              rows={1}
              placeholder={`${t('Write a replay')}...`}
            />
          </Form> */}
          {renderEditorWYSWYG(onKeyUpEditorCreate)}
        
        </>
  
        )}
        {canEditComment() && !getIsLoading() && showEditComment && (
          <>
          {/* <Form onSubmit={handleEditFormSubmit}>
            <Form.Control
              value={editCommentInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditCommentInput(e.target.value)}
              onKeyPress={onKeyPressEditForm}
              className="border fs-6 rounded-pill bg-light"
              as="textarea"
              rows={1}
              placeholder={`${t('Edit the replay')}...`}
            />
          </Form> */}
          {renderEditorWYSWYG(onKeyUpEditorEdit, editCommentInput)}
          </>
        )}
        {getIsLoading() ? <Spinner animation="grow" variant="info" size="sm" /> : ''}
      </aside>
    }
    return '';
  }

  return <aside className={className}>
  {renderCommentActions()}</aside>
};

export default CommentActionsBar;
