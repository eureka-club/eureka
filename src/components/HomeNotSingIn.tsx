
import { FunctionComponent,useState } from 'react';
import SimpleLayout from '@/src/components/layouts/SimpleLayout';
import useTranslation from 'next-translate/useTranslation';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link'
import styles from './HomeNotSingIn.module.css';
import SignInForm from '@/src/components/forms/SignInForm';

const HomeNotSingIn: FunctionComponent = ({  }) => {
  const { t } = useTranslation('common');


  return <SimpleLayout allPageSize={true} title={t('browserTitleWelcome')}> 
         <div className='pt-2 m-1 pt-lg-5 m-lg-5'>
                 <section className='d-flex flex-column justify-content-center align-items-center'>
                        <span className='d-flex flex-column flex-md-row border-bottom border-primary'>
                                <h1 className='text-secondary me-1 mb-3'><b>{t('infoText1')}</b></h1>
                                <h1 className='text-primary me-1 mb-3'><b>{ t('infoText2')}</b></h1>
                                <h1 className='text-secondary me-1 mb-3'><b>{t('infoText3')}</b></h1>
                        </span>
                        <h5 className='text-secondary mt-3'>{t('infoSubText')}</h5>

                 </section>
                <Row className='d-flex flex-column-reverse flex-lg-row justify-content-center'>
                        <Col className={`col-12 col-lg-6`}>
                        <Container className='d-flex justify-content-center justify-content-lg-end'>
                                <img  className={`ms-0 ms-lg-5 ${styles.arquimedesImage}`} src="/arquimedes-es-en-fr-pt.png" alt="Eureka" /> 
                        </Container>
                        </Col>
                        <Col className={`col-12 col-lg-6 mt-3`}>
                            <SignInForm noModal logoImage={false} />
                        </Col>
                </Row>
                <section className='d-flex flex-column justify-content-center align-items-center'>
                        <h5 className='d-flex flex-row text-primary'>{t('HowWorkText')}</h5>
                 </section>
          </div>   

   <div className='d-flex flex-column  m-0 m-lg-3'>
                 <Row className='d-flex flex-column flex-lg-row justify-content-center'>
                          <Col className={`${styles.WorkSection} col-12 col-lg-6 p-5 d-flex flex-column justify-content-center aling-items-center`}>
                              <h1 className='d-flex justify-content-center text-secondary me-1'>{t('WorkSectionText')}</h1>
                              <h5 className='d-flex justify-content-center text-secondary mt-5'>{t('WorkSectionSubText')}</h5>    
                        </Col>
                        <Col className={`p-3 p-lg-5 col-12 col-lg-6 border-top border-primary`}>
                          <Container className='d-flex justify-content-center '>
                             <img  className={`ms-0 ms-lg-5 ${styles.WorkSectionImage}`} src="/find-works-FR.png" alt="" /> 
                          </Container>
                        </Col>
                </Row>
                 <Row className='d-flex flex-column-reverse flex-lg-row justify-content-center'>
                      <Col className={`p-3 p-lg-4 col-12 col-lg-6`}>
                        <Container className='d-flex justify-content-center'>
                             <img  className={`ms-0 ms-lg-5 ${styles.CyclesSectionImage}`} src="/join-cycle-FR.png" alt="" /> 
                          </Container>
                        </Col>
                        <Col className={`${styles.CyclesSection} col-12 col-lg-6 p-5 d-flex flex-column justify-content-center aling-items-center`}>
                              <h1 className='d-flex justify-content-center text-secondary me-1'>{t('CyclesSectionText')}</h1>
                              <h5 className='d-flex justify-content-center text-secondary mt-5'>{t('CyclesSectionSubText')}</h5>    
                        </Col>
                </Row>
                <Row className='d-flex flex-column flex-lg-row '>
                        <Col className={`${styles.EurekaSection} p-3 p-lg-4 col-12 col-lg-6 d-flex flex-column justify-content-center aling-items-center`}>
                              <span className='d-flex flex-wrap justify-content-center'>
                                <h1 className='text-white me-1'>{t('EurekaSectionText1')}</h1>
                                <h1 className='text-primary me-1'>{ t('EurekaSectionText2')}</h1>
                                <h1 className='text-white me-1'>{t('EurekaSectionText3')}</h1>
                        </span>
                        <h5 className='d-flex justify-content-center text-white mt-5'>{t('EurekaSectionSubText')}</h5>    
                        </Col>
                        <Col className={`p-4 col-12 col-lg-6`}>
                          <Container className='d-flex justify-content-center'>
                             <img  className={`ms-0 ms-lg-5 ${styles.EurekaSectionImage}`} src="/share-eureka-FR.png" alt="" /> 
                          </Container>                        
                        </Col>
                </Row>   
          </div>   
        </SimpleLayout>



}
export default HomeNotSingIn;