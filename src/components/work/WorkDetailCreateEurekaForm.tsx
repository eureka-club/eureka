"use client"
import { useSession } from 'next-auth/react';
import { ChangeEvent, MouseEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Button, Col, Row, ButtonGroup, Form, Spinner } from 'react-bootstrap';
import { Post } from '@prisma/client';

import { ImCancelCircle } from 'react-icons/im';


import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { WorkMosaicItem } from '../../types/work';
import { CreatePostAboutWorkClientPayload, PostMosaicItem } from '../../types/post';

import TagsInputTypeAheadMaterial from '../forms/controls/TagsInputTypeAheadMaterial';
import TagsInputMaterial from '../forms/controls/TagsInputMaterial';
import { useNotificationContext } from '@/src/hooks/useNotificationProvider';
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import useWork from '@/src/hooks/useWork'
import styles from './WorkDetailCreateEurekaForm.module.css';
import { Switch, TextField, FormControlLabel } from '@mui/material';
import Prompt from '@/src/components/post/PostPrompt';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDictContext } from '@/src/hooks/useDictContext';
import useTopics from '@/src/hooks/useTopics';
import { t } from '@/src/get-dictionary';
import { LANGUAGES } from '@/src/constants';

interface Props {
  cacheKey: string[];
  workItem: WorkMosaicItem;
  discussionItem?: string;
  setDiscussionItem: (val: string | undefined) => void;
  close: () => void;

}

const WorkDetailCreateEurekaForm: FunctionComponent<Props> = ({
  cacheKey,
  workItem,
  discussionItem,
  setDiscussionItem,
  close
}) => {
  const{dict,langs}=useDictContext();
  const lenguages = langs.split(',').map(l => LANGUAGES[l]).join(',');
  const l = lenguages[0];

  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const [newEurekaImageFile, setNewEurekaImageFile] = useState<File | null>(null);
  const { data: topics } = useTopics();
  const [eurekaTopics, setEurekaTopics] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('');
  const editorRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [useCrop, setUSeCrop] = useState<boolean>(false);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [useOtherFields, setUseOtherFields] = useState<boolean>(false);
  const [newEureka, setNewEureka] = useState({
    selectedCycleId: null,
    selectedWorkId: workItem.id,
    title: '',
    image: null,
    language: l,
    contentText: '',
    isPublic: true,
    topics: eurekaTopics,
    tags: tags
  });

  const { notifier } = useNotificationContext();
  // const gec = useGlobalEventsContext();

  const { data: work } = useWork(workItem.id, {
    enabled: !!workItem.id
  })


  const clearPayload = () => {
    if (editorRef.current)
      editorRef.current.setContent('');
    setDiscussionItem('');
    setEurekaTopics(() => []);
    setTags('');
    setNewEurekaImageFile(null);
    setCurrentImg(null);
    setNewEureka((res) => ({
      ...res,
      title: '',
      image: null,
      contentText: '',
      topics: eurekaTopics,
    }));
    setUSeCrop(false);
    close();
  };
  const clearCreateEurekaForm = () => {
    clearPayload();
  };


  const formValidation = (payload: any) => {
   if (!newEurekaImageFile) {
      toast.error(t(dict,'requiredEurekaImageError'))
      return false;
    }
    return true;
  };


  const handlerSubmitCreateEureka = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (newEureka.selectedWorkId) {
      const payload: CreatePostAboutWorkClientPayload = {
        selectedCycleId: null,
        selectedWorkId: newEureka.selectedWorkId,
        title: newEureka.title,
        image: newEurekaImageFile!,
        language: l,
        contentText: (editorRef.current) ? editorRef.current.getContent() : "",
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
        tags: tags
      };
      if (formValidation(payload))
        await mutateExecCreateEureka.mutate(payload);
    }

  };

  const mutateExecCreateEureka = useMutation(
    {
      mutationFn:async (payload: CreatePostAboutWorkClientPayload): Promise<Post | null> => {
        const u = session!.user;
  
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
  
        if (!res.ok)//TODO add Toast notification to the user
          return null;
  
        const json = await res.json();
  
        if (json) {
          toast.success(t(dict,'postCreated'))
          clearPayload();
          return json.post;
        }
        return null;
      },
      onMutate: async () => {
        const previewsItems = queryClient.getQueryData<PostMosaicItem[]>(cacheKey);
        return { previewsItems, cacheKey };
      },
      onSettled: (_eureka, error, _variables, context) => {
        if (error) {
          if (context) {
            queryClient.setQueryData(context.cacheKey, context.previewsItems);
          }
        }
        if (context && session) {
          queryClient.invalidateQueries({queryKey:context.cacheKey});
          //queryClient.invalidateQueries(['CYCLES',JSON.stringify(workItemsWhere)])
          queryClient.invalidateQueries({queryKey:['USER', `${session.user.id.toString()}`]});//to get the new notification
        }
      },
    },
  );


  useEffect(() => {
    if (!discussionItem) return;
    const [entity, id] = discussionItem.split('-');
    if (entity === 'work')
      setNewEureka((res) => ({
        ...res,
        selectedWorkId: parseInt(id, 10),
      }));
  }, [discussionItem]);

  const onChangeFieldEurekaForm = (e: ChangeEvent<HTMLInputElement>) => {
    const key: string = e.target.id.split('-')[1];
    const val: number | string = e.target.value;

    setNewEureka((res) => ({
      ...res,
      [`${key}`]: val,
    }));
  };

  const onGenerateCrop = (photo: File) => {
    setNewEurekaImageFile(() => photo);
    setCurrentImg(URL.createObjectURL(photo));
    //setChangingPhoto(true);
    setShowCrop(false);
  };

  const closeCrop = () => {
    setShowCrop(false);
  };

  const renderPhoto = () => {
    if (currentImg)
      return <img
        className={styles.postImage}
        src={currentImg}
        alt=''
      />;
  };

  const onImageSelect = (photo: File, text: string) => {
    setNewEurekaImageFile(() => photo);
    setNewEureka((res) => ({
      ...res,
      title: text,
    }));
  };

  const handleChangeUseCropSwith = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUSeCrop(event.target.checked);
    setCurrentImg('');
  };

  const handleChangeUseOtherFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseOtherFields(event.target.checked);
    setEurekaTopics([]);
    setTags('');
  };

  return (
    <Form ref={formRef}>
      <section id="create-post" className=" my-3">
        {!useCrop && <Prompt onImageSelect={onImageSelect} showTitle={true} margin={false} />}
        <Form.Group className="mt-4 mb-4">
          <FormControlLabel
            control={<Switch checked={useCrop} onChange={handleChangeUseCropSwith} />}
            label={t(dict,'showCrop')}
          />
        </Form.Group>
        {useCrop && (
          <Row className="d-flex justify-content-center flex-column flex-column-reverse flex-lg-row flex-lg-row-reverse">
            <Col className="mb-4 d-flex justify-content-center justify-content-lg-start">
              {<div className={styles.imageContainer}>{renderPhoto()}</div>}
            </Col>
            <Col xs={12} md={8} className="mt-2 mb-4">
              {!showCrop && (
                <Button
                  data-cy="image-load"
                  variant="primary"
                  className="btn-eureka w-100"
                  onClick={() => setShowCrop(true)}
                >
                  {t(dict,'Image')}
                </Button>
              )}
              {showCrop && (
                <Col className="d-flex">
                  <div className="w-100 border p-3">
                    <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape="rect" />
                  </div>
                </Col>
              )}
            </Col>
          </Row>
        )}
      </section>
      {newEurekaImageFile && (
        <>
          <Form.Group controlId="eureka-title">
            <TextField
              id="eureka-title"
              className="w-100 mb-4"
              inputProps={{ maxLength: 80 }}
              label={t(dict,'Title')}
              variant="outlined"
              size="small"
              value={newEureka.title}
              onChange={onChangeFieldEurekaForm}
            ></TextField>
          </Form.Group>
          <EditorCmp
            apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
            onInit={(_: any, editor) => {
              editorRef.current = editor;
            }}
            initialValue={newEureka.contentText!}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount', 'emoticons'
              ],
              emoticons_database: 'emojiimages',
              relative_urls: false,
              forced_root_block: "div",
              toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link | emoticons  | help',
              // toolbar:
              //   'undo redo | formatselect | ' +
              //   'bold italic backcolor | alignleft aligncenter ' +
              //   'alignright alignjustify | bullist numlist outdent indent | ' +
              //   'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
            }}
          />
          <Row>
            <Col xs={12} md={8}>
              <Form.Group className="mt-5 mb-4">
                <FormControlLabel
                  control={<Switch checked={useOtherFields} onChange={handleChangeUseOtherFields} />}
                  label={t(dict,'showOthersFields')}
                />
              </Form.Group>
              {useOtherFields && (<>
                <Form.Group controlId="topics">
                  <TagsInputTypeAheadMaterial
                    style={{ background: 'white' }}
                    data={topics as {code:string,label:string}[]}
                    items={eurekaTopics}
                    setItems={setEurekaTopics}
                    max={3}
                    label={`${t(dict,'Type to add tag')}...`}
                    formatValue={(v: string) => t(dict,`${v}`)}
                    className="mt-3"
                  />
                </Form.Group>
                <Form.Group controlId="tags" className='mt-4'>
                  <TagsInputMaterial tags={tags} setTags={setTags} label={t(dict,'topicsFieldLabel')} />
                </Form.Group>
                </>
              )}
            </Col>
          </Row>

          <aside className="d-flex justify-content-end">
            <ButtonGroup size="sm" className="pt-3">
              <Button variant="warning" className="text-white" onClick={clearCreateEurekaForm} disabled={mutateExecCreateEureka.isPending}>
                <ImCancelCircle />
              </Button>
              <Button
                data-cy="create-eureka-btn"
                onClick={handlerSubmitCreateEureka}
                className="text-white"
                style={{ width: '8rem' }}
                disabled={mutateExecCreateEureka.isPending}
              >
                <span>{t(dict,'Create')}</span>
                {mutateExecCreateEureka.isPending && <Spinner size="sm" animation="grow" />}
              </Button>
            </ButtonGroup>
          </aside>
        </>
      )}
    </Form>
  );

};

export default WorkDetailCreateEurekaForm;
