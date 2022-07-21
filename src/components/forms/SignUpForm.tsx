import { signIn } from 'next-auth/react';
import useTranslation from 'next-translate/useTranslation';
import { FunctionComponent,useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useMutation } from "react-query";
import {Form} from 'react-bootstrap'
import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import toast from 'react-hot-toast';
import styles from './SignUpForm.module.css';

interface Props {
  noModal?: boolean;
}

const SignUpForm: FunctionComponent<Props> = ({ noModal = false }) => {
  const { t } = useTranslation('signUpForm');
  const formRef=useRef<HTMLFormElement>(null)
 interface MutationProps{
        identifier:string;
        password:string;
        fullName:string;
    }

    const userRegistered = async (email:string)=>{
      const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
      if(res.ok){
        return res.json()
      }
      return null;
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
            toast.error(res.statusText)
        }
        return null;
    })

     const validateEmail = (text:string)=>{
       const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

        if(!text.match(emailRegex)){
          return false;
        }
        return true;
      }

       const validatePassword = (text:string)=>{
          if(text.length<8){
            return false;
          }
          if(!text.match(/[a-zA-z]/g)){
            return false;
          }
          if(!text.match(/\d/g)){
            return false;
          }
          return true;
        }

    const handleSubmitSignUp = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        //mutate user custom data
        const form = formRef.current
        if(form){
          const email = form.email.value;
          const password = form.password.value;
          const fullName = form.Name.value + ' ' + form.lastname.value;
          
          if(email && password && fullName){

            if(!validateEmail(email)){
               toast.error( t('InvalidMail'));
               return false;
            }

            if(!validatePassword(password)){
               toast.error( t('InvalidPassword'));
               return false;
            }
          
            const ur = await userRegistered(email);
            if(!ur){
              toast.error(t('Error'));
              return;
            }
            if(!ur.isUser || !ur.hasPassword){
              mutate({
                  identifier:email,
                  password:password,
                  fullName,
              }); 
            }
            else toast.error(t('UserRegistered'))
          }
          else
            toast.error(t('emptyFields'))
        }
    }

//border border-1"  style={{ borderRadius: '0.5em'}}
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
                    <Link href="/explore" replace>  
                        <p  className={`mt-5 cursor-pointer text-white ${styles.VisitEurekaText}`}>{t('VisitEureka')} </p> 
                    </Link>
                  </Container>
              </section>
          </Col>
          <Col className={`col-12 col-lg-6`}>
            <div className={`${styles.registerFormSection}`}>
          <Row > 
              <span className={`lg-ms-3 ${styles.joinEurekaText}`}>{t('JoinEureka')}</span>
              <p className={`${styles.haveAccounttext}`}>{t('HaveAccounttext')} <Link href="/">
                 <a className="">{t('Login')}</a></Link></p>
              
          </Row>
          <section className='border border-1 mb-5'  style={{ borderRadius: '0.5em'}}>
          <Row>
            <button type="button" className={`d-flex justify-content-center mt-4  ${styles.buttonGoogle}`}>
                <div className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}>
                <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
                {t('joinViaGoogle')}
                </div>
              </button>
              <p className={`mb-2 ${styles.alternativeLabel}`}>{t('alternativeText')}</p>
          </Row>
          <Row>
            <div className="d-flex justify-content-center ">
                       
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
                 <p className={`d-flex flex-row flex-wrap align-items-center justify-content-center mb-4 ${styles.joinedTermsText}`}>{t('joinedTerms')}
                    <Link href="/manifest" passHref>
                      <span className={`d-flex cursor-pointer ms-1 me-1 ${styles.linkText}`}>{t('termsText')}</span>
                    </Link>
                    {t('and')}
                      <Link href="/policy" passHref>
                      <span className={`d-flex cursor-pointer ms-1 ${styles.linkText}`}>{t('policyText')}</span>
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </Row>
          </section>
          </div>
          </Col>
          </Row>
          </Container>
          </>
  );
};

export default SignUpForm;
