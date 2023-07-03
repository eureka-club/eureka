
import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Link from 'next/link'
import styles from './HomeNotSingIn.module.css';
import SignInForm from '@/src/components/forms/SignInForm';
import { BsChevronDown} from 'react-icons/bs';

const HomeNotSingIn: FunctionComponent = ({  }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  return  <>
            <div className='pt-2 mt-1 pt-lg-5 mt-lg-5'>
                 <section className='d-flex flex-column justify-content-center align-items-center text-center mt-lg-3'>
                        <h1 className='d-flex flex-column flex-md-row justify-content-center flex-wrap'>
                                <b className='text-secondary me-2'>{t('infoText1')}</b>
                                <b className='text-primary me-2'>{t('infoText2')}</b>
                                <b className='text-secondary'>{t('infoText3')}</b>
                        </h1>
                        <h2 className='text-secondary mt-1 mb-4' style={{fontSize:'1.25rem'}}>{t('infoSubText')}</h2>

                 </section>
                <Row className='d-flex flex-column-reverse flex-lg-row justify-content-center'>
                        <Col className={`col-12 col-lg-4`}>
                        <div className='d-flex justify-content-center justify-content-lg-start'>
                                <img  className={`${styles.arquimedesImage}`} src="/arquimedes-es-en-fr-pt.webp" alt="Eureka" /> 
                        </div>
                        </Col>
                        <Col className={`col-12 col-lg-4`}>
                            <div className='d-flex justify-content-center flex-column flex-lg-row  mt-4' >
                            <SignInForm noModal logoImage={false} />
                            </div>
                        </Col>
                </Row>
                <section className='d-flex flex-row justify-content-center align-items-baseline mb-0'>
                        <span className='d-flex flex-row  text-primary' style={{fontSize:'1.25rem'}}>{t('HowWorkText')}</span><div className={`ms-1 fs-6 text-primary ${styles.downArrow}`}><BsChevronDown/></div>
                 </section>
          </div>   

        <div className='d-flex flex-column  m-0'>
                 <Row className='d-flex flex-column flex-lg-row justify-content-center'>
                          <Col className={`${styles.WorkSection} col-12 col-lg-6 p-5 d-flex flex-column justify-content-center aling-items-center`}>
                              <h2 className='d-flex justify-content-center text-center text-white' style={{fontWeight:900,fontSize:'1.9rem'}}>{t('WorkSectionText')}</h2>
                              <h3 className='d-flex justify-content-center text-center text-white mt-4' style={{fontStyle:'italic',fontSize:'1.25rem'}}>{t('WorkSectionSubText')}</h3>    
                        </Col>
                        <Col className={`p-3 p-lg-5 col-12 col-lg-6 border-top border-primary ${styles.WorkSectionImageContainer}`}>
                          <Container className='d-flex justify-content-center '>
                             <img  className={`ms-0  ${styles.WorkSectionImage}`} src={`/find-works-${router.locale}.webp`} alt="" /> 
                          </Container>
                        </Col>
                </Row>
                 <Row className='d-flex flex-column-reverse flex-lg-row justify-content-center'>
                      <Col className={`p-3 p-lg-4 col-12 col-lg-6`}>
                        <Container className='d-flex justify-content-center'>
                             <img  className={`ms-0 ${styles.CyclesSectionImage}`} src={`/join-cycle-${router.locale}.webp`} alt="" /> 
                          </Container>
                        </Col>
                        <Col className={`${styles.CyclesSection} col-12 col-lg-6 p-5 d-flex flex-column justify-content-center aling-items-center`}>
                              <h2 className='d-flex justify-content-center text-center text-white' style={{fontWeight:900,fontSize:'1.9rem'}}>{t('CyclesSectionText')}</h2>
                              <h3 className='d-flex justify-content-center text-center text-white mt-4' style={{fontStyle:'italic',fontSize:'1.25rem'}}>{t('CyclesSectionSubText')}</h3>    
                        </Col>
                </Row>
                <Row className='d-flex flex-column flex-lg-row '>
                        <Col className={`${styles.EurekaSection} p-3 p-lg-4 col-12 col-lg-6 d-flex flex-column justify-content-center aling-items-center`}>
                         <h2 className='d-flex flex-wrap text-center justify-content-center'>
                                <span className='text-white me-2' style={{fontWeight:600,fontSize:'1.9rem'}}>{t('EurekaSectionText1')}</span>
                                <span className='text-primary me-2' style={{fontWeight:600,fontSize:'1.9rem'}}>{ t('EurekaSectionText2')}</span>
                                <span className='text-white' style={{fontWeight:600,fontSize:'1.9rem'}}>{t('EurekaSectionText3')}</span>
                        </h2>
                        <h3 className='d-flex justify-content-center text-center text-white mt-4' style={{fontStyle:'italic',fontSize:'1.25rem'}}>{t('EurekaSectionSubText')}</h3>    
                        </Col>
                        <Col className={`p-4 col-12 col-lg-6 border-bottom border-secondary`}>
                          <Container className='d-flex justify-content-center'>
                             <img  className={`ms-0 ${styles.EurekaSectionImage}`} src={`/Eurekas-${router.locale}.webp`} alt="" /> 
                          </Container>                        
                        </Col>
                </Row>   
          </div>   
         <div className='m-0 m-lg-5'>
          <Row className='mt-4 d-flex flex-column flex-lg-row '>
                        <Col className="d-flex flex-column justify-content-center align-items-center">
                           <Button onClick={()=> window.scrollTo(0, 60)}  className={` btn-eureka ${styles.submitButton}`}>
                                {t('signInForm:login')} 
                           </Button>
                           <p className={`mt-1 text-secondary ${styles.dontHaveAccounttext}`}>{t('signInForm:dontHaveAccounttext')} <Link href="/register">
                           <a className="text-secondary text-decoration-underline">{t('signInForm:Join')}</a></Link></p>
                        </Col>
                        <Col className="d-flex flex-column justify-content-center align-items-center ">
                                <Link href='/explore'>
                                        <Button  data-cy="btn-explore" className={` btn-eureka ${styles.submitButton}`}>
                                                {t('Explore')} 
                                        </Button>
                                </Link>
                           {/* <Button data-cy="btn-explore" onClick={()=> router.push('/explore')} variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                           {t('Explore')} 
                           
                           </Button> */}
                           <p className={`mt-1 text-center text-secondary ${styles.dontHaveAccounttext}`}>{t('ExploreText')}</p>
                        </Col>
                </Row> 
          </div>  
        </>    
}
export default HomeNotSingIn;