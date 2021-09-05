import { useSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState, useRef } from 'react';

import { Button, Col, Row, ButtonGroup, Form } from 'react-bootstrap';

import { Comment } from '@prisma/client';

import { BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';
// import { Editor, EditorState } from 'draft-js';
// import 'draft-js/dist/Draft.css';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';

import { useMutation, useQueryClient } from 'react-query';

import { Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import {
  CreateCommentAboutCycleClientPayload,
  CreateCommentAboutWorkClientPayload,
  CreateCommentAboutCommentClientPayload,
} from '../../types/comment';

interface Props {
  cycle: CycleMosaicItem;
  discussionItem: string;
}

const CycleDetailDiscussionCreateCommentForm: FunctionComponent<Props> = ({ cycle, discussionItem }) => {
  const queryClient = useQueryClient();

  const [session] = useSession() as [Session | null | undefined, boolean];
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
  //   debugger;
  //   if(tinymce)
  //   tinymce.init({
  //     selector: '#comment-contentText',

  //   });
  // },[tinymce]);

  const clearCreateEurekaForm = () => {
    editorRef.current.setContent(newComment.contentText);
    setNewComment((res) => ({
      ...res,
      contentText: '',
      selectedCycleId: cycle.id,
      selectedWorkId: 0,
      selectedCommentId: 0,
    }));
  };

  const { mutate: execCreateComment } = useMutation(
    async (
      payload:
        | CreateCommentAboutCycleClientPayload
        | CreateCommentAboutWorkClientPayload
        | CreateCommentAboutCommentClientPayload,
    ): Promise<Comment | null> => {
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
        const cacheKey = ['CYCLES', `${cycle.id}`];
        // await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<CycleMosaicItem[]>(cacheKey);
        // const eureka: Pick<Post, 'title' | 'language' | 'contentText' | 'isPublic'> = newComment;

        // queryClient.setQueryData<Item[]>(cacheKey, (prev) => prev!.concat(eureka));
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

    if (newComment.selectedWorkId) {
      const payload: CreateCommentAboutWorkClientPayload = {
        selectedCycleId: newComment.selectedCycleId ? newComment.selectedCycleId : undefined,
        selectedWorkId: newComment.selectedWorkId,
        selectedCommentId: undefined,
        contentText: editorRef.current.getContent(),
        creatorId: cycle.creatorId,
      };
      await execCreateComment(payload);
    } else if (newComment.selectedCycleId) {
      const payload: CreateCommentAboutCycleClientPayload = {
        selectedCycleId: newComment.selectedCycleId,
        selectedWorkId: undefined,
        selectedCommentId: undefined,
        contentText: editorRef.current.getContent(),
        creatorId: cycle.creatorId,
      };
      await execCreateComment(payload);
    } else if (newComment.selectedCommentId) {
      const payload: CreateCommentAboutCommentClientPayload = {
        selectedCycleId: newComment.selectedCycleId ? newComment.selectedCycleId : undefined,
        selectedCommentId: newComment.selectedCommentId,
        selectedWorkId: undefined,
        contentText: editorRef.current.getContent(),
        creatorId: cycle.creatorId,
      };
      await execCreateComment(payload);
    }
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
        onInit={(_: any, editor) => {
          editorRef.current = editor;
        }}
        initialValue={newComment.contentText}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          relative_urls: false,
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
        <Row>
          {/* <Col xs={12} md={8}>
          <Form.Group controlId="topics">
            <Form.Control />
          </Form.Group>
        </Col> */}
          <Col xs={12} md={4}>
            <ButtonGroup size="sm">
              <Button variant="secondary" onClick={clearCreateEurekaForm}>
                <ImCancelCircle />
              </Button>
              <Button type="submit">
                <BsCheck />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default CycleDetailDiscussionCreateCommentForm;
