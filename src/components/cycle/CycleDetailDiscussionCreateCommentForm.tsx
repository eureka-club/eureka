import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { Button, Spinner, ButtonGroup, Form } from 'react-bootstrap';

import { Comment } from '@prisma/client';

import { BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';
// import { Editor, EditorState } from 'draft-js';
// import 'draft-js/dist/Draft.css';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';

import { useMutation, useQueryClient } from 'react-query';
import globalModalsAtom from '../../atoms/globalModals';

// import { Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import {
  CommentMosaicItem,
  CreateCommentClientPayload,
  
} from '../../types/comment';

import { useNotificationContext } from '@/src/useNotificationProvider';
import toast from 'react-hot-toast'
import {useRouter} from 'next/router';
import useWorks from '@/src/useWorks'
import useUsers from '@/src/useUsers'
interface Props {
  cacheKey:string[];
  cycle: CycleMosaicItem;
  discussionItem: string | undefined;
  setDiscussionItem: (val: string | undefined) => void;
}

const whereCycleParticipants = (id:number)=>({
  where:{
    OR:[
      {cycles: { some: { id } }},//creator
      {joinedCycles: { some: { id } }},//participants
    ], 
  }
});

const CycleDetailDiscussionCreateCommentForm: FunctionComponent<Props> = ({
  cacheKey,
  cycle,
  discussionItem,
  setDiscussionItem,
}) => {
  const queryClient = useQueryClient();
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const {data:session} = useSession();
  const { t } = useTranslation('cycleDetail');
  const editorRef = useRef<any>(null);
  const [newComment, setNewComment] = useState({
    selectedCycleId: cycle.id,
    selectedWorkId: 0,
    selectedCommentId: 0,
    contentText: '',
    creatorId: cycle.creatorId,
  });

  // const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  // useEffect(() => {
  //   if(tinymce)
  //   tinymce.init({
  //     selector: '#comment-contentText',

  //   });
  // },[tinymce]);
  const router = useRouter();
  const {notifier} = useNotificationContext();
  const [notifyMessage, setNotifyMessage] = useState<string>('');
  
  const { data: dataWorks } = useWorks(undefined,{ where:{cycles: { some: { id: cycle?.id } }} }, {
    enabled:!!cycle?.id
  })
  const [works,setWorks] = useState(dataWorks?.works)
  useEffect(()=>{
    if(dataWorks)setWorks(dataWorks.works)
  },[dataWorks])


  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants(cycle.id),
    {
      enabled:!!cycle
    }
  )

  const clearCreateEurekaForm = () => {
    editorRef.current.setContent(newComment.contentText);
    setDiscussionItem('');
    setNewComment((res) => ({
      ...res,
      contentText: '',
      selectedCycleId: cycle.id,
      selectedWorkId: 0,
      selectedCommentId: 0,
    }));
  };

  const { mutate: execCreateComment, isLoading } = useMutation(
    async (
      payload:
        CreateCommentClientPayload
        
    ): Promise<Comment | null> => {
      const res = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if(!res.ok){
        setGlobalModalsState({
          ...globalModalsState,
          showToast:{
            show:true,
            title:t('Warning'),
            type:'warning',
            message: res.statusText
          }
        });
        return null;
      }

      const json = await res.json();
      if (json.ok) {
        if(notifier && participants && session){
          const u = session.user;
          const toUsers = participants.filter(p=>p.id!==u.id).map(p=>p.id);
          notifier.notify({
            toUsers,
            data:{message:notifyMessage}
          });
      }
       toast.success( t('commentCreated'))
       return json.comment;
      }

      return null;
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<CommentMosaicItem[]>(cacheKey);
        return { previewsItems, cacheKey };
      },
      onSettled: (_comment, error, _variables, context) => {
        if (error) {
          if (context) {
            queryClient.setQueryData(context.cacheKey, context.previewsItems);
          }
          // console.error(error);
        }
        if (context) queryClient.invalidateQueries(context.cacheKey);
      },
    },
  );

  const handlerSubmitCreateComment = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!discussionItem) {
      setGlobalModalsState({
        ...globalModalsState,
        showToast: {
          show: true,
          type: 'warning',
          title: t('Warning'),
          message: t('requiredDiscussionItemError'),
        },
      });
      return;
    }
    const u = session!.user;
    const toUsers = (participants||[]).filter(p=>p.id!==u.id).map(p=>p.id);
    if(u.id !== cycle.creatorId)
      toUsers.push(cycle.creatorId);
    if (newComment.selectedWorkId) {
      if (works) {
        const work = works.find(w=>w.id === newComment.selectedWorkId)
        const msg = `commentCreatedAboutWorkInCycle!|!${JSON.stringify({
          userName: u.name,
          workTitle: work?.title,
          cycleTitle: cycle.title,
        })}`;
        setNotifyMessage(msg);        
        const payload: CreateCommentClientPayload = {
          selectedCycleId: cycle.id,
          selectedWorkId: newComment.selectedWorkId,
          selectedCommentId: undefined,
          contentText: editorRef.current.getContent(),
          creatorId: cycle.creatorId,
          notificationMessage:msg,
          notificationContextURL:router.asPath,
          notificationToUsers:toUsers
        };
        await execCreateComment(payload);
      }
    } else if (newComment.selectedCycleId) {
      const msg = `commentCreatedAboutCycle!|!${JSON.stringify({
        userName: u.name,
        cycleTitle: cycle.title,
      })}`;
      setNotifyMessage(msg);
      const payload: CreateCommentClientPayload = {
        selectedCycleId: newComment.selectedCycleId,
        selectedWorkId: undefined,
        selectedCommentId: undefined,
        contentText: editorRef.current.getContent(),
        creatorId: cycle.creatorId,
        notificationMessage:msg,
        notificationContextURL:router.asPath,
        notificationToUsers:toUsers
      };
      await execCreateComment(payload);
    } /* else if (newComment.selectedCommentId) {
      const payload: CreateCommentAboutCommentClientPayload = {
        selectedCycleId: cycle.id,
        selectedCommentId: newComment.selectedCommentId,
        selectedWorkId: undefined,
        contentText: editorRef.current.getContent(),
        creatorId: cycle.creatorId,
      };
      await execCreateComment(payload);
    } */
    clearCreateEurekaForm();
  };

  useEffect(() => {
    if (!discussionItem) return;
    if (discussionItem === '-1') {
      setNewComment((res) => ({
        ...res,
        selectedCycleId: cycle.id,
      }));
    } else {
      const [entity, id] = discussionItem.split('-');
      if (entity === 'comment')
        setNewComment((res) => ({
          ...res,
          selectedWorktId: null,
          selectedCommentId: parseInt(id, 10),
        }));
      else if (entity === 'work')
        setNewComment((res) => ({
          ...res,
          selectedWorkId: parseInt(id, 10),
          selectedCommentId: 0,
        }));
    }
  }, [discussionItem, cycle.id]);

  const onChangeFieldCommentForm = (e: ChangeEvent<HTMLInputElement>) => {
    const key: string = e.target.id.split('-')[1];
    const val: number | string = e.target.value;

    setNewComment((res) => ({
      ...res,
      [`${key}`]: val,
    }));
    // console.log(newComment);
  };

  return (
    <>
      <EditorCmp
        apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
        onInit={(_: any, editor) => {
          editorRef.current = editor;
        }}
        initialValue={newComment.contentText}
        init={{
          height: 150,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          relative_urls: false,
          forced_root_block : "p,a",
          toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link  | help',
          // toolbar:
          //   'undo redo | formatselect | ' +
          //   'bold italic backcolor | alignleft aligncenter ' +
          //   'alignright alignjustify | bullist numlist outdent indent | ' +
          //   'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />

      <Form onSubmit={handlerSubmitCreateComment}>
        <Form.Group controlId="comment-contentText">
          {/* <Form.Control
            as="textarea"
            rows={3}
            required
            placeholder="Text"
            value={newComment.contentText}
            onChange={onChangeFieldCommentForm}
          /> */}
        </Form.Group>
        <section className="d-flex justify-content-end mt-3">
          <ButtonGroup size="sm">
            <Button variant="warning" onClick={clearCreateEurekaForm} disabled={isLoading}>
              <ImCancelCircle />
            </Button>
            <Button type="submit" className="text-white" disabled={isLoading}>
              <span>
                <BsCheck /> {t('Add')}
              </span>
              {isLoading && <Spinner size="sm" animation="grow" variant="info" />}
            </Button>
          </ButtonGroup>
        </section>
      </Form>
    </>
  );
};

export default CycleDetailDiscussionCreateCommentForm;
