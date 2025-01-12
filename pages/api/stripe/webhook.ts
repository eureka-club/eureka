import { NextApiRequest, NextApiResponse } from "next";
import { OncheckoutSessionCompleted } from "./OncheckoutSessionCompleted";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

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
      case 'checkout.session.completed':
        let session=event.data.object;
        let {email,name}=session.customer_details;
        let {customer,metadata:{cycleId,cycleTitle,product_id}}=session;
        console.log(`checkout.session.completed for ${email} was successful!`,session);
        await OncheckoutSessionCompleted(email,name,+cycleId,cycleTitle,customer,product_id);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // const {client_reference_id:userId,cycleId}=paymentIntent.metadata;
        // const cycle = await prisma?.cycle.findUnique({where:{id:+cycleId}});
        
        // if(cycle){
        //   try{
        //     await addParticipant(cycle.id,+userId);
        //   }
        //   catch(e){
        //     console.error(e);
        //     const user = await prisma.user.findUnique({where:{id:+userId}});
        //     if(user){
        //       const subject =`After the user paid successfully -failed join ${user.email} to the cycle: ${cycleId}`;
        //       await sendMail ({       
        //         from:process.env.DEV_EMAIL!,
        //         to:[{email:process.env.EMAILING_FROM!}],
        //         subject,
        //         html:`<p>${subject}</p>`
        //       });
        //     }
        //   }
        // }
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
    res.status(200).send('Acknowledge receipt');

  } 
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
  }
}