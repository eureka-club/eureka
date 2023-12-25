import { addParticipant } from "@/src/facades/cycle";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
import {prisma} from '@/src/lib/prisma';
import { sendMail} from "@/src/facades/mail";
import { NextRequest, NextResponse } from "next/server";

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

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
export const POST = async (req:NextRequest)=>{
  let {event} = await req.json();
  const body = await buffer(req);

    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers.get('stripe-signature');
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          endpointSecret
        );
      } catch (e) {
        const err = e as{message:string};
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return NextResponse.json({error:'Webhook signature verification failed.'});
      }
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const {client_reference_id:userId,cycleId}=paymentIntent.metadata;
        const cycle = await prisma?.cycle.findUnique({where:{id:+cycleId}});
        
        if(cycle){
          try{
            await addParticipant(cycle.id,+userId);
          }
          catch(e){
            console.error(e);
            const user = await prisma.user.findUnique({where:{id:+userId}});
            if(user){
              const subject =`After the user paid successfully -failed join ${user.email} to the cycle: ${cycleId}`;
              await sendMail ({       
                from:process.env.DEV_EMAIL!,
                to:process.env.EMAILING_FROM!,
                subject,
                html:`<p>${subject}</p>`
              });
            }
          }
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
    return NextResponse.json({error:'Acknowledge receipt'});
}
