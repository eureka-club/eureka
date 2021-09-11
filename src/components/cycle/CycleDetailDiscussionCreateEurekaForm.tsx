import { useSession } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, FormEvent, FunctionComponent, useEffect, useRef, useState } from 'react';

import { Button, Col, Row, ButtonGroup, Form } from 'react-bootstrap';

import { Post } from '@prisma/client';

import { BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

import { useMutation, useQueryClient } from 'react-query';

import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload } from '../../types/post';

import ImageFileSelect from '../forms/controls/ImageFileSelect';
import TagsInputTypeAhead from '../forms/controls/TagsInputTypeAhead';
import stylesImageFileSelect from '../forms/CreatePostForm.module.css';
import useTopics from '../../useTopics';

// import styles from './CycleDetailDiscussionCreateEurekaForm.module.css';

interface Props {
  cycle: CycleMosaicItem;
  discussionItem: string;
}

const CycleDetailDiscussionCreateEurekaForm: FunctionComponent<Props> = ({ cycle, discussionItem }) => {
  const queryClient = useQueryClient();

  const [session] = useSession() as [Session | null | undefined, boolean];
  const { t } = useTranslation('cycleDetail');

  const [newEurekaImageFile, setNewEurekaImageFile] = useState<File | null>(null);
  const { data: topics } = useTopics();
  const [eurekaTopics, setEurekaTopics] = useState<string[]>([]);
  const editorRef = useRef<any>(null);
  const [newEureka, setNewEureka] = useState({
    selectedCycleId: cycle.id,
    selectedWorkId: 0,
    title: '',
    image: null,
    language: cycle.languages,
    contentText: '',
    isPublic: cycle.access === 1,
    topics: eurekaTopics,
  });

  const clearCreateEurekaForm = () => {
    editorRef.current.setContent('');
    setEurekaTopics(() => []);
    setNewEurekaImageFile(null);
    setNewEureka((res) => ({
      ...res,
      title: '',
      image: null,
      contentText: '',
      topics: eurekaTopics,
    }));
  };

  const { mutate: execCreateEureka } = useMutation(
    async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });
      const res = await fetch('/api/post', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.ok) {
        return json.post;
      }

      return null;
    },
    {
      onMutate: async () => {
        const cacheKey = ['CYCLES', `${cycle.id}`];
        // await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<CycleMosaicItem[]>(cacheKey);
        // const eureka: Pick<Post, 'title' | 'language' | 'contentText' | 'isPublic'> = newEureka;

        // queryClient.setQueryData<Item[]>(cacheKey, (prev) => prev!.concat(eureka));
        return { previewsItems, cacheKey };
      },
      onSettled: (_eureka, error, _variables, context) => {
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

  const handlerSubmitCreateEureka = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!newEurekaImageFile) return;

    if (newEureka.selectedWorkId) {
      const payload: CreatePostAboutWorkClientPayload = {
        selectedCycleId: newEureka.selectedCycleId ? newEureka.selectedCycleId : null,
        selectedWorkId: newEureka.selectedWorkId,
        title: newEureka.title,
        image: newEurekaImageFile,
        language: newEureka.language,
        contentText: editorRef.current.getContent(),
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
      };
      await execCreateEureka(payload);
    } else if (newEureka.selectedCycleId) {
      const payload: CreatePostAboutCycleClientPayload = {
        selectedCycleId: newEureka.selectedCycleId,
        selectedWorkId: null,
        title: newEureka.title,
        image: newEurekaImageFile,
        language: newEureka.language,
        contentText: editorRef.current.getContent(),
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
      };
      await execCreateEureka(payload);
    }
  };

  useEffect(() => {
    if (discussionItem === '-1') {
      setNewEureka((res) => ({
        ...res,
        selectedCycleId: cycle.id,
      }));
    } else {
      const [entity, id] = discussionItem.split('-');
      if (entity === 'work')
        setNewEureka((res) => ({
          ...res,
          selectedWorkId: parseInt(id, 10),
        }));
    }
  }, [discussionItem, cycle.id]);

  const onChangeFieldEurekaForm = (e: ChangeEvent<HTMLInputElement>) => {
    const key: string = e.target.id.split('-')[1];
    const val: number | string = e.target.value;

    setNewEureka((res) => ({
      ...res,
      [`${key}`]: val,
    }));
    // console.log(newEureka);
  };

  return (
    <Form onSubmit={handlerSubmitCreateEureka}>
      <Form.Group controlId="eureka-title">
        <Form.Control
          type="text"
          maxLength={80}
          required
          placeholder="Title"
          value={newEureka.title}
          onChange={onChangeFieldEurekaForm}
        />
      </Form.Group>

      <EditorCmp
        onInit={(_: any, editor) => {
          editorRef.current = editor;
        }}
        initialValue={newEureka.contentText}
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

      {/* <Form.Group controlId="eureka-contentText">
        <Form.Control
          as="textarea"
          rows={3}
          required
          placeholder="Text"
          value={newEureka.contentText}
          onChange={onChangeFieldEurekaForm}
        />
      </Form.Group> */}

      <ImageFileSelect acceptedFileTypes="image/*" file={newEurekaImageFile} setFile={setNewEurekaImageFile} required>
        {(imagePreview) => (
          <Form.Group>
            {/* <Form.Label>*{t('imageFieldLabel')}</Form.Label> */}
            <div className={stylesImageFileSelect.imageControl}>
              {newEurekaImageFile != null && imagePreview ? (
                <span className={stylesImageFileSelect.imageName}>{newEurekaImageFile?.name}</span>
              ) : (
                t('Image')
              )}
              {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
            </div>
          </Form.Group>
        )}
      </ImageFileSelect>
      <Row>
        <Col xs={12} md={8}>
          <Form.Group controlId="topics">
            {/* <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel> */}
            <TagsInputTypeAhead
              style={{ background: 'white' }}
              data={topics}
              items={eurekaTopics}
              setItems={setEurekaTopics}
              labelKey={(res: { code: string }) => t(`topics:${res.code}`)}
              max={3}
              placeholder={`${t('Type to add tag')}...`}
            />
          </Form.Group>
        </Col>
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
  );
};

export default CycleDetailDiscussionCreateEurekaForm;
