import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, MouseEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
import { Button, Col, Row, ButtonGroup, Form, Spinner } from 'react-bootstrap';
// import { useAtom } from 'jotai';
import { Post } from '@prisma/client';

// import { BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

import { useMutation, useQueryClient } from 'react-query';

import { Editor as EditorCmp } from '@tinymce/tinymce-react';
// import globalModalsAtom from '../../atoms/globalModals';
// import { Session } from '../../types';
import { CycleDetail } from '../../types/cycle';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload, PostDetail } from '../../types/post';

// import ImageFileSelect from '../forms/controls/ImageFileSelect';
import TagsInputTypeAheadMaterial from '../forms/controls/TagsInputTypeAheadMaterial';
import TagsInputMaterial from '../forms/controls/TagsInputMaterial';

// import stylesImageFileSelect from '../forms/CreatePostForm.module.css';
import useTopics from '../../useTopics';

import { useNotificationContext } from '@/src/useNotificationProvider';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import useWorks from '@/src/useWorksDetail';
import useUsers from '@/src/useUsers';
// import {useGlobalEventsContext} from '@/src/useGlobalEventsContext'
import styles from './CycleDetailDiscussionCreateEureka.module.css';
import {
  Switch,
  FormControlLabel,
  SelectChangeEvent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Prompt from '@/src/components/post/PostPrompt';
import { WorkDetail } from '@/src/types/work';

// import { devNull } from 'os';
// import { isNullOrUndefined } from 'util';

interface Props {
  cycle: CycleDetail;
  discussionItem?: string;
  setDiscussionItem: (val: string | undefined) => void;
  close: () => void;
}

const languages: Record<string, string> = {
  es: "spanish",
  en: 'english',
  fr: 'french',
  pt: 'portuguese'
}

const whereCycleParticipants = (id: number) => ({
  where: {
    OR: [
      { cycles: { some: { id } } }, //creator
      { joinedCycles: { some: { id } } }, //participants
    ],
  },
});

const CycleDetailDiscussionCreateEurekaForm: FunctionComponent<Props> = ({
  cycle,
  discussionItem,
  setDiscussionItem,
  close,
}) => {
  const cacheKey=['CYCLE',`${cycle.id}`,'POSTS'];
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useTranslation('cycleDetail');
  //const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [newEurekaImageFile, setNewEurekaImageFile] = useState<File | null>(null);
  const { data: topics} = useTopics();
  const [eurekaTopics, setEurekaTopics] = useState<string[]>([]);
  const [tags, setTags] = useState<string>('');
  const editorRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [useCrop, setUSeCrop] = useState<boolean>(false);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const [useOtherFields, setUseOtherFields] = useState<boolean>(false);
  const [newEureka, setNewEureka] = useState({
    selectedCycleId: cycle.id,
    selectedWorkId: 0,
    title: '',
    image: null,
    language: languages[`${router.locale}`],
    contentText: '',
    isPublic: cycle.access === 1,
    topics: eurekaTopics,
    tags: tags
  });


  const { notifier } = useNotificationContext();
  // const gec = useGlobalEventsContext();
  const [selection, setSelection] = useState<string | undefined>(undefined); // by default empty but required
  useEffect(() => {
    if (discussionItem) setSelection(discussionItem);
  }, [discussionItem]);

  const { data: dataWorks } = useWorks(
    { where: { cycles: { some: { id: cycle?.id } } } },
    {
      enabled: !!cycle?.id,
      notLangRestrict:true
    },
  );
  const [works, setWorks] = useState(dataWorks?.works);
  useEffect(() => {
    if (dataWorks) setWorks(dataWorks.works);
  }, [dataWorks]);

  const { data: participants, isLoading: isLoadingParticipants } = useUsers(whereCycleParticipants(cycle.id), {
    enabled: !!cycle,
  });

  const clearPayload = () => {
    if (editorRef.current) editorRef.current.setContent('');
    setSelection('');
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
      tags:tags
    }));
    setUSeCrop(false);
    close();
  };
  const clearCreateEurekaForm = () => {
    clearPayload();
  };

  const formValidation = (payload: any) => {
    if (!selection) {
      toast.error(t('requiredDiscussionItemError'));
      return false;
    } else if (!newEurekaImageFile) {
      toast.error(t('requiredEurekaImageError'));
      return false;
    } /*else if (!payload.title.length) {
      toast.error( t('NotTitle'))
          return false;
    }else if (!payload.contentText.length) {
      toast.error( t('NotContentText'))
      return false;
    }*/
    return true;
  };

  const handlerSubmitCreateEureka = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    if (newEureka.selectedWorkId) {
      const payload: CreatePostAboutWorkClientPayload = {
        selectedCycleId: newEureka.selectedCycleId ? newEureka.selectedCycleId : null,
        selectedWorkId: newEureka.selectedWorkId,
        title: newEureka.title,
        image: newEurekaImageFile!,
        language: languages[`${router.locale}`],
        contentText: editorRef.current ? editorRef.current.getContent() : '',
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
        tags:tags
      };
      if (formValidation(payload)) await execCreateEureka(payload);
    } else if (newEureka.selectedCycleId) {
      const payload: CreatePostAboutCycleClientPayload = {
        selectedCycleId: newEureka.selectedCycleId,
        selectedWorkId: null,
        title: newEureka.title,
        image: newEurekaImageFile!,
        language: languages[`${router.locale}`],
        contentText: editorRef.current ? editorRef.current.getContent() : '',
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
        tags: tags
      };
      if (formValidation(payload)) await execCreateEureka(payload);
    }
  };

  const { mutate: execCreateEureka, isLoading } = useMutation(
    async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
      const u = session!.user;
      const toUsers = (participants || []).filter((p) => p.id !== u.id).map((p) => p.id);
      if (u.id !== cycle.creatorId) toUsers.push(cycle.creatorId);
      let message = '';
      let notificationContextURL = router.asPath;
      if (payload.selectedWorkId) {
        if (works) {
          const work = works.find((w) => w.id === payload.selectedWorkId);
          if (work) {
            message = `eurekaCreatedAboutWorkInCycle!|!${JSON.stringify({
              userName: u.name || '',
              workTitle: work.title,
              cycleTitle: cycle.title,
            })}`;
            notificationContextURL = `/work/${work.id}/post`;
          }
        }
      } else if (payload.selectedCycleId) {
        message = `eurekaCreatedAboutCycle!|!${JSON.stringify({
          userName: u.name || '',
          cycleTitle: cycle.title,
        })}`;
        notificationContextURL = `/cycle/${cycle.id}/post`;
      }
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

      formData.append('notificationMessage', message);
      formData.append('notificationContextURL', notificationContextURL);
      formData.append('notificationToUsers', toUsers.join(','));

      const res = await fetch('/api/post', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok)
        //TODO add Toast notification to the user
        return null;

      const json = await res.json();

      if (json) {
        if (notifier) {
          notifier.notify({
            toUsers,
            data: { message },
          });
        }
        toast.success(t('postCreated'));
        clearPayload();
        return json.post;
      }

      return null;
    },
    {
      onMutate: async () => {
        // await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<PostDetail[]>(cacheKey);
        return { previewsItems, cacheKey };
      },
      onSettled: (_eureka, error, _variables, context) => { 
        if (error) {
          if (context) {
            queryClient.setQueryData(context.cacheKey, context.previewsItems);
          }
          // console.error(error);
        }
        if (context && session) {
          queryClient.invalidateQueries(context.cacheKey);
          queryClient.invalidateQueries(['USER', session.user.id.toString()]); //to get the new notification
        }
      },
    },
  );

  useEffect(() => {
    if (!selection) return;
    if (selection === '-1') {
      setNewEureka((res) => ({
        ...res,
        selectedCycleId: cycle.id,
      }));
    } else {
      const [entity, id] = selection.split('-');
      if (entity === 'work')
        setNewEureka((res) => ({
          ...res,
          selectedWorkId: parseInt(id, 10),
        }));
    }
  }, [selection, cycle.id]);

  const onChangeFieldEurekaForm = (e: ChangeEvent<HTMLInputElement>) => {
    const key: string = e.target.id.split('-')[1];
    const val: number | string = e.target.value;

    setNewEureka((res) => ({
      ...res,
      [`${key}`]: val,
    }));
    // console.log(newEureka);
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
    if (currentImg) return <img className={styles.postImage} src={currentImg} alt="" />;
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
    //setSelectedCycle(null);
    setEurekaTopics([]);
    setTags('');
  };

  const onChangeDiscussionItem = (e: SelectChangeEvent) => {
    setSelection(() => e.target.value);
    setDiscussionItem(selection);
  };

  const getWorksOpt = () => {
    if (!works) return [];
    return works.map((w) => {
      return (
        <MenuItem key={w.id} value={`work-${w.id}`}>
          {w.title}
        </MenuItem>
      );
    });
  };

  return (
    <Form ref={formRef}>
      <section className="my-3">
        {!useCrop && <Prompt onImageSelect={onImageSelect} showTitle={true} margin={false} />}
        <Form.Group className="mt-4 mb-4">
          <FormControlLabel
            control={<Switch checked={useCrop} onChange={handleChangeUseCropSwith} />}
            label={t('showCrop')}
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
                  {t('Image')}
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
            <FormControl className="mb-4 w-100">
              <InputLabel id="discussionItem">{t('emptyDiscussionItemLbl')}</InputLabel>
              <Select
                variant="outlined"
                labelId="discussionItem"
                size="small"
                name="discussionItem"
                id="discussionItem"
                label={t('emptyDiscussionItemLbl')}
                onChange={onChangeDiscussionItem}
                value={selection}
              >
                <MenuItem value="-1">{t('Cycle itself')}</MenuItem>
                {getWorksOpt()}
              </Select>
            </FormControl>
            <TextField
              id="eureka-title"
              className="w-100 mb-4"
              inputProps={{ maxLength: 80 }}
              label={t('Title')}
              variant="outlined"
              size="small"
              value={newEureka.title}
              onChange={onChangeFieldEurekaForm}
            ></TextField>
          </Form.Group>
          {/*<Form.Group controlId="eureka-title" className="mb-3">
        {/*<Form.Control
          type="text"
          maxLength={80}
          required
          placeholder={t('Title')}
          value={newEureka.title}
          onChange={onChangeFieldEurekaForm}
        />
      </Form.Group>
      {/* @ts-ignore*/}
          <EditorCmp
            apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
            onInit={(_: any, editor) => {
              editorRef.current = editor;
            }}
            initialValue={newEureka.contentText}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount', 'emoticons'
              ],
              emoticons_database: 'emojis',
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
          {/* <Form.Group controlId="eureka-contentText">
        <Form.Control
          as="textarea"
          rows={3}
          required
          placeholder="Text"
          value={newEureka.contentText}
          onChange={onChangeFieldEurekaForm}
        />
      </Form.Group> 
      <Form.Group className="mt-3" controlId="eureka-image">
         <Row className="d-flex justify-content-center flex-column flex-column-reverse flex-lg-row flex-lg-row-reverse">
            <Col className='mb-4 d-flex justify-content-center justify-content-lg-start'>
              {<div className={styles.imageContainer}>{renderPhoto()}</div>}
              </Col>
              <Col xs={12} md={8} className='mb-4 mt-2'>
                {!showCrop && (<Button data-cy="image-load" variant="primary" className="btn-eureka w-100" onClick={() => setShowCrop(true)}>
                  {t('Image')}
                </Button>
                )}        
                { showCrop && (
                <Col className='d-flex'>
                  <div className='w-100 border p-3'>  
                  <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape='rect' />
                  </div>  
                </Col>
               )}      
            </Col>  
            </Row>
        {/*<ImageFileSelect acceptedFileTypes="image/*" file={newEurekaImageFile} setFile={setNewEurekaImageFile} required>
          {(imagePreview) => (
            <Form.Group>
              <Row className="rounded border border-primary bg-white p-1 m-0">
                <Col xs={12} md={10}>{newEurekaImageFile != null && imagePreview ? (
                  <span className={`pt-1`}>{newEurekaImageFile?.name}</span>
                ) : (
                  t('Image')
                )}
                </Col>
                <Col xs={12} md={2} className="d-flex justify-content-start justify-content-sm-end align-items-center">

                {imagePreview && <Image layout="fixed" width="57px" height="32px" src={imagePreview} className="float-right" alt="Work cover" />}
                </Col>
              </Row>
            </Form.Group>
          )}
        </ImageFileSelect>
      </Form.Group>*/}
          {/*<Row>
        <Col xs={12} md={8}>
          <Form.Group controlId="topics">
            {/* <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel> 
            <TagsInputTypeAhead
              style={{ background: 'white' }}
              data={topics}
              items={eurekaTopics}
              setItems={setEurekaTopics}
              labelKey={(res: { code: string }) => t(`topics:${res.code}`)}
              max={3}
              placeholder={`${t('Type to add tag')}...`}
              formatValue={(v: string) => t(`topics:${v}`)} 
              className="mt-3 w-100"
            />
          </Form.Group>
        </Col>
      </Row>*/}
          <Row>
            <Col xs={12} md={8}>
              <Form.Group className="mt-5 mb-4">
                <FormControlLabel
                  control={<Switch checked={useOtherFields} onChange={handleChangeUseOtherFields} />}
                  label={t('showOthersFields')}
                />
              </Form.Group>
              {useOtherFields && (<>
                <Form.Group controlId="topics">
                  {/* <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel> */}
                  <TagsInputTypeAheadMaterial
                    style={{ background: 'white' }}
                    data={topics??[]}
                    items={eurekaTopics}
                    setItems={setEurekaTopics}
                    max={3}
                    label={t('Type to add tag')}
                    placeholder={`${t('Type to add tag')}...`}
                    formatValue={(v: string) => t(`topics:${v}`)}
                    className="mt-3"
                  />
                </Form.Group>
                <Form.Group controlId="tags" className='mt-4'>
                  <TagsInputMaterial tags={tags} setTags={setTags} label={t('topicsFieldLabel')} />
                </Form.Group></>
              )}
            </Col>
          </Row>{' '}
          <aside className="d-flex justify-content-end">
            <ButtonGroup size="sm" className="pt-3">
              <Button variant="warning" className="text-white" onClick={clearCreateEurekaForm} disabled={isLoading}>
                <ImCancelCircle />
              </Button>
              <Button
                data-cy="create-eureka-btn"
                onClick={handlerSubmitCreateEureka}
                className="text-white"
                style={{ width: '8rem' }}
                disabled={isLoading}
              >
                <span>{t('Create')}</span>
                {isLoading && <Spinner size="sm" animation="grow" />}
              </Button>
            </ButtonGroup>
          </aside>
        </>
      )}
    </Form>
  );
};

export default CycleDetailDiscussionCreateEurekaForm;
