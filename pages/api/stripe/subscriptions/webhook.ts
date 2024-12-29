import { addParticipant } from "@/src/facades/cycle";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
import {prisma} from '@/src/lib/prisma';
import { sendMail} from "@/src/facades/mail";

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
) {debugger;
  if (req.method === 'POST') {
    let event = req.body;
    console.log('event ',event); 

    await sendMail({
      from:process.env.EMAILING_FROM!,
      to:[{email:'gbanoaol@gmail.com'}],
      subject:`Stripe Webhook event payload`,
      html:`
      ${JSON.stringify(event)}
      `
    });


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
      case 'checkout.session.completed':debugger;
        const {data:{object:{status,customer:{id},metadata:{cycleId,userId}}}} = event.data;
        const user = await prisma.user.findUnique({
          select:{email:true},
          where:{id:userId}
        });
        const cycle = await prisma.cycle.findUnique({
          select:{title:true},
          where:{id:cycleId}
        });
        await prisma.subscription.create({
          data:{
            status,
            userId,
            cycleId,
            customerId:id
          }
        });
        await addParticipant(userId,cycleId);
        await sendMail({
          from:process.env.EMAILING_FROM!,
          to:[{email:user?.email!}],
          subject:`Você entrou no clube ${cycle?.title}`,
          html:`
            <p>
              Você entrou no clube <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycle?.title}</a> com sucesso.
            </p>
          `
        });
        
        break;
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      break;
      case 'customer.created':
        debugger;
          const {...othersCC} = event.data;
        break;
      case 'invoice.paid':
        debugger;
        const {...othersIP} = event.data;
        // Continue to provision the subscription as payments continue to be made.
        // Store the status in your database and check when a user accesses your service.
        // This approach helps you avoid hitting rate limits.
        break;
      case 'invoice.payment_failed':
        // The payment failed or the customer does not have a valid payment method.
        // The subscription becomes past_due. Notify your customer and send them to the
        // customer portal to update their payment information.
        break;
      
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