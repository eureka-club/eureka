import { Button } from "@mui/material";
import { getSession, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import { FC } from "react";
import toast from "react-hot-toast";

interface Props {
    label:string;
    price:string;
    product_id:string;
    cycleId:string;
}   
const BuySubscriptionButton:FC<Props> = ({label,price,product_id,cycleId}) => { 
  const {data:session}=useSession();
  const {t}=useTranslation('common');
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
            userId:session?.user.id
          }),
          headers:{
            'Content-Type':'application/json'
          }
        });
        const {stripe_session_url} = await fr.json();
        window.location.href = stripe_session_url;
  };   
  return (
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
      
  );
}
export default BuySubscriptionButton;