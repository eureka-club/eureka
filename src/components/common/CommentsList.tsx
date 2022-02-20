import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent, /* MouseEvent, */ useRef,useEffect, useState, ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/client';
import { EditorEvent } from 'tinymce';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { InputGroup, Form, Button /* , Row, Col, Card, Popover, */, Spinner } from 'react-bootstrap';
import { v4 } from 'uuid';
import { Cycle, Work, Post, Comment } from '@prisma/client';
// import { MdReply, MdCancel } from 'react-icons/md';
import {
  CreateCommentClientPayload as CCCP,
  CommentMosaicItem,
} from '../../types/comment';
import { isCycle, isWork, isComment, Session, isPost } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { PostMosaicItem } from '../../types/post';
import { WorkMosaicItem } from '../../types/work';
import useUser from '@/src/useUser';
import CommentCmp from './CommentCmp';
import CommentActionsBar from './CommentActionsBar';
// import globalModalsAtom from '../../atoms/globalModals';

// import { WEBAPP_URL } from '../../constants';

// import styles from './CommentsList.module.css';

interface Props {
  entity: CycleMosaicItem | CommentMosaicItem | WorkMosaicItem | PostMosaicItem;
  parent: CycleMosaicItem | CommentMosaicItem | WorkMosaicItem | PostMosaicItem | undefined;
  showCounts?: boolean;
  showShare?: boolean;
  showButtonLabels?: boolean;
  cacheKey: [string,string];
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
  const router = useRouter();
  const [session] = useSession() as [Session | null | undefined, boolean];
  const [newCommentInput, setNewCommentInput] = useState<string>();
  const [idSession, setIdSession] = useState<string>('');
  const commentsPerPage = 2;
  const [commentsShowCount, setCommentsShowCount] = useState<number>(commentsPerPage);
  const [filterdComments, setFilterdComments] = useState<Comment[]>();
  const { /* isLoading, isError, error, */ data: user } = useUser(+idSession,{enabled:!!+idSession});
  // const editorRef = useRef<any>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const s = session as unknown as Session;
    if (s) setIdSession(s.user.id.toString());
  }, [session]);


  useEffect(() => {
    if (entity) {
      if (isCycle(entity)) {
        setFilterdComments(() => entity.comments.filter((c) => !c.workId && !c.postId && !c.commentId));
      } else if (isWork(entity)) {
        setFilterdComments(() => entity.comments.filter((c) => c.workId && !c.postId && !c.commentId));
      } else if (isPost(entity)) {
        setFilterdComments(() => entity.comments.filter((c) => c.postId && !c.commentId));
      } else {
        setFilterdComments(() => entity.comments.filter((c) => c.commentId));
      }
    }
  }, [entity]);

  const renderComment = () => {
    if (filterdComments)
      return filterdComments
        .sort((p, c) => (p.id > c.id && -1) || 1)
        .slice(0, commentsShowCount)
        .map((c) => {
          return <CommentCmp key={v4()} comment={c as CommentMosaicItem} parent={entity} cacheKey={cacheKey} />;
        });
    return <></>;
  };

  const viewMoreComments = () => {
    if (filterdComments && filterdComments.length) {
      const diff = filterdComments.length - commentsShowCount;
      if (diff > commentsPerPage) setCommentsShowCount((res) => res + commentsPerPage);
      else setCommentsShowCount(() => filterdComments.length);
    }
  };

  const viewLessComments = () => {
    if (filterdComments && filterdComments.length) {
      const diff = commentsShowCount - commentsPerPage;
      if (diff > 0) setCommentsShowCount((res) => res - commentsPerPage);
      else setCommentsShowCount(() => commentsPerPage);
    }
  };



 /*  const renderEditorWYSWYG = (
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
          onKeyUp={(e)=>{
            if (e.key === 'Enter' && !e.shiftKey) {
              submitForm();
              e.preventDefault();
            }
          }
        }
          
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
  } */

  return (
    <section className="bg-white border-0">
      {/* {user && (
        <Form onSubmit={handleFormSubmit}>
          <InputGroup className="mt-2">
            <Avatar user={user} size="sm" showName={false} />
            <Form.Control
              value={newCommentInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewCommentInput(e.target.value)}
              onKeyPress={onKeyPressForm}
              className="border fs-6 rounded-pill bg-light"
              as="textarea"
              rows={1}
              placeholder={`${t('Write a replay')}...`}
            />
          </InputGroup>
        </Form> 
        
      
      )} */}
      {/* {user && renderEditorWYSWYG()} */}
      <CommentActionsBar entity={entity} parent={parent} cacheKey={cacheKey} />
      <div className="ms-1">
        {renderComment()}
        {(filterdComments && filterdComments.length && (
          <div>
            {commentsShowCount < filterdComments?.length && (
              <Button variant="default" className="fs-6 text-primary" onClick={viewMoreComments}>
                {t('vmcomments')}
              </Button>
            )}
            {commentsShowCount > commentsPerPage && (
              <Button variant="default" className="fs-6 text-primary" onClick={viewLessComments}>
                {t('vlcomments')}
              </Button>
            )}
          </div>
        )) ||
          ''}
      </div>
      {/* {isLoading && <Spinner animation="grow" variant="info" size="sm" />} */}
    </section>
  );
};

export default CommentsList;
