import path from 'path';
import Handlebars from 'handlebars';
import {prisma} from '@/src/lib/prisma';

import readFile from './readFile';
import axios from 'axios';
// const client = require('@sendgrid/client');

// const Handlebars = require('handlebars');
export interface MailDataRequired {
  from:string,
  to:{email:string}[],
  subject:string,
  html?:string,
  template_name?:string,
  template_content?:{name:string,content:any}[],
}
const sendEmailWebhook = async (opt: MailDataRequired) => {
  const { from, to, subject, template_name = '', template_content=[], html = '' } = opt;
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/sendMail`,{
      from,
      to,
      subject,
      ...template_name && {
        template_name,
        template_content
      },
      ...!template_name && {html},
    });
    
    if (res.status==200) return true;
    return false;
  } catch (error) {
    const e = error as unknown as { response: { body: any } };
    if (error) {
      const e = (error as {message:string,code?:string});
      // eslint-disable-next-line no-console
      console.error(`${e?.code} ${e.message}`);
      // eslint-disable-next-line no-console
      console.error(e);
    }
    return false;
  }
};
// sgMail.setApiKey(process.env.EMAIL_SERVER_PASS!);

type EmailSingInSpecs = {
  url: string;
  to: string;
  title: string;
  subtitle: string;
  singIngConfirmationUrl: string;
  ignoreEmailInf: string;
  aboutEureka: string;
  emailReason: string;
};

type EmailRequestJoinCycleSpecs = {
  applicantMediathequeURL: string;
  to: string;
  title: string;
  emailReason: string;

  authorizeText: string;
  denyText: string;
  authorizeURL: string;
  denyURL: string;
  thanks: string;
  eurekaTeamThanks: string;
  ignoreEmailInf: string;
  aboutEureka: string;
};

type EmailRequestJoinCycleResponseSpecs = {
  to: string;
  title: string;
  emailReason: string;

  ignoreEmailInf: string;
  aboutEureka: string;
  thanks: string;
  eurekaTeamThanks: string;
  visitCycleInfo?: string;
  cycleURL?: string;
};

export const sendMail = async (opt: MailDataRequired): Promise<boolean> => {
  const { to, subject, html = '', template_name = '', template_content = [] } = opt;
  const msg = {
    from:process.env.EMAILING_FROM!,
    to,
    subject,
    ...!template_name && {html},
    ...template_name && { template_name,template_content },
  };

  try {
    // const res = await sgMail.send(msg as MailDataRequired);
    const res = await sendEmailWebhook(msg);

    // console.log(res);
    if (res) return true;
    return false;
  } catch (error) {
    /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.error(error);

    return false;
  }
};

export type OnCommentCreatedProps = {
  specs:Record<string,any>,
} & Pick<MailDataRequired,'to'|'subject'>;
export const sendEmailOnCommentCreated = async (props:OnCommentCreatedProps)=>{
             
  const {to,subject,specs}=props;
  if(to.length){
    const tc = Object.entries(specs).map(([name,content])=>({name,content}));
    const res = await sendEmailWebhook({
      from:'notifications@eureka.club',
      to,
      subject,
      template_name:'hyvortalkoncommentcreated',
      template_content:tc
  });
  return res;
  }
  // else if (Object.values(specs).length && process.env.TEMPLATE_ORIGIN === 'local') {
  //   const templatePath = path.join(process.cwd(), 'public', 'templates', 'hyvor_talk_comment_created.html');
  //   // eslint-disable-next-line no-console
  //   const templateStr = await readFile(templatePath);
  //   if (templateStr) {
  //     const template = Handlebars.compile(templateStr);
  //     html = template(specs);
  //     const res = await sendEmailWebhook({
  //         from:process.env.EMAILING_FROM!,
  //         to,
  //         subject,
  //         html,
          
  //     });
  //     return res;
  //   }
  // }
  else{
    console.error(`bad request on sendEmailOnCommentCreated`);
    return null;
  }
}

export const sendEmailWithComentCreatedSumary = async ()=>{
  const data = await prisma?.comentCreatedDaily.findMany({
    distinct:['pageIdentifier'],
    orderBy: {
        id: 'desc',
    }
  });
  if(data?.length){
    const promises:Promise<boolean|null>[] = [];

    data.forEach(d=>{
      const {to:to_,subject,etitle,eurl,urllabel,about,aboutEnd,unsubscribe}=d;
      const to = to_.split(",").map((t:string)=>({email:t}));
      promises.push(sendEmailOnCommentCreated({
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
      }));
    });
    const res = await Promise.allSettled(promises);
    await prisma?.comentCreatedDaily.deleteMany();
    
  }
}

export const sendMailSingIn = async (opt: MailDataRequired, specs: EmailSingInSpecs): Promise<boolean> => {
  const opts = { ...opt };
  if (process.env.TEMPLATE_ORIGIN === 'local') {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'mail', 'eureka_singin.html');
    // eslint-disable-next-line no-console
    const res = await readFile(templatePath);
    if (res) {
      const template = Handlebars.compile(res);
      opts.html = template(specs);
    }
  } else {
    opts.template_name = 'eureka_singin';
    opts.template_content = [{ name:'url',content:''}]; // TODO
  }
  // const res = await sendMail(opts);

  const res = await sendEmailWebhook(opts);
  return res;
};

export const sendMailRequestJoinCycle = async (
  opt: MailDataRequired,
  specs: EmailRequestJoinCycleSpecs,
): Promise<boolean> => {
  const opts = { ...opt };
  if (process.env.TEMPLATE_ORIGIN === 'local') {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'mail', 'request_join_cycle.html');
    const res = await readFile(templatePath);
    if (res) {
      const template = Handlebars.compile(res);
      opts.html = template(specs);
    }
  } else {
    opts.template_name = 'request_join_cycle';
    opts.template_content = [{ name: 'url', content:'' }]; // TODO
  }
  // const res = await sendMail(opts);
  const res = await sendEmailWebhook(opts);
  return res;
};

export const sendMailRequestJoinCycleResponse = async (
  opt: MailDataRequired,
  specs: EmailRequestJoinCycleResponseSpecs,
): Promise<boolean> => {
  const opts = { ...opt };
  if (process.env.TEMPLATE_ORIGIN === 'local') {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'mail', 'request_join_cycle_response.html');
    const res = await readFile(templatePath);
    if (res) {
      const template = Handlebars.compile(res);
      opts.html = template(specs);
    }
  } else {
    opts.template_name = 'request_join_cycle_response';
    opts.template_content = [{ name: 'url',content:'' }]; // TODO
  }
  // const res = await sendMail(opts);
  const res = await sendEmailWebhook(opts);
  return res;
};