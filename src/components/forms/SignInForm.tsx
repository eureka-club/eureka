import { signIn } from "next-auth/react";
// import {Form, Spinner} from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';
import { useState, FunctionComponent, MouseEvent,useRef } from 'react';
// import Button from 'react-bootstrap/Button';
// import Container from 'react-bootstrap/Container';
// import ModalBody from 'react-bootstrap/ModalBody';
// import ModalHeader from 'react-bootstrap/ModalHeader';
// import Row from 'react-bootstrap/Row';
import Link from 'next/link'
import toast from 'react-hot-toast'
import styles from './SignInForm.module.css';
import {useRouter} from 'next/router'
import { useModalContext } from "@/src/hooks/useModal";
import { Button,Box, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import Image from "next/image";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface Props {
  noModal?: boolean;
  logoImage?:boolean;
  joinToCycle?:number;
}

const SubmitButton = ({handleSubmitSignIn}:{handleSubmitSignIn:(e:any)=>void})=>{
  const { t } = useTranslation('signInForm');
  const[loading,setLoading]=useState(false);
  const handleSubmitSignInHandler=async (e:any)=>{
    setLoading(true)
    await handleSubmitSignIn(e);
    setLoading(false);
  }
  return <Button data-cy='btn-login' disabled={loading} onClick={handleSubmitSignInHandler} className={`btn-eureka ${'styles.submitButton'} me-1`}>
  {t('login')} {loading && <CircularProgress size={'sm'}/>}
  </Button>
}

const SignInForm: FunctionComponent<Props> = ({ joinToCycle, noModal = false,logoImage = true }) => {
  const router = useRouter()
  const { t } = useTranslation('signInForm');
  const formRef=useRef<HTMLFormElement>(null)
  const [loading,setLoading] = useState(false)
  const handleSignInGoogle = (ev: MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    if(!noModal)
      localStorage.setItem('loginRedirect', router.asPath)
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
           if(!ur.provider && !ur.hasPassword){
                toast.error(t('RegisterAlert'))
                    setLoading(false)
           }
           else if(ur.provider=='google'){
            toast.error(t('RegisteredUsingGoogleProvider'))
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
                toast.error(t('InvalidSesion'))
                setLoading(false)
              }
              else{
                close()
                localStorage.setItem('loginRedirect',router.asPath)
                router.push(localStorage.getItem('loginRedirect') || '/').then(()=>{
                  localStorage.setItem('loginRedirect','')
                })
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
  router.push(`/register/${joinToCycle??''}`)
}
const handlerRecoveryLogin = ()=>{
  close()
  router.push("/recoveryLogin")
}

const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return <Stack rowGap={2}>
  <Paper elevation={2} sx={{padding:'1rem'}}>
      <Stack rowGap={2}>
        <Stack justifyContent={'center'} alignItems={'center'} rowGap={(1)}>
          <Link href="/" replace>
            <Image src="/logo.svg" alt="Eureka" width={75} height={75} />  
            {/* <img  className={`cursor-pointer`} src="/logo.svg" alt="Eureka" />  */}
          </Link>   
          <Typography>Eureka</Typography>
        </Stack>
          <Stack justifyContent={'center'} alignItems={'center'} rowGap={2}>
              <Button onClick={handleSignInGoogle} variant="contained" sx={{textTransform:'none',width:'100%'}} >
                  <Image src='/img/logo-google.png' width={23} height={23}/>
                  <Typography variant='h6' paddingLeft={1}>{t('loginViaGoogle')}</Typography>
              </Button>
              <Typography color={'primary'}>{t('alternativeText')}</Typography>
              {/* <span className={`${'styles.alternativeLabel'}`}>{t('alternativeText')}</span> */}
          </Stack>
            <form ref={formRef}>
              <Stack direction={'column'} rowGap={2}>
                <FormControl>
                    <TextField
                        name='email'
                        required
                        variant="outlined"
                        label={t('emailFieldLabel')}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="outlined-adornment-password">{t('passwordFieldLabel')}</InputLabel>
                    <OutlinedInput
                        name="password"
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            // onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                        }
                        label={t('passwordFieldLabel')}
                    />
                </FormControl>
                <SubmitButton handleSubmitSignIn={handleSubmitSignIn}/>
                <Button onClick={handlerRecoveryLogin} variant="outlined">{t('forgotPassText')}</Button>
              </Stack>
            </form>
      </Stack>
  </Paper>
  <Typography sx={{padding:'0 2rem'}} textAlign={'center'} variant='caption'>{t('RegisterNotice')}</Typography>
  <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
      <Typography justifyContent={'center'}>{t('dontHaveAccounttext')}</Typography>
      <Button onClick={handlerJoinLink} color='primary' sx={{textTransform:'none',cursor:'pointer'}}>
          <Typography>{t('Join')}</Typography>
      </Button>
  </Stack>
</Stack>
  // return (
  //     <>
  //     <ModalHeader className={`position-relative ${styles.modalHeader}`} closeButton={!noModal}>
  //       {logoImage && (<Container>
  //       <Link href="/" replace>  
  //       <img  className={`cursor-pointer ${styles.eurekaImage}`} src="/logo.svg" alt="Eureka" /> 
  //       </Link>
  //       <p className={styles.EurekaText}>Eureka</p>
  //       </Container>)}
  //     </ModalHeader>
  //     <ModalBody className="pt-0">
  //       <div>
  //        {logoImage && (<p className={`${styles.loginGreeting}`}>{t('loginGreeting')}</p>)}
  //        <div className="py-3 border border-1"  style={{ borderRadius: '0.5em'}}>
  //         <Row>
  //             <button type="button" onClick={handleSignInGoogle} className={`d-flex justify-content-center fs-6 ${styles.buttonGoogle}`}>
  //               <div className={`d-flex justify-content-start justify-content-sm-center aling-items-center flex-row ${styles.gmailLogoAndtext}`}>
  //               <img  className={`${styles.gmailLogo} me-1 me-lg-2`} src="/img/logo-google.png" alt="gmail" /> 
  //               {t('loginViaGoogle')}
  //               </div>
  //             </button>
  //         </Row>
  //         <Row>
  //             <span className={`${styles.alternativeLabel}`}>{t('alternativeText')}</span>
  //         </Row>
  //         <Row>
  //           <div className="d-flex justify-content-center">
  //             <Form ref={formRef} className={`d-flex flex-column fs-6 ${styles.loginForm}`} data-cy="login-form">
  //               <Form.Group controlId="email">
  //                 <Form.Label>{t('emailFieldLabel')}</Form.Label>
  //                 <Form.Control className='' type="email" required />
  //                 <div className='d-flex justify-content-between mb-1 mt-2'><div>{t('passwordFieldLabel')}</div>
  //                   {/* <Link href="/recoveryLogin" passHref> */}
  //                     <Button onClick={handlerRecoveryLogin} variant="link" className={`btn-link d-flex link align-items-end cursor-pointer ${styles.forgotPassText}`}>{t('forgotPassText')}</Button>
  //                   {/* </Link> */}
  //                 </div>
  //               </Form.Group>
  //               <Form.Group controlId='password'>
  //                 <Form.Control type="password" required />
  //               </Form.Group>
  //               <div className="d-flex justify-content-center">
  //               <Button data-cy='btn-login' disabled={loading} onClick={handleSubmitSignIn} className={`btn-eureka ${styles.submitButton} me-1`}>
  //                 {t('login')} {loading && <Spinner animation="grow" size='sm'/>}
  //               </Button>
  //               </div>
  //             </Form>
                 
  //           </div>
  //         </Row>
  //         </div>
  //         <p className={`mt-2 ${styles.registerNotice}`}>{t('RegisterNotice')}</p>
  //         <p className={`fs-6 ${styles.dontHaveAccounttext} mb-0 pb-0`}>{t('dontHaveAccounttext')} 
  //           <Button onClick={handlerJoinLink} className="text-primary fs-5 " variant="link">
  //           {t('Join')}
  //           </Button>
  //         </p>
  //       </div>
  //     </ModalBody>
  //   </>
  // );
};

export default SignInForm;
