import { Post } from '@prisma/client';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent, ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';
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
import { useMutation, useQueryClient } from 'react-query';
import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../../types';
import { EditPostAboutCycleClientPayload, EditPostAboutWorkClientPayload, PostMosaicItem } from '../../types/post';
import { CycleWithImages, CycleMosaicItem } from '../../types/cycle';
import { WorkWithImages } from '../../types/work';
// import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreatePostForm.module.css';
import useTopics from '../../useTopics';
import usePost from '../../usePost';
import { setDefaultResultOrder } from 'dns';

const EditPostForm: FunctionComponent = () => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleMosaicItem[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleWithImages | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkWithImages | null>(null);
  // const [post, setPost] = useState<PostMosaicItem | null>(null);
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const { data: topics } = useTopics();

  const [items, setItems] = useState<string[]>([]);

  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('createPostForm');

  const [postId, setPostId] = useState<string>('');
  const { data: post, isLoading, isFetching } = usePost(globalModalsState.editPostId || +postId);
  const editorRef = useRef<any>(null);
  const [remove,setRemove] = useState(false);

  useEffect(() => {
    // const fetchPost = async () => {
    //   const res: Response = await fetch(`/api/post/${router.query.postId}`);
    //   const { status, post: p = null } = await res.json();

    //   if (status === 'OK') {
    //     setPost(p);
    //     if (p.works.length) setSelectedWork(p.works[0]);
    //     if (p.cycles.length) setSelectedCycle(p.cycles[0]);
    //   }
    // };
    // fetchPost();
    if(globalModalsState.editPostId)
      setPostId(router.query.postId as string);
    else if (router.query) {
      setPostId(router.query.postId as string);
    }
  }, [globalModalsState,router.query]);

  useEffect(() => {
    if (post) {
      if (post.topics) items.push(...post.topics.split(','));
      if (post.works.length) setSelectedWork(post.works[0]);
      if (post.cycles.length) setSelectedCycle(post.cycles[0]);
    }
  }, [post]);

  const {
    mutate: execEditPost,
    data: editPost,
    error: createPostError,
    isError: isEditPostError,
    isLoading: isEditPostLoading,
    isSuccess: isEditPostSuccess,
  } = useMutation(
    async (payload: EditPostAboutCycleClientPayload | EditPostAboutWorkClientPayload): Promise<Post> => {
      const res = await fetch(`/api/post/${globalModalsState.editPostId || router.query.postId}`, {
        method: remove?'DELETE':'PATCH',
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    {
      onMutate: async (variables) => {
        if (post) {
          const ck = [`POST`, `${globalModalsState.editPostId || post.id}`];
          const snapshot = queryClient.getQueryData<PostMosaicItem>(ck);
          queryClient.setQueryData(ck, { ...snapshot, ...variables });
          return { snapshot, ck };
        }
        return { snapshot: null, ck: '' };
      },
      onSettled: (_post, error, _variables, context) => {
        const ctx = context as { snapshot: PostMosaicItem; ck: string[] };
        if (context) {
          if (error) queryClient.setQueryData(ctx.ck, ctx.snapshot);
          queryClient.invalidateQueries(ctx.ck);
          if(ctx.snapshot.cycles){
            const cycle = ctx.snapshot.cycles[0];
            queryClient.invalidateQueries(['CYCLE',`${cycle.id}`]);
          }

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
    const itemsSCL: CycleMosaicItem[] = await response.json();

    setSearchCycleResults(itemsSCL);
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

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    // if (imageFile == null) {
    //   return;
    // }

    const form = ev.currentTarget;
    if (selectedWork != null) {
      const payload: EditPostAboutWorkClientPayload = {
        id: globalModalsState.editPostId ? globalModalsState.editPostId.toString() : router.query.postId as string,
        selectedCycleId: selectedCycle != null ? selectedCycle.id : null,
        selectedWorkId: selectedWork.id,
        title: form.postTitle.value,
        // image: imageFile,
        language: form.language.value,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: form.isPublic.checked,
        topics: items.join(','),
      };
      await execEditPost(payload);
    } else if (selectedCycle != null) {
      const payload: EditPostAboutCycleClientPayload = {
        id: globalModalsState.editPostId ? globalModalsState.editPostId.toString() : router.query.postId as string,
        selectedCycleId: selectedCycle.id,
        selectedWorkId: null,
        title: form.postTitle.value,
        // image: imageFile,
        language: form.language.value,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: form.isPublic.checked,
        topics: items.join(','),
      };
      await execEditPost(payload);
    }
  };

  useEffect(() => {
    if (isEditPostSuccess === true && editPost != null) {
      setGlobalModalsState({ ...globalModalsState, ...{ editPostModalOpened: false, editPostId:undefined } });
      // queryClient.invalidateQueries(['POST',`${globalModalsState.editPostId || router.query.postId}`]);

      /* if (selectedWork != null) {
        router.push(`/work/${selectedWork.id}/post/${router.query.postId}`);
        return;
      }
      if (selectedCycle != null) {
        router.push(`/cycle/${selectedCycle.id}/post/${router.query.postId}`);
      } */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPost, isEditPostSuccess]);

  const handlerchange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (post && ev.currentTarget.id in post) {
      const p: PostMosaicItem & { [key: string]: unknown } = post;
      p[ev.currentTarget.id] = ev.currentTarget.value;
      // setPost(p);
    }
  };
  const labelKeyFn = (res: SearchResult) => {
    if ('title' in res)
      return `${res.title}`;
    return `${res.name}`;
  };

  if (isLoading || isFetching || !post) return <Spinner animation="grow" variant="info" size="sm" />;

  return (
    post && (
      <Form onSubmit={handleSubmit} ref={formRef}>
        <ModalHeader closeButton>
          <Container>
            <ModalTitle>{t('titleEdit')}</ModalTitle>
          </Container>
        </ModalHeader>

        <ModalBody>
          <Container>
            <Row>
              <Col>
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
              <Col>
                <FormGroup controlId="postTitle">
                  <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                  <FormControl type="text" maxLength={80} required onChange={handlerchange} defaultValue={post.title} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              {/* <Col>
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
            </Col> */}
              <Col>
                <FormGroup controlId="language">
                  <FormLabel>*{t('languageFieldLabel')}</FormLabel>
                  <LanguageSelect defaultValue={post.language} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={{ span: 6 }}>
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
              <Col>
                <small style={{ color: 'lightgrey', position: 'relative', top: '-0.75rem' }}>
                  {t('searchCycleInfotip')}
                </small>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup controlId="topics">
                  <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel>
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
              <FormGroup controlId="description" as={Col}>
                <FormLabel>*{t('descriptionFieldLabel')}</FormLabel>
                {/* <FormControl
                  as="textarea"
                  rows={6}
                  maxLength={4000}
                  required
                  defaultValue={post.contentText}
                  onChange={handlerchange}
                /> */}
                <EditorCmp
                  apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
                  onInit={(_: any, editor) => {
                    editorRef.current = editor;
                  }}
                  initialValue={post.contentText}
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
          </Container>
        </ModalBody>

        <ModalFooter>
          <Container className="py-3">
            <Row>
              <Col>
                <FormCheck
                  type="checkbox"
                  defaultChecked={post.isPublic}
                  onChange={handlerchange}
                  inline
                  id="isPublic"
                  label={t('isPublicFieldLabel')}
                />
                <small style={{ color: 'lightgrey', display: 'block', margin: '0.25rem 0 0 1.25rem' }}>
                  {t('isPublicInfotip')}
                </small>
                <FormCheck
                      type="checkbox"
                      defaultChecked={remove}
                      onChange={()=>setRemove(!remove)}
                      className="text-danger"
                      id="removePost"
                      label={t('common:Remove')}
                    />
              </Col>
              <Col style={{ borderLeft: '1px solid lightgrey' }}>
                <Button variant="primary" disabled={isEditPostLoading} type="submit" className="ps-5 pe-4 float-right">
                  {t('titleEdit')}
                  {isEditPostLoading ? (
                    <Spinner size="sm" animation="grow" variant="secondary" className={styles.loadIndicator} />
                  ) : (
                    <span className={styles.placeholder} />
                  )}
                  {isEditPostError && createPostError}
                </Button>
              </Col>
            </Row>
          </Container>
        </ModalFooter>
      </Form>
    )
  );
};

export default EditPostForm;
