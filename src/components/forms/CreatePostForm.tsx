import { Post } from '@prisma/client';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
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
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { BsFillXCircleFill } from 'react-icons/bs';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { useMutation, useQueryClient } from 'react-query';
import TagsInput from './controls/TagsInput';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../../types';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload } from '../../types/post';
import { CycleMosaicItem } from '../../types/cycle';
import { WorkMosaicItem } from '../../types/work';
import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreatePostForm.module.css';
import useTopics from '../../useTopics';
import useWorks from '../../useWorks';
import { Session } from '@/src/types';
import { useSession } from 'next-auth/client';
import useUser from '@/src/useUser';
import { useNotificationContext } from '@/src/useNotificationProvider';

interface Props {
  noModal?: boolean;
}

const CreatePostForm: FunctionComponent<Props> = ({noModal = false}) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleMosaicItem[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleMosaicItem | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkMosaicItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [items, setItems] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const queryClient = useQueryClient();
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const [session] = useSession();
  const [userId, setUserId] = useState<number>();
  // const [workId, setWorkId] = useState<string | undefined>();
  const { data: work } = useWorks(router.query.id as string);
  const {data:user} = useUser(userId!,{
    enabled:!!userId
  });
  const {notifier} = useNotificationContext();
  useEffect(()=>{
    if(session){
      const user = (session as unknown as Session).user;
      setUserId(user.id);
    }
  },[session]);
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
    if (work) setSelectedWork(work as WorkMosaicItem);
  }, [work]);

  const { t } = useTranslation('createPostForm');

  const { data: topics } = useTopics();
  const [tags, setTags] = useState<string>('');
  const [postId, setPostId] = useState<number | undefined>();
  const {
    mutate: execCreatePost,
    data: createdPost,
    error: createPostError,
    isError: isCreatePostError,
    isLoading: isCreatePostLoading,
    isSuccess: isCreatePostSuccess,
    status,
  } = useMutation(
    async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

      let message = "";
      if(user && notifier){
        if(selectedWork)  {
          if(selectedCycle){
            message = `eurekaCreatedAboutWorkInCycle!|!${JSON.stringify({
              userName:user.name||'',
              workTitle:selectedWork.title,
              cycleTitle:selectedCycle.title
            })}`;
  
          }
          else{
            message = `eurekaCreatedAboutWork!|!${JSON.stringify({
              userName:user.name||'',
              workTitle:selectedWork.title
            })}`;
          }
        }
        else if(selectedCycle)
          message = `eurekaCreatedAboutCycle!|!${JSON.stringify({
            userName:user.name||'',
            cycleTitle:selectedCycle.title
          })}`;
  
        formData.append('notificationMessage', message);
        formData.append('notificationContextURL', router.asPath);
        formData.append('notificationToUsers', user.followedBy.map(u=>u.id).join(','));

      }

      const res = await fetch('/api/post', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setPostId(json.id);
        if(notifier && user)
          notifier.notify({
            data:{message},
            toUsers: user?.followedBy.map(u=>u.id)
          })
        return json.post;
      }
      //TODO toast with error to the user
      return null;
    },
    {
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
          if (context) queryClient.invalidateQueries(ck);
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
    const itemsCL: CycleMosaicItem[] = await response.json();

    setSearchCycleResults(itemsCL);
    setIsSearchCycleLoading(false);
  };

  const handleSelectWorkOrCycle = (selected: SearchResult[]): void => {
    const searchResult = selected[0];
    if (searchResult != null) {
      if (isCycleMosaicItem(searchResult)) {
        setSelectedCycle(searchResult);
        if (formRef.current) formRef.current.isPublic.checked = searchResult.access === 1;
      }
      if (isWorkMosaicItem(searchResult)) {
        setSelectedWork(searchResult);
      }
    }
  };

  const handleSelectCycle = (selected: CycleMosaicItem[]): void => {
    const searchResult = selected[0];
    if (searchResult != null) {
      setSelectedCycle(searchResult);
    }
  };

  const handleClearSelectedWork = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    setSelectedWork(null);
  };

  const handleClearSelectedCycle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    setSelectedCycle(null);
    if (formRef.current) formRef.current.isPublic.checked = true;
  };

  const handleSubmit = async (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    if (imageFile == null) {
      return;
    }

    const form = formRef.current;
    if (form && selectedWork != null) {
      const payload: CreatePostAboutWorkClientPayload = {
        selectedCycleId: selectedCycle != null ? selectedCycle.id : null,
        selectedWorkId: selectedWork.id,
        title: form.postTitle.value,
        image: imageFile,
        language: form.language.value,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: form.isPublic.checked,
        topics: items.join(','),
        tags,
      };
      await execCreatePost(payload);
    } else if (form && selectedCycle != null) {
      const payload: CreatePostAboutCycleClientPayload = {
        selectedCycleId: selectedCycle.id,
        selectedWorkId: null,
        title: form.postTitle.value,
        image: imageFile,
        language: form.language.value,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: form.isPublic.checked,
        topics: items.join(','),
        tags,
      };
      await execCreatePost(payload);
    }
  };

  useEffect(() => {
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
  }, [createdPost, isCreatePostSuccess]);

  const labelKeyFn = (res: SearchResult) => {
    if ('title' in res)
      return `${res.title}`;
    return `${res.name}`;
  };

  return (
    <Form ref={formRef}>
      <ModalHeader closeButton={!noModal}>
         <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('title')}</h1></ModalTitle>
      </ModalHeader>

      <ModalBody>
          <Row className='d-flex flex-column flex-lg-row'>
            <Col className='mb-4'>
              <FormGroup controlId="workOrCycle">
                <FormLabel>*{t('searchCycleOrWorkFieldLabel')}</FormLabel>
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
                    {/* language=CSS */}
                    <style jsx global>{`
                      .rbt-menu {
                        background-color: #d0f7ed;
                        min-width: 468px;
                      }
                    `}</style>
                    <AsyncTypeahead
                      id="create-post--search-work-or-cycle"
                      // Bypass client-side filtering. Results are already filtered by the search endpoint
                      filterBy={() => true}
                      inputProps={{ required: true }}
                      placeholder={t('searchCycleOrWorkFieldPlaceholder')}
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
              </FormGroup>
            </Col>
              <Col className='mb-4'>
              <FormGroup controlId="postTitle" >
                <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                <FormControl type="text" maxLength={80} required />
              </FormGroup>
            </Col>
          </Row>
          <Row>
              <Col className='mb-4'>
              <ImageFileSelect acceptedFileTypes="image/*" file={imageFile} setFile={setImageFile} required>
                {(imagePreview) => (
                  <FormGroup>
                    <FormLabel>*{t('imageFieldLabel')}</FormLabel>
                    <div className={styles.imageControl}>
                      {(imageFile != null && imagePreview) != null ? (
                        <span className={styles.imageName}>{imageFile?.name}</span>
                      ) : (
                        t('imageFieldPlaceholder')
                      )}
                      {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
                    </div>
                  </FormGroup>
                )}
              </ImageFileSelect>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <FormGroup controlId="language" >
                <FormLabel>*{t('languageFieldLabel')}</FormLabel>
                <LanguageSelect />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={{ span: 6 }} className="mb-4">
              <FormGroup controlId="workOrCycle">
                <FormLabel>{t('searchCycleFieldLabel')}</FormLabel>
                {!selectedCycle ? (
                  <>
                    {/* language=CSS */}
                    <style jsx global>{`
                      .rbt-menu {
                        background-color: #d0f7ed;
                        min-width: 468px;
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
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col  className="mb-4">
              <small style={{ color: 'lightgrey', position: 'relative', top: '-0.75rem' }}>
                {t('searchCycleInfotip')}
              </small>
            </Col>
          </Row>
          <Row>
            <Col  className="mb-4">
              <FormGroup controlId="topics">
                <FormLabel>{t('topicsPostLabel')}</FormLabel>
                <TagsInputTypeAhead
                  data={topics}
                  items={items}
                  setItems={setItems}
                  labelKey={(res) => t(`topics:${res.code}`)}
                  max={3}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <TagsInput tags={tags} setTags={setTags} label={t('topicsFieldLabel')}/>
            </Col>
          </Row>
          <Row>
            <FormGroup controlId="description" as={Col}  className="mb-4">
              <FormLabel>*{t('descriptionFieldLabel')}</FormLabel>
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
            </FormGroup>
          </Row>
      </ModalBody>

      <ModalFooter>
        <Container className="py-3">
            <Row className='d-flex flex-column flex-lg-row'>
            <Col className="border-end border-info mb-4">
              <FormCheck type="checkbox" defaultChecked inline id="isPublic" label={t('isPublicFieldLabel')} />
              <small style={{ color: 'lightgrey', display: 'block', margin: '0.25rem 0 0 1.25rem' }}>
                {t('isPublicInfotip')}
              </small>
            </Col>
            <Col className="mb-4">
              <Button variant="primary" disabled={isCreatePostLoading} onClick={(e)=>{handleSubmit(e)}} className="w-100 text-white">
                {t('submitButtonLabel')}
                {isCreatePostLoading ? (
                  <Spinner animation="grow" variant="info" size="sm" />
                ) : (
                  <span className={styles.placeholder} />
                )}
                {isCreatePostError && createPostError}
              </Button>
            </Col>
          </Row>
        </Container>
      </ModalFooter>
    </Form>
  );
};

export default CreatePostForm;
