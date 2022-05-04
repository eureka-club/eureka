import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FormEvent, FunctionComponent, MouseEvent,useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useMutation } from "react-query";
import {Form} from 'react-bootstrap'
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import { useToasts } from 'react-toast-notifications';
import styles from './SignUpForm.module.css';

interface Props {
  noModal?: boolean;
}

const SignUpForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t } = useTranslation('signUpForm');
  const formRef=useRef<HTMLFormElement>(null)
  const {addToast} = useToasts()
 interface MutationProps{
        identifier:string;
        password:string;
        fullName:string;
    }

    const userRegistered = async (email:string)=>{
      const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
      if(res.ok){
        const {data} = await res.json()
        return data;
      }
      return false;
    }

    const {mutate,isLoading:isMutating} = useMutation(async (props:MutationProps)=>{
        const {identifier,password,fullName} = props;
        const res = await fetch('/api/userCustomData',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({
                identifier,
                password,
                fullName,
            })
        })
        if(res.ok){
            const data = await res.json()
            signIn('email',{email:identifier})
            // return data;
        }
        else{
            addToast(res.statusText)
        }
        return null;
    })

    const handleSubmitSignUp = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current
        if(form){
          const email = form.email.value;
          const password = form.password.value;
          const fullName = form.Name.value + ' ' + form.lastname.value;
          if(email && password && fullName){
            const ur = await userRegistered(email)
            if(!ur){
              mutate({
                  identifier:email,
                  password:password,
                  fullName,
              }); 
            }
            else addToast('User already registered',{autoDismiss:true})
          }
          else
            addToast('All data are required (Email, Password, Name and Last Name)')
        }
    }


  return (
    <>
    <section className={`${styles.welcomeMobileSection}`}>
      <div className='d-flex d-lg-none flex-column justify-content-center'>
          <Container className={`${styles.imageContainer} d-flex justify-content-center`}>
               <img  className={`${styles.eurekaImage}`} src="/Eureka-VT-web-white.png" alt="Eureka" /> 
          </Container>
          <p className={`mt-3 ${styles.welcomeText}`}>{t('Welcome')}</p>
     </div>
    </section>
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
            <div className={`${styles.registerFormSection}`}>
          <Row > 
              <span className={`lg-ms-3 ${styles.joinEurekaText}`}>{t('JoinEureka')}</span>
              <p className={`${styles.haveAccounttext}`}>{t('HaveAccounttext')} <Link href="/login">
                 <a className="">{t('Login')}</a></Link></p>
              <button type="button" className={`d-flex justify-content-center ${styles.buttonGoogle}`}>
                <div className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}>
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
                       
              <Form ref={formRef} className={`d-flex flex-column ${styles.registerForm}`} >
                <div className='d-flex flex-column flex-lg-row justify-content-between'>
                     <div className={`d-flex flex-column ${styles.personalData}`}>
                      <Form.Group  controlId="Name">
                          <Form.Label>{t('Name')}</Form.Label>
                          <Form.Control className='mb-2' type="text" required />
                       </Form.Group>
                     </div>
                     <div className={`d-flex flex-column ${styles.personalData}`}>
                     <Form.Group  controlId="lastname">
                       <Form.Label>{t('LastName')}</Form.Label>
                       <Form.Control className='mb-2' type="text" required />  
                     </Form.Group>
                     </div>
                  </div>  
                  <Form.Group controlId="email">
                    <Form.Label>{t('emailFieldLabel')}</Form.Label>
                    <Form.Control className='mb-2' type="email" required />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>{t('passwordFieldLabel')} <span className={styles.passRequirement}>{` (${t('passRequirements')})`}</span></Form.Label>
                    <Form.Control type="password" required />
                  </Form.Group>
                <div className="d-flex flex-column align-items-center justify-content-center">
                <Button onClick={handleSubmitSignUp} variant="primary text-white" className={`mb-4 d-flex justify-content-center align-items-center ${styles.submitButton}`}>
                  {t('Join')}
                </Button>
                 <p className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-5 ${styles.joinedTermsText}`}>{t('joinedTerms')}
                    <Link href="/terms?show=manifesto" passHref>
                      <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`}>{t('termsText')}</span>
                    </Link>
                    {t('and')}
                      <Link href="/terms?show=policy" passHref>
                      <span className={`d-flex cursor-pointer ms-1 ${styles.linkText}`}>{t('policyText')}</span>
                    </Link>
                  </p>
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
