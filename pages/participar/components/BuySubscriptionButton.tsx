import useCycleSumary from "@/src/useCycleSumary";
import { Button } from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import {Grid, Stack} from '@mui/material'
import toast from "react-hot-toast";

interface Props {
    label:string;
    price:string;
    product_id:string;
    cycleId:number;
    
}   
const BuySubscriptionButton:FC<Props> = ({label,price,product_id,cycleId}) => { 
  const {data:session}=useSession();
  const {t}=useTranslation('common');
  const {data:cycle}=useCycleSumary(cycleId);
  if(!session){
    toast.error(t('Unauthorized'));
    return null;
  }
  const onClickHandle = async (e:any) => {
      const fr = await fetch('/api/stripe/subscriptions/checkout_sessions',{
          method:'POST',
          body:JSON.stringify({
            product_id,
            price,
            customer_email: session?.user.email,
            cycleId,
            cycleTitle:cycle?.title,
            userId:session?.user.id,
            userName:session?.user.name
          }),
          headers:{
            'Content-Type':'application/json'
          }
        });
        const {stripe_session_url,subscription_already_exist} = await fr.json();
        if(subscription_already_exist){ 
          return toast.error(t('Você já está inscrito no clube.'));
        }
        window.location.href = stripe_session_url;
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
      >
          {label}
      </Button>
      </Stack>
      </>
  );
}
export default BuySubscriptionButton;