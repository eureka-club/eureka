import {Form, Spinner} from 'react-bootstrap';
import { FunctionComponent,useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Link from 'next/link'
import toast from 'react-hot-toast'

import styles from './RecoveryLoginForm.module.css';
import { useDictContext } from '@/src/hooks/useDictContext';
import { t as t_} from '@/src/get-dictionary';


const RecoveryLoginForm: FunctionComponent = () => {
  //  const { t } = useTranslation('PasswordRecovery');
  const{dict}=useDictContext()
  const t=(s:string)=>t_(dict,s)
  
  const [validated,setValidated] = useState<boolean>(false);
  const [loading,setLoading] = useState(false);

  const userRegistered = async (email:string)=>{
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if(res.ok){
      const {data} = await res.json()
      return data;
    }
    return false;
  }

  const handlerSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    const form = e.currentTarget;
    setLoading(true)
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    const ue = await userRegistered(form.email.value)
   
    if(ue.isUser){
      if(ue.hasOwnProperty('hasPassword') && !ue.hasPassword){
        e.preventDefault();
        e.stopPropagation();
        toast.error(t('RegisterAlert'))
        setLoading(false)
        }
     } else {      
      e.preventDefault();
      e.stopPropagation();  
      setLoading(false)
      toast.error(t('isNotUser'))
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
        <p className={`${styles.forgotPassword}`}>{t('forgotPassword')}</p>
        <p className={`${styles.indicationsText}`}>{t('indicationsText')}</p>
          
        </div>
            <div className="mb-5 d-flex justify-content-center">
             <Form className={`d-flex flex-column ${styles.sendForm}`} onSubmit={handlerSubmit} action='/api/recoveryLogin' validated={validated} method='POST'>
                <Form.Group controlId="email">
                  <Form.Label>{t('emailFieldLabel')}</Form.Label>
                  <Form.Control className='mb-2' name="email" type="email" required />
                 </Form.Group>
                 <div className="d-flex justify-content-center">
                  <Button type='submit' disabled={loading} className={`btn-eureka ${styles.submitButton}`}>
                  {t('sendText')} {loading && <Spinner animation="grow"/>}
                </Button>
                </div>
              </Form>
            </div>
    </Container>
  );
};

export default RecoveryLoginForm;
