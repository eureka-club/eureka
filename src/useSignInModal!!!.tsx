import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import useTranslation from 'next-translate/useTranslation';
import { Box, CircularProgress, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper, Stack, TextField, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
    noModal?: boolean;
    logoImage?:boolean;
    joinToCycle?:number;
}
  
const SubmitButton = ({handleSubmitSignIn}:{handleSubmitSignIn:(e:any)=>void})=>{
  const { t } = useTranslation('signInForm');
  const[loading,setLoading]=React.useState(false);
  const handleSubmitSignInHandler=async (e:any)=>{
    setLoading(true)
    await handleSubmitSignIn(e);
    setLoading(false);
  }
  return <Button data-cy='btn-login' disabled={loading} onClick={handleSubmitSignInHandler} className={`btn-eureka ${'styles.submitButton'} me-1`}>
  {t('login')} {loading && <CircularProgress size={'sm'}/>}
  </Button>
}
const useSignInModal = ()=>{
    const { t } = useTranslation('signInForm');
    const [open, setOpen] = React.useState(false);
    const formRef=React.useRef<HTMLFormElement>(null)

    function SignInModal({noModal,joinToCycle,logoImage}:Props) {
        const router = useRouter();
    
      const handleClose = () => {
        setOpen(false);
      };

      const handleSignInGoogle = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if(!noModal)
          localStorage.setItem('loginRedirect', router.asPath)
        const callbackUrl = !!joinToCycle&&joinToCycle!=-1 
           ? `/cycle/${joinToCycle}?join=true`
           : localStorage.getItem('loginRedirect')?.toString()||'/';
            signIn('google',{ callbackUrl });
      };
      const userRegistered = async (email:string)=>{
        const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
        if(res.ok){
          return res.json();
        }
        return null;
      }
      const handleSubmitSignIn = async (e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        e.stopPropagation();
        const form = formRef.current;
        if(!form?.email.value){
          toast.error(t('EmailRequired'))
          form?.email.focus();
          return false;
        }
        if(!form?.password.value){
          toast.error(t('PasswordRequired'))
          form?.password.focus();
          return false;
        }
        if(form){
          const ur = await userRegistered(form.email.value);
              if(!ur){
                toast.error('Error');
                return;
              }
              if(ur.isUser){
                if(!ur.provider && !ur.hasPassword){
                    toast.error(t('RegisterAlert'))
                }
                else if(ur.provider=='google'){
                toast.error(t('RegisteredUsingGoogleProvider'))
                }
                else {
                const callbackUrl = !!joinToCycle&&joinToCycle>0 
                ? `/cycle/${joinToCycle}?join=true`
                : localStorage.getItem('loginRedirect')?.toString()||'/';
                const res = await signIn('credentials' ,{
                  callbackUrl,
                  email:form.email.value,
                  password:form.password.value,
                  redirect:false
                });
                if(res && res.error){
                  toast.error(t('InvalidSesion'))
                }
                else{
                    setOpen(false);
                    localStorage.setItem('loginRedirect',router.asPath)
                    router.push(localStorage.getItem('loginRedirect') || '/').then(()=>{
                      localStorage.setItem('loginRedirect','')
                    })
                }
                }
              }
              else{
                toast.error(t('isNotUser'))
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
    const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
    
      return (
        <React.Fragment>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
            {
                logoImage 
                    ? <Stack rowGap={2} direction={'column'} justifyContent={'center'} alignItems={'center'}>
                        <Link href="/" replace> 
                            <Image width={75} height={75} src="/logo.svg" alt="Eureka"/>
                        </Link>
                        <Typography variant='h6' letterSpacing={15}>EUREKA</Typography>
                        <Typography>{t('loginGreeting')}</Typography>
                    </Stack>
                    : <></>
            }
            </DialogTitle>
            <DialogContent>
                <Stack rowGap={2}>
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
            </DialogContent>
          </Dialog>
        </React.Fragment>
      );
    }
    return {SignInModal,open,setOpen};
}
export default useSignInModal;