import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import {prisma} from '@/src/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {debugger;
    //let {price,code,client_reference_id,customer_email,id:product_id} = req.body;
    let { price, product_id, client_reference_id:crid, customer_email,cycleId,cycleTitle} = req.body;
    let client_reference_id = crid;
    try {
      if(!crid){
        // const password = await bcrypt.hash(customer_email, 8);
        // const user = await prisma.user.create({
        //   data:{
        //     email:customer_email,
        //     name:customer_email,
        //     password
        //   }
        // });
        // client_reference_id = user?.id;
      }
      else{
        const cycle = await prisma?.cycle.findFirst({
          select:{
            participants:{
              where:{id:crid}
            }
          },
          where:{
              id:+cycleId,
          }
        });
        if(cycle?.participants?.length/* && cycle.participants.findIndex(p=>p.id==client_reference_id)>=0*/){
          res.json({stripe_session_url:null,participant_already_exist:true});
          return;
        }
      }

      const session = await stripe.checkout.sessions.create({
        client_reference_id,
        metadata:{price,product_id,cycleId,cycleTitle,client_reference_id},  
        payment_intent_data:{
          metadata:{price,product_id,cycleId,cycleTitle,client_reference_id}
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

    } 
    catch (e) {
      const err = e as {message:string};
      res.statusMessage = err.message;
      console.error(err.message)
      res.redirect(`${req.headers.origin}/payment_error?cycleId=${cycleId}`)
    }
  } 
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}