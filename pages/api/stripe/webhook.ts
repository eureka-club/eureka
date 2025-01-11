import { addParticipant } from "@/src/facades/cycle";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
import {prisma} from '@/src/lib/prisma';
import { sendMail} from "@/src/facades/mail";
import { GiBreakingChain } from "react-icons/gi";
const bcrypt = require('bcryptjs');

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

  const OncheckoutSessionCompleted=async (email:string,userName:string,cycleId:number,cycleTitle:string)=>{
    let user=await prisma.user.findFirst({where:{email}});
    let newUser=false;
    if(!user){
      const password = await bcrypt.hash(email, 8);
      user = await prisma.user.create({
        data:{
          email,
          password
        }
      });
      newUser=true;
    }
    await addParticipant(cycleId,user?.id);
    const next=encodeURIComponent(`/cycle/${cycleId}`);
    const html = newUser
      ? `
        <h5>${userName}, sua assinatura no clube <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycleTitle}</a>, foi concluída com sucesso.</h5>
        <a href="${process.env.NEXTAUTH_URL}/profile?next=${next} style="ext-decoration: underline;color: orange;">Você deve atualizar seu registro com uma nova senha.</a>
      `
      : `<h5>${userName}, sua assinatura no clube <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycleTitle}</a>, foi concluída com sucesso.</h5>`;

    await sendMail({
      from:process.env.EMAILING_FROM!,
      to:[{email}],
      subject:`Assinatura no clube "${cycleTitle}", concluída com sucesso`,
      html
    });
  }
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
        let {metadata:{cycleId,cycleTitle}}=session;
        await OncheckoutSessionCompleted(email,name,+cycleId,cycleTitle);
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