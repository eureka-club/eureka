import { signIn } from 'next-auth/client';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Link from 'next/link'

import styles from './SignUpForm.module.css';

interface Props {
  noModal?: boolean;
}

const SignUpForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t } = useTranslation('signUpForm');


  return (
    <>
    <section className={`${styles.welcomeMobileSection}`}>
      <div className='d-flex d-lg-none flex-column justify-content-center'>
      <p className={`mt-3 ${styles.welcomeText}`}>{t('Welcome')}</p>
        <Container className={`${styles.imageContainer} d-flex justify-content-center`}>
           <img  className={`${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" /> 
         </Container>
     </div>
    </section>
    <Container className='p-lg-0 m-lg-0'>
    <Row className='d-flex justify-content-between'>
          <Col className={`d-none d-lg-flex col-6 ${styles.welcomeSection}`}>
              <section className={`d-flex flex-column w-100 ${styles.welcomeSectionText}`}>
                    <p className={`ms-5 ${styles.welcomeText}`}>{t('Welcome')}</p>
                    <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText1')}</p>
                    <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText2')}</p>
                  <Container className={`${styles.imageContainer} d-flex justify-content-center`}>
                    <img  className={`${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" /> 
                  </Container>
              </section>
          </Col>
          <Col className={`col-12 col-lg-6`}>
            <div className={`${styles.registerFormSection}`}>
          <Row > 
              <span className={`ms-3 ${styles.joinEurekaText}`}>{t('JoinEureka')}</span>
              <p className={`${styles.haveAccounttext}`}>{t('HaveAccounttext')} <Link href="/login">
                 <a className="">{t('Login')}</a></Link></p>
              <button type="button" className={`d-flex justify-content-center ${styles.buttonGoogle}`}>
                <div className='d-flex justify-content-start justify-content-sm-center mt-2 flex-row'>
                <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
                {t('joinViaGoogle')}
                </div>
              </button>
          </Row>
          <Row>
              <p className={`mb-3 ${styles.alternativeLabel}`}>{t('alternativeText')}</p>
          </Row>
          <Row>
            <div className="d-flex justify-content-center">
              <Form className={`d-flex flex-column ${styles.registerForm}`} >
                 <FormGroup className='d-flex flex-column flex-lg-row justify-content-between' controlId="name">
                     <div className={`d-flex flex-column ${styles.personalData}`}>
                       <FormLabel>{t('Name')}</FormLabel>
                       <FormControl className='mb-2' type="text" required />
                     </div>
                     <div className={`d-flex flex-column ${styles.personalData}`}>
                       <FormLabel>{t('LastName')}</FormLabel>
                       <FormControl className='mb-2' type="text" required />  
                     </div>
                    </FormGroup>
                <FormGroup controlId="email">
                  <FormLabel>{t('emailFieldLabel')}</FormLabel>
                  <FormControl className='mb-2' type="email" required />
                  <FormLabel>{t('passwordFieldLabel')}</FormLabel>
                  <FormControl type="password" required />
                </FormGroup>
                <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary text-white" className={`mb-4 d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('Join')}
                </Button>
                </div>
              </Form>
            </div>
          </Row>
          </div>
          </Col>
          </Row>
          </Container>
          </>
  );
};

export default SignUpForm;
