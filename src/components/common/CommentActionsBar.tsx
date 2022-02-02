import { FunctionComponent, useState, useRef } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { MdReply, MdCancel } from 'react-icons/md';
import { BiTrash, BiEdit } from 'react-icons/bi';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import {useMutation, useQueryClient, useIsFetching} from 'react-query';
import {useAtom} from 'jotai'
import { Comment } from '@prisma/client'
import useTranslation from 'next-translate/useTranslation';
import {
  CreateCommentClientPayload as CCCP,
  CommentMosaicItem,
} from '@/src/types/comment';
import globalModalsAtom from '@/src/atoms/globalModals';
import { Session } from '@/src/types';
import {useSession} from 'next-auth/client'
import { EditorEvent } from 'tinymce';
import { useRouter } from 'next/router';

import { useNotificationContext } from '@/src/useNotificationProvider';

import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import { PostMosaicItem } from '@/src/types/post';
import {isCycleMosaicItem,isWorkMosaicItem, isPostMosaicItem, isCommentMosaicItem, isComment} from '@/src/types' 
import {CreateCommentClientPayload} from '@/src/types/comment'

type CommentWithComments = Comment & {comments?: Comment[];}
type EntityWithComments = CycleMosaicItem | WorkMosaicItem | PostMosaicItem | CommentMosaicItem
type ContextWithComments = CycleMosaicItem | WorkMosaicItem | PostMosaicItem | CommentMosaicItem
interface Props {
  cacheKey?: string[];
  className?: string;
  entity: EntityWithComments;
  context?: ContextWithComments; //if not provide -parent will be used, should be the mosaic used to render the page :|
  parent?: EntityWithComments;
  showReplyBtn?: boolean;
}

const CommentActionsBar: FunctionComponent<Props> = ({
  entity, parent, context, className = '', cacheKey, showReplyBtn = true }) => {
  const { t } = useTranslation('common');
  const [session] = useSession() as [Session | null | undefined, boolean];
  const queryClient = useQueryClient();
  const isFetching = useIsFetching(cacheKey);
  const router = useRouter();
  
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  
  const [newCommentInput, setNewCommentInput] = useState<string>();
  const [editCommentInput, setEditCommentInput] = useState<string>();
  const [showCreateComment, setShowCreateComment] = useState<boolean>(false);
  const [showEditComment, setShowEditComment] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  const {notifier} = useNotificationContext();

  const getIsLoading = () => {
    return isLoading || isEditLoading || isFetching;
  }

  const canEditComment = () => {
    if(!session?.user.id) return false;
    if(isComment(entity) || isCommentMosaicItem(entity)){
      const comment = (entity as Comment);
      if(comment){
        // if(comment.comments && comment.comments.length)
        //   return false;
        if(session?.user.id !== comment.creatorId)
          return false;
        return true;
      }
    }
   
    return false;
  }

  const {
    isLoading,
    // isError,
    mutate: createComment,
  } = useMutation(
    async (payload: CCCP): Promise<Comment | null> => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.ok) {
        if(notifier){
          const toUsers = payload.notificationToUsers;
          notifier.notify({
            toUsers,
            data:{message:payload.notificationMessage}
          });
        }
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
    if (entity && editorRef.current.getContent()) {
      const user = (session as Session).user;
      let notificationMessage = '';      
      let notificationToUsers = new Set<number>([]);

      let payload:Partial<CreateCommentClientPayload>={
        notificationContextURL: router.asPath,
      };

      if(isCycleMosaicItem(entity)){
        const cycle = (entity as CycleMosaicItem);
        notificationToUsers.add(cycle.creatorId);
        notificationMessage = `commentCreatedAboutCycle!|!${JSON.stringify({
          userName: user.name,
          cycleTitle: cycle.title,
        })}`;
        payload  = {...payload,selectedCycleId: cycle.id,notificationMessage};
      }
      else if(isWorkMosaicItem(entity)){
        const work = (entity as WorkMosaicItem);
        if(user.id !== work.creatorId)
          notificationToUsers.add(work.creatorId);
        payload = {...payload, selectedWorkId: work.id}
        if(parent && isCycleMosaicItem(parent)){//in cycle context
          const cycle = (parent as CycleMosaicItem);
          notificationToUsers.add(cycle.creatorId);
          notificationMessage = `commentCreatedAboutWorkInCycle!|!${JSON.stringify({
            userName: user.name,
            workTitle: work.title,
            cycleTitle: cycle.title,
          })}`;
          payload = {...payload, selectedCycleId: cycle.id,notificationMessage}
        }
        else{
          notificationMessage = `commentCreatedAboutWork!|!${JSON.stringify({
            userName: user.name,
            workTitle: work.title,
          })}`;
          payload = {...payload,notificationMessage}
        }
      }
      else if(isPostMosaicItem(entity)){
        const post = (entity as PostMosaicItem);
        payload = {...payload, selectedPostId: post.id}
        if(user.id !== post.creatorId)
          notificationToUsers.add(post.creatorId);
        if(parent && isCycleMosaicItem(parent)){//in cycle context
          const cycle = (parent as CycleMosaicItem);
          if(user.id !== cycle.creatorId)
            notificationToUsers.add(cycle.creatorId);
          notificationMessage = `commentCreatedAboutPostInCycle!|!${JSON.stringify({
            userName: user.name,
            postTitle: post.title,
            cycleTitle: cycle.title,
          })}`;
          payload = {...payload, selectedCycleId: cycle.id,notificationMessage}
        }
        else if(parent && isWorkMosaicItem(parent)){//in work context
          const work = (parent as WorkMosaicItem);
          if(user.id !== work.creatorId)
            notificationToUsers.add(work.creatorId);
          notificationMessage = `commentCreatedAboutPostInWork!|!${JSON.stringify({
            userName: user.name,
            postTitle: post.title,
            workTitle: work.title,
          })}`;
          payload = {...payload, selectedWorkId: work.id,notificationMessage}
        }
        else{
          notificationToUsers.add(post.creatorId);
          notificationMessage = `commentCreatedAboutPost!|!${JSON.stringify({
            userName: user.name,
            postTitle: post.title,
          })}`;
          payload = {...payload,notificationMessage}
        }
      }
      else if(isCommentMosaicItem(entity)){//the context here it is not need, because coment parent has unique context
        const comment = (entity as CommentMosaicItem);
        if(user.id !== comment.creatorId)
          notificationToUsers.add(comment.creatorId);
        payload = {...payload, selectedCommentId: comment.id}
        
        if(parent && isPostMosaicItem(parent)){
          const post = (parent as PostMosaicItem);
          if(user.id !== post.creatorId)
            notificationToUsers.add(post.creatorId); 
          payload = {...payload, selectedPostId: post.id};

          let cycle: CycleMosaicItem | undefined = undefined;
          if(comment.cycleId){
            cycle = queryClient.getQueryData<CycleMosaicItem>(['CYCLE',comment.cycleId.toString()]);
          }
          if(cycle){//in cycle context
            if(user.id !== cycle.creatorId)
              notificationToUsers.add(cycle.creatorId);  
            notificationMessage = `commentCreatedAboutPostInCycle!|!${JSON.stringify({
              userName: user.name,
              postTitle: post.title,
              cycleTitle: cycle.title,
            })}`;
            payload = {...payload,selectedCycleId: cycle.id,notificationMessage}
          }
          else{   
            notificationMessage = `commentCreatedAboutPost!|!${JSON.stringify({
              userName: user.name,
              postTitle: post.title,
            })}`;
            payload = {...payload,notificationMessage};
          }
        }
        else if(parent && isCycleMosaicItem(parent)){//in the cycle it self
          const cycle = (parent as CycleMosaicItem);
          if(user.id !== cycle.creatorId)
            notificationToUsers.add(cycle.creatorId);  
          notificationMessage = `commentCreatedAboutCommentInCycle!|!${JSON.stringify({
            userName: user.name,
            cycleTitle: cycle.title,
          })}`;
          payload = {...payload, selectedCycleId: cycle.id,notificationMessage}
        }
        else if(parent && isWorkMosaicItem(parent)){
          const work = (parent as WorkMosaicItem);
          if(work.creatorId !== user.id)
            notificationToUsers.add(work.creatorId);
          payload = {...payload, selectedWorkId: work.id};
          
          let cycle: CycleMosaicItem | undefined = undefined;
          if(comment.cycleId){
            cycle = queryClient.getQueryData<CycleMosaicItem>(['CYCLE',comment.cycleId.toString()]);
          }
          if(cycle){
            if(cycle.creatorId !== user.id)
              notificationToUsers.add(cycle.creatorId);  
            notificationMessage = `commentCreatedAboutWorkInCycle!|!${JSON.stringify({
              userName: user.name,
              workTitle: work.title,
              cycleTitle: cycle.title,
            })}`;
            payload = {...payload,selectedCycleId: cycle.id,notificationMessage}
          }
          else{   
            notificationMessage = `commentCreatedAboutWork!|!${JSON.stringify({
              userName: user.name,
              workTitle: work.title,
            })}`;
            payload = {...payload,notificationMessage};
          }          
        }
        else if(parent && isCommentMosaicItem(parent)){
          let cycle: CycleMosaicItem | undefined = undefined;
          if(comment.cycleId){
            cycle = queryClient.getQueryData<CycleMosaicItem>(['CYCLE',comment.cycleId.toString()]);
          }
          if(cycle){
            if(cycle.creatorId !== user.id){
              notificationToUsers.add(cycle.creatorId);
            }
            notificationMessage = `commentCreatedAboutCommentInCycle!|!${JSON.stringify({
              userName: user.name,
              commentTitle: `${comment.contentText.slice(0,50)}...`, 
              cycleTitle: cycle?.title,             
            })}`;
            payload = {...payload, selectedCycleId: comment.id,notificationMessage};
          }
          else{
            notificationMessage = `commentCreatedAboutComment!|!${JSON.stringify({
              userName: user.name,
              commentTitle: `${comment.contentText.slice(0,50)}...`,              
            })}`;
            notificationToUsers.add(comment.creatorId);
            payload = {...payload,notificationMessage}; 
          }
        }
        
      }

      
      
      payload = {...payload,
        creatorId: +session!.user.id,
        contentText: editorRef.current.getContent(),
        notificationToUsers: [...notificationToUsers],
      };
      createComment(payload as CreateCommentClientPayload);
      editorRef.current.setContent('');
      setNewCommentInput(() => '');
    }
  };

  const submitEditForm = () => {    
    if (isComment(entity)||isCommentMosaicItem(entity)) {
      const comment = (entity as Comment);
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
    if (isComment(entity) || isCommentMosaicItem(entity)) {
      const comment = (entity as Comment);
      setEditCommentInput(comment.contentText);
      setShowEditComment(true);    
      setShowCreateComment(false);
    }
  }

  const handlerDeleteBtn = () => {
    if (isComment(entity) || isCommentMosaicItem(entity)) {
      const comment = (entity as Comment);
      setShowEditComment(false);    
      setShowCreateComment(false);
      
      const payload = {
        commentId: comment.id,
        contentText: '',
        status: 1,
      };
      editComment(payload);
    }
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
            forced_root_block : "p,a",
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

  if(!session?.user.id) return <></>;
  if(isCommentMosaicItem(entity)){
    const c = (entity as CommentMosaicItem);
    return <section>
              {c && !(c.commentId) && !getIsLoading() && (
                <Button
                  variant="default"
                  onClick={handlerCreateBtn}
                  className={`p-0 border-top-0`}
                >
                  <MdReply className="fs-6 text-primary" />
                  <span className="fs-6 text-primary">{t('Reply')}</span>
                </Button>
              )}
              
              {canEditComment() && !getIsLoading() && <>
                <Button
                  variant="default"
                  onClick={handlerEditBtn}
                  className={`p-0 border-top-0 ms-2`}
                >
                  <BiEdit className="fs-6 text-warning" />
                </Button>
                <Button
                  variant="default"
                  onClick={handlerDeleteBtn}
                  className={`p-0 border-top-0 ms-2`}
                >
                  <BiTrash className="fs-6 text-warning" />
                </Button>
              </>}
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
            
          </section>;
        
  }
  if(isComment(entity)){
    const c = (entity as Comment);
    return <section>              
              {canEditComment() && !getIsLoading() && <>
                <Button
                  variant="default"
                  onClick={handlerEditBtn}
                  className={`p-0 border-top-0 ms-2`}
                >
                  <BiEdit className="fs-6 text-warning" />
                </Button>
                <Button
                  variant="default"
                  onClick={handlerDeleteBtn}
                  className={`p-0 border-top-0 ms-2`}
                >
                  <BiTrash className="fs-6 text-warning" />
                </Button>
              </>}
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
            
          </section>;
        
  }
  else return <section>{!getIsLoading() && (
      <>
        {renderEditorWYSWYG(onKeyUpEditorCreate)}    
      </>

      )}
    </section>
  
  };

export default CommentActionsBar;
