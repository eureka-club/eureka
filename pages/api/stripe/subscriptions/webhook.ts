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

    if (event.data){
      let userId;
      let cycleId;
      let email;
      let userName;
      let cycleTitle;
      let productId;
      let customerId;
      let status;
      let obj;
      let invoice;
      let subscription;
      
      switch (event.type) {
        case 'checkout.session.completed':
          obj = event.data.object;
          cycleId = +obj.metadata.cycleId;
          cycleTitle = obj.metadata.cycleTitle;
          userId = +obj.metadata.userId;
          userName = obj.metadata.userName;
          customerId = obj.customer;
          email = obj.customer_email;
          productId = obj.metadata.product_id;
          status = obj.payment_status;

          await prisma.subscription.create({
            data:{
              status,
              userId,
              cycleId,
              customerId,
              productId,
            }
          });
          await addParticipant(cycleId,userId);
          await sendMail({
            from:process.env.EMAILING_FROM!,
            to:[{email}],
            subject:`Assinatura no clube "${cycleTitle}", concluída com sucesso`,
            html:`
              <h5>${userName}, sua assinatura no clube <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycleTitle}</a>, foi concluída com sucesso.</h5>
            `
          });
          break;
        case 'invoice.paid':
          obj = event.data.object.subscription_details;
          cycleId = +obj.metadata.cycleId;
          userId = +obj.metadata.userId;
          customerId = obj.customer;
          email = obj.customer_email;
          productId = obj.metadata.product_id;
          status = obj.payment_status;
          
          await sendMail({
            from:process.env.EMAILING_FROM!,
            to:[{email:event.data.object.customer_email}],
            subject:`Pagamento da conta da assinatura no clube "${cycleTitle}", concluída com sucesso`,
            html:`
              <p><a href="${event.data.object.invoice_pdf}">Fatura em PDF</a></p>
            `
          });

          await prisma.subscription.update({
            where:{
              cycleId_userId_customerId:{
                cycleId,
                userId,
                customerId
              }
            },
            data:{
              status:'paid',
            }
          });
          
          break;
        case 'invoice.payment_failed':
          invoice = event.data.object;
          subscription = invoice.subscription_details;
          customerId = invoice.customer;
          userName = invoice.customer_name;
          status = 'failed';

          await sendMail({
            from:process.env.EMAILING_FROM!,
            to:[{email:process.env.DEV_EMAIL!},{email:process.env.EMAILING_FROM!}],
            subject:`invoice.payment_failed (${subscription.customer}|${subscription.id})`,
            html:`
              <p>user: ${subscription.metadata.userId}, cycle: ${subscription.metadata.cycleId}</code>
            `
          });

          await prisma.subscription.update({
            where:{
              cycleId_userId_customerId:{
                cycleId:+subscription.metadata.cycleId,
                userId:+subscription.metadata.userId,
                customerId
              }
            },
            data:{
              status,
            }
          });

          break;
        case 'customer.subscription.deleted':
          subscription = event.data.object;
          status = subscription.status;

          await sendMail({
            from:process.env.EMAILING_FROM!,
            to:[{email:process.env.DEV_EMAIL!},{email:process.env.EMAILING_FROM!}],
            subject:`customer.subscription.deleted (${subscription.customer}|${subscription.id})`,
            html:`
              <p>user: ${subscription.metadata.userId}, cycle: ${subscription.metadata.cycleId}</code>
            `
          });

          await prisma.subscription.update({
            where:{
              cycleId_userId_customerId:{
                cycleId:+subscription.metadata.cycleId,
                userId:+subscription.metadata.userId,
                customerId:subscription.customer
              }
            },
            data:{
              status,
            }
          });
          break;
        
          default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send('Acknowledge receipt');
  } 
  else {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
  }
}