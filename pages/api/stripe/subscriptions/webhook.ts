import { addParticipant } from "@/src/facades/cycle";
import { NextApiRequest, NextApiResponse } from "next";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
import {prisma} from '@/src/lib/prisma';
import { sendMail} from "@/src/facades/mail"; 
import { OncheckoutSessionCompleted } from "../OncheckoutSessionCompleted";

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
  let event;
  const setSubscriptionOnEureka = async (cycleId:number,userId:number,customerId:string,status:string)=>{
    
    await prisma.subscription.updateMany({
      where:{
          cycleId,
          userId,
      },
      data:{
        status,
      }
    });
  }
  try{
    if (req.method === 'POST') {
      event = req.body;
  
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
        let invoice;
        let subscription;
        
        switch (event.type) {
          case 'checkout.session.completed':
            let session = event.data.object;
            cycleId = +session.metadata.cycleId;
            cycleTitle = session.metadata.cycleTitle;
            userId = +session.metadata.userId;
            userName = session.metadata.userName;
            customerId = session.customer;
            email = session.customer_details.email;
            productId = session.metadata.product_id;
            status = session.payment_status;
            subscription = session.subscription;
            let iterations = +session.metadata.iterations;

            let schedule = await stripe.subscriptionSchedules.create({
              from_subscription:subscription
            });
            let phases = schedule.phases.map((p:any)=>({
              start_date:p.start_date,
              end_date:p.end_date,
              items:p.items
            }));
            schedule = await stripe.subscriptionSchedules.update(schedule.id,{
              end_behavior:'cancel',
              phases:[
                ...phases,
                {
                  items:[
                    {
                      price:session.metadata.price,
                      quantity:1
                    },
                  ],
                  iterations:iterations-1,
                  proration_behavior:'none'
                }
              ]
            });

            await OncheckoutSessionCompleted(email,userName,cycleId,cycleTitle,customerId,productId);
            // await addParticipant(cycleId,userId);
            // await sendMail({
            //   from:process.env.EMAILING_FROM!,
            //   to:[{email}],
            //   subject:`Assinatura no clube "${cycleTitle}", concluída com sucesso`,
            //   html:`
            //     <h5>${userName}, sua assinatura no clube <a href="${process.env.NEXTAUTH_URL}/cycle/${cycleId}">${cycleTitle}</a>, foi concluída com sucesso.</h5>
            //   `
            // });
            break;
          // case 'invoice.created':
          //   let {customer_email,hosted_invoice_url,subscription_details:{metadata}} = event.data.object;
          //   await sendMail({
          //     from:process.env.EMAILING_FROM!,
          //     to:[{email:customer_email}],
          //     subject:`Fatura da Assinatura no clube "${metadata.cycleTitle}"`,
          //     html:`
          //       <p><a href="${hosted_invoice_url}">Fatura em PDF </a></p>
          //     `
          //   });
          //   break;
          // case 'invoice.paid':
          //   subscription = event.data.object.subscription_details;
          //   cycleId = +subscription.metadata.cycleId;
          //   userId = +subscription.metadata.userId;
          //   cycleTitle = subscription.metadata.cycleTitle;
          //   customerId = event.data.object.customer;
          //   email = event.data.object.customer_email;
          //   productId = subscription.metadata.product_id;
          //   status = event.data.object.status;
            
          //   await sendMail({
          //     from:process.env.EMAILING_FROM!,
          //     to:[{email}],
          //     subject:`Pagamento da conta da assinatura no clube "${cycleTitle}", concluída com sucesso`,
          //     html:`
          //       <p><a href="${event.data.object.invoice_pdf}">Fatura em PDF</a></p>
          //     `
          //   });
          // setSubscriptionOnEureka(
          //   cycleId,
          //   userId,
          //   customerId,
          //   status
          // );
          //   break;
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
  
            setSubscriptionOnEureka(
              +subscription.metadata.cycleId,
              +subscription.metadata.userId,
              customerId,
              status
            );
  
            break;
          case 'customer.subscription.update':
            subscription = event.data.object;
            status = subscription.status;
  
            await sendMail({
              from:process.env.EMAILING_FROM!,
              to:[{email:process.env.DEV_EMAIL!},{email:process.env.EMAILING_FROM!}],
              subject:`customer.subscription.update (${subscription.customer}|${subscription.id})`,
              html:`
                <p>user: ${subscription.metadata.userId}, cycle: ${subscription.metadata.cycleId}</code>
              `
            });
  
            setSubscriptionOnEureka(
              +subscription.metadata.cycleId,
              +subscription.metadata.userId,
              subscription.customer,
              status
            );
            
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
  catch(e){
    console.log(event?.type,e);
    await sendMail({
      from:process.env.EMAILING_FROM!,
      to:[{email:process.env.DEV_EMAIL!}],
      subject:`stripe subscription webhook error`,
      html:`
        <code> ${event?.type} | ${JSON.stringify(e)}</code>
      `
    });
    res.status(405).send('stripe subscription webhook error');

  }
  
}