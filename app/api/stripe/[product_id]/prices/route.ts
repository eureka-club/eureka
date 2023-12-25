import { NextRequest, NextResponse } from "next/server";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
interface Props{
  params:{product_id:number}
}
export const GET = async (req:NextRequest,{params}:Props)=>{
  let { product_id } = params;
    try {
      const prices = await stripe.prices.list({
        product: product_id,
        active: true,
      });
      return NextResponse.json({prices});
    } catch (e) {
      const err = e as {message:string};
      // res.statusMessage = err.message;
      console.error(err.message)
      return NextResponse.json({error:err.message});
    }
}
