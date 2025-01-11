import { Box } from "@mui/material"
import { useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";

const PaymentOptionForm:React.FC<{price?:string,priceInPlots?:string,product_id:string,cycleId:number|string}>=({
    price,
    priceInPlots,
    product_id,
    cycleId
})=>{
  const {t}=useTranslation('common');
  const {data:session}=useSession();
  
  const doAction = async (mode:'payment'|'subscription',price:string)=>{
    const url = mode=='payment'
      ? '/api/stripe/checkout_sessions'
      : '/api/stripe/subscriptions/checkout_sessions';

    const fr = await fetch(url,{
      method:'POST',
      body:JSON.stringify({
        ... mode=='payment' ? {price} : {priceInPlots:price},
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
  const onClickHandler = async (e:any,mode:'payment'|'subscription',price:string)=>{
    e.preventDefault();
    await doAction(mode,price);
  }

    return <Box id="subscription-form">
    <form>
        <input name="price" value={price} hidden/>
        <input name="product_id" value={product_id} hidden/>
        <input name="cycleId" value={cycleId} hidden/>
      <button  onClick={(e)=>onClickHandler(e,'payment',price!)}>A vista (R$ 160)</button>  
    </form>
    <form action='/api/stripe/subscriptions/checkout_session'>
        <input name="priceInPlots" value={priceInPlots} hidden/>
        <input name="product_id" value={product_id} hidden/>
        <input name="cycleId" value={cycleId} hidden/>
      <button  onClick={(e)=>onClickHandler(e,'subscription',priceInPlots!)}>Parcelado (R$ 49*3)</button>  
    </form>
  </Box>
}
export default PaymentOptionForm;