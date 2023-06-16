import { useSession } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, MouseEvent, FunctionComponent, useEffect, useRef, useState } from 'react';
import { Button, Col, Row, ButtonGroup, Form, Spinner } from 'react-bootstrap';
import { Post } from '@prisma/client';

import { BsCheck } from 'react-icons/bs';
import { ImCancelCircle } from 'react-icons/im';

import { useMutation, useQueryClient } from 'react-query';

import { Editor as EditorCmp } from '@tinymce/tinymce-react';
import { WorkMosaicItem } from '../../types/work';
import { CreatePostAboutWorkClientPayload, PostMosaicItem } from '../../types/post';

import ImageFileSelect from '../forms/controls/ImageFileSelect';
import TagsInputTypeAheadMaterial from '../forms/controls/TagsInputTypeAheadMaterial';
import stylesImageFileSelect from '../forms/CreatePostForm.module.css';
import useTopics from '../../useTopics';

import { useNotificationContext } from '@/src/useNotificationProvider';
import { useRouter} from 'next/router'
import toast from 'react-hot-toast'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import useWork from '@/src/useWork'
import useUsers from '@/src/useUsers'
// import {useGlobalEventsContext} from '@/src/useGlobalEventsContext'
import styles from './WorkDetailCreateEurekaForm.module.css';
import { Switch,TextField,FormControlLabel,Autocomplete} from '@mui/material';
import Prompt from '@/src/components/post/PostPrompt';


import useCycles from '@/src/useCycles'

// import { devNull } from 'os';
// import { isNullOrUndefined } from 'util';
const languages: Record<string, string> = {
  es: "spanish",
  en: 'english',
  fr: 'french',
  pt: 'portuguese'
}
interface Props {
  cacheKey:string[];
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
  const queryClient = useQueryClient();
  const router = useRouter();
  const {data:session} = useSession();
  const { t } = useTranslation('cycleDetail');
  const [newEurekaImageFile, setNewEurekaImageFile] = useState<File | null>(null);
  const { data: topics } = useTopics();
  const [eurekaTopics, setEurekaTopics] = useState<string[]>([]);
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
    language: languages[`${router.locale}`],
    contentText: '',
    isPublic: true,
    topics: eurekaTopics,
  });

   /*const workItemsWhere = {
    works:{
      some:{
        id:workItem.id
      }
    }
  }*/

  //const {data:cycles} = useCycles(workItemsWhere,{enabled:!!workItem.id})


  const {notifier} = useNotificationContext();
  // const gec = useGlobalEventsContext();

   const {data:work} = useWork(workItem.id,{
    enabled:!!workItem.id
  })


  const clearPayload = () => {
    if(editorRef.current)
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
    setUSeCrop(false);
    close();
  };
  const clearCreateEurekaForm = () => {
    clearPayload();
  };
  

   const formValidation = (payload:any) => {
   /*if (!payload.title.length) {
      toast.error( t('NotTitle'))
          return false;
    }else if (!payload.contentText.length) {
      toast.error( t('NotContentText'))
      return false;
    }else*/ if (!newEurekaImageFile) {
      toast.error( t('requiredEurekaImageError'))
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
        language: languages[`${router.locale}`],
        contentText: (editorRef.current) ? editorRef.current.getContent() : "",
        isPublic: newEureka.isPublic,
        topics: eurekaTopics.join(','),
      };
     if(formValidation(payload))
        await execCreateEureka(payload);
    }
    
  };

  const { mutate: execCreateEureka, isLoading } = useMutation(
    async (payload: CreatePostAboutWorkClientPayload): Promise<Post | null> => {
      const u = session!.user;
      /* const toUsers = (participants||[]).filter(p=>p.id!==u.id).map(p=>p.id);
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
      }*/
     
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value);
        }
      });

   /*   formData.append('notificationMessage', message);
      formData.append('notificationContextURL', notificationContextURL);
      formData.append('notificationToUsers', toUsers.join(','));
*/
      const res = await fetch('/api/post', {
        method: 'POST',
        body: formData,
      });

      if(!res.ok)//TODO add Toast notification to the user
        return null;

      const json = await res.json();

      if (json) {
        
      /*  if(notifier){
          
            notifier.notify({
              toUsers,
              data:{message}
            });
            
        } */
        toast.success( t('postCreated'))
        clearPayload();
        return json.post;
      }

      return null;
    },
    {
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
        if (context && session){
          queryClient.invalidateQueries(context.cacheKey);
          //queryClient.invalidateQueries(['CYCLES',JSON.stringify(workItemsWhere)])
          queryClient.invalidateQueries(['USER',session.user.id.toString()]);//to get the new notification
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

    const onImageSelect = (photo: File, text: string) => {
    setNewEurekaImageFile(()=>photo);
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
  };

  return (
    <Form ref={formRef}>
      <section id="create-post" className=" my-3">
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
              forced_root_block: 'div',
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
          {/*<Form.Group className="mt-3" controlId="eureka-image">
         <Row className="d-flex justify-content-center flex-column flex-column-reverse flex-lg-row flex-lg-row-reverse">
            <Col className='mb-4 d-flex justify-content-center justify-content-lg-start'>
              {<div className={styles.imageContainer}>{renderPhoto()}</div>}
              </Col>
            <Col xs={12} md={8} className='mt-2 mb-4'>
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
        <ImageFileSelect acceptedFileTypes="image/*" file={newEurekaImageFile} setFile={setNewEurekaImageFile} required>
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
          <Row>
            <Col xs={12} md={8}>
              <Form.Group className="mt-5 mb-4">
                <FormControlLabel
                  control={<Switch checked={useOtherFields} onChange={handleChangeUseOtherFields} />}
                  label={t('showOthersFields')}
                />
              </Form.Group>
              {useOtherFields && (
                <Form.Group controlId="topics">
                  {/* <FormLabel>{t('createWorkForm:topicsLabel')}</FormLabel> */}
                  <TagsInputTypeAheadMaterial
                    style={{ background: 'white' }}
                    data={topics}
                    items={eurekaTopics}
                    setItems={setEurekaTopics}
                    max={3}
                    label={`${t('Type to add tag')}...`}
                    formatValue={(v: string) => t(`topics:${v}`)}
                    className="mt-3"
                  />
                </Form.Group>
              )}
            </Col>
          </Row>

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

export default WorkDetailCreateEurekaForm;
