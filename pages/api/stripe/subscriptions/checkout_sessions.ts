import { UNAUTHORIZED } from "@/src/api_code";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  debugger;
  if (req.method === 'POST') {
      let { price, product_id, customer_email,cycleId,userId} = req.body;
      if(!userId){
        res.status(405).end(UNAUTHORIZED);
        return;
      }

      try {
      const session = await stripe.checkout.sessions.create({
        client_reference_id:userId,
        metadata:{price,product_id,cycleId,userId},  
        // payment_intent_data:{
        //   metadata:{price,product_id,cycleId,client_reference_id}
        // },
        subscription_data: {
          metadata:{price,product_id,cycleId,userId},  
        },
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        customer_email,
        // billing_address_collection: 'auto',
        mode: 'subscription',
        // discounts: [{
        //   coupon:"10PERCENT",
        // }],
        allow_promotion_codes:true,
        success_url: `${req.headers.origin}/payment_success?cycleId=${cycleId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/payment_cancel?cycleId=${cycleId}`,        
      });
      res.json({stripe_session_url:session.url});
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