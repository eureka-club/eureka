import { addParticipant, find } from "@/src/facades/cycle";
import { NextApiRequest, NextApiResponse } from "next";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const POST = async (req:NextRequest)=>{
  //let {price,code,client_reference_id,customer_email,id:product_id} = req.body;
  const body = await req.json();
  let { price, product_id, client_reference_id, customer_email,cycleId} = body;
  const origin = req.headers.get('origin');

  try {
    const session = await stripe.checkout.sessions.create({
      client_reference_id,
      metadata:{price,product_id,cycleId,client_reference_id},  
      payment_intent_data:{
        metadata:{price,product_id,cycleId,client_reference_id}
      },
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      customer_email,
      // billing_address_collection: 'auto',
      mode: 'payment', //subscription or payment
      // discounts: [{
      //   coupon:"10PERCENT",
      // }],
      allow_promotion_codes:true,
      success_url: `${origin}/payment_success/${cycleId}`,
      cancel_url: `${origin}/payment_cancel?cycleId=${cycleId}`,        
    });
    return NextResponse.json({stripe_session_url:session.url});
  } catch (e) {
    const err = e as {message:string};
    console.error(err.message)
    redirect(`${origin}/payment_error?cycleId=${cycleId}`)
    // res.status(err.statusCode || 500).end();
  }
}
