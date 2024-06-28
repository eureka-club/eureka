import {prisma} from '@/src/lib/prisma';
import { CronJob, sendAt } from 'cron';
import { sendEmailOnCommentCreated, sendEmailWithComentCreatedSumary } from '@/src/facades/mail';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CRON_TIME, LOCALES, WEBAPP_URL } from '@/src/constants';
import { defaultLocale } from 'i18n';
import { NOT_FOUND } from '@/src/api_code';
import { dict, getDict } from '@/src/hooks/useTranslation';
import { Locale } from 'i18n-config';
interface ReqProps{
  workId:number;
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
      const{workId,url,user:{name,email},parent_id}=req.body as ReqProps; 
      
      let locale = req.cookies.NEXT_LOCALE || defaultLocale;
      let to:{email:string,name?:string}[] = [];

      const work = await prisma.work.findFirst({
        where:{id:+workId},
        select:{
          title:true,
          language:true,
        }
      });
      if(!work)return res.status(200).json({error:NOT_FOUND});

      const title=work.title;
      const language = work.language;
      locale=language ? language : locale;
      locale=LOCALES[locale]??defaultLocale;
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
          if(parentComment){
            const {comment:{user:{email}}}=parentComment;
            to.push({email});
            const emailSend = await sendEmailOnCommentCreated({
              to,
              subject,
              specs:{
                etitle,
                about,
                aboutEnd,
                eurl:url,
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
        const url = `${WEBAPP_URL}/api/hyvor_talk/searchComments?id=work-${workId}`;
        const fr = await fetch(url);
        const {data} = await fr.json();
        const to_:Record<string,string>={};
        data?.reduce((prev:Record<string,string>,curr:any) => {
          const {user:{email,name}} = curr;
          prev[email]=name;
          return prev;
        },to_);
             
        const subject=dict(`subject-work-sumary`,json,{
          title,
        });
        const etitle=dict(`title-work-sumary`,json,{
            title,
        });
        const about=dict(`about-work`,json);
debugger;
        const comentEmailSaved = await prisma.comentCreatedDaily.create({
          data:{
            to:Object.keys(to_).join(','),
            subject,
            etitle,
            about,
            aboutEnd,
            eurl:url,
            urllabel,
            unsubscribe
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
        return res.status(200).json({ data:{comentEmailSaved} });    
      }
    }
    catch(e){
        console.error(e);
        return res.status(400).json({ error:e?.toString() });
    }
  }
}
