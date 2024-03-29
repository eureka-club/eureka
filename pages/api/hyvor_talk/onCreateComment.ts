import { sendMail } from '@/src/facades/mail';
import { create } from '@/src/facades/notification';
import Notifier from '@/src/lib/Notifier';
import { compare, compareSync } from 'bcryptjs';
import { createHash, createHmac } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
const secretKey = process.env.HYVOR_TALK_Webhook_Secret;

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

type Data = {
  data?: Object;
  error?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    // if(req.method=='POST'||req.method=='post'){
        try{debugger;
          const bodyBuffer = await buffer(req);
          debugger;
        var a=req.headers;
        
        await sendMail({
            from:{email:process.env.EMAILING_FROM!},
            to:[
              {email:process.env.DEV_EMAIL!},
              {email:process.env.EMAILING_FROM!}
            ],
            subject:`gbanoaol@gmail.com`,
            html:`${JSON.stringify({headers:a,method:req.method})}`
        });

          const givenSignature = req.headers['HTTP_X_SIGNATURE']??req.headers['http_x_signature'];
          if(givenSignature){
            const body = JSON.parse(bodyBuffer!.toString()); 
            const {
                event,
                data
            } = body;

            const userId = data?.user?.sso_id??undefined;
            const name = data?.user?.name??undefined;
            // const body_html = data?.body_html??'';
            const title = data?.page?.title??'';
            // const identifier = data?.page?.identifier??'';
            const url = data?.page?.url??'';
          
            await sendMail({
                  from:{email:process.env.EMAILING_FROM!},
                  to:[
                    {email:process.env.DEV_EMAIL!},
                    {email:process.env.EMAILING_FROM!}
                  ],
                  subject:`gbanoaol@gmail.com`,
                  html:`${givenSignature}`
            });
            
            let sense = (event??'').replace(/^\w+\.(\w+)/g,'$1');
            const msg=`hyvor-talk-comment-${sense}!|!{"userName":"${name}","cycleTitle":"${title}"}`;
            await create(msg,url,127,[2,127]);
          
            return res.status(200).json({ data:{data,event} });
          }
          console.log('headers ',req.headers);
          return res.status(200).json({ data:{data:null,event:null} });
        }
        catch(e){
          return res.status(400).json({ error:'Server Error' });
        }
    // }
}
