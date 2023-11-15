import { addParticipant } from "@/src/facades/cycle";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = 'whsec_c40464540a3e7b1fac872b6fbcea8735b70956c1bcab6b59d51a5b54d01a4418';

const buffer = (req:any) => {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];

    req.on('data', (chunk: any) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    req.on('error', reject);
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let event = req.body;
    const body = await buffer(req);

    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          endpointSecret
        );
      } catch (e) {
        const err = e as{message:string};
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400);
      }
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const {client_reference_id:userId,cycleId}=paymentIntent.metadata;
        const cycle = await prisma?.cycle.findUnique({where:{id:+cycleId}});
        if(cycle){
          await addParticipant(cycle,+userId);
        }
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`,paymentIntent.metadata);
        break;
      // case 'charge.succeeded':
      //   //console.log(`charge.succeeded ${event.type} was successful!`,event);
      //   break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).end('Acknowledge receipt');

  } 
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}