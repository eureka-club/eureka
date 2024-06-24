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
      const{cycleId,url,user:{name,email},parent_id}=req.body as ReqProps; 
      
      let locale = req.cookies.NEXT_LOCALE || defaultLocale;
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

      const elementTitle=cycle?.title;
      const languages = cycle?.languages.split(",")
      locale=languages?.length ? languages[0] : locale;
      locale=LOCALES[locale]??defaultLocale;
      const json=(await getDict('onCommentCreated',locale as Locale))??{};
      
      const aboutEnd=dict(`aboutEnd`,json);
      const urllabel=dict('urlLabel',json);
      const unsubscribe="";//dict('unsubscribe');
      
      if(parent_id){
        const subject=dict(`subject-comment`,json,{title:elementTitle});
        const title=dict(`title-comment`,json,{
          title:elementTitle,
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
                etitle:title,
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
        const idx = cycle?.participants.findIndex(p=>p.email==email);
        if(idx>=0)cycle?.participants.splice(idx!,1);
        to=cycle.participants.map((p)=>({email:p.email!,name:p.name!}));
        if(cycle.creator.email!=email)to.push({email:cycle.creator.email!,name:cycle.creator.name!});//to=[{email:cycle.creator.email!}]//

        const subject=dict(`subject-cycle-sumary`,json,{title:elementTitle});
        const title=dict(`title-cycle-sumary`,json,{
            title:elementTitle,
            first3UsersNames:to.slice(0,3).map(t=>t.name??t.email).join(', ')
        });
        const about=dict(`about-cycle-sumary`,json);

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
