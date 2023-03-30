import { GetServerSideProps, NextPage } from 'next';
import {getSession} from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState,FormEvent,useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { backOfficePayload } from '@/src/types/backoffice';
import useBackOffice from '@/src/useBackOffice';
import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import {
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  Spinner,
  Button,
  Nav,
  NavItem,
  NavLink,
  Form,
} from 'react-bootstrap';
import { FiTrash2 } from 'react-icons/fi';
import styles from './back-office.module.css'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';
import toast from 'react-hot-toast'
import axios from 'axios';
const { NEXT_PUBLIC_AZURE_CDN_ENDPOINT } = process.env;
const { NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME } = process.env;
interface Props {
  notFound?: boolean;
}

interface backOfficeClearSliderPayload{
originalName?:string
}

const BackOffice: NextPage<Props> = ({notFound}) => {
  const { t } = useTranslation('backOffice');
  const router = useRouter();
  const [tabKey, setTabKey] = useState<string>();
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [showCrop, setShowCrop] = useState<boolean>(false);
 
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);
  const [image1, setImage1] = useState<string | undefined>();
  const [image2, setImage2] = useState<string | undefined>();
  const [image3, setImage3] = useState<string | undefined>();
  const queryClient = useQueryClient();
  const {data:bo } = useBackOffice();

  useEffect(() => {
            if (notFound) 
                router.push('/');
          
    }, [notFound]);

    useEffect(() => {
    //console.log(bo,'bo data')
    setImage1(undefined);
    setImage2(undefined);
    setImage3(undefined);

    if (bo && bo.sliderImages.length) {
      if(bo.SlideImage1 !='null'){
        let storeFile1 = bo.sliderImages.filter(x=> x.originalFilename == bo.SlideImage1)[0].storedFile;
        setImage1(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile1}`);
      }
      if(bo.SlideImage2 !='null'){
        let storeFile2 = bo.sliderImages.filter(x=> x.originalFilename == bo.SlideImage2)[0].storedFile;
        setImage2(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile2}`);
      }
       if(bo.SlideImage3 !='null'){
        let storeFile3 = bo.sliderImages.filter(x=> x.originalFilename == bo.SlideImage3)[0].storedFile;
        setImage3(`https://${NEXT_PUBLIC_AZURE_CDN_ENDPOINT}.azureedge.net/${NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}/backoffice/${storeFile3}`);
      }
    }
  }, [bo]);


  const handleSubsectionChange = (key: string | null) => {
  if (key != null) 
      setTabKey(key);
  };

    const closeCrop = () => {
       setShowCrop(false);
       setCurrentSlider(0);
  };

    const openCrop = (n:number) => {
       setShowCrop(true);
       setCurrentSlider(n);
  };

    const onGenerateCrop = (photo: File) => {
      if(currentSlider == 1){
        setImageFile1(()=>photo);
        setImage1(URL.createObjectURL(photo));
      }
      if(currentSlider == 2){
        setImageFile2(()=>photo);
        setImage2(URL.createObjectURL(photo));
      }
      if(currentSlider == 3){
        setImageFile3(()=>photo);
        setImage3(URL.createObjectURL(photo));
      }
   
    setShowCrop(false);
    setCurrentSlider(0);
  };

  const {
    mutate: execUpdateBackOffice,
    error: UpdateBackOfficeError,
    isLoading: isLoadingBackOffice,
  } = useMutation(
    async (payload: backOfficePayload) => {
      const formData = new FormData();
      //console.log(payload,'payload')
      Object.entries(payload).forEach(([key,value])=>{
          formData.append(key,value);
      });
      const url = `/api/backoffice`;

      const res = await fetch(url, {
        method: 'PATCH',
        //headers: { 'Content-Type': 'application/json' },
        body: formData,
      });
      if(res.ok)
         toast.success( t('Settings') + '  Saved')      
      else
        toast.error(res.statusText)
    },
    {
      onMutate: async () => {
        const cacheKey = ['BACKOFFICE',"1"];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };
      },
      onSettled: (_backData, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    },
  );

  const {
    mutate: execClearSlideBackOffice,
    error: ClearSlideBackOffice,   
  } = useMutation(
    async (clearSliderPayload: backOfficeClearSliderPayload) => {
      const url = `/api/backoffice/${clearSliderPayload.originalName}`;
      const res = await fetch(url, {
      method: 'delete',
    });
    const data = await res.json();
     if(res.ok)
         toast.success( t('Banner Settings') + '  Saved')      
      else
        toast.error(res.statusText)
    },  
    {
      onMutate: async () => {
        const cacheKey = ['BACKOFFICE',"1"];
        const snapshot = queryClient.getQueryData(cacheKey);
        return { cacheKey, snapshot };
      },
      onSettled: (_backData, error, _variables, context) => {
        if (context) {
          const { cacheKey, snapshot } = context;
          if (error && cacheKey) {
            queryClient.setQueryData(cacheKey, snapshot);
          }
          if (context) queryClient.invalidateQueries(cacheKey);
        }
      },
    }, 
  );


  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const form = ev.currentTarget;
    const payload: backOfficePayload = {
        SlideTitle1: form.TitleSlider1.value,
        SlideText1: form.TextSlider1.value,
        SlideImage1: (imageFile1) ? imageFile1.name : null ,
        Image1: imageFile1,
        SlideTitle2: form.TitleSlider2.value,
        SlideText2: form.TextSlider2.value,
        SlideImage2: (imageFile2) ? imageFile2.name : null ,
        Image2: imageFile2,
        SlideTitle3: form.TitleSlider3.value,
        SlideText3: form.TextSlider3.value,
        SlideImage3: (imageFile3) ? imageFile3.name : null ,
        Image3: imageFile3,
        CyclesExplorePage:form.CyclesToShow.value,
        PostExplorePage:form.PostToShow.value,
        FeaturedUsers:form.UsersToShow.value,    
        FeaturedWorks:form.WorksToShow.value     
    };
    //console.log(payload,"payload")
    await execUpdateBackOffice(payload);
  };


  const clearSlider = async (n: number) => {

    let sliderOriginalName;
    if(n==1)
      sliderOriginalName = bo!.SlideImage1;
    if(n==2)
      sliderOriginalName = bo!.SlideImage2;  
    if(n==3)
      sliderOriginalName = bo!.SlideImage3;  

    //console.log('bo',bo, sliderOriginalName)

    const clearSliderPayload: backOfficeClearSliderPayload = {
        originalName: sliderOriginalName || undefined
    };
    //console.log(payload,"payload")
    await execClearSlideBackOffice(clearSliderPayload);
  };

  const removeNotificationsSinceLastMonth = async ()=>{
    const url = '/api/notification/remove-since-last-month';
    const res = await axios.delete(url);
    if(res.data?.error)
      toast.error(res.data?.error);
    else toast.success(`${res.data?.notifications.count} notifications where deleted`);
  }

  return (
    <SimpleLayout title={t('Admin Panel')}>
      <h1 className="text-secondary me-1 mb-4">
        <b>{t('Admin Panel')}</b>
      </h1>
      <TabContainer onSelect={handleSubsectionChange} activeKey={tabKey || 'explorer-page'} transition={false}>
        <style jsx global>
          {`
            .nav-tabs .nav-item.show .nav-link,
            .nav-tabs .nav-link.active,
            .nav-tabs .nav-link:hover {
              background-color: var(--bs-primary);
              color: white !important;
              border: none !important;
              border-bottom: solid 2px var(--bs-primary) !important;
            }
            .nav-tabs {
              border: none !important;
            }
          `}
        </style>

        <Nav variant="tabs" className="scrollNav" fill>
          <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
            <NavLink eventKey="explorer-page">
              <span className="mb-3">{t('Content administration')}</span>
            </NavLink>
          </NavItem>
          {
            <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
              <NavLink eventKey="export-participants">
                <span className="mb-3">...</span>
              </NavLink>
            </NavItem>
          }
        </Nav>

        <TabContent>
          <TabPane eventKey="explorer-page">
            <h2 className="text-secondary mt-3 mb-3">
              <b>{t('Banner Settings')}</b>
            </h2>

            <Form onSubmit={handleSubmit} className={`d-flex flex-column`}>
              <Row className="col-12 px-4 py-2 d-flex flex-column flex-lg-row justify-content-around">
                <Col className="col-12 col-lg-4 mb-4">
                  <h5 className="text-secondary mb-2">
                    <b>{t('Slider 1')}</b>
                  </h5>

                  <Form.Group controlId="TitleSlider1">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideTitle1 || ''} maxLength={100} />
                  </Form.Group>
                  <Form.Group controlId="TextSlider1">
                    <Form.Label>{t('Text')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideText1 || ''} maxLength={120} />
                  </Form.Group>

                  {!showCrop && currentSlider != 1 && (
                    <div>
                      <Button
                        data-cy="image-load"
                        variant="primary"
                        className="w-50 text-white mt-2  mb-3"
                        onClick={() => openCrop(1)}
                      >
                        {t('Image')}
                      </Button>
                      {bo?.SlideImage1?.length && bo?.SlideImage1 != 'null' && (
                        <Button
                          type="button"
                          title={t('Delete slider')}
                          className={`text-warning p-0 ${styles.sliderDelete}`}
                          onClick={() => clearSlider(1)}
                          variant="link"
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  )}
                  {showCrop && currentSlider == 1 && (
                    <Row className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </Row>
                  )}
                  {image1 && (
                    <Row>
                      <img className={styles.Image} src={image1} alt="" />
                    </Row>
                  )}
                </Col>
                <Col className="col-12 col-lg-4 mb-4">
                  <h5 className="text-secondary mb-2">
                    <b>{t('Slider 2')}</b>
                  </h5>
                  <Form.Group controlId="TitleSlider2">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideTitle2 || ''} maxLength={100} />
                  </Form.Group>
                  <Form.Group controlId="TextSlider2">
                    <Form.Label>{t('Text')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideText2 || ''} maxLength={120} />
                  </Form.Group>

                  {!showCrop && currentSlider != 2 && (
                    <div>
                      <Button
                        data-cy="image-load"
                        variant="primary"
                        className="w-50 text-white mt-2  mb-3"
                        onClick={() => openCrop(2)}
                      >
                        {t('Image')}
                      </Button>
                      {bo?.SlideImage2?.length && bo?.SlideImage2 != 'null' && (
                        <Button
                          type="button"
                          title={t('Delete slider')}
                          className={`text-warning p-0 ${styles.sliderDelete}`}
                          onClick={() => clearSlider(2)}
                          variant="link"
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  )}
                  {showCrop && currentSlider == 2 && (
                    <Row className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </Row>
                  )}
                  {image2 && (
                    <Row>
                      <img className={styles.Image} src={image2} alt="" />
                    </Row>
                  )}
                </Col>
                <Col className="col-12 col-lg-4 mb-4">
                  <h5 className="text-secondary mb-2">
                    <b>{t('Slider 3')}</b>
                  </h5>

                  <Form.Group controlId="TitleSlider3">
                    <Form.Label>{t('Title')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideTitle3 || ''} maxLength={100} />
                  </Form.Group>
                  <Form.Group controlId="TextSlider3">
                    <Form.Label>{t('Text')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.SlideText3 || ''} maxLength={120} />
                  </Form.Group>

                  {!showCrop && currentSlider != 3 && (
                    <div className="">
                      <Button
                        data-cy="image-load"
                        variant="primary"
                        className="w-50 text-white mt-2  mb-3"
                        onClick={() => openCrop(3)}
                      >
                        {t('Image')}
                      </Button>
                      {bo?.SlideImage3?.length && bo?.SlideImage3 != 'null' && (
                        <Button
                          type="button"
                          title={t('Delete slider')}
                          className={`text-warning p-0 ${styles.sliderDelete}`}
                          onClick={() => clearSlider(3)}
                          variant="link"
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  )}
                  {showCrop && currentSlider == 3 && (
                    <Row className="d-flex">
                      <div className="w-100 border p-3">
                        <CropImageFileSelect
                          onGenerateCrop={onGenerateCrop}
                          onClose={() => closeCrop()}
                          cropShape="rect"
                          width={352}
                          height={320}
                        />
                      </div>
                    </Row>
                  )}
                  {image3 && (
                    <Row>
                      <img className={styles.Image} src={image3} alt="" />
                    </Row>
                  )}
                </Col>
              </Row>

              <h2 className="text-secondary mt-3 mb-3">
                <b>{t('Content Page')}</b>
              </h2>
              <div className="py-2 d-flex flex-column flex-lg-row justify-content-between">
                <Col className="col-12 col-lg-6 px-2 ">
                  <Form.Group controlId="CyclesToShow">
                    <Form.Label>{t('CyclesToShow')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.CyclesExplorePage || ''} />
                  </Form.Group>
                </Col>
                <Col className="col-12 col-lg-6 px-2">
                  <Form.Group controlId="PostToShow">
                    <Form.Label>{t('PostToShow')}</Form.Label>
                    <Form.Control className="mb-4" type="text" defaultValue={bo?.PostExplorePage || ''} />
                  </Form.Group>
                </Col>
              </div>
              <div className="py-2 d-flex flex-column flex-lg-row justify-content-between">
                <Col className="col-12 col-lg-6 px-2 ">
                  <Form.Group controlId="UsersToShow">
                    <Form.Label>{t('UsersToShow')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.FeaturedUsers || ''} />
                  </Form.Group>
                </Col>
                <Col className="col-12 col-lg-6 px-2 ">
                  <Form.Group controlId="WorksToShow">
                    <Form.Label>{t('WorksToShow')}</Form.Label>
                    <Form.Control className="mb-2" type="text" defaultValue={bo?.FeaturedWorks || ''} />
                  </Form.Group>
                </Col>
              </div>
              <div className="d-flex justify-content-center justify-content-lg-end">
                <Button variant="primary" type="submit" className="text-white mb-5" style={{ width: '12em' }}>
                  {t('Save')}
                  {isLoadingBackOffice && <Spinner animation="grow" variant="info" size="sm" className="ms-1" />}
                </Button>
              </div>
            </Form>
          </TabPane>

          <TabPane eventKey="export-participants"></TabPane>
        </TabContent>
      </TabContainer>
      <Button variant='danger' className='text-white my-1' onClick={removeNotificationsSinceLastMonth}>Remove old notifications</Button>

    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = (await getSession(ctx));
  if (session == null || !session.user.roles.includes('admin')) {
    return { props: { notFound: true } };
  }

  return {
    props: {},
  };
};

export default BackOffice;
