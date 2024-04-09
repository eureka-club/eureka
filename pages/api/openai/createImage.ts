// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendMail } from '@/src/facades/mail';
import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from "openai";

const openai = new OpenAI();

// const openai = new OpenAIApi(configuration);
openai.apiKey = process.env.OPENAI_API_KEY!
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });


type Data = {
  data?: any[];
  error?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) { 
    if(req.method=='POST'){
      const {n:n_,size:s} = req.body
      const n = n_ ? n_ : 3
      const size = s ? s : '1024x1024'
      try{
        const r = await openai.images.generate({
          prompt: req.body.text.replace(/,|;/g,''),
          n:1,
          size,
          model:'dall-e-3',
          quality:'hd',
          response_format:'b64_json'
          });
          if(r.data){
            return res.status(200).json({ data:r.data });
          }
      }
      catch(e){
        if(e?.hasOwnProperty('message')){
          const {message} = (e as {message:string});
          if(e?.hasOwnProperty('code')){
            const {code} = (e as {code:string});
            if(code=="billing_hard_limit_reached"){
              await sendMail({
                from:process.env.EMAILING_FROM!,
                to:[
                  {email:process.env.DEV_EMAIL!},
                  {email:process.env.EMAILING_FROM!}
                ],
                subject:message,
                html:`<p>${`OPEN AI ERROR: ${message}`}</p>`
              });
            }
          }
          return res.status(200).json({ error:message });
        }
        return res.status(200).json({ error:'SERVER ERROR' });
      }

  }
}
