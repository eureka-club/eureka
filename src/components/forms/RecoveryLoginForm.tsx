import useTranslation from 'next-translate/useTranslation';
import {  FunctionComponent, useState } from 'react';
import Link from 'next/link'
import styles from './RecoveryLoginForm.module.css';
import { Box, Button, Container, LinearProgress, Stack, TextField, Typography } from '@mui/material';

const RecoveryLoginForm: FunctionComponent = () => {
   const { t,lang } = useTranslation('PasswordRecovery');
  const [textError,settextError] = useState("");
  const [loading,setLoading] = useState(false);
  const[email,setemail]=useState("");
  const userRegistered = async (email:string)=>{
    const res = await fetch(`/api/user/isRegistered?identifier=${email}`);
    if(res.ok){
      const r = await res.json();
      return r;
    }
    return false;
  }

  const handlerSubmit = async (e:any)=>{
    setLoading(true);
    if(!email){
      e.preventDefault();
      e.stopPropagation();
      settextError(t('common:MISSING_FIELD',{fieldName:'EMAIL'}));
      setLoading(false)
      return ;
    }
    const ue = await userRegistered(email);
   
    if(ue?.isUser){
      if(ue.provider=='google'){
        settextError(t('signInForm:RegisteredUsingGoogleProvider'));
        setLoading(false)
        return ;
      }
      else if((ue.hasOwnProperty('hasPassword') && !ue.hasPassword)){
        settextError(t('RegisterAlert'))
        setLoading(false)
      }
      else{
       const url = `/api/recoveryLogin`;
       fetch(url,{
          method:'post',
          redirect:'follow',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify({
            email
          })
       })
       .then(e=>{
        if(e.ok)
          window.location.href = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/${lang}/auth/emailVerify`;
       })
       .catch(e=>{console.error(e);});
      }
     } 
     else {      
      setLoading(false)
      settextError(t('isNotUser'))
    }
  }

  return <Container>
      <Stack paddingTop={'5rem'} justifyContent={'center'} alignItems={'center'} gap={3}>

        <Stack justifyContent={'center'} alignItems={'center'}>
          <Link href="/" replace>  
              <img  className={`cursor-pointer ${styles.eurekaImage}`} src="/logo.svg" alt="Eureka" /> 
          </Link>   
          <p className={styles.EurekaText}>Eureka</p>
        </Stack>
        
        <Stack alignItems={'center'} justifyContent={'center'} gap={6} width={450}>
          <Typography variant='h5'>{t('forgotPassword')}</Typography>
          <Typography variant='body2' textAlign={'center'}>{t('indicationsText')}</Typography>
        </Stack>

        <Stack gap={3}>
          
            <TextField 
              error={!!textError} 
              helperText={textError}
              value={email} 
              onChange={(e)=>setemail(e.target.value)} 
              label={t('emailFieldLabel')} 
              variant="outlined" 
            />
            <Box position={'relative'}>
              <Button variant='contained'
                    onClick={handlerSubmit}
                    disabled={loading} sx={{padding:'.5rem'}}
              >{t('sendText')}</Button>
              {
                loading 
                  ? <LinearProgress
                    color='primary'
                    /> 
                  : <></>
              } 
            </Box>

        </Stack>
      </Stack>
    </Container>
};

export default RecoveryLoginForm;
