// import { Post } from '@prisma/client';
// import { useAtom } from 'jotai';
// import { useRouter } from 'next/router';
// import useTranslation from 'next-translate/useTranslation';
// import { FormEvent, FunctionComponent, MouseEvent, RefObject, useEffect, useRef, useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import Col from 'react-bootstrap/Col';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import FormCheck from 'react-bootstrap/FormCheck';
// import FormControl from 'react-bootstrap/FormControl';
// import FormGroup from 'react-bootstrap/FormGroup';
// import FormLabel from 'react-bootstrap/FormLabel';
// import ModalBody from 'react-bootstrap/ModalBody';
// import ModalFooter from 'react-bootstrap/ModalFooter';
// import ModalHeader from 'react-bootstrap/ModalHeader';
// import ModalTitle from 'react-bootstrap/ModalTitle';
// import Row from 'react-bootstrap/Row';
// import Spinner from 'react-bootstrap/Spinner';
// import { AsyncTypeahead } from 'react-bootstrap-typeahead';
// import { BsFillXCircleFill } from 'react-icons/bs';
// import { Editor as EditorCmp } from '@tinymce/tinymce-react';
// import { useMutation, useQueryClient } from 'react-query';
// import TagsInput from './controls/TagsInput';
// import TagsInputTypeAhead from './controls/TagsInputTypeAhead';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
// import { SearchResult, isCycleMosaicItem, isWorkMosaicItem } from '../../types';
// import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload } from '../../types/post';
// import { CycleSumary } from '../../types/cycle';
// import { WorkSumary } from '../../types/work';
// import CycleTypeaheadSearchItem from '../cycle/TypeaheadSearchItem';
// import WorkTypeaheadSearchItem from '../work/TypeaheadSearchItem';
// import globalModalsAtom from '../../atoms/globalModals';
// import styles from './CreatePostForm.module.css';
// import useTopics from '../../useTopics';
// import useWork from '../../useWorkDetail';
// import { useSession } from 'next-auth/react';
// import useUser from '@/src/useUser';
// import useUsers from '@/src/useUsers'
// import { useNotificationContext } from '@/src/useNotificationProvider';
// import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
// import toast from 'react-hot-toast'
// import { ImCancelCircle } from 'react-icons/im';
// /* ESTE FICHERO NO SE ESTA USANDO desde la incorporacion de dall-e*/
// interface Props {
//   noModal?: boolean;
// }

// const whereCycleParticipants = (id:number)=>({
//   where:{
//     OR:[
//       {cycles: { some: { id } }},//creator
//       {joinedCycles: { some: { id } }},//participants
//     ],
//   } 
// });
// const CreatePostForm: FunctionComponent<Props> = ({noModal = false}) => {
//   const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
//   const [isSearchWorkOrCycleLoading, setIsSearchWorkOrCycleLoading] = useState(false);
//   const [isSearchCycleLoading, setIsSearchCycleLoading] = useState(false);
//   const [searchWorkOrCycleResults, setSearchWorkOrCycleResults] = useState<SearchResult[]>([]);
//   const [searchCycleResults, setSearchCycleResults] = useState<CycleSumary[]>([]);
//   const [selectedCycle, setSelectedCycle] = useState<CycleSumary | null>(null);
//   const [selectedWork, setSelectedWork] = useState<WorkSumary | null>(null);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [items, setItems] = useState<string[]>([]);
//   const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;
//   const [showCrop, setShowCrop] = useState<boolean>(false);
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const editorRef = useRef<any>(null);
//   const {data:session} = useSession();
//   const [userId, setUserId] = useState<number>();
//   const [workId, setWorkId] = useState<string>('');
//   const [isPublic, setIsPublic] = useState<boolean>(true);
//   //const [photo, setPhoto] = useState<File>();
//   const [currentImg, setCurrentImg] = useState<string | undefined>();

//   useEffect(() => {
//     if (router && router.query?.id) {
//       setWorkId(router.query.id.toString());
//     }
//   },[router])
//   const { data: work } = useWork(+workId,
//   //    {
//   //   enabled:!!workId
//   // }
// );

//   const {data:user} = useUser(userId!,{
//     enabled:!!userId
//   });

//   const { data: participants,isLoading:isLoadingParticipants } = useUsers(selectedCycle ?whereCycleParticipants(selectedCycle.id):{},
//     {
//       enabled:!!selectedCycle
//     }
//   )

//   const {notifier} = useNotificationContext();
//   useEffect(()=>{
//     if(session){
//       const user = session.user;
//       setUserId(user.id);
//     }
//   },[session]);
//   // useEffect(() => {
//   //   if (router) {
//   //     const routeValues = router.route.split('/').filter((i) => i);
//   //     if (routeValues.length) {
//   //       if (routeValues[0] === 'work') {
//   //         setWorkId(router.query.id as string);
//   //       }
//   //     }
//   //   }
//   // }, [router, router.query.id]);

//   useEffect(() => {
//     if (work) setSelectedWork(work as unknown as WorkSumary);
//   }, [work]);

//   const { t } = useTranslation('createPostForm');

//   const { data: topics } = useTopics();
//   const [tags, setTags] = useState<string>('');
//   const [postId, setPostId] = useState<number | undefined>();
//   const {
//     mutate: execCreatePost,
//     data: createdPost,
//     error: createPostError,
//     isError: isCreatePostError,
//     isLoading: isCreatePostLoading,
//     isSuccess: isCreatePostSuccess,
//     status,
//   } = useMutation(
//     async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
//       const formData = new FormData();
//       Object.entries(payload).forEach(([key, value]) => {
//         if (value != null) {
//           formData.append(key, value);
//         }
//       });

//       let message = "";
//       let notificationContextURL = router.asPath
//       let notificationToUsers:number[];
//       if(user && notifier){
//         notificationToUsers = user.followedBy.map(u=>u.id)
//         if(selectedWork)  {
//           notificationContextURL = `/work/${selectedWork.id}/post`
//           if(selectedCycle){
//             message = `eurekaCreatedAboutWorkInCycle!|!${JSON.stringify({
//               userName:user.name||'',
//               workTitle:selectedWork.title,
//               cycleTitle:selectedCycle.title
//             })}`;
//             notificationToUsers = (participants||[]).filter(p=>p.id!==user.id).map(p=>p.id);
//             if(user.id !== selectedCycle.creator.id)
//               notificationToUsers.push(selectedCycle.creator.id)
//           }
//           else{
//             message = `eurekaCreatedAboutWork!|!${JSON.stringify({
//               userName:user.name||'',
//               workTitle:selectedWork.title
//             })}`;
//           }
//         }
//         else if(selectedCycle){
//           notificationContextURL = `/cycle/${selectedCycle.id}/post`
//           message = `eurekaCreatedAboutCycle!|!${JSON.stringify({
//             userName:user.name||'',
//             cycleTitle:selectedCycle.title
//           })}`;
//           notificationToUsers = (participants||[]).filter(p=>p.id!==user.id).map(p=>p.id);
//           if(user.id !== selectedCycle.creator.id)
//             notificationToUsers.push(selectedCycle.creator.id)
//         }
  
//         formData.append('notificationMessage', message);
//         formData.append('notificationContextURL', notificationContextURL);
//         formData.append('notificationToUsers', notificationToUsers.join(','));

//       }

//       const res = await fetch('/api/post', {
//         method: 'POST',
//         body: formData,
//       });

//       if (res.ok) {
//         const json = await res.json();
//         setPostId(json.id);
//         if(notifier && user)
//           notifier.notify({
//             data:{message},
//             toUsers: user?.followedBy.map(u=>u.id)
//           })
//          toast.success( t('postCreated'))
//         return json.post;
//       }
//       //TODO toast with error to the user
//       return null;
//     },
//     {
//       onMutate: async () => {
//         if (selectedCycle) {
//           const cacheKey = ['CYCLE', `${selectedCycle.id}`]
//           const snapshot = queryClient.getQueryData(cacheKey);
//           return { cacheKey, snapshot };
//         }
//         return { cacheKey: undefined, snapshot: null };
//       },
//       onSettled: (_comment, error, _variables, context) => {
//         if (context) {
//           const { cacheKey: ck, snapshot } = context;
//           if (error && ck) {
//             queryClient.setQueryData(ck, snapshot);
//           }
//           if (context) queryClient.invalidateQueries(ck);
//         }
//       },
//     },
//   );

//   const handleSearchWorkOrCycle = async (query: string) => {
//     setIsSearchWorkOrCycleLoading(true);

//     const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));
//     const response = await fetch(`/api/search/works-or-cycles?q=${query}&include=${includeQP}`);
//     const itemsSWC: SearchResult[] = await response.json();

//     setSearchWorkOrCycleResults(itemsSWC);
//     setIsSearchWorkOrCycleLoading(false);
//   };

//   const handleSearchCycle = async (query: string) => {
//     let criteria = `q=${query}`;
//     if (selectedWork != null) {
//       criteria = `where=${JSON.stringify({
//         title: { contains: query },
//         works: { some: { id: selectedWork.id } },
//       })}`;
//     }
//     const includeQP = encodeURIComponent(JSON.stringify({ localImages: true }));

//     setIsSearchCycleLoading(true);
//     const response = await fetch(`/api/search/cycles?${criteria}&include=${includeQP}`);
//     const itemsCL: CycleSumary[] = await response.json();

//     setSearchCycleResults(itemsCL);
//     setIsSearchCycleLoading(false);
//   };

//   const handleSelectWorkOrCycle = (selected: SearchResult[]): void => {
//     const searchResult = selected[0];
//     if (searchResult != null) {
//       if (isCycleMosaicItem(searchResult)) {
//         setSelectedCycle(searchResult);
//       }
//       if (isWorkMosaicItem(searchResult)) {
//         setSelectedWork(searchResult);
//       }
//     }
//   };

//   const handleSelectCycle = (selected: CycleSumary[]): void => {
//     const searchResult = selected[0];
//     if (searchResult != null) {
//       setSelectedCycle(searchResult);
//       if(searchResult.access === 2)
//       setIsPublic(false);
//     }
//   };

//   const handleClearSelectedWork = (ev: MouseEvent<HTMLButtonElement>) => {
//     ev.preventDefault();

//     setSelectedWork(null);
//   };

//   const handleClearSelectedCycle = (ev: MouseEvent<HTMLButtonElement>) => {
//     ev.preventDefault();
//     setSelectedCycle(null);
//     setIsPublic(true);
//     //if (formRef.current) formRef.current.isPublic.checked = true;
//   };

//    const formValidation = (payload:any) => {
  
//    if (!payload.title.length) {
//       toast.error( t('NotTitle'))
//       return false;
//     }else if (!imageFile) {
//       toast.error( t('requiredEurekaImageError'))
//       return false;
//     }else if (!payload.contentText.length) {
//       toast.error( t('NotContentText'))
//       return false;
//     }
//     return true;
//   };

//    const handleFormClear = (ev: MouseEvent<HTMLButtonElement>) => {
//     ev.preventDefault();
//     /*setSelectedWorksForCycle([]);
//     setCycleCoverImageFile(null);
//     editorRef.current.setContent('');*/
//     setItems([]);
//     setTags('');


//    /* if (formRef.current != null) {
//       const form = formRef.current;

//       form.cycleTitle.value = '';
//       form.languages.value = '';
//       form.startDate.value = '';
//       form.endDate.value = '';
//     }*/
//   };

//   const handleSubmit = async (ev: MouseEvent<HTMLButtonElement>) => {
//     ev.preventDefault();

//    if (!selectedWork && !selectedCycle) {
//        toast.error( t('requiredDiscussionItemError'))
//        return;
//    }

//    const form = formRef.current;
//     if (form && selectedWork != null) {
//       const payload: CreatePostAboutWorkClientPayload = {
//         selectedCycleId: selectedCycle != null ? selectedCycle.id : null,
//         selectedWorkId: selectedWork.id,
//         title: form.postTitle.value,
//         image: imageFile!,
//         language: '',
//         contentText: editorRef.current.getContent(), // form.description.value.length ? form.description.value : null,
//         isPublic: isPublic,//form.isPublic.checked,
//         topics: items.join(','),
//         tags,
//       };
//       if(formValidation(payload))
//           await execCreatePost(payload);
//     } else if (form && selectedCycle != null) {
//       const payload: CreatePostAboutCycleClientPayload = {
//         selectedCycleId: selectedCycle.id,
//         selectedWorkId: null,
//         title: form.postTitle.value,
//         image: imageFile!,
//         language: '',
//         contentText: editorRef.current?.getContent(), // form.description.value.length ? form.description.value : null,
//         isPublic: isPublic,//form.isPublic.checked,
//         topics: items.join(','),
//         tags,
//       };
//       if(formValidation(payload))
//           await execCreatePost(payload);
//     }
//   };

//   useEffect(() => {
//     if (isCreatePostSuccess === true && createdPost != null) {
//       setGlobalModalsState({ ...globalModalsState, ...{ createPostModalOpened: false } });
//       queryClient.invalidateQueries('posts.mosaic');

//       if (selectedWork != null) {
//         router.push(`/work/${selectedWork.id}/post/${createdPost.id || postId}`);
//         return;
//       }
//       if (selectedCycle != null) {
//         router.push(`/cycle/${selectedCycle.id}/post/${createdPost.id || postId}`);
//       }
//     } else if (status === 'error') {
//       alert('Error creating the post');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [createdPost, isCreatePostSuccess]);

//   const labelKeyFn = (res: SearchResult) => {
//     if ('title' in res)
//       return `${res.title}`;
//     return `${res.name}`;
//   };

//     const onGenerateCrop = (photo: File) => {
//     setImageFile(()=>photo);
//     setCurrentImg(URL.createObjectURL(photo));
//     //setChangingPhoto(true);
//     setShowCrop(false);
//   };

//     const closeCrop = () => {
//     setShowCrop(false);
//   };

//   const renderPhoto = ()=>{
//    if(currentImg)
//     return <img
//         className={styles.postImage}
//         src={currentImg}
//         alt=''
//       />;
//   };

//   return (
//     <Form ref={formRef}>
//       <ModalHeader closeButton={!noModal}>
//          <ModalTitle> <h1 className="text-secondary fw-bold mt-sm-0 mb-2">{t('title')}</h1></ModalTitle>
//       </ModalHeader>

//       <ModalBody>
//           <Row className='d-flex flex-column flex-lg-row'>
//             <Col className='mb-4'>
//               <FormGroup controlId="workOrCycle">
//                 <FormLabel>*{t('searchCycleOrWorkFieldLabel')}</FormLabel>
//                 {selectedWork != null ? (
//                   <div className={styles.searchResult}>
//                     <WorkTypeaheadSearchItem work={selectedWork} />
//                     <button onClick={handleClearSelectedWork} type="button" className={styles.discardSearchResult}>
//                       <BsFillXCircleFill />
//                     </button>
//                   </div>
//                 ) : selectedCycle != null ? (
//                   <div className={styles.searchResult}>
//                     <CycleTypeaheadSearchItem cycle={selectedCycle} />
//                     <button onClick={handleClearSelectedCycle} type="button" className={styles.discardSearchResult}>
//                       <BsFillXCircleFill />
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     {/* language=CSS */}
//                     <style jsx global>{`
//                       .rbt-menu {
//                         min-width: 300px;
//                       }
//                     `}</style>
//                     <AsyncTypeahead
//                       id="create-post--search-work-or-cycle"
//                       // Bypass client-side filtering. Results are already filtered by the search endpoint
//                       filterBy={() => true}
//                       inputProps={{ required: true }}
//                       placeholder={t('searchCycleOrWorkFieldPlaceholder')}
//                       isLoading={isSearchWorkOrCycleLoading}
//                       labelKey={labelKeyFn}
//                       minLength={2}
//                       onSearch={handleSearchWorkOrCycle}
//                       options={searchWorkOrCycleResults}
//                       onChange={handleSelectWorkOrCycle}
//                       renderMenuItemChildren={(searchResult) => {
//                         if (isCycleMosaicItem(searchResult)) {
//                           return <CycleTypeaheadSearchItem cycle={searchResult} />;
//                         }
//                         if (isWorkMosaicItem(searchResult)) {
//                           return <WorkTypeaheadSearchItem work={searchResult} />;
//                         }

//                         return null;
//                       }}
//                     />
//                   </>
//                 )}
//               </FormGroup>
//             </Col>
//               <Col className='mb-4'>
//               <FormGroup controlId="postTitle" >
//                 <FormLabel>*{t('titleFieldLabel')}</FormLabel>
//                 <FormControl type="text" maxLength={80} required />
//               </FormGroup>
//             </Col>
//           </Row>
//           <Row className='d-flex justify-content-center justify-content-lg-start'>
//              <Row className="d-flex justify-content-center flex-column flex-column-reverse flex-lg-row flex-lg-row-reverse">
//             <Col className='mb-4 d-flex justify-content-center justify-content-lg-start'>
//               {<div className={styles.imageContainer}>{renderPhoto()}</div>}
//               </Col>
//             <Col className='mb-4'>
//                 {!showCrop && (<Button data-cy="image-load" className="btn-eureka w-100 text-white" onClick={() => setShowCrop(true)}>
//                   {t('imageFieldLabel')}
//                 </Button>
//                 )}        
//                 { showCrop && (
//                 <Col className=''>
//                   <div className='w-100 border p-3'>  
//                   <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={closeCrop} cropShape='rect' />
//                   </div>  
//                 </Col>
//                )}      
//             </Col>  
//             </Row>
              
//              {/*<ImageFileSelect acceptedFileTypes="image/*" file={imageFile} setFile={setImageFile} required>
//                 {(imagePreview) => (
//                   <FormGroup>
//                     <FormLabel>*{t('imageFieldLabel')}</FormLabel>
//                     <div className={styles.imageControl}>
//                       {(imageFile != null && imagePreview) != null ? (
//                         <span className={styles.imageName}>{imageFile?.name}</span>
//                       ) : (
//                         t('imageFieldPlaceholder')
//                       )}
//                       {imagePreview && <img src={imagePreview} className="float-right" alt="Work cover" />}
//                     </div>
//                   </FormGroup>
//                 )}
//               </ImageFileSelect>*/}
//            </Row>
//          { /*<Row>
//             <Col className="mb-4">
//               <FormGroup controlId="language" >
//                 <FormLabel>*{t('languageFieldLabel')}</FormLabel>
//                 <LanguageSelect />
//               </FormGroup>
//             </Col>
//           </Row>*/}
//           <Row>
//             <Col sm={{ span: 6 }} className="mb-4">
//               <FormGroup controlId="workOrCycle">
//                 <FormLabel>{t('searchCycleFieldLabel')}</FormLabel>
//                 {!selectedCycle ? (
//                   <>
//                     {/* language=CSS */}
//                     <style jsx global>{`
//                       .rbt-menu {
//                         min-width: 300px;
//                       }
//                     `}</style>
//                     <AsyncTypeahead
//                       id="create-post--search-cycle"
//                       filterBy={() => true}
//                       inputProps={{ id: 'create-post--search-cycle' }}
//                       placeholder={t('searchCycleFieldPlaceholder')}
//                       isLoading={isSearchCycleLoading}
//                       labelKey={labelKeyFn}
//                       minLength={2}
//                       useCache={false}
//                       onSearch={handleSearchCycle}
//                       options={searchCycleResults}
//                       onChange={handleSelectCycle}
//                       renderMenuItemChildren={(searchResult) => <CycleTypeaheadSearchItem cycle={searchResult} />}
//                     />
//                   </>
//                 ) : (
//                   <div className={styles.searchResult}>
//                     {selectedCycle !== null && <CycleTypeaheadSearchItem cycle={selectedCycle} />}
//                     <button onClick={handleClearSelectedCycle} type="button" className={styles.discardSearchResult}>
//                       <BsFillXCircleFill />
//                     </button>
//                   </div>
//                 )}
//               </FormGroup>
//             </Col>
//           </Row>
//           <Row>
//             <Col  className="mb-4">
//               <small style={{ color: 'lightgrey', position: 'relative', top: '-0.75rem' }}>
//                 {t('searchCycleInfotip')}
//               </small>
//             </Col>
//           </Row>
//           <Row>
//             <Col  className="mb-4">
//               <FormGroup controlId="topics">
//                 <FormLabel>{t('topicsPostLabel')}</FormLabel>
//                 <TagsInputTypeAhead
//                   data={topics??[]}
//                   items={items}
//                   setItems={setItems}
//                   labelKey={(res) => t(`topics:${res.code}`)}
//                   formatValue={(v: string) => t(`topics:${v}`)} 
//                   max={3}
//                   placeholder={`${t('Type to add tag')}...`}
//                 />
//               </FormGroup>
//             </Col>
//           </Row>
//           <Row>
//             <Col className="mb-4">
//               <TagsInput tags={tags} setTags={setTags} label={t('topicsFieldLabel')}/>
//             </Col>
//           </Row>
//           <Row>
//             <FormGroup controlId="description" as={Col}  className="mb-4">
//               <FormLabel>*{t('descriptionFieldLabel')}</FormLabel>
//               {/* @ts-ignore*/}
//               <EditorCmp
//                 apiKey="f8fbgw9smy3mn0pzr82mcqb1y7bagq2xutg4hxuagqlprl1l"
//                 onInit={(_: any, editor) => {
//                   editorRef.current = editor;
//                 }}
//                 // initialValue={newEureka.contentText}
//                 init={{
//                   height: 300,
//                   menubar: false,
//                   plugins: [
//                     'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
//                     'searchreplace', 'visualblocks', 'code', 'fullscreen',
//                     'insertdatetime', 'media', 'table', 'paste', 'code', 'help', 'wordcount', 'emoticons'
//                   ],
//                   emoticons_database: 'emojiimages',
//                   relative_urls: false,
//                   forced_root_block: "div",
//                   toolbar: 'undo redo | formatselect | bold italic backcolor color | insertfile | link | emoticons  | help',
//                   // toolbar:
//                   //   'undo redo | formatselect | ' +
//                   //   'bold italic backcolor | alignleft aligncenter ' +
//                   //   'alignright alignjustify | bullist numlist outdent indent | ' +
//                   //   'removeformat | help',
//                   content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
//                 }}
//               />
//             </FormGroup>
//           </Row>
//       </ModalBody>

//       <ModalFooter>
//             <Row className='d-flex flex-column flex-lg-row'>
//             <Container className="p-0 d-flex justify-content-end">
//              <ButtonGroup  className="py-4">
//               <Button
//                variant="warning"
//                onClick={handleFormClear}
//                className="text-white"
//               >
//                 <ImCancelCircle />
//               </Button>
//               <Button disabled={isCreatePostLoading} onClick={(e)=>{handleSubmit(e)}} className="btn-eureka"  style={{ width: '12em' }}>
//                 <>
//                   {t('submitButtonLabel')}
//                   {isCreatePostLoading && (
//                     <Spinner className="ms-2" animation="grow" variant="info" size="sm" />
//                   ) }
//                 </>
//               </Button>
//               </ButtonGroup>
//             </Container>            
//           </Row>
//       </ModalFooter>
//     </Form>
//   );
// };

// export default CreatePostForm;
export default function CreatePostForm(){return <></>;}

