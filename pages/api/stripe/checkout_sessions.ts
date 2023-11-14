import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    console.log(req.body);
    //let {price,code,client_reference_id,customer_email,id:product_id} = req.body;
        let { price, product:product_id, user:client_reference_id, email:customer_email} = req.body;

    try {
      //DEVELOP ONLY
        product_id=product_id??'prod_OyqslFUmYVAFWx';
        price=price??'price_1OAtArHYKOHA4EIyjjEISJm7';
      //DEVELOP ONLY
      console.log(product_id,price,client_reference_id,customer_email)
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
        success_url: `${req.headers.origin}/payment_success`,
        cancel_url: `${req.headers.origin}/payment_cancel`,        
      });
      res.json({stripe_session_url:session.url});
    } catch (e) {
      const err = e as {message:string};
      res.statusMessage = err.message;
      console.error(err.message)
      res.redirect(`${req.headers.origin}/payment_error`)
      // res.status(err.statusCode || 500).end();
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}