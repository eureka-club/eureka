import { Box } from "@mui/material"
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";

const PaymentOptionForm:React.FC<{price?:string,priceInPlots?:string,product_id:string,cycleId:number|string,cycleTitle:string,iterations?:number}>=({
    price,
    priceInPlots,
    product_id,
    cycleId,
    cycleTitle,
    iterations
})=>{
  const {t}=useTranslation('common');
  const {data:session}=useSession();
  
  const doAction = async (mode:'payment'|'subscription',price:string,iterations?:number)=>{
    const url = mode=='payment'
      ? '/api/stripe/checkout_sessions'
      : '/api/stripe/subscriptions/checkout_sessions';
debugger;
    const fr = await fetch(url,{
      method:'POST',
      body:JSON.stringify({
        price,
        product_id,
        client_reference_id:session?.user.id,
        customer_email: session?.user.email,
        cycleId,
        cycleTitle,
        ... mode=='subscription' && {iterations}
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
  const onClickHandler = async (e:any,mode:'payment'|'subscription',price:string,iterations?:number)=>{
    e.preventDefault();
    await doAction(mode,price,iterations);
  }

    return <Box id="subscription-form">
      <button  onClick={(e)=>onClickHandler(e,'payment',price!)}>A vista (R$ 160)</button>  
      <button  onClick={(e)=>onClickHandler(e,'subscription',priceInPlots!,iterations)}>Parcelado (R$ 49*3)</button>  
  </Box>
}
export default PaymentOptionForm;