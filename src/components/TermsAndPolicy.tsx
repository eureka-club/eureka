import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent,useRef } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useMutation } from "react-query";
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import styles from './TermsAndPolicy.module.css';


const TermsAndPolicy: FunctionComponent = () => {
  const { t } = useTranslation('signUpForm');

  return (
    <>
    <Container className='p-lg-0 m-lg-0'>
    <Row className='d-flex justify-content-between'>
          <Col className={`d-none d-lg-flex col-6 ${styles.welcomeSection}`}>
              <section className={`d-flex flex-column w-100 ${styles.welcomeSectionText}`}>
                    <p className={`ms-5 ${styles.welcomeText}`}>{t('Welcome')}</p>
                    <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText1')}</p>
                    <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText2')}</p>
                  <Container className={`${styles.imageContainer} d-flex flex-column align-items-center justify-content-center`}>
                   <Link href="/" replace>  
                        <img  className={` cursor-pointer ${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" /> 
                    </Link>
                    <Link href="/" replace>  
                        <p  className={`mt-5 cursor-pointer text-white ${styles.VisitEurekaText}`}>{t('VisitEureka')} </p> 
                    </Link>
                  </Container>
              </section>
          </Col>
          <Col className={`col-12 col-lg-6`}>
          

          
          </Col>
          </Row>
          </Container>
          </>
  );
};

export default TermsAndPolicy;
