import { GetServerSideProps, NextPage } from 'next';
//import { getSession } from 'next-auth/react';
import { useState,useRef,RefObject } from 'react';

import useTranslation from 'next-translate/useTranslation';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import {
  TabPane,
  TabContent,
  TabContainer,
  Row,
  Col,
  ButtonGroup,
  Button,
  Nav,
  NavItem,
  NavLink,
  Form,
  Spinner,
} from 'react-bootstrap';
import styles from './back-office.module.css'
import CropImageFileSelect from '@/components/forms/controls/CropImageFileSelect';


const BackOffice: NextPage = ({  }) => {
  const { t } = useTranslation('backOffice');
  const [tabKey, setTabKey] = useState<string>();
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [showCrop, setShowCrop] = useState<boolean>(false);
  
  const [imageFile1, setImageFile1] = useState<File | null>(null);
  const [imageFile2, setImageFile2] = useState<File | null>(null);
  const [imageFile3, setImageFile3] = useState<File | null>(null);
  const [image1, setImage1] = useState<string | undefined>();
  const [image2, setImage2] = useState<string | undefined>();
  const [image3, setImage3] = useState<string | undefined>();

  const formRef = useRef<HTMLFormElement>() as RefObject<HTMLFormElement>;

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

  return (
    <SimpleLayout title={t('Admin Panel')}>
       <h1 className='text-secondary me-1 mb-4'><b>{t('Admin Panel')}</b></h1>
      <TabContainer
         onSelect={handleSubsectionChange}
         activeKey={ tabKey || "explorer-page"}
         transition={false}
      > 
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
            
            <Nav variant="tabs" className='scrollNav' fill>
                <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
                  <NavLink eventKey="explorer-page">
                      <span className="mb-3">
                      {t('Explore Page')}
                      </span>
                  </NavLink>
                </NavItem>
                <NavItem className={`border-primary border-bottom cursor-pointer  ${styles.tabBtn}`}>
                  <NavLink eventKey="export-participants">
                      <span className="mb-3">
                      {t('Export Cycle Participants')}
                      </span>
                  </NavLink>
                </NavItem>
              </Nav>
       
              <TabContent>
                  <TabPane eventKey="explorer-page">     
                      <h2 className='text-secondary mt-3 mb-3'><b>{t('Banner Settings')}</b></h2>

                    <Form ref={formRef} className={`d-flex flex-column`} >

                       <Row className='col-12 px-4 py-2 d-flex flex-column flex-lg-row justify-content-around'>
                          <Col className='col-12 col-lg-4 mb-4'>
                             <h5 className='text-secondary mb-2'><b>{t('Slider 1')}</b></h5>

                              <Form.Group  controlId="TitleSlider1">
                                  <Form.Label>{t('Title')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>
                              <Form.Group  controlId="TextSlider1">
                                  <Form.Label>{t('Text')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>

                              {(!showCrop && currentSlider != 1) && (<Button data-cy="image-load" variant="primary" className="w-50 text-white mt-2  mb-3" onClick={() => openCrop(1)}>
                                {t('Image')}
                              </Button>
                              )}        
                              { (showCrop && currentSlider == 1) && (
                              <Row className='d-flex'>
                                <div className='w-100 border p-3'>  
                                <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={()=> closeCrop()} cropShape='rect' />
                                </div>  
                              </Row>                        
                            )}      
                            { image1  && (<Row><img className={styles.Image} src={image1}  alt='' /></Row>)}
                          </Col>  
                         <Col className='col-12 col-lg-4 mb-4'>
                              <h5 className='text-secondary mb-2'><b>{t('Slider 2')}</b></h5>
                               <Form.Group  controlId="TitleSlider2">
                                  <Form.Label>{t('Title')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>
                              <Form.Group  controlId="TextSlider2">
                                  <Form.Label>{t('Text')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>

                              {(!showCrop && currentSlider != 2) && (<Button data-cy="image-load" variant="primary" className="w-50 text-white mt-2 mb-3" onClick={() => openCrop(2)}>
                                {t('Image')}
                              </Button>
                              )}        
                              { (showCrop && currentSlider == 2) && (
                              <Row className='d-flex'>
                                <div className='w-100 border p-3'>  
                                <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={()=> closeCrop()} cropShape='rect' />
                                </div>  
                              </Row>
                            )}      
                            { image2  && (<Row><img className={styles.Image} src={image2}  alt='' /></Row>)}
                          </Col>     
                         <Col className='col-12 col-lg-4 mb-4'>
                              <h5 className='text-secondary mb-2'><b>{t('Slider 3')}</b></h5>
                              
                               <Form.Group  controlId="TitleSlider2">
                                  <Form.Label>{t('Title')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>
                              <Form.Group  controlId="TextSlider2">
                                  <Form.Label>{t('Text')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>

                              {(!showCrop && currentSlider != 3) && (<Button data-cy="image-load" variant="primary" className="w-50 text-white mt-2 mb-3" onClick={() => openCrop(3)}>
                                {t('Image')}
                              </Button>
                              )}        
                              { (showCrop && currentSlider == 3) && (
                              <Row className='d-flex'>
                                <div className='w-100 border p-3'>  
                                <CropImageFileSelect onGenerateCrop={onGenerateCrop} onClose={()=> closeCrop()} cropShape='rect' />
                                </div>  
                              </Row>
                            )}      
                            { image3  && (<Row><img className={styles.Image} src={image3}  alt='' /></Row>)}
                          </Col>  
                      </Row>

                      <h2 className='text-secondary mt-3 mb-3'><b>{t('Content Page')}</b></h2>
                       <div className="py-2 d-flex flex-column flex-lg-row justify-content-between">
                       <Col className="col-12 col-lg-6 px-2 ">
                              <Form.Group  controlId="CyclesToShow" >
                                  <Form.Label>{t('CyclesToShow')}</Form.Label>
                                  <Form.Control className='mb-2' type="text"/>
                              </Form.Group>
                       </Col>         
                      <Col className="col-12 col-lg-6 px-2">
                              <Form.Group  controlId="PostToShow">
                                  <Form.Label>{t('PostToShow')}</Form.Label>
                                  <Form.Control className='mb-4' type="text"/>
                              </Form.Group>
                       </Col>       
                       </div>
                       <div className='d-flex justify-content-center justify-content-lg-end'> 
                       <Button variant="primary" className="text-white mb-5" style={{width:'12em'}}>{t('Save')}</Button>
                       </div>

                      </Form>
                  </TabPane>
            
                  <TabPane eventKey="export-participants">
                    Export specific Cycle Participants Function HERE!!!
                  </TabPane>
              </TabContent>     
       </TabContainer>
    </SimpleLayout>
  );
};

export default BackOffice;
