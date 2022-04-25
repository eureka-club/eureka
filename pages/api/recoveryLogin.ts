import { NextApiRequest, NextApiResponse } from 'next';
// import { Session } from '../../src/types';
import { Work, Cycle } from '@prisma/client';
import getApiHandler from '../../src/lib/getApiHandler';
import prisma from '../../src/lib/prisma';
import bcrypt, { encodeBase64 } from 'bcryptjs'
import dayjs from 'dayjs';
import axios from 'axios';
import path from 'path';
import readFile from '@/src/facades/readFile';
import getT from 'next-translate/getT';
import Handlebars from 'handlebars';


export default getApiHandler()
.post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {debugger;
    const {email:em} = req.body;
    const locale = req.cookies.NEXT_LOCALE || 'es';
    const to = em.toString();
    const user = await prisma.user.findUnique({where:{email:to}});
    if(user){
      let html = '';
      const t = await getT(locale, 'recoveryLoginMail');
      const title = t('title');
      const subtitle = t('subtitle');
      const recoveryLogInConfirmationUrl = t('recoveryLogInConfirmationUrl');
      const ignoreEmailInf = t('ignoreEmailInf');
      const aboutEureka = t('aboutEureka');
      const emailReason = t('emailReason');
      const base64Hash = Buffer.from(user.email!, 'binary').toString('base64');
  
      const specs = {
        url: `${process.env.NEXTAUTH_URL}/api/recoveryLogin?hash=${base64Hash}`,
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
        console.log('templatePath ', templatePath);
        const res = await readFile(templatePath);
        if (res) {
          const template = Handlebars.compile(res);
          html = template(specs);
        }
      }
      const {data,status, statusText} = await axios.post(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/sendMail`,{
        to:[{email:to,name:user.name}],
        // to,
        subject:'EUREKA recovery login',
        html
      });
      debugger;
      if(status == 200)
        res.redirect(`${process.env.NEXT_PUBLIC_WEBAPP_URL}/auth/emailVerify`)
      res.statusMessage = statusText;  
      res.status(status).json({data:null})

    }
    

  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } 
  
})
.get<NextApiRequest, NextApiResponse>(async (req,res):Promise<void> => {
  debugger;
  const {hash:h} = req.query;
  if(!h){
    res.statusMessage = 'invalid session';
    res.status(400).end();
  }
  else{
    const hash = h.toString()
    const email = Buffer.from(hash, 'base64').toString('binary');
    const user = await prisma.user.findUnique({where:{email}})
    if(user){
      const resUCD = await prisma.userCustomData.delete({where:{identifier:email}});
      if(resUCD)
        res.redirect(`${process.env.NEXTAUTH_URL}/register`)
    }
    res.status(400).end();
    
  }

})
