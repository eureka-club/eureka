import { useSession, signIn, signOut } from "next-auth/react";
import {Form, Spinner} from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent,useState,useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import { useToasts } from 'react-toast-notifications'

import styles from './ResetPassForm.module.css';
import { json } from "stream/consumers";
import { useRouter } from "next/router";

interface Props{
  userId:string;
  email:string;
}
const ResetPassForm: FunctionComponent<Props> = ({userId,email}) => {
  const { t } = useTranslation('PasswordRecovery');
  const router = useRouter();
  const {addToast} = useToasts();
  const [validated,setValidated] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading,setLoading] = useState<boolean>(false);

  const handlerSubmit = async (e:React.MouseEvent<HTMLButtonElement>)=>{
    setLoading(true)
    const form = formRef.current;    
    const url = `/api/user/${userId}/resetPass`;
    if(!form)return;
    if (form.checkValidity() === false) {
      e.preventDefault();
      return;
    }
    setValidated(true);

    const password = form.password.value;
    const ConfirmPassword = form.ConfirmPassword.value;
    if(ConfirmPassword!==password){
      addToast('Passwords are differents');
      return;
    }
    const res = await fetch(url,{
      method:'PATCH',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({
        password
      })
    });
    if(res){
      const data = await res.json();
      if(data){
        signIn('credentials' ,{
          redirect:false,
          email,
          password
        })
        .then(res=>{
          const r = res as unknown as {error:string}
          if(res && r.error)
            addToast('Invalid session',{
              appearance:'warning',
              autoDismiss:true,                
          })
          else{
            router.push(localStorage.getItem('loginRedirect') || '/')
          }
            
        })
      }
    }

  }


  return (
    <Container>
        <Container className={`${styles.headerContainer}`}>
         <Link href="/" replace>  
        <img  className={`cursor-pointer ${styles.eurekaImage}`} src="/logo.svg" alt="Eureka" /> 
        </Link>
        <p className={styles.EurekaText}>EUREKA</p>
        </Container>
      
        <div className="d-flex flex-column align-items-center justify-content-center">
        <p className={`${styles.resetPassword}`}>{t('resetPassword')}</p>
          
        </div>
            <div className="mb-5 d-flex justify-content-center">
             <Form ref={formRef} className={`d-flex flex-column ${styles.sendForm}`} validated={validated}>
                 <Form.Group controlId="password">
                    <Form.Label>{t('NewpasswordFieldLabel')}</Form.Label>
                    <Form.Control type="password" name="password" required />
                  </Form.Group>
                  <Form.Group controlId="ConfirmPassword">
                    <Form.Label>{t('ConfirmNewpasswordFieldLabel')}</Form.Label>
                    <Form.Control type="password" required />
                  </Form.Group>
                 <div className="d-flex justify-content-center">
                  <Button disabled={loading} onClick={handlerSubmit} variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('resetPassword1')} {loading && <Spinner animation="grow" />}
                </Button>
                </div>
              </Form>
            </div>
    </Container>
  );
};

export default ResetPassForm;
