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
    <Row>
          <Col className={`col-5 ${styles.welcomeSection}`}>
              <section className={`d-flex flex-column w-100 ${styles.welcomeSectionText}`}>
                    <p className={`ms-5 ${styles.welcomeText}`}>{t('Welcome')}</p>
                    <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText1')}</p>
                    <p className={`ms-5 mb-4 ${styles.otherText}`}>{t('welcomeText2')}</p>
                  <Container className={`${styles.imageContainer} d-flex justify-content-center`}>
                    <img  className={`${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" /> 
                  </Container>
              </section>
          </Col>
          <Col className={`col-7`}>
          <Row>
              <button type="button" className={`d-flex justify-content-center ${styles.buttonGoogle}`}>
                <div className='d-flex justify-content-start justify-content-sm-center mt-2 flex-row'>
                <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
                {t('loginViaGoogle')}
                </div>
              </button>
          </Row>
          <Row>
              <p className={`mb-2 ${styles.alternativeLabel}`}>{t('alternativeText')}</p>
          </Row>
          <Row>
            <div className="d-flex justify-content-center">
              <Form className={`d-flex flex-column ${styles.loginForm}`} >
                <FormGroup controlId="email">
                  <FormLabel>{t('emailFieldLabel')}</FormLabel>
                  <FormControl className='mb-2' type="email" required />
                  <div className='d-flex justify-content-between mb-2'><div>{t('passwordFieldLabel')}</div><div className={`d-flex align-items-end ${styles.forgotPassText}`}>{t('forgotPassText')}</div></div>
                  <FormControl type="password" required />
                </FormGroup>
                <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('login')}
                </Button>
                </div>
                 <p className={`mt-5 ${styles.dontHaveAccounttext}`}>{t('dontHaveAccounttext')} <Link href="/">
                 <a className="">{t('Join')}</a></Link></p>
              </Form>
            </div>
          </Row>
          </Col>
          </Row>

        
        

     {/* <ModalHeader className={`position-relative ${styles.modalHeader}`} closeButton={!noModal}>
        <Container>
        <img  className={`${styles.eurekaImage}`} src="/logo.svg" alt="Eureka" /> 
        <p className={styles.EurekaText}>EUREKA</p>
        </Container>
      </ModalHeader>
      <ModalBody className="pt-0 pb-5">
      
        <div>
        <p className={`${styles.loginGreeting}`}>{t('loginGreeting')}</p>
          <Row>
              <button type="button" onClick={handleSignInGoogle} className={`d-flex justify-content-center ${styles.buttonGoogle}`}>
                <div className='d-flex justify-content-start justify-content-sm-center mt-2 flex-row'>
                <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
                {t('loginViaGoogle')}
                </div>
              </button>
          </Row>
          <Row>
              <p className={`mb-2 ${styles.alternativeLabel}`}>{t('alternativeText')}</p>
          </Row>
          <Row>
            <div className="d-flex justify-content-center">
              <Form className={`d-flex flex-column ${styles.loginForm}`} onSubmit={handleEmailLoginSubmit}>
                <FormGroup controlId="email">
                  <FormLabel>{t('emailFieldLabel')}</FormLabel>
                  <FormControl className='mb-2' type="email" required />
                  <div className='d-flex justify-content-between mb-2'><div>{t('passwordFieldLabel')}</div><div className={`d-flex align-items-end ${styles.forgotPassText}`}>{t('forgotPassText')}</div></div>
                  <FormControl type="password" required />
                </FormGroup>
                <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('login')}
                </Button>
                </div>
                 <p className={`mt-5 ${styles.dontHaveAccounttext}`}>{t('dontHaveAccounttext')} <Link href="/">
                 <a className="">{t('Join')}</a></Link></p>
              </Form>
            </div>
          </Row>
        </div>
      </ModalBody>*/}
    </>
  );
};

export default SignUpForm;
