import { signIn } from "next-auth/react";
import {Form, Spinner} from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useState, FunctionComponent, MouseEvent,useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ModalBody from 'react-bootstrap/ModalBody';
import ModalHeader from 'react-bootstrap/ModalHeader';
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './SignInForm.module.css';
import {useRouter} from 'next/router'
import {useModalContext} from '@/src/useModal'
interface Props {
  noModal?: boolean;
  logoImage?:boolean
}

const SignInForm: FunctionComponent<Props> = ({ noModal = false,logoImage = true }) => {
  const router = useRouter()
  const { t } = useTranslation('signInForm');
  const formRef=useRef<HTMLFormElement>(null)
  const [loading,setLoading] = useState(false)
  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();

    signIn('google');
  };

  const {close} = useModalContext()
  const userRegistered = async (email:string)=>{
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if(res.ok){
      return res.json();
    }
    return null;
  }

  const handleSubmitSignIn = async (e:React.MouseEvent<HTMLButtonElement>)=>{
    const form = formRef.current;
    setLoading(true);
    if(!form!.email.value){
      toast.error(t('EmailRequired'))
      setLoading(false)

      return false;
    }
    if(!form!.password.value){
      toast.error(t('PasswordRequired'))
      setLoading(false)

      return false;
    }
    if(form){
      const ur = await userRegistered(form.email.value);
          if(!ur){
            toast.error('Error');
            setLoading(false)

            return;
          }
          if(ur.isUser){
           if(!ur.hasPassword){
                toast.error(t('RegisterAlert'))
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
                toast.error(t('InvalidSesion'))
                setLoading(false)
              }
              else{
               close()
                router.push(localStorage.getItem('loginRedirect') || '/')
              }
            })
          }
          }
          else{
            toast.error(t('isNotUser'))
            setLoading(false)

          }
        }

      }
      
const handlerJoinLink = ()=>{
  close()
  router.push("/register")
}
const handlerRecoveryLogin = ()=>{
  close()
  router.push("/recoveryLogin")
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
      <ModalBody className="pt-0">
        <div>
         {logoImage && (<p className={`${styles.loginGreeting}`}>{t('loginGreeting')}</p>)}
         <div className="py-4 border border-1"  style={{ borderRadius: '0.5em'}}>
          <Row>
              <button type="button" onClick={handleSignInGoogle} className={`d-flex justify-content-center fs-6 ${styles.buttonGoogle}`}>
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
              <Form ref={formRef} className={`d-flex flex-column fs-6 ${styles.loginForm}`} data-cy="login-form">
                <Form.Group controlId="email">
                  <Form.Label>{t('emailFieldLabel')}</Form.Label>
                  <Form.Control className='' type="email" required />
                  <div className='d-flex justify-content-between mb-1 mt-2'><div>{t('passwordFieldLabel')}</div>
                    {/* <Link href="/recoveryLogin" passHref> */}
                      <Button onClick={handlerRecoveryLogin} variant="link" className={`btn-link d-flex link align-items-end cursor-pointer ${styles.forgotPassText}`}>{t('forgotPassText')}</Button>
                    {/* </Link> */}
                  </div>
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Control type="password" required />
                </Form.Group>
                <div className="d-flex justify-content-center">
                <Button data-cy='btn-login' disabled={loading} onClick={handleSubmitSignIn} className={`btn-eureka ${styles.submitButton} me-1`}>
                  {t('login')} {loading && <Spinner animation="grow" size='sm'/>}
                </Button>
                </div>
              </Form>
                 
            </div>
          </Row>
          </div>
          <p className={`mt-3 ${styles.registerNotice}`}>{t('RegisterNotice')}</p>
          <p className={`fs-6 ${styles.dontHaveAccounttext}`}>{t('dontHaveAccounttext')} 
            <Button onClick={handlerJoinLink} className="text-primary" variant="link">
            {t('Join')}
            </Button>
          </p>
        </div>
      </ModalBody>
    </>
  );
};

export default SignInForm;
