import { MISSING_FIELD, UNAUTHORIZED } from "@/src/api_code";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
      let { price, product_id, customer_email,cycleId,cycleTitle,userId,userName} = req.body;
      if(!userId){
        res.status(405).end(UNAUTHORIZED);
        return;
      }
      if(!product_id){
        res.status(405).end(MISSING_FIELD('product_id'));
        return;
      }

      try {
        
        const sub = await prisma?.subscription.findFirst({
          where:{
              cycleId:+cycleId,
              userId:+userId,
          }
        });
        if(sub && sub.status !== 'cancelled'){
          res.json({stripe_session_url:null,subscription_already_exist:true});
          return;
        }
        
        const {data:customers} = await stripe.customers.search({
          query: `email:\'${customer_email}\' OR metadata[\'userId\']:\'${userId}\'`,
        });
        let customer;
        if(customers.length>0){
          customer = customers[0];
        }
        else{
          customer = await stripe.customers.create({
            name: userName,
            email: customer_email,
            metadata:{userId},
          });
        }
          
        const session = await stripe.checkout.sessions.create({
          client_reference_id:userId,
          metadata:{price,product_id,cycleId,cycleTitle,userId,userName},  
          // payment_intent_data:{
          //   metadata:{price,product_id,cycleId,client_reference_id}
          // },
          subscription_data: {
            metadata:{price,product_id,cycleId,cycleTitle,userId,userName},  
          },
          line_items: [
            {
              price,
              quantity: 1,
            },
          ],
          customer: customer.id,
          billing_address_collection: 'auto',
          mode: 'subscription',
          // discounts: [{
          //   coupon:"10PERCENT",
          // }],
          allow_promotion_codes:true,
          success_url: `${req.headers.origin}/payment_success?cycleId=${cycleId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/payment_cancel?cycleId=${cycleId}`,        
        });
        res.json({stripe_session_url:session.url,subscription_already_exist:false});
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