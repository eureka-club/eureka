// import { NextApiRequest, NextApiResponse } from 'next';
// import { Work, Cycle } from '@prisma/client';
// import getApiHandler from '@/src/lib/getApiHandler';
// import bcrypt, { encodeBase64 } from 'bcryptjs'
// import dayjs from 'dayjs';
import {prisma} from '@/src/lib/prisma';
import axios from 'axios';
import path from 'path';
import readFile from '@/src/facades/readFile';
import Handlebars from 'handlebars';
import { i18n } from 'i18n-config';
import getLocale from '@/src/getLocale';
import { NextRequest, NextResponse } from 'next/server';
import { getDictionary, t } from '@/src/get-dictionary';
import { redirect } from 'next/navigation';
import { SERVER_ERROR } from '@/src/api_codes';
import { NOTFOUND } from 'dns';

export const POST = async (req:NextRequest) => {
  try {debugger;
    const body = await req.json();
    const {email:em} = body;
    const locale = getLocale(req);
    const to = em.toString();
    const user = await prisma.user.findUnique({where:{email:to}});
    if(user && user.password){
      let html = '';
      const {recoveryLoginMail} = await getDictionary(locale);
      const title = t(recoveryLoginMail,'title');
      const subtitle = t(recoveryLoginMail,'subtitle');
      const ignoreEmailInf = t(recoveryLoginMail,'ignoreEmailInf');
      const aboutEureka = t(recoveryLoginMail,'aboutEureka');
      const emailReason = t(recoveryLoginMail,'emailReason');

      const base64Hash = Buffer.from(`${user.email}!|!${user.password}`,'binary').toString('base64');

      const specs = {
        url: `${process.env.NEXTAUTH_URL}/${locale||'es'}/resetPass?hash=${base64Hash}`,
        to,
        title,
        subtitle,
        ignoreEmailInf,
        aboutEureka,
        emailReason,
      };
  
      if (process.env.TEMPLATE_ORIGIN === 'local') {
        const templatePath = path.join(process.cwd(), 'public', 'templates', 'mail', 'eureka_recovery_login.html');
        // eslint-disable-next-line no-console
        const res = await readFile(templatePath);
        if (res) {
          const template = Handlebars.compile(res);
          html = template(specs);
        }
      }
      const {data,status, statusText} = await axios.post(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/sendMail`,{
        to:[{email:to,name:user.name}],
        // to,
        subject:t(recoveryLoginMail,'subject'),
        html
      });
      
      if(status == 200)
        redirect(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/${locale||i18n.defaultLocale}/auth/emailVerify`)
      else{
        return NextResponse.json({data:null});
      }

    }
    return NextResponse.json({error:NOTFOUND});
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } 
}