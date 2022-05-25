import { useSession, signIn, signOut } from "next-auth/react";
import {Form, Spinner} from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useState, FunctionComponent, MouseEvent,useRef } from 'react';
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
import { useToasts } from 'react-toast-notifications'

import styles from './SignInForm.module.css';
import {useRouter} from 'next/router'
interface Props {
  noModal?: boolean;
  logoImage?:boolean
}

const SignInForm: FunctionComponent<Props> = ({ noModal = false,logoImage = true }) => {
  const { addToast } = useToasts()
  const router = useRouter()
  const { t } = useTranslation('signInForm');
  const formRef=useRef<HTMLFormElement>(null)
  const [loading,setLoading] = useState(false)

  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    signIn('google');
  };

  /*const handleEmailLoginSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const email = form.email.value;

    signIn('email', { email });
  };*/

  const userRegistered = async (email:string)=>{
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if(res.ok){
      const {data} = await res.json()
      return data;
    }
    return false;
  }

  const handleSubmitSignIn = async (e:React.MouseEvent<HTMLButtonElement>)=>{
      const form = formRef.current;
      setLoading(true)
         if(!form!.email.value){
            addToast(t('EmailRequired'),{
                  appearance:'warning',
                  autoDismiss:true,                
                })
                setLoading(false)
                return false;
          }
      if(form){
          const ur = await userRegistered(form.email.value)
          if(ur.isUser){
           if(ur.hasOwnProperty('hasPassword') && !ur.hasPassword){
                addToast(t('RegisterAlert'),{
                     appearance:'warning',
                     autoDismiss:true,                
                     })
                    setLoading(false)
           }
           else {
            signIn('credentials' ,{
              redirect:false,
              email:form.email.value,
              password:form.password.value
            })
            .then(res=>{
              const r = res as unknown as {error:string}
              if(res && r.error){
                addToast(t('InvalidSesion'),{
                  appearance:'warning',
                  autoDismiss:true,                
                })
                setLoading(false)
              }
              else{
                router.push(localStorage.getItem('loginRedirect') || '/')
              }
            })
          }
          }
          else{
            addToast(t('isNotUser'),{
              appearance:'warning',
              autoDismiss:true,                
            })
            setLoading(false)

          }
        }
      }
      

  return (
      <>
      <ModalHeader className={`position-relative ${styles.modalHeader}`} closeButton={!noModal}>
        {logoImage && (<Container>
        <Link href="/" replace>  
        <img  className={`cursor-pointer ${styles.eurekaImage}`} src="/logo.svg" alt="Eureka" /> 
        </Link>
        <p className={styles.EurekaText}>EUREKA</p>
        </Container>)}
      </ModalHeader>
      <ModalBody className="pt-0 pb-5">
      
        <div>
         {logoImage && (<p className={`${styles.loginGreeting}`}>{t('loginGreeting')}</p>)}
          <Row>
              <button type="button" onClick={handleSignInGoogle} className={`d-flex justify-content-center ${styles.buttonGoogle}`}>
                <div className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}>
                <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
                {t('loginViaGoogle')}
                </div>
              </button>
          </Row>
          <Row>
              <span className={`${styles.alternativeLabel}`}>{t('alternativeText')}</span>
          </Row>
          <Row>
            <div className="d-flex justify-content-center">
              <Form ref={formRef} className={`d-flex flex-column ${styles.loginForm}`}>
                <Form.Group controlId="email">
                  <Form.Label>{t('emailFieldLabel')}</Form.Label>
                  <Form.Control className='mb-2' type="email" required />
                  <div className='d-flex justify-content-between mb-2'><div>{t('passwordFieldLabel')}</div>
                    <Link href="/recoveryLogin" passHref>
                      <div className={`d-flex align-items-end cursor-pointer ${styles.forgotPassText}`}>{t('forgotPassText')}</div>
                    </Link>
                  </div>
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Control type="password" required />
                </Form.Group>
                <div className="d-flex justify-content-center">
                <Button disabled={loading} onClick={handleSubmitSignIn} variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('login')} {loading && <Spinner animation="grow"/>}
                </Button>
                </div>
                 <p className={`my-4 ${styles.registerNotice}`}>{t('RegisterNotice')}</p>
                 <p className={`${styles.dontHaveAccounttext}`}>{t('dontHaveAccounttext')} <Link href="/register">
                 <a className="">{t('Join')}</a></Link></p>
              </Form>
            </div>
          </Row>
        </div>
      </ModalBody>
    </>
  );
};

export default SignInForm;
