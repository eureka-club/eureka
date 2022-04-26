import { useSession, signIn, signOut } from "next-auth/react";
import {Form} from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent,useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import { useToasts } from 'react-toast-notifications'

import styles from './ResetPassForm.module.css';


const ResetPassForm: FunctionComponent = () => {
   const { t } = useTranslation('PasswordRecovery');
  const {addToast} = useToasts();
  const [validated,setValidated] = useState<boolean>(false);

  const handlerSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
   /* const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);*/
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
             <Form className={`d-flex flex-column ${styles.sendForm}`} onSubmit={handlerSubmit} action='' validated={validated} method='POST'>
                 <Form.Group controlId="password">
                    <Form.Label>{t('NewpasswordFieldLabel')}</Form.Label>
                    <Form.Control type="password" required />
                  </Form.Group>
                  <Form.Group controlId="ConfirmPassword">
                    <Form.Label>{t('ConfirmNewpasswordFieldLabel')}</Form.Label>
                    <Form.Control type="password" required />
                  </Form.Group>
                 <div className="d-flex justify-content-center">
                  <Button type='submit' variant="primary text-white" className={`d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('resetPassword1')}
                </Button>
                </div>
              </Form>
            </div>
    </Container>
  );
};

export default ResetPassForm;
