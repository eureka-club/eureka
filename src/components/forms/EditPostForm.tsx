import { Post } from '@prisma/client';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { BsX } from 'react-icons/bs';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormCheck from 'react-bootstrap/FormCheck';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalFooter from 'react-bootstrap/ModalFooter';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { Switch, TextField, FormControlLabel, Autocomplete } from '@mui/material';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { BsFillXCircleFill } from 'react-icons/bs';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { useMutation, useQueryClient } from 'react-query';
import TagsInput from './controls/TagsInput';
import TagsInputMaterial from './controls/TagsInputMaterial';
import TagsInputTypeAheadMaterial from './controls/TagsInputTypeAheadMaterial';
import AsyncTypeaheadMaterial from './controls/AsyncTypeaheadMaterial';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../../types';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload } from '../../types/post';
import { CycleDetail } from '../../types/cycle';
import { WorkDetail } from '../../types/work';
//import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreatePostForm.module.css';
import useTopics from '../../useTopics';
import useWork from '../../useWorkDetail';
// import { Session } from '@/src/types';
import { useSession } from 'next-auth/react';
import useUser from '@/src/useUser';
import useUsers from '@/src/useUsers'
import { useNotificationContext } from '@/src/useNotificationProvider';
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import toast from 'react-hot-toast'
import { ImCancelCircle } from 'react-icons/im';
import Prompt from '@/src/components/post/PostPrompt';
import { set } from 'lodash';
import usePost from '../../usePostDetail';
import LocalImageComponent from '../LocalImage';
import { EditPostAboutCycleClientPayload, EditPostAboutWorkClientPayload, PostDetail } from '../../types/post';
interface Props {
  noModal?: boolean;
  cacheKey?: string[]
  id: number;
}

interface FormValues {
  id: number | null;
  title: string;
  language: string | undefined;
  contentText: string | null;
  image?: File | null;
  currentImage?: any;
  selectedCycle: any | null;
  selectedWork: any | null;
  isPublic: boolean;
  topics: string[];
  tags: string;
}

const whereCycleParticipants = (id: number) => ({
  where: {
    OR: [
      { cycles: { some: { id } } },//creator
      { joinedCycles: { some: { id } } },//participants
    ],
  }
});
const EditPostForm: FunctionComponent<Props> = ({ noModal = false, id }) => {
  const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
  const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleDetail[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleDetail | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkDetail | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  //const [items, setItems] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const [changePhoto, setChangePhoto] = useState<boolean>(false);
  const [useCrop, setUSeCrop] = useState<boolean>(false);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number>();
  const [workId, setWorkId] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [formValues, setFormValues] = useState<FormValues>({
    id: null,
    title: '',
    language: '',
    contentText: '',
    selectedCycle: null,
    selectedWork: null,
    isPublic: true,
    topics: [],
    tags: ''
  });
  const [imageChanged, setImageChanged] = useState<string | undefined>();
  const [ck, setCK] = useState<string[]>();

  const { data: post, isLoading, isFetching } = usePost(id);


  useEffect(() => {

    if (post) {
      let form = {
        id: post.id,
        title: post.title,
        language: post.language,
        image: null,
        currentImage: `https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/${post.localImages[0].storedFile}`,
        contentText: post.contentText,
        selectedCycle: post.cycles[0] as CycleDetail | null,
        selectedWork: post.works[0] as WorkDetail | null,
        isPublic: post.isPublic,
        topics: [] as string[],
        tags: post.tags as string
      }

      if (post.topics?.length) {
        for (let topic of post.topics.split(',')) {
          if (!form.topics.includes(topic))
            form.topics.push(...post.topics.split(','));
        }
      }
      setFormValues(form);
    }
  }, [post])

  /*useEffect(() => {
    if (router && router.query?.id) {
      setWorkId(router.query.id.toString());
    }
  }, [router])*/
  const { data: work } = useWork(+workId, {
    enabled: !!workId
  });

  const { data: user } = useUser(userId!, {
    enabled: !!userId
  });

  /*const { data: participants, isLoading: isLoadingParticipants } = useUsers(selectedCycle ? whereCycleParticipants(selectedCycle.id) : {},
    {
      enabled: !!selectedCycle
    }
  )*/

  const { notifier } = useNotificationContext();
  useEffect(() => {
    if (session) {
      const user = session.user;
      setUserId(user.id);
    }
  }, [session]);
  // useEffect(() => {
  //   if (router) {
  //     const routeValues = router.route.split('/').filter((i) => i);
  //     if (routeValues.length) {
  //       if (routeValues[0] === 'work') {
  //         setWorkId(router.query.id as string);
  //       }
  //     }
  //   }
  // }, [router, router.query.id]);

  useEffect(() => {
    if (work) setSelectedWork(work as WorkDetail);
  }, [work]);

  const { t } = useTranslation('createPostForm');

  const { data: topics } = useTopics();
  //const [tags, setTags] = useState<string>('');
  //const [postId, setPostId] = useState<number | undefined>();


  const handleSelectWorkOrCycle = (selected: SearchResult | null): void => {
    //console.log(selected, 'selected')

    const searchResult = selected;
    if (searchResult != null) {
      if (isCycleMosaicItem(searchResult)) {
        setFormValues({
          ...formValues,
          ['selectedCycle']: searchResult
        });
      }
      if (isWorkMosaicItem(searchResult)) {
        setFormValues({
          ...formValues,
          ['selectedWork']: searchResult,
          ['selectedCycle']: null

        });
      }
    }
    else {
      setFormValues({
        ...formValues,
        ['selectedWork']: null,
        ['selectedCycle']: null

      });
    }

  };

  const handleSelectCycle = (selected: SearchResult | null): void => {
    const searchResult = selected as CycleDetail | null
    setFormValues({
      ...formValues,
      ['selectedCycle']: searchResult
    });
    if (searchResult != null) {     
      if (searchResult.access === 2)
        setFormValues({
          ...formValues,
          ['isPublic']: false
        });
    }
  };


  /*const formValidation = (payload: any) => {

    if (!payload.title.length) {
       toast.error( t('NotTitle'))
       return false;
     }else if (!imageFile) {
       toast.error( t('requiredEurekaImageError'))
       return false;
     }else if (!payload.contentText.length) {
       toast.error( t('NotContentText'))
       return false;
     }
    return true;
  };*/

  const {
    mutate: execEditPost,
    data: editPost,
    error: createPostError,
    isError: isEditPostError,
    isLoading: isEditPostLoading,
    isSuccess: isEditPostSuccess,
  } = useMutation(
    async (payload: EditPostAboutCycleClientPayload | EditPostAboutWorkClientPayload): Promise<Post> => {

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

      const res = await fetch(`/api/post/${id}`, {
        method: 'PATCH',
        body: formData,//JSON.stringify(payload),
      });
      //console.log(res, 'res')
      if (res.ok) {
        toast.success(t('PostEdited'));
        router.push(`/${formValues.selectedCycle ? 'cycle' : 'work'}/${formValues.selectedCycle ? formValues.selectedCycle.id : formValues.selectedWork!.id}/post/${post!.id}`)
      }
      return res.json();
    },
    {
      onMutate: async (variables) => {
        if (post) {
          const ck_ = ck || ['POST', `${post.id}`];
          await queryClient.cancelQueries(ck_)
          const snapshot = queryClient.getQueryData<PostDetail[] | PostDetail>(ck_)
          const { title, contentText } = variables;
          if (snapshot) {
            let posts = [];
            if (('length' in snapshot)) {
              posts = [...snapshot] as PostDetail[];
              const idx = posts.findIndex(p => p.id == +post.id)
              if (idx > - 1) {
                const oldPost = posts[idx];
                const newPost = {
                  ...oldPost,
                  contentText: contentText ?? oldPost.contentText,
                  title: title ?? oldPost.title,
                }
                posts.splice(idx, 1, newPost);
                queryClient.setQueryData(ck_, [...posts]);
              }
            }
            else
              queryClient.setQueryData(ck_, { ...snapshot, title, contentText });

            return { snapshot, ck: ck_ };
          }
        }

      },
      onSettled: (_post, error, _variables, context) => {
        if (error) {
          queryClient.invalidateQueries(ck);
          queryClient.invalidateQueries(['POST', `${formValues.id}`]);
        }
        // this make the page to do a refresh
        queryClient.invalidateQueries(ck);
        // queryClient.invalidateQueries(['POST',postId]);

      },
    },
  );

  const {
    mutate: execDeletePost,
    data: deletePost,
    error: deletePostError,
    isError: isDeletePostError,
    isLoading: isDeletePostLoading,
    isSuccess: isDeletePostSuccess,
  } = useMutation(
    async (payload: EditPostAboutCycleClientPayload | EditPostAboutWorkClientPayload): Promise<Post> => {
      const res = await fetch(`/api/post/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success(t('PostRemoved'));
        router.push(`/${formValues.selectedCycle ? 'cycle' : 'work'}/${formValues.selectedCycle ? formValues.selectedCycle.id : formValues.selectedWork!.id}`)
      }
      return res.json();
    },
    {
      onMutate: async (variables) => {
        if (post) {
          const ck_ = ck || ['POST', `${post.id}`];
          await queryClient.cancelQueries(ck_)
          const snapshot = queryClient.getQueryData<PostDetail[] | PostDetail>(ck_)
          const { title, contentText } = variables;
          if (snapshot) {
            let posts = [];
            if (('length' in snapshot)) {
              posts = [...snapshot] as PostDetail[];
              const idx = posts.findIndex(p => p.id == +post.id)
              if (idx > - 1) {
                const oldPost = posts[idx];
                const newPost = {
                  ...oldPost,
                  contentText: contentText ?? oldPost.contentText,
                  title: title ?? oldPost.title,
                }
                posts.splice(idx, 1, newPost);
                queryClient.setQueryData(ck_, [...posts]);
              }
            }
            else
              queryClient.setQueryData(ck_, { ...snapshot, title, contentText });

            return { snapshot, ck: ck_ };
          }
          // const ck = [`POST`, `${globalModalsState.editPostId || post.id}`];
        }

        // return { snapshot: null, ck: '' };
      },
      onSettled: (_post, error, _variables, context) => {
        if (error) {
          queryClient.invalidateQueries(ck);
          queryClient.invalidateQueries(['POST', `${post!.id}`]);
        }
        // this make the page to do a refresh
        queryClient.invalidateQueries(ck);
        // queryClient.invalidateQueries(['POST',postId]);

      },
    },
  );

  const handleSubmit = async (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (!imageFile && !formValues.currentImage) {
      toast.error(t('requiredEurekaImageError'))
      return;
    }

    //const form = ev.currentTarget;
    if (formValues.selectedWork != null) {
      const payload: EditPostAboutWorkClientPayload = {
        id: formValues.id!.toString(),
        selectedCycleId: formValues.selectedCycle != null ? formValues.selectedCycle?.id : null,
        selectedWorkId: formValues.selectedWork.id,
        title: formValues.title,
        image: imageFile!,
        language: formValues.language,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: formValues.isPublic,
        topics: formValues.topics.join(','),
        tags: formValues.tags
      };
      //if (formValidation(payload))
      await execEditPost(payload);   

    } else if (formValues.selectedCycle != null) {
      const payload: EditPostAboutCycleClientPayload = {
        id: formValues.id!.toString(),
        selectedCycleId: formValues.selectedCycle != null ? formValues.selectedCycle?.id : null,
        selectedWorkId: formValues.selectedWork.id,
        title: formValues.title,
        image: imageFile!,
        language: formValues.language,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: formValues.isPublic,
        topics: formValues.topics.join(','),
        tags: formValues.tags
      };
      // (formValidation(payload))
      await execEditPost(payload);
    }
    else
      toast.error(t('NotAboutItem'))
  };

  const handleRemove = async (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const payload: EditPostAboutWorkClientPayload = {
      id: formValues.id!.toString(),
      selectedCycleId: formValues.selectedCycle != null ? formValues.selectedCycle?.id : null,
      selectedWorkId: formValues.selectedWork.id,
      title: '',
      language: '',
      contentText: '', 
      isPublic: false,
      topics: '',
    };
    await execDeletePost(payload);

  }

  /* useEffect(() => {
     if (isCreatePostSuccess === true && createdPost != null) {
       setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: false } });
       queryClient.invalidateQueries('posts.mosaic');
 
       if (selectedWork != null) {
         router.push(`/work/${selectedWork.id}/post/${createdPost.id || postId}`);
         return;
       }
       if (selectedCycle != null) {
         router.push(`/cycle/${selectedCycle.id}/post/${createdPost.id || postId}`);
       }
     } else if (status === 'error') {
       alert('Error creating the post');
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [createdPost, isCreatePostSuccess]);*/

  const labelKeyFn = (res: SearchResult) => {
    if ('title' in res)
      return `${res.title}`;
    return `${res.name}`;
  };

  const onGenerateCrop = (photo: File) => {
    setImageFile(() => photo);
    setImageChanged(URL.createObjectURL(photo));
    setChangePhoto(false);
    setShowCrop(false);
    setFormValues({
      ...formValues,
      ['currentImage']: undefined
    });
  };

  const closeCrop = () => {
    setShowCrop(false);
  };

  const renderPhoto = () => {
    if (formValues.currentImage)
      return <Row className='d-flex flex-column'>
        <Col className='d-flex flex-column justify-content-center align-items-center  flex-xxl-row justify-content-xxl-start align-items-xxl-start' >
          <img className={styles.selectedPhoto} src={formValues.currentImage} />
          <Button className="btn-eureka ms-0 ms-xxl-3  text-white" onClick={() => handleChangePhoto()}>
            {t('Change Photo')}
          </Button>
        </Col>
      </Row>
    if (imageChanged)
      return <Row className='d-flex flex-column'>
        <Col className='d-flex flex-column justify-content-center align-items-center  flex-xxl-row justify-content-xxl-start align-items-xxl-start' >
          <img className={styles.selectedPhoto} src={imageChanged} />
          <Button className="btn-eureka ms-0 ms-xxl-3  text-white" onClick={() => handleChangePhoto()}>
            {t('Change Photo')}
          </Button>
        </Col>
      </Row>
  };


  const onImageSelect = (photo: File, text: string) => {
    setImageFile(() => photo);
    setImageChanged(URL.createObjectURL(photo));
    setChangePhoto(false);
    setFormValues({
      ...formValues,
      ['currentImage']: undefined,
      ['title']: text,
    });
  };

  const handleChangeUseCropSwith = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUSeCrop(event.target.checked);
    window.scroll(0, 0);
    setImageChanged(undefined);
  };



  const handleChangePhoto = () => {
    setChangePhoto(true);
    setUSeCrop(false);
  };

  const onCloseChangePhoto = () => {
    setChangePhoto(false);
  };

  const onSelectLanguage = (language: string) => {
    setFormValues({
      ...formValues,
      ['language']: language
    });
  };

  const handleSetTitle = (title: string) => {
    setFormValues({
      ...formValues,
      ['title']: title
    });

  };

  const handleSetTopics = (topics: string[]) => {
    setFormValues({
      ...formValues,
      ['topics']: topics
    });

  };

  const handleSetTags = (tags: string) => {
    setFormValues({
      ...formValues,
      ['tags']: tags
    });

  };


  return (
    <Form ref={formRef}>
      <ModalHeader closeButton={!noModal}>
        <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('titleEdit')}</h1></ModalTitle>
      </ModalHeader>
      <ModalBody className=''>
        <section className='my-3'>

          {!changePhoto && renderPhoto()}
          {changePhoto && <>   <div className='d-flex justify-content-end mb-2'> <Button variant="primary text-white" onClick={onCloseChangePhoto} size="sm">
            <BsX fontSize='1.5em' />
          </Button></div>{!useCrop && <Prompt onImageSelect={onImageSelect} />}
            <FormGroup className='mt-4 mb-4'>
              <FormControlLabel control={<Switch checked={useCrop} onChange={handleChangeUseCropSwith} />} label={t('showCrop')} />
            </FormGroup>
            {useCrop && <Col className='mb-4'>
              {!showCrop && (<><Button data-cy="image-load" className="btn-eureka w-100 px-2 px-lg-5 text-white" onClick={() => setShowCrop(true)}>
                {t('imageFieldLabel')}
              </Button>
                {/*currentImg && renderPhoto()*/}
              </>)}
              {showCrop && (
                <Col className='px-2 px-lg-5'>
                  <div className='w-100 border p-3 '>
                    <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape='rect' />
                  </div>

                </Col>
              )}
            </Col>}</>}

        </section>

        {!changePhoto && <><Row className='d-flex flex-column px-2 mt-5 '>
          <Col className='mb-4'>
            <AsyncTypeaheadMaterial item={(formValues.selectedWork) ? formValues.selectedWork : formValues.selectedCycle} searchType="all" onSelected={handleSelectWorkOrCycle}
              label={`*${t('searchCycleOrWorkFieldLabel')}`}
              helperText={`${t('searchCycleOrWorkFieldPlaceholder')}`} />
          </Col>
          <Col className='mb-4'>
            <LanguageSelect onSelectLanguage={onSelectLanguage} defaultValue={formValues.language} label={t('languageFieldLabel')} />
          </Col>
          <Col className='mb-4'>
            <FormGroup controlId="postTitle" >
              <TextField id="postTitle" className="w-100" label={t('titleFieldLabel')}
                variant="outlined" size="small" value={formValues.title}
                onChange={(e) => handleSetTitle(e.target.value)}>
              </TextField>
            </FormGroup>
          </Col>
        </Row>
          <FormGroup controlId="description" as={Col} className="mb-4 px-2">
            <FormLabel>{t('descriptionFieldLabel')}</FormLabel>
            {/* @ts-ignore*/}
            <EditorCmp
              apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
              onInit={(_: any, editor) => {
                editorRef.current = editor;
              }}
              initialValue={formValues.contentText || ''}
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
          </FormGroup>
          <Row className='mt-5 px-2 d-flex flex-column'>
            <Col className="mb-4">
              <FormGroup controlId="workOrCycle">
                {/*!selectedCycle ? (
                  <>
                    <style jsx global>{`
                      .rbt-menu {
                        min-width: 300px;
                      }
                    `}</style>
                    <AsyncTypeahead
                      id="create-post--search-cycle"
                      filterBy={() => true}
                      inputProps={{ id: 'create-post--search-cycle' }}
                      placeholder={t('searchCycleFieldPlaceholder')}
                      isLoading={isSearchCycleLoading}
                      labelKey={labelKeyFn}
                      minLength={2}
                      useCache={false}
                      onSearch={handleSearchCycle}
                      options={searchCycleResults}
                      onChange={handleSelectCycle}
                      renderMenuItemChildren={(searchResult) => <CycleTypeaheadSearchItem cycle={searchResult} />}
                    />
                  </>
                ) : (
                  <div className={styles.searchResult}>
                    {selectedCycle !== null && <CycleTypeaheadSearchItem cycle={selectedCycle} />}
                    <button onClick={handleClearSelectedCycle} type="button" className={styles.discardSearchResult}>
                      <BsFillXCircleFill />
                    </button>
                  </div>
                )*/}
                <AsyncTypeaheadMaterial item={formValues.selectedCycle} onSelected={handleSelectCycle} searchType="cycles"
                  workSelected={formValues.selectedWork}
                  label={`${t('searchCycleFieldLabel')}`}
                  helperText={`${t('searchCycleInfotip')}`} />
              </FormGroup>
            </Col>

            <Col className="mb-4">
              <FormGroup controlId="topics">
                <TagsInputTypeAheadMaterial
                  data={topics}
                  items={formValues.topics}
                  setItems={handleSetTopics}
                  formatValue={(v: string) => t(`topics:${v}`)}
                  max={3}
                  label={t('topicsPostLabel')}
                  placeholder={`${t('Type to add tag')}...`}
                />
              </FormGroup>
            </Col>
            <Col className="mb-4">
              <TagsInputMaterial tags={formValues.tags} setTags={handleSetTags} label={t('topicsFieldLabel')} />
            </Col>
          </Row></>}
      </ModalBody>
      <ModalFooter>
        {!changePhoto && <Row className='d-flex flex-column flex-lg-row'>
          <Container className="p-0 d-flex justify-content-end">
            <ButtonGroup className="py-4">
              <Button
                variant="warning"
                disabled={isDeletePostLoading}
                onClick={handleRemove}
              >
                <>
                  {t('resetBtnLabel')}
                  {isDeletePostLoading && (
                    <Spinner size="sm" animation="grow" variant="secondary" className={`ms-2 ${styles.loadIndicator}`} />
                  )}</>
              </Button>
              <Button disabled={isEditPostLoading} onClick={(e) => { handleSubmit(e) }} className="btn-eureka" style={{ width: '10em' }}>
                <>
                  {t('titleEdit')}
                  {isEditPostLoading && (
                    <Spinner size="sm" animation="grow" variant="secondary" className={`ms-2 ${styles.loadIndicator}`} />
                  )}
                </>
              </Button>
            </ButtonGroup>
          </Container>
        </Row>}
      </ModalFooter>

    </Form>
  );
};

export default EditPostForm;
