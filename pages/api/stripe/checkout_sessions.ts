import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let {price,code,client_reference_id,customer_email,id:product_id} = req.body;
    try {
      //DEVELOP ONLY
        product_id=product_id??'prod_OyqslFUmYVAFWx';
        price=price??'price_1OAtArHYKOHA4EIyjjEISJm7';
      //DEVELOP ONLY
      
      const session = await stripe.checkout.sessions.create({
        client_reference_id,
        metadata:{price,product_id},  
        payment_intent_data:{metadata:{price}},
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
        success_url: `${req.headers.origin}/confirmation-pass?success=true`,
        cancel_url: `${req.headers.origin}/pass?canceled=true`,        
      });
      res.redirect(303, session.url);
    } catch (e) {
      const err = e as {message:string};
      res.statusMessage = err.message;
      console.error(err.message)
      res.redirect(`${req.headers.origin}/pass?error=true`)
      // res.status(err.statusCode || 500).end();
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}