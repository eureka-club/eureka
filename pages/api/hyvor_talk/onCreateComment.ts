import { CronJob, sendAt } from 'cron';

import { sendEmailOnCommentCreated, sendEmailWithComentCreatedSumary } from '@/src/facades/mail';
// import { compare, compareSync } from 'bcryptjs';
// import { createHash, createHmac, timingSafeEqual } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultLocale } from 'i18n';
import { readFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import {prisma} from '@/src/lib/prisma';
import { LOCALES, WEBAPP_URL } from '@/src/constants';

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
        // const bodyBuffer = await buffer(req);
        //const givenSignature = (req.headers['X_SIGNATURE']??req.headers['x-signature'])?.toString()??'';
        //if(givenSignature){
        // const bodyJSON = bodyBuffer!.toString();
        const body = req.body//JSON.parse(bodyJSON); 
        const {
            //event,
            data
        } = body;
         
        let locale = req.cookies.NEXT_LOCALE || defaultLocale;
        
        let url = data?.page?.url??'';
        // const userId = data?.user?.sso_id??undefined;
        const parent = data?.parent;
        const name = data?.user?.name??undefined;
        // // const body_html = data?.body_html??'';
        const identifier = data?.page?.identifier??'';
        const [elementType,elementId] = (identifier?.split('-')??[undefined,undefined]);
        let cycle=null;
        let post=null;
        let work=null;

        let elementTitle=data.page.title;

        let to:{email:string,name?:string}[] = [];
        switch(elementType){
          case 'cycle':
            cycle = await prisma.cycle.findFirst({
              where:{id:+elementId},
              select:{
                title:true,
                languages:true,
                creator:{select:{email:true,name:true}},
                participants:{select:{email:true,name:true}},
              }
            });
            elementTitle=cycle?.title;
            const languages = cycle?.languages.split(",")
            locale=languages?.length ? languages[0] : locale;
          break;
          case 'post':
            post = await prisma?.post.findFirst({
              where:{id:+elementId},
              select:{
                title:true,
                language:true,
                creator:{select:{name:true,email:true}}
              }
            });
            elementTitle=post?.title;
            locale=post?.language ?? locale;
          break;  
          case 'work':
            work = await prisma.work.findFirst({
              where:{id:+elementId},
              select:{title:true,language:true}
            });
            elementTitle=work?.title;
            locale=work?.language ?? locale;
          break;  
        }

        if(parent && parent.user?.email!=data.user.email){
            to=[{email:`${parent.user?.email}`,name:parent.user?.name}];
            url=url?`${url}?ht-comment-id=${data.id}`:'';
        }
        else{
          if(post && post.creator?.email!=data.user.email)
              to=[{email:post.creator?.email!,name:post.creator.name!}]
          else if(cycle){
            const idx = cycle?.participants.findIndex(p=>p.email==data.user.email);
            if(idx>=0)cycle?.participants.splice(idx!,1);
            to=cycle.participants.map((p)=>({email:p.email!,name:p.name!}));
            if(cycle.creator.email!=data.user.email)to.push({email:cycle.creator.email!,name:cycle.creator.name!});//to=[{email:cycle.creator.email!}]//
          }
          else if(work){
            const url = `${WEBAPP_URL}/api/hyvor_talk/searchComments?id=${elementType}-${elementId}`;
            const fr = await fetch(url);
            const json = await fr.json();
            json?.data?.data?.forEach((e:{user:{email:string,name:string}}) => {
              if(e.user.email!=data.user.email)to.push({email:e.user.email,name:e.user.name!??e.user.email});
            });
            //to=json?.data?.data?.map((j:{user:{email:string}})=>({email:j.user.email}));
          }
        }
        //let sense = (event??'').replace(/^\w+\.(\w+)/g,'$1');
        //const msg=`hyvor-talk-comment-${sense}!|!{"userName":"${name}","cycleTitle":"${title}"}`;
        if(!to?.length)return res.status(200).json({ data:{emailSend:false,notUsersToSend:true} });

        locale=LOCALES[locale]??defaultLocale;
        const tr_file = !cycle ? 'onCommentCreated.json' : 'onCommentCreatedS.json';
        const path = join(process.cwd(),'locales',locale,tr_file);

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
                const vr = val.replace(re,specsEntries[i][1]);
                val = vr ?? val;
              }
            }
          }
          return val;
        }
        
        const subject=dict(`subject-${elementType}`,{title:elementTitle});
        const title=!cycle 
          ? dict(`title-${elementType}`,{title:elementTitle,name})
          : dict(`title-${elementType}`,{title:elementTitle,first3UsersNames:to.map(t=>t.name??t.email).join(', ')});
        const about=dict(`about-${elementType}`);
        const aboutEnd=dict(`aboutEnd`);
        const urllabel=dict('urlLabel');
        const unsubscribe="";//dict('unsubscribe');

        if(cycle){
          
          const comentEmailSaved = await prisma.comentCreatedDaily.create({
            data:{
              to:to.map(t=>t.email).join(','),
              subject,
              etitle:title,
              about,
              aboutEnd,
              eurl:url,
              urllabel,
              unsubscribe
            }
          });
          if(comentEmailSaved){
            const cronTime = '0 1 20 * * *';
            if(!(global as any).job){
              const dt = sendAt(cronTime);
              console.log(`The job would run at: ${dt.toISO()}`);
              (global as any).job = new CronJob(
                cronTime, // cronTime
                async function () {
                  await sendEmailWithComentCreatedSumary();
                  console.log((new Date()).toISOString());
                }, // onTick
                null, // onComplete
                true, // start
                'America/Sao_Paulo' // timeZone
              );
            }
            return res.status(200).json({ data:{comentEmailSaved} });
          }
          return res.status(200).json({ data:{comentEmailSaved} });    
        }
        
        const emailSend = await sendEmailOnCommentCreated({
          to,
          subject,
          specs:{
            etitle:title,
            about,
            aboutEnd,
            eurl:url,
            urllabel,
            unsubscribe
          },
        });
        if(emailSend)
          return res.status(200).json({ data:{emailSend} });
        return res.status(200).json({ data:{emailSend:false} });
      }
      catch(e){
          console.error(e);
          return res.status(400).json({ error:e?.toString() });
      }
    }
}

const sendComentCreatedEmailDailySumarized = ()=>{

}
