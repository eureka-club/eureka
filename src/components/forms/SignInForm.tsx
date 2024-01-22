"use client"
import { signIn } from "next-auth/react";
import {Form, Spinner} from 'react-bootstrap';

import { useState, FunctionComponent, MouseEvent,useRef } from 'react';
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './SignInForm.module.css';
import {useModalContext} from '@/src/useModal'
import { useDictContext } from "@/src/hooks/useDictContext";
import { Button, Container } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
interface Props {
  noModal?: boolean;
  logoImage?:boolean;
  joinToCycle?:number;
}

const SignInForm: FunctionComponent<Props> = ({ joinToCycle, noModal = false,logoImage = true }) => {
  // const { t } = useTranslation('signInForm');
  const{t,dict}=useDictContext();debugger;
  const asPath=usePathname()!;
  const router = useRouter();
  const formRef=useRef<HTMLFormElement>(null)
  const [loading,setLoading] = useState(false)
  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if(!noModal)
      localStorage.setItem('loginRedirect', asPath)
    const callbackUrl = !!joinToCycle&&joinToCycle!=-1 
       ? `/cycle/${joinToCycle}?join=true`
       : localStorage.getItem('loginRedirect')?.toString()||'/';
    signIn('google',{ callbackUrl });
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
      toast.error(t(dict,'EmailRequired'))
      setLoading(false)

      return false;
    }
    if(!form!.password.value){
      toast.error(t(dict,'PasswordRequired'))
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
           if(!ur.provider && !ur.hasPassword){
                toast.error(t(dict,'RegisterAlert'))
                    setLoading(false)
           }
           else if(ur.provider=='google'){
            toast.error(t(dict,'RegisteredUsingGoogleProvider'))
            setLoading(false)
           }
           else {
            const callbackUrl = !!joinToCycle&&joinToCycle>0 
            ? `/cycle/${joinToCycle}?join=true`
            : localStorage.getItem('loginRedirect')?.toString()||'/';
            signIn('credentials' ,{
              callbackUrl,
              email:form.email.value,
              password:form.password.value
            })
            .then(res=>{
              const r = res as unknown as {error:string}
              if(res && r.error){
                toast.error(t(dict,'InvalidSesion'))
                setLoading(false)
              }
              else{
                close()
                localStorage.setItem('loginRedirect',asPath)
                router.push(localStorage.getItem('loginRedirect') || '/',{})
                // localStorage.setItem('loginRedirect','');
                // .then(()=>{
                //   localStorage.setItem('loginRedirect','')
                // })
              }
            })
          }
          }
          else{
            toast.error(t(dict,'isNotUser'))
            setLoading(false)

          }
        }

      }
      
const handlerJoinLink = ()=>{
  close()
  router.push(`/register/${joinToCycle??''}`)
}
const handlerRecoveryLogin = ()=>{
  close()
  router.push("/recoveryLogin")
}

  return (
      <>
      <section className={`position-relative ${styles.modalHeader}`}>
        {logoImage && (<Container>
        <Link legacyBehavior  href="/" replace>  
        <img  className={`cursor-pointer ${styles.eurekaImage}`} src="/logo.svg" alt="Eureka" /> 
        </Link>
        <p className={styles.EurekaText}>EUREKA</p>
        </Container>)}
      </section>
      <section className="pt-0">
        <div>
         {logoImage && (<p className={`${styles.loginGreeting}`}>{t(dict,'loginGreeting')}</p>)}
         <div className="py-3 border border-1"  style={{ borderRadius: '0.5em'}}>
          <section>
              <button type="button" onClick={handleSignInGoogle} className={`d-flex justify-content-center fs-6 ${styles.buttonGoogle}`}>
                <div className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}>
                <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
                {t(dict,'loginViaGoogle')}
                </div>
              </button>
          </section>
          <section>
              <span className={`${styles.alternativeLabel}`}>{t(dict,'alternativeText')}</span>
          </section>
          <section>
            <div className="d-flex justify-content-center">
              <Form ref={formRef} className={`d-flex flex-column fs-6 ${styles.loginForm}`} data-cy="login-form">
                <Form.Group controlId="email">
                  <Form.Label>{t(dict,'emailFieldLabel')}</Form.Label>
                  <Form.Control className='' type="email" required />
                  <div className='d-flex justify-content-between mb-1 mt-2'><div>{t(dict,'passwordFieldLabel')}</div>
                    {/* <Link legacyBehavior  href="/recoveryLogin" passHref> */}
                      <Button onClick={handlerRecoveryLogin}  className={`btn-link d-flex link align-items-end cursor-pointer ${styles.forgotPassText}`}>{t(dict,'forgotPassText')}</Button>
                    {/* </Link> */}
                  </div>
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Control type="password" required />
                </Form.Group>
                <div className="d-flex justify-content-center">
                <Button data-cy='btn-login' disabled={loading} onClick={handleSubmitSignIn} className={`btn-eureka ${styles.submitButton} me-1`}>
                  {t(dict,'login')} {loading && <Spinner animation="grow" size='sm'/>}
                </Button>
                </div>
              </Form>
                 
            </div>
          </section>
          </div>
          <p className={`mt-2 ${styles.registerNotice}`}>{t(dict,'RegisterNotice')}</p>
          <p className={`fs-6 ${styles.dontHaveAccounttext} mb-0 pb-0`}>{t(dict,'dontHaveAccounttext')} 
            <Button onClick={handlerJoinLink} className="text-primary fs-5 ">
            {t(dict,'Join')}
            </Button>
          </p>
        </div>
      </section>
    </>
  );
};

export default SignInForm;
