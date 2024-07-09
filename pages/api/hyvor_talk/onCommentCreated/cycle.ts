import {prisma} from '@/src/lib/prisma';
import { CronJob, sendAt } from 'cron';
import { sendEmailOnCommentCreated, sendEmailWithComentCreatedSumary } from '@/src/facades/mail';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CRON_TIME, LOCALES, WEBAPP_URL } from '@/src/constants';
const i18 = require('i18n');
import { NOT_FOUND } from '@/src/api_code';
import { dict, getDict } from '@/src/hooks/useTranslation';
import { Locale } from 'i18n-config';
interface ReqProps{
  cycleId:number;
  url:string;
  user:{name:string,email:string};
  parent_id:number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  
  if(req.method?.toLowerCase()=='post'){
    try{
      const{cycleId,url:eurl,user:{name,email},parent_id}=req.body as ReqProps; 
      const pageIdentifier=`cycle-${cycleId}`;
      let locale = req.cookies.NEXT_LOCALE || i18.defaultLocale;
      let to:{email:string,name?:string}[] = [];

      const cycle = await prisma.cycle.findFirst({
        where:{id:+cycleId},
        select:{
          title:true,
          languages:true,
          creator:{select:{email:true,name:true}},
          participants:{select:{email:true,name:true}},
        }
      });
      if(!cycle)return res.status(200).json({error:NOT_FOUND});

      const title=cycle?.title;
      const languages = cycle?.languages.split(",")
      locale=languages?.length ? languages[0] : locale;
      locale=LOCALES[locale]??i18.defaultLocale;
      const json=(await getDict('onCommentCreated',locale as Locale))??{};
      
      const aboutEnd=dict(`aboutEnd`,json);
      const urllabel=dict('urlLabel',json);
      const unsubscribe="";//dict('unsubscribe');
      
      if(parent_id){

        const subject=dict(`subject-comment`,json,{title});
        const etitle=dict(`title-comment`,json,{
          title,
          name
        });
        const about=dict(`about-comment`,json);
        const pcurl = `${WEBAPP_URL}/api/hyvor_talk/comment/${parent_id}`;
        const fr=await fetch(pcurl);
        if(fr.ok){
          const parentComment=await fr.json();

          if(parentComment && parentComment.comment?.user?.email!=email){
            const {comment}=parentComment;
            to.push({email:comment.user.email});
            const emailSend = await sendEmailOnCommentCreated({
              to,
              subject,
              specs:{
                etitle,
                about,
                aboutEnd,
                eurl,
                urllabel,
                unsubscribe
              },
            });
            return res.status(200).json({data:{emailSend}});
          }
        }
        return res.status(200).json({error:NOT_FOUND});
      }
      else{
        const idx = cycle?.participants.findIndex(p=>p.email==email);
        if(idx>=0)cycle?.participants.splice(idx!,1);
        to=cycle.participants.map((p)=>({email:p.email!,name:p.name!}));
        if(cycle.creator.email!=email)to.push({email:cycle.creator.email!,name:cycle.creator.name!});//to=[{email:cycle.creator.email!}]//

        const url = `${WEBAPP_URL}/api/hyvor_talk/searchCommentsLast8Hours?id=cycle-${cycleId}`;
        const fr = await fetch(url);
        const {data} = await fr.json();
        const commentedBy:Record<string,string>={};
        data?.reduce((prev:Record<string,string>,curr:any) => {
          const {user} = curr;
          prev[user.email]=user.name;
          return prev;
        },commentedBy);
        const subject=dict(`subject-cycle-sumary`,json,{title});
        const etitle=dict(`title-cycle-sumary`,json,{
            title,
            first3UsersNames:Object.values(commentedBy).join(', ')
        });
        const about=dict(`about-cycle-sumary`,json);
        let comentEmailSaved = null;
        if(to?.length){
          comentEmailSaved = await prisma.comentCreatedDaily.create({
            data:{
              to:to.map(t=>t.email).join(','),
              subject,
              etitle,
              about,
              aboutEnd,
              eurl,
              urllabel,
              unsubscribe,
              pageIdentifier
            }
          });
          if(!(global as any).sendEmailWithComentCreatedSumaryCronJob){
            const cronTime = CRON_TIME;
            const dt = sendAt(cronTime);
            console.log(`The job would run at: ${dt.toISO()}`);
            (global as any).sendEmailWithComentCreatedSumaryCronJob = new CronJob(
              cronTime, // cronTime
              async function () {
                await sendEmailWithComentCreatedSumary();
              }, // onTick
              null, // onComplete
              true, // start
              'America/Sao_Paulo' // timeZone
            );
          }
        }
        return res.status(200).json({ data:{comentEmailSaved} });    
      }
    }
    catch(e){
        console.error(e);
        return res.status(400).json({ error:e?.toString() });
    }
  }
}
