import useCycleSumary from "@/src/useCycleSumary";
import { Button, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import React, { FC, useEffect, useState } from "react";
import {Stack} from '@mui/material'
import toast from "react-hot-toast";
import { useModalContext } from "@/src/hooks/useModal";
import SignInForm from "@/src/components/forms/SignInForm";
import { useRouter } from "next/router";

interface Props {
    label:string|React.ReactNode;
    price:string;
    product_id:string;
    cycleId:number;
}   
const BuyButton:FC<Props> = ({label,price,product_id,cycleId}) => { 
  const {data:session}=useSession();
  const router=useRouter();
  const {t}=useTranslation('common');
  
  const {show} = useModalContext();
  const[isLoading,setIsLoading] = useState(false);
      
  useEffect(()=>{
    localStorage.setItem('loginRedirect', `/${router.locale}${router.asPath}?doAction=1`)
  },[]);
  useEffect(()=>{
    if(router.query.doAction && session?.user){
      doAction();
    }
  },[router.query,session]);
  
  const doAction = async ()=>{debugger;
    const fr = await fetch('/api/stripe/checkout_sessions',{
      method:'POST',
      body:JSON.stringify({
        price,
        product_id,
        client_reference_id:session?.user.id,
        customer_email: session?.user.email,
        cycleId,
      }),
      headers:{
        'Content-Type':'application/json'
      }
    });
    const {stripe_session_url,participant_already_exist} = await fr.json();
    if(participant_already_exist){ 
      return toast.error(t('Você já está inscrito no clube.'));
    }
    window.location.href = stripe_session_url;
  }
  const onClickHandle = async (e:any) => {
    setIsLoading(true);
    if(session?.user){
      doAction();
    }else{
      show(<SignInForm/>);
    }
    setIsLoading(false);
  };   
  
  return (
    <>
    <Stack direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 3 }}
        paddingLeft={4}
        justifyContent={'center'}
        justifyItems={'center'}>
    <Button
          variant="contained"
          color="primary"
          size="large"
          style={{color: 'white!important;'}}
          type="submit"
          onClick={onClickHandle}
          disabled={isLoading}

      >
      {label} <CircularProgress size={'2rem'} color="inherit" style={{display: isLoading ? 'block' : 'none'}}/>
      </Button>
      </Stack>
      </>
  );
}
export default BuyButton;