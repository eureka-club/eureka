import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, MouseEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import Image from 'next/image'
import { Button, Col, Row, ButtonGroup, Form, Spinner } from 'react-bootstrap';
import { useAtom } from 'jotai';
import { Post } from '@prisma/client';

import { BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

import { useMutation, useQueryClient } from 'react-query';

import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import globalModalsAtom from '../../atoms/globalModals';
// import { Session } from '../../types';
import { CycleMosaicItem } from '../../types/cycle';
import { CreatePostAboutCycleClientPayload, CreatePostAboutWorkClientPayload, PostMosaicItem } from '../../types/post';

import ImageFileSelect from '../forms/controls/ImageFileSelect';
import TagsInputTypeAhead from '../forms/controls/TagsInputTypeAhead';
import stylesImageFileSelect from '../forms/CreatePostForm.module.css';
import useTopics from '../../useTopics';

import { useNotificationContext } from '@/src/useNotificationProvider';
import { useRouter} from 'next/router'
import toast from 'react-hot-toast'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import useWorks from '@/src/useWorks'
import useUsers from '@/src/useUsers'
// import {useGlobalEventsContext} from '@/src/useGlobalEventsContext'
import styles from './CycleDetailDiscussionCreateEureka.module.css';
// import { devNull } from 'os';
// import { isNullOrUndefined } from 'util';

interface Props {
  cacheKey:string[];
  cycle: CycleMosaicItem;
  discussionItem?: string;
  setDiscussionItem: (val: string | undefined) => void;
  close: () => void;

}

const whereCycleParticipants = (id:number)=>({
  where:{
    OR:[
      {cycles: { some: { id } }},//creator
      {joinedCycles: { some: { id } }},//participants
    ],
  } 
});

const CycleDetailDiscussionCreateEurekaForm: FunctionComponent<Props> = ({
  cacheKey,
  cycle,
  discussionItem,
  setDiscussionItem,
  close
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {data:session} = useSession();
  const { t } = useTranslation('cycleDetail');
  //const [globalModalsState, setGlobalModalsState] = useAtom(globalModalsAtom);
  const [newEurekaImageFile, setNewEurekaImageFile] = useState<File | null>(null);
  const { data: topics } = useTopics();
  const [eurekaTopics, setEurekaTopics] = useState<string[]>([]);
  const editorRef = useRef<any>(null);
  const formRef = useRef<any>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState<boolean>(false);
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

  const {notifier} = useNotificationContext();
  // const gec = useGlobalEventsContext();

  const { data: dataWorks } = useWorks({ where:{cycles: { some: { id: cycle?.id } }} }, {
    enabled:!!cycle?.id
  })
  const [works,setWorks] = useState(dataWorks?.works)
  useEffect(()=>{
    if(dataWorks)setWorks(dataWorks.works)
  },[dataWorks])


  const { data: participants,isLoading:isLoadingParticipants } = useUsers(whereCycleParticipants(cycle.id),
    {
      enabled:!!cycle
    }
  )

  const clearPayload = () => {
    editorRef.current.setContent('');
    setDiscussionItem('');
    setEurekaTopics(() => []);
    setNewEurekaImageFile(null);
    setCurrentImg(null);
    setNewEureka((res) => ({
      ...res,
      title: '',
      image: null,
      contentText: '',
      topics: eurekaTopics,
    }));

    close();
  };
  const clearCreateEurekaForm = () => {
    clearPayload();
  };

   const formValidation = (payload:any) => {
    if (!discussionItem) {
          toast.error( t('requiredDiscussionItemError'))
          return false;
    }else if (!payload.title.length) {
      toast.error( t('NotTitle'))
          return false;
    }else if (!payload.contentText.length) {
      toast.error( t('NotContentText'))
      return false;
    }else if (!newEurekaImageFile) {
      toast.error( t('requiredEurekaImageError'))
          return false;
    }
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
        language: newEureka.language,
        contentText: editorRef.current.getContent(),
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
      };
      if(formValidation(payload))
        await execCreateEureka(payload);
    } else if (newEureka.selectedCycleId) {
      const payload: CreatePostAboutCycleClientPayload = {
        selectedCycleId: newEureka.selectedCycleId,
        selectedWorkId: null,
        title: newEureka.title,
        image: newEurekaImageFile!,
        language: newEureka.language,
        contentText: editorRef.current.getContent(),
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
      }; 
      if(formValidation(payload))
         await execCreateEureka(payload);
    }
  };

  const { mutate: execCreateEureka, isLoading } = useMutation(
    async (payload: CreatePostAboutCycleClientPayload | CreatePostAboutWorkClientPayload): Promise<Post | null> => {
      const u = session!.user;
      const toUsers = (participants||[]).filter(p=>p.id!==u.id).map(p=>p.id);
      if(u.id !== cycle.creatorId)
        toUsers.push(cycle.creatorId);
      let message = '';
      let notificationContextURL = router.asPath
      if (payload.selectedWorkId) {
        if (works) {
          const work = works.find(w=>w.id === payload.selectedWorkId);
          if(work){
            message = `eurekaCreatedAboutWorkInCycle!|!${JSON.stringify({
              userName:u.name||'',
              workTitle:work.title,
              cycleTitle:cycle.title
            })}`; 
            notificationContextURL = `/work/${work.id}/post`         
          }          
        }
      }
      else if(payload.selectedCycleId){
        message = `eurekaCreatedAboutCycle!|!${JSON.stringify({
          userName:u.name||'',
          cycleTitle:cycle.title
        })}`;  
        notificationContextURL = `/cycle/${cycle.id}/post`       
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

      if(!res.ok)//TODO add Toast notification to the user
        return null;

      const json = await res.json();

      if (json) {
        
        if(notifier){
          
            notifier.notify({
              toUsers,
              data:{message}
            });
            
        } 
        toast.success( t('postCreated'))
        clearPayload();
        return json.post;
      }

      return null;
    },
    {
      onMutate: async () => {
        // await queryClient.cancelQueries(cacheKey);
        const previewsItems = queryClient.getQueryData<PostMosaicItem[]>(cacheKey);
        return { previewsItems, cacheKey };
      },
      onSettled: (_eureka, error, _variables, context) => {

        if (error) {
          if (context) {
            queryClient.setQueryData(context.cacheKey, context.previewsItems);
          }
          // console.error(error);
        }
        if (context && session){
          queryClient.invalidateQueries(context.cacheKey);
          queryClient.invalidateQueries(['USER',session.user.id.toString()]);//to get the new notification
        } 
      },
    },
  );


  useEffect(() => {
    if (!discussionItem) return;
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

    const onGenerateCrop = (photo: File) => {
    setNewEurekaImageFile(()=>photo);
    setCurrentImg(URL.createObjectURL(photo));
    //setChangingPhoto(true);
    setShowCrop(false);
  };

    const closeCrop = () => {
    setShowCrop(false);
  };

  const renderPhoto = ()=>{
   if(currentImg)
    return <img
        className={styles.postImage}
        src={currentImg}
        alt=''
      />;
  };

  return <Form ref={formRef}>
      <Form.Group controlId="eureka-title" className="mb-3">
        <Form.Control
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
        </ImageFileSelect>*/}
      </Form.Group>
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
              formatValue={(v: string) => t(`topics:${v}`)} 
              className="mt-3 w-100"
            />
          </Form.Group>
        </Col>
      </Row>

      <aside className="d-flex justify-content-end">
        <ButtonGroup size="sm" className="pt-3">
          <Button variant="warning" onClick={clearCreateEurekaForm} disabled={isLoading}>
            <ImCancelCircle />
          </Button>
          <Button data-cy="create-eureka-btn" onClick={handlerSubmitCreateEureka} className="text-white"  style={{ width: '5rem' }} disabled={isLoading}>
            <span>
              <BsCheck /> {t('Create')}
            </span>
            {isLoading && <Spinner size="sm" animation="grow" />}
          </Button>
        </ButtonGroup>
      </aside>
    </Form>;
  
};

export default CycleDetailDiscussionCreateEurekaForm;
