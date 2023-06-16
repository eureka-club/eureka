import { Post } from '@prisma/client';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent, ChangeEvent, RefObject, useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
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
import { CycleMosaicItem } from '../../types/cycle';
import { WorkMosaicItem } from '../../types/work';
// import ImageFileSelect from './controls/ImageFileSelect';
import LanguageSelect from './controls/LanguageSelect';
import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
import globalModalsAtom from '../../atoms/globalModals';
import styles from './CreatePostForm.module.css';
import useTopics from '../../useTopics';
import usePost from '../../usePost';
import editOnSmallerScreens from '../../atoms/editOnSmallerScreens';
import toast from 'react-hot-toast'
import { Alert } from 'react-bootstrap';
interface Props {
  noModal?: boolean;
  cacheKey?:string[]
  id:number;
}

const EditPostForm: FunctionComponent<Props> = ({noModal = false,id}) => {
  const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
  const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
  const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
  const [searchCycleResults, setSearchCycleResults] = useState<CycleMosaicItem[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<CycleMosaicItem | null>(null);
  const [selectedWork, setSelectedWork] = useState<WorkMosaicItem | null>(null);
  const { data: topics } = useTopics();

  const [items, setItems] = useState<string[]>([]);

  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
  const queryClient = useQueryClient();
  const router = useRouter();
  const { t } = useTranslation('createPostForm');

  const [postId, setPostId] = useState<string>('');
  const [ck,setCK] = useState<string[]>();
  const editorRef = useRef<any>(null);
  const [language, setLanguage] = useState<string>('');
  //const [remove,setRemove] = useState<boolean>(false);
  const [editPostOnSmallerScreen,setEditPostOnSmallerScreen] = useAtom(editOnSmallerScreens);

  
  const { data: post, isLoading, isFetching } = usePost(id);
  useEffect(()=>{
    if (post && post.topics?.length){
      for(let topic of post.topics.split(',')){
          if(!items.includes(topic))
            items.push(...post.topics.split(','));
      }
    }
    if (post && post.works.length) setSelectedWork(post.works[0] as WorkMosaicItem);
    if (post && post.cycles.length) setSelectedCycle(post.cycles[0] as CycleMosaicItem);
    if(post && post.language) setLanguage(post.language);
  },[post])
    

  const {
    mutate: execEditPost,
    data: editPost,
    error: createPostError,
    isError: isEditPostError,
    isLoading: isEditPostLoading,
    isSuccess: isEditPostSuccess,
  } = useMutation(
    async (payload: EditPostAboutCycleClientPayload | EditPostAboutWorkClientPayload): Promise<Post> => {
      const res = await fetch(`/api/post/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      console.log(res,'res')
      if(res.ok){
        handleEditPostOnSmallerScreenClose();
         toast.success( t('PostEdited'));
         router.push(`/${selectedCycle?'cycle':'work'}/${selectedCycle?selectedCycle.id:selectedWork!.id}/post/${post!.id}`)
      }
      return res.json();
    },
    {
      onMutate: async (variables) => {
         if (post) {
            const ck_ = ck||['POST',`${post.id}`];
            await queryClient.cancelQueries(ck_)
            const snapshot = queryClient.getQueryData<PostMosaicItem[]|PostMosaicItem>(ck_)
            const {title,contentText} = variables;
            if(snapshot){
              let posts = [];
              if(('length' in snapshot)){
                posts = [...snapshot] as PostMosaicItem[];                  
                const idx = posts.findIndex(p=>p.id == +postId)
                if(idx >- 1){
                  const oldPost = posts[idx];
                  const newPost = {
                    ...oldPost,
                    contentText: contentText??oldPost.contentText,
                    title: title??oldPost.title,
                  }
                  posts.splice(idx,1,newPost);
                  queryClient.setQueryData(ck_, [...posts]);
                }
              }
              else 
                queryClient.setQueryData(ck_,{...snapshot,title,contentText});
              
              return { snapshot, ck:ck_ };
            }
            // const ck = [`POST`, `${globalModalsState.editPostId || post.id}`];
          }
          handleEditPostOnSmallerScreenClose();
        
        // return { snapshot: null, ck: '' };
      },
      onSettled: (_post, error, _variables, context) => {
        if (error){
          queryClient.invalidateQueries(ck);
          queryClient.invalidateQueries(['POST',`${postId}`]);
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
      console.log(res,'res')
      if(res.ok){
        handleEditPostOnSmallerScreenClose();
        toast.success( t('PostRemoved'));
        console.log(`/${selectedCycle?'cycle':'work'}/${selectedCycle?selectedCycle.id:selectedWork!.id}`)
        router.push(`/${selectedCycle?'cycle':'work'}/${selectedCycle?selectedCycle.id:selectedWork!.id}`)
      }
      return res.json();
    },
    {
      onMutate: async (variables) => {
         if (post) {
            const ck_ = ck||['POST',`${post.id}`];
            await queryClient.cancelQueries(ck_)
            const snapshot = queryClient.getQueryData<PostMosaicItem[]|PostMosaicItem>(ck_)
            const {title,contentText} = variables;
            if(snapshot){
              let posts = [];
              if(('length' in snapshot)){
                posts = [...snapshot] as PostMosaicItem[];                  
                const idx = posts.findIndex(p=>p.id == +postId)
                if(idx >- 1){
                  const oldPost = posts[idx];
                  const newPost = {
                    ...oldPost,
                    contentText: contentText??oldPost.contentText,
                    title: title??oldPost.title,
                  }
                  posts.splice(idx,1,newPost);
                  queryClient.setQueryData(ck_, [...posts]);
                }
              }
              else 
                queryClient.setQueryData(ck_,{...snapshot,title,contentText});
              
              return { snapshot, ck:ck_ };
            }
            // const ck = [`POST`, `${globalModalsState.editPostId || post.id}`];
          }
          handleEditPostOnSmallerScreenClose();
        
        // return { snapshot: null, ck: '' };
      },
      onSettled: (_post, error, _variables, context) => {
        if (error){
          queryClient.invalidateQueries(ck);
          queryClient.invalidateQueries(['POST',`${postId}`]);
        }
        // this make the page to do a refresh
        queryClient.invalidateQueries(ck);
        // queryClient.invalidateQueries(['POST',postId]);
        
      },
    },
  );

  const handleEditPostOnSmallerScreenClose = () => {
        setEditPostOnSmallerScreen({ ...editOnSmallerScreens, ...{ value: false } });
  };

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
       // if (formRef.current) formRef.current.isPublic.checked = searchResult.access === 1;
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
   // if (formRef.current) formRef.current.isPublic.checked = true;
  };

    const handleRemove = async (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    const payload: EditPostAboutWorkClientPayload = {
        id: globalModalsState.editPostId ? globalModalsState.editPostId.toString() : router.query.postId as string,
        selectedCycleId: selectedCycle != null ? selectedCycle.id : null,
        selectedWorkId: selectedWork != null ? selectedWork.id : undefined,
        title: '',
        // image: imageFile,
        language: '',
        contentText: '', // form.description.value.length ? form.description.value : null,
        isPublic: false,
        topics: '',
      }; 
      console.log(payload,'payload') 
    await execDeletePost(payload);

    }

  const formValidation = (payload:any) => {
    if (!payload.title.length) {
      toast.error( t('NotTitle'))
      return false;
    }else if (!payload.language.length) {
      toast.error( t('NotLanguage'))
      return false;
    }else if (!payload.contentText.length) {
      toast.error( t('NotContentText'))
      return false;
    }
    return true;
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
        language: language,
        contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
        isPublic: post?.isPublic,
        topics: items.join(','),
      };
      if(formValidation(payload))
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
        isPublic: post ? post.isPublic : false,
        topics: items.join(','),
      };
      if(formValidation(payload))
         await execEditPost(payload);
    }
    else
       toast.error( t('NotAboutItem'))
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

  const onSelectLanguage = (language: string) => {
    setLanguage(language)
  };

  if (isLoading || isFetching || !post) return <Spinner animation="grow" variant="info" size="sm" />;
  return (
    post ? (
      <Form onSubmit={handleSubmit} ref={formRef}>
        {/* <ModalHeader closeButton={!noModal}>
          <Container>
            <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('titleEdit')}</h1></ModalTitle>
          </Container>
        </ModalHeader> */}

        {/* <ModalBody> */}
          <Container>
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
                          min-width: 300px;
                        }
                      `}</style>
                      <AsyncTypeahead
                        id="create-post--search-work-or-cycle"
                        // Bypass client-side filtering. Results are already filtered by the search endpoint
                        filterBy={() => true}
                        inputProps={{ required: false}}
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
                <FormGroup controlId="postTitle">
                  <FormLabel>*{t('titleFieldLabel')}</FormLabel>
                  <FormControl type="text" maxLength={80} onChange={handlerchange} defaultValue={post.title} />
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
              <Col className='mb-4'>
                <FormGroup controlId="language">
                  <FormLabel>*{t('languageFieldLabel')}</FormLabel>
                <LanguageSelect onSelectLanguage={onSelectLanguage} defaultValue={language} label={t('languageFieldLabel')} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={{ span: 6 }} className='mb-4'>
                <FormGroup controlId="workOrCycle">
                  <FormLabel>{t('searchCycleFieldLabel')}</FormLabel>
                  {!selectedCycle ? (
                    <>
                      {/* language=CSS */}
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
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col className='mb-4'>
                <small style={{ color: 'lightgrey', position: 'relative', top: '-0.75rem' }}>
                  {t('searchCycleInfotip')}
                </small>
              </Col>
            </Row>
            <Row>
              <Col className='mb-4'>
                <FormGroup controlId="topics">
                  <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel>
                  <TagsInputTypeAhead
                    data={topics}
                    items={items}
                    setItems={setItems}
                    labelKey={(res) => t(`topics:${res.code}`)}
                    formatValue={(v: string) => t(`topics:${v}`)} 
                    placeholder={`${t('Type to add tag')}...`}
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
                {/* @ts-ignore*/}
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
                    forced_root_block : "div",   
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
        {/* </ModalBody> */}

        {/* <ModalFooter>
            
                <FormCheck
                      type="checkbox"
                      defaultChecked={remove}
                      onChange={()=>setRemove(!remove)}
                      className="text-danger"
                      id="removePost"
                      label={t('common:Remove')}
                    /> */}
               
                <Row>
            <Col className='d-flex justify-content-end  py-5'>
             <Button
               variant="warning"
               disabled={isDeletePostLoading}
                onClick={handleRemove}
                className="text-white  me-3"
                style={{ width: '10em' }}
              >
                <>
                {t('resetBtnLabel')}
                 {isDeletePostLoading && (
                      <Spinner size="sm" animation="grow" variant="secondary" className={`ms-2 ${styles.loadIndicator}`}/>
                    )}</>
              </Button>
                <Button disabled={isEditPostLoading} type="submit" className="btn-eureka" style={{ width: '10em' }}>
                  <>
                    {t('titleEdit')}
                    {isEditPostLoading && (
                      <Spinner size="sm" animation="grow" variant="secondary" className={`ms-2 ${styles.loadIndicator}`}/>
                    )}
                  </>
                </Button>
                </Col>
                </Row>
          </Container>
              
        {/* </ModalFooter> */}
      </Form>
    )
    : <Alert variant="warning">Not Found</Alert>
  );
};

export default EditPostForm;
