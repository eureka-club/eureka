import { sendEmailOnCommentCreated, sendMail } from '@/src/facades/mail';
// import Notifier from '@/src/lib/Notifier';
// import { compare, compareSync } from 'bcryptjs';
// import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultLocale } from 'i18n';
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import {prisma} from '@/src/lib/prisma';
import { WEBAPP_URL } from '@/src/constants';

// const secretKey = process.env.HYVOR_TALK_Webhook_Secret;

// const buffer = (req:any) => {
//     return new Promise((resolve, reject) => {
//       const chunks: any[] = [];
  
//       req.on('data', (chunk: any) => {
//         chunks.push(chunk);
//       });
  
//       req.on('end', () => {
//         resolve(Buffer.concat(chunks));
//       });
  
//       req.on('error', reject);
//     });
//   };

// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

type Data = {
  data?: Object;
  error?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method?.toLowerCase()=='post'){
        try{
          const locale = req.cookies.NEXT_LOCALE || defaultLocale;
          const path = join(process.cwd(),'locales',locale,'onCommentCreated.json');

          const rf = promisify(readFile);
          const jsonStr = await rf(path);
          const json = JSON.parse(jsonStr.toString());
          const dict = (k:string,specs?:Record<string,any>)=>{
            let val = json[k];
            if(specs){
              const specsEntries = Object.entries(specs);
              if(specsEntries.length){
                let i = 0;
                for(;i<specsEntries.length;i++){
                  const re=new RegExp(`{{${specsEntries[i][0]}}}`);
                  val = val.replace(re,specsEntries[i][1]);
                }
              }
            }
            return val;
          }

          // const bodyBuffer = await buffer(req);
          //const givenSignature = (req.headers['X_SIGNATURE']??req.headers['x-signature'])?.toString()??'';
          //if(givenSignature){
            // const bodyJSON = bodyBuffer!.toString();
            const body = req.body//JSON.parse(bodyJSON); 
            const {
                //event,
                data
            } = body;
            const emailReason=dict('emailReason');
            const aboutEureka=dict('aboutEureka');
            const ignoreEmailInf=dict('ignoreEmailInf');
            let url = data?.page?.url??'';
            // const userId = data?.user?.sso_id??undefined;
            const parent = data?.parent;
            const name = data?.user?.name??undefined;
            // // const body_html = data?.body_html??'';
            const title = data?.page?.title??'';
            const identifier = data?.page?.identifier??'';
            const [elementType,elementId] = (identifier?.split('-')??[undefined,undefined]);
            
            let to:{email:string}[] = [];
            
            if(parent){
                to=[{email:`${parent.user?.email}`}];
                url=url?`${url}?ht-comment-id=${data.id}`:'';
            }
            else{
              if(elementType=='post'){
                const post = await prisma?.post.findFirst({
                  where:{id:+elementId},
                  select:{creator:{select:{name:true,email:true}}}
                });
                if(post)to=[{email:post?.creator?.email!}]
              }
              else if(elementType=='cycle'){
                {
                  const url = `${WEBAPP_URL}/api/cycle/${elementId}/participants`;
                  const fr = await fetch(url);
                  const {participants} = await fr.json();
                  to=participants.map((p:{email:string})=>({email:p.email}));
                }
              }
              else{
                const url = `${WEBAPP_URL}/api/hyvor_talk/searchComments?id=${elementType}-${elementId}`;
                const fr = await fetch(url);
                const json = await fr.json();
                to=json?.data?.data?.map((j:{user:{email:string}})=>({email:j.user.email}));
              }
            }
            //let sense = (event??'').replace(/^\w+\.(\w+)/g,'$1');
            //const msg=`hyvor-talk-comment-${sense}!|!{"userName":"${name}","cycleTitle":"${title}"}`;
            let titleLbl = parent ? 'replyingCommentTitle' : 'title';
            
            const emailSend = await sendEmailOnCommentCreated({
              to,
              subject:dict(titleLbl,{name,title}),
              specs:{
                title:dict(titleLbl,{name,title}),
                url,
                urlLabel:dict('urlLabel'),
                ignoreEmailInf,
                aboutEureka,
                emailReason,
              }
            });
            
            return res.status(200).json({ data:{emailSend} });
          //}
          //return res.status(200).json({ data:{data:null,event:null} });
        }
        catch(e){
          console.error(e);
          return res.status(400).json({ error:e?.toString() });
        }
    }
}
