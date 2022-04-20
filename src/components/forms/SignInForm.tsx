import { useSession, signIn, signOut } from "next-auth/react";
import {Form} from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent,useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import Row from 'react-bootstrap/Row';
import Link from 'next/link'

import styles from './SignInForm.module.css';

interface Props {
  noModal?: boolean;
}

const SignInForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t } = useTranslation('signInForm');
  const formRef=useRef<HTMLFormElement>(null)

  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    signIn('google');
  };

  /*const handleEmailLoginSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
debugger;
    const form = ev.currentTarget;
    const email = form.email.value;

    signIn('email', { email });
  };*/

    const handleSubmitSignIn = (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current
debugger;
        if(form){
            // signIn()
            signIn('credentials' ,{
                email:form.email.value,
                password:form.password.value
            })
            
        }
    }

  return (
    <Container>
      <ModalHeader className={`mt-5 position-relative ${styles.modalHeader}`} closeButton={!noModal}>
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
              <Form ref={formRef} className={`d-flex flex-column ${styles.loginForm}`}>
                <Form.Group controlId="email">
                  <Form.Label>{t('emailFieldLabel')}</Form.Label>
                  <Form.Control className='mb-2' type="email" required />
                  <div className='d-flex justify-content-between mb-2'><div>{t('passwordFieldLabel')}</div><div className={`d-flex align-items-end ${styles.forgotPassText}`}>{t('forgotPassText')}</div></div>
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Control type="password" required />
                </Form.Group>
                <div className="d-flex justify-content-center">
                <Button type="submit" onClick={handleSubmitSignIn} variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('login')}
                </Button>
                </div>
                 <p className={`mt-5 ${styles.dontHaveAccounttext}`}>{t('dontHaveAccounttext')} <Link href="/register">
                 <a className="">{t('Join')}</a></Link></p>
              </Form>
            </div>
          </Row>
        </div>
      </ModalBody>
    </Container>
  );
};

export default SignInForm;
