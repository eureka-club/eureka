import sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import path from 'path';
import readFile from './readFile';

const Handlebars = require('handlebars');

sgMail.setApiKey(process.env.EMAIL_SERVER_PASS!);

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
  url: string;
  to: string;
  title: string;
  subtitle: string;
  singIngConfirmationUrl: string;
  ignoreEmailInf: string;
  aboutEureka: string;
  emailReason: string;
};

export const sendMail = async (opt: MailDataRequired): Promise<boolean> => {
  const { to, from, subject, html = '', templateId = null, dynamicTemplateData = null } = opt;
  const msg = {
    to,
    from,
    subject,
    ...(html && { html }),
    ...(templateId && { templateId }),
    ...(dynamicTemplateData && { dynamicTemplateData }),
  };

  try {
    const res = await sgMail.send(msg as MailDataRequired);
    // console.log(res);
    if (res) return true;
    return false;
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
};

export const sendMailSingIn = async (opt: MailDataRequired, specs: EmailSingInSpecs): Promise<boolean> => {
  const opts = { ...opt };
  if (process.env.TEMPLATE_ORIGIN === 'local') {
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'mail', 'eureka_singin.html');
    const res = await readFile(templatePath);
    if (res) {
      const template = Handlebars.compile(res);
      opts.html = template(specs);
    }
  } else {
    opts.templateId = 'eureka_singin';
    opts.dynamicTemplateData = { url: ' ' }; // TODO
  }
  const res = await sendMail(opts);
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
    opts.templateId = 'request_join_cycle';
    opts.dynamicTemplateData = { url: ' ' }; // TODO
  }
  const res = await sendMail(opts);
  return res;
};
