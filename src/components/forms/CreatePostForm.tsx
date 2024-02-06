import { Post } from '@prisma/client';
import { useAtom } from 'jotai';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';;
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
import useWork from '../../useWork';
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
import { getLocale_In_NextPages } from '@/src/lib/utils';
import { useDictContext } from '@/src/hooks/useDictContext';

interface Props {
  noModal?: boolean;
  params?: any;
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
      { cycles: { some: { id } } },//creator
      { joinedCycles: { some: { id } } },//participants
    ],
  }
});
const CreatePostForm: FunctionComponent<Props> = ({ noModal = false, params }) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleDetail[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleDetail | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkDetail | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const [useCrop, setUSeCrop] = useState<boolean>(false);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const { data: session } = useSession();
  const [userId, setUserId] = useState<number>();

  const searchParams=useSearchParams()!;
  const asPath=usePathname()!;
  const locale=getLocale_In_NextPages(asPath);
  const [workId, setWorkId] = useState<string>(searchParams.get('id')!);
  const [postTitle, setPostTitle] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [useOtherFields, setUseOtherFields] = useState<boolean>(false);

  //const [photo, setPhoto] = useState<File>();
  const [currentImg, setCurrentImg] = useState<string | undefined>();

  const { data: work } = useWork(+workId, {
    enabled: !!workId
  });

  const { data: user } = useUser(userId!, {
    enabled: !!userId
  });

  const { data: participants, isLoading: isLoadingParticipants } = useUsers(selectedCycle ? whereCycleParticipants(selectedCycle.id) : {},
    {
      enabled: !!selectedCycle
    }
  )

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

  // const { t } = useTranslation('createPostForm');
  const{t,dict}=useDictContext();

  const { data: topics } = useTopics();
  const [tags, setTags] = useState<string>('');
  const [postId, setPostId] = useState<number | undefined>();
  const {
    mutate: execCreatePost,
    data: createdPost,
    error: createPostError,
    isError: isCreatePostError,
    isPending: isCreatePostLoading,
    isSuccess: isCreatePostSuccess,
    status,
  } = useMutation(
    {
      mutationFn:async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value != null) {
            formData.append(key, value);
          }
        });
  
        let message = "";
        let notificationContextURL = asPath
        let notificationToUsers: number[];
        if (user && notifier) {
          notificationToUsers = user.followedBy.map(u => u.id)
          if (selectedWork) {
            notificationContextURL = `/work/${selectedWork.id}/post`
            if (selectedCycle) {
              message = `eurekaCreatedAboutWorkInCycle!|!${JSON.stringify({
                userName: user.name || '',
                workTitle: selectedWork.title,
                cycleTitle: selectedCycle.title
              })}`;
              notificationToUsers = (participants || []).filter(p => p.id !== user.id).map(p => p.id);
              if (user.id !== selectedCycle.creatorId)
                notificationToUsers.push(selectedCycle.creatorId)
            }
            else {
              message = `eurekaCreatedAboutWork!|!${JSON.stringify({
                userName: user.name || '',
                workTitle: selectedWork.title
              })}`;
            }
          }
          else if (selectedCycle) {
            notificationContextURL = `/cycle/${selectedCycle.id}/post`
            message = `eurekaCreatedAboutCycle!|!${JSON.stringify({
              userName: user.name || '',
              cycleTitle: selectedCycle.title
            })}`;
            notificationToUsers = (participants || []).filter(p => p.id !== user.id).map(p => p.id);
            if (user.id !== selectedCycle.creatorId)
              notificationToUsers.push(selectedCycle.creatorId)
          }
  
          formData.append('notificationMessage', message);
          formData.append('notificationContextURL', notificationContextURL);
          formData.append('notificationToUsers', notificationToUsers.join(','));
  
        }
  
        const res = await fetch('/api/post', {
          method: 'POST',
          body: formData,
        });
  
        if (res.ok) {
          const json = await res.json();
          setPostId(json.id);
          if (notifier && user)
            notifier.notify({
              data: { message },
              toUsers: user?.followedBy.map(u => u.id)
            })
          toast.success(t(dict,'postCreated'))
          return json.post;
        }
        //TODO toast with error to the user
        return null;
      },
      onMutate: async () => {
        if (selectedCycle) {
          const cacheKey = ['CYCLE', `${selectedCycle.id}`]
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
          if (context) queryClient.invalidateQueries({queryKey:ck});
        }
      },
    },
  );

  const handleSearchWorkOrCycle = async (query: string) => {
    setIsSearchWorkOrCycleLoading(true);

    const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
    const response = await fetch(`/api/search/works-or-cycles?q=${query}&include=${includeQP}`);
    const itemsSWC: SearchResult[] = await response.json();

    setSearchWorkOrCycleResults(itemsSWC);
    setIsSearchWorkOrCycleLoading(false);
  };

  const handleSearchCycle = async (query: string) => {
    let criteria = `q=${query}`;
    if (selectedWork != null) {
      criteria = `where=${JSON.stringify({
        title: { contains: query },
        works: { some: { id: selectedWork.id } },
      })}`;
    }
    const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));

    setIsSearchCycleLoading(true);
    const response = await fetch(`/api/search/cycles?${criteria}&include=${includeQP}`);
    const itemsCL: CycleDetail[] = await response.json();

    setSearchCycleResults(itemsCL);
    setIsSearchCycleLoading(false);
  };

  const handleSelectWorkOrCycle = (selected: SearchResult | null): void => {
    //console.log(selected, 'selected')

    const searchResult = selected;
    if (searchResult != null) {
      if (isCycleMosaicItem(searchResult)) {
        setSelectedCycle(searchResult);
      }
      if (isWorkMosaicItem(searchResult)) {
        setSelectedWork(searchResult);
        setSelectedCycle(null);
      }
    }
    else{
      setSelectedWork(null);
      setSelectedCycle(null);
    }

    

  };

  const handleSelectCycle = (selected: SearchResult | null): void => {
    const searchResult = selected as CycleDetail | null
    if (searchResult != null) {
      setSelectedCycle(searchResult);
      if (searchResult.access === 2)
        setIsPublic(false);
    }
  };

 /* const handleClearSelectedWork = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setSelectedWork(null);
  };

  const handleClearSelectedCycle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setSelectedCycle(null);
    setIsPublic(true);
    //if (formRef.current) formRef.current.isPublic.checked = true;
  };*/

  const formValidation = (payload: any) => {

    /*if (!payload.title.length) {
       toast.error( t(dict,'NotTitle'))
       return false;
     }else if (!imageFile) {
       toast.error( t(dict,'requiredEurekaImageError'))
       return false;
     }else if (!payload.contentText.length) {
       toast.error( t(dict,'NotContentText'))
       return false;
     }*/
    return true;
  };

  const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setSelectedCycle(null);
    setSelectedWork(null);
    setPostTitle('');
    setCurrentImg(undefined);
    if (editorRef.current)
      editorRef.current.setContent('');
    setItems([]);
    setTags('');


    /* if (formRef.current != null) {
       const form = formRef.current;
 
       form.cycleTitle.value = '';
       form.languages.value = '';
       form.startDate.value = '';
       form.endDate.value = '';
     }*/
  };

  const handleSubmit = async (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (!imageFile) {
      toast.error(t(dict,'requiredEurekaImageError'))
      return;
    }
    if (!selectedWork && !selectedCycle) {
      toast.error(t(dict,'requiredDiscussionItemError'))
      return;
    }

    const form = formRef.current;
    if (form && selectedWork != null) {
      const payload: CreatePostAboutWorkClientPayload = {
        selectedCycleId: selectedCycle != null ? selectedCycle.id : null,
        selectedWorkId: selectedWork.id,
        title: postTitle,
        image: imageFile!,
        language: languages[`${locale}`],
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: isPublic,//form.isPublic.checked,
        topics: items.join(','),
        tags,
      };
      //console.log(payload, 'payload')

      if (formValidation(payload))
        await execCreatePost(payload);
    } else if (form && selectedCycle != null) {
      const payload: CreatePostAboutCycleClientPayload = {
        selectedCycleId: selectedCycle.id,
        selectedWorkId: null,
        title: postTitle,
        image: imageFile!,
        language: languages[`${locale}`],
        contentText: editorRef.current?.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: isPublic,//form.isPublic.checked,
        topics: items.join(','),
        tags,
      };
      if (formValidation(payload))
        await execCreatePost(payload);
    }
  };

  useEffect(() => {
    if (isCreatePostSuccess === true && createdPost != null) {
      setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: false } });
      queryClient.invalidateQueries({queryKey:['posts.mosaic']});

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
  }, [createdPost, isCreatePostSuccess]);

  const labelKeyFn = (res: SearchResult) => {
    if ('title' in res)
      return `${res.title}`;
    return `${res.name}`;
  };

  const onGenerateCrop = (photo: File) => {
    setImageFile(() => photo);
    setCurrentImg(URL.createObjectURL(photo));
    //setChangingPhoto(true);
    setShowCrop(false);
  };

  const closeCrop = () => {
    setShowCrop(false);
  };

  const renderPhoto = () => {
    if (currentImg)
      return <Container className="my-4 d-flex justify-content-center">
        <img className={styles.selectedPhoto} src={currentImg} />
      </Container>
  };

  const onImageSelect = (photo: File, text: string) => {
    setImageFile(() => photo);
    setPostTitle(text)
  };

  const handleChangeUseCropSwith = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUSeCrop(event.target.checked);
    window.scroll(0, 0);
    setCurrentImg(undefined);
  };

  const handleChangeUseOtherFields = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUseOtherFields(event.target.checked);
    setSelectedCycle(null);
    setItems([]);
    setTags('');
  };

  return (
    <Form ref={formRef}>

      <ModalHeader closeButton={!noModal}>
        <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t(dict,'title')}</h1></ModalTitle>
      </ModalHeader>
      <ModalBody className=''>
        <section className='my-3'>
          {!useCrop && <Prompt onImageSelect={onImageSelect} searchtext={params?.searchtext} searchstyle={params?.searchstyle} />}
          <FormGroup className='mt-4 mb-4'>
            <FormControlLabel control={<Switch checked={useCrop} onChange={handleChangeUseCropSwith} />} label={t(dict,'showCrop')} />
          </FormGroup>
          {useCrop && <Col className='mb-4'>
            {!showCrop && (<><Button data-cy="image-load" className="btn-eureka w-100 px-2 px-lg-5 text-white" onClick={() => setShowCrop(true)}>
              {t(dict,'imageFieldLabel')}
            </Button>
              {currentImg && renderPhoto()}
            </>)}
            {showCrop && (
              <Col className='px-2 px-lg-5'>
                <div className='w-100 border p-3 '>
                  <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape='rect' />
                </div>

              </Col>
            )}
          </Col>}

        </section>

        {imageFile && <><Row className='d-flex flex-column px-2 px-lg-5'>
          <Col className='mb-4'>
            {/*<FormGroup controlId="workOrCycle">
                <FormLabel>*{t(dict,'searchCycleOrWorkFieldLabel')}</FormLabel>
                {selectedWork != null ? (
                  <div className={styles.searchResult}>
                    <WorkTypeaheadSearchItem work={selectedWork} />
                    <button onClick={handleClearSelectedWork} type="button" className={styles.discardSearchResult}>
                      <BsFillXCircleFill />
                    </button>
                  </div>
                ) : selectedCycle != null ? (
                  <div className={styles.searchResult}>
                    <CycleTypeaheadSearchItem cycle={selectedCycle} />
                    <button onClick={handleClearSelectedCycle} type="button" className={styles.discardSearchResult}>
                      <BsFillXCircleFill />
                    </button>
                  </div>
                ) : (
                  <>
                    <style jsx global>{`
                      .rbt-menu {
                        min-width: 300px;
                      }
                    `}</style>
                    <AsyncTypeahead
                      id="create-post--search-work-or-cycle"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      inputProps={{ required: true }}
                      placeholder={t(dict,'searchCycleOrWorkFieldPlaceholder')}
                      isLoading={isSearchWorkOrCycleLoading}
                      labelKey={labelKeyFn}
                      minLength={2}
                      onSearch={handleSearchWorkOrCycle}
                      options={searchWorkOrCycleResults}
                      onChange={handleSelectWorkOrCycle}
                      renderMenuItemChildren={(searchResult) => {
                        if (isCycleMosaicItem(searchResult)) {
                          return <CycleTypeaheadSearchItem cycle={searchResult} />;
                        }
                        if (isWorkMosaicItem(searchResult)) {
                          return <WorkTypeaheadSearchItem work={searchResult} />;
                        }
                        return null;
                      }}
                    />
                  </>
                )}
              </FormGroup> */}
            <AsyncTypeaheadMaterial item={(selectedWork) ? selectedWork : selectedCycle} searchType="all" onSelected={handleSelectWorkOrCycle}
              label={`*${t(dict,'searchCycleOrWorkFieldLabel')}`}
              helperText={`${t(dict,'searchCycleOrWorkFieldPlaceholder')}`} />
          </Col>
          <Col className='mb-4'>
            <FormGroup controlId="postTitle" >
              <TextField id="postTitle" className="w-100" label={t(dict,'titleFieldLabel')}
                variant="outlined" size="small" value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}>
              </TextField>
            </FormGroup>
          </Col>
        </Row>
          <FormGroup controlId="description" as={Col} className="mb-4 px-2 px-lg-5">
            <FormLabel>{t(dict,'descriptionFieldLabel')}</FormLabel>
            {/* @ts-ignore*/}
            <EditorCmp
              apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
              onInit={(_: any, editor) => {
                editorRef.current = editor;
              }}
              // initialValue={newEureka.contentText}
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
          <FormGroup className='mt-5 mb-4'>
            <FormControlLabel control={<Switch checked={useOtherFields} onChange={handleChangeUseOtherFields} />} label={t(dict,'showOthersFields')} />
          </FormGroup>
          {useOtherFields && <Row className='mt-5 px-2 px-lg-5 d-flex flex-column'>
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
                      placeholder={t(dict,'searchCycleFieldPlaceholder')}
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
                <AsyncTypeaheadMaterial item={selectedCycle} onSelected={handleSelectCycle} searchType="cycles"
                  workSelected={selectedWork}
                  label={`${t(dict,'searchCycleFieldLabel')}`}
                  helperText={`${t(dict,'searchCycleInfotip')}`} />
              </FormGroup>
            </Col>

            <Col className="mb-4">
              <FormGroup controlId="topics">
                <TagsInputTypeAheadMaterial
                  data={topics as {code:string,label:string}[]}
                  items={items}
                  setItems={setItems}
                  formatValue={(v: string) => t(dict,`topics:${v}`)}
                  max={3}
                  label={t(dict,'topicsPostLabel')}
                  placeholder={`${t(dict,'Type to add tag')}...`}
                />
              </FormGroup>
            </Col>
            <Col className="mb-4">
              <TagsInputMaterial tags={tags} setTags={setTags} label={t(dict,'topicsFieldLabel')} />
            </Col>
          </Row>}  </>}
      </ModalBody>
      <ModalFooter>
        <Row className='d-flex flex-column flex-lg-row'>
          <Container className="p-0 d-flex justify-content-end">
            <ButtonGroup className="py-4">
              <Button
                variant="warning"
                onClick={handleFormClear}
                className="text-white"
              >
                <ImCancelCircle />
              </Button>
              <Button disabled={isCreatePostLoading} onClick={(e) => { handleSubmit(e) }} className="btn-eureka" style={{ width: '12em' }}>
                <>
                  {t(dict,'submitButtonLabel')}
                  {isCreatePostLoading && (
                    <Spinner className="ms-2" animation="grow" variant="info" size="sm" />
                  )}
                </>
              </Button>
            </ButtonGroup>
          </Container>
        </Row>
      </ModalFooter>

    </Form>
  );
};

export default CreatePostForm;
