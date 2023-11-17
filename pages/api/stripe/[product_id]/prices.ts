import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    let { product_id } = req.query;
    try {
      const prices = await stripe.prices.list({
        product: product_id,
        active: true,
      });
      res.json({prices});
    } catch (e) {
      const err = e as {message:string};
      res.statusMessage = err.message;
      console.error(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}