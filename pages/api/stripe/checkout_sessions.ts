import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import {prisma} from '@/src/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    //let {price,code,client_reference_id,customer_email,id:product_id} = req.body;
        let { price, product_id, client_reference_id, customer_email,cycleId} = req.body;

    try {

      const cycle = await prisma?.cycle.findFirst({
        select:{
          participants:{select:{id:true}}
        },
        where:{
            id:+cycleId,
        }
      });
      if(cycle && cycle.participants.findIndex(p=>p.id==client_reference_id)>=0){
        res.json({stripe_session_url:null,participant_already_exist:true});
        return;
      }

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
        success_url: `${req.headers.origin}/payment_success?cycleId=${cycleId}`,
        cancel_url: `${req.headers.origin}/payment_cancel?cycleId=${cycleId}`,        
      });
      res.json({stripe_session_url:session.url,participant_already_exist:false});

    } catch (e) {
      const err = e as {message:string};
      res.statusMessage = err.message;
      console.error(err.message)
      res.redirect(`${req.headers.origin}/payment_error?cycleId=${cycleId}`)
      // res.status(err.statusCode || 500).end();
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}