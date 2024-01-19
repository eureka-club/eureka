// import { NextApiRequest, NextApiResponse } from 'next';
// import NextAuth, { User }  from 'next-auth';
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
// // import Providers from 'next-auth/providers';
// import GoogleProvider from "next-auth/providers/google"
// import EmailProvider from "next-auth/providers/email"
// import CredentialsProvider from "next-auth/providers/credentials"

// import getT from 'next-translate/getT';
// import {prisma} from '@/src/lib/prisma';
// import { sendMail, sendMailSingIn } from '@/src/facades/mail';
// const bcrypt = require('bcryptjs');
// import { subscribe_to_segment } from '@/src/lib/mailchimp';
// import { addParticipant, find } from '@/src/facades/cycle';
// import axios from 'axios';
// import cycle from '../cycle';
// import { Cycle } from '@prisma/client';
// import { CycleDetail } from '@/src/types/cycle';
// import { defaultLocale } from 'i18n';
// import { config } from '@/src/auth';

// /* const getOptions = (req: NextApiRequest) => {
//   const locale = req.cookies.NEXT_LOCALE;
//   const options = {
//     adapter: Adapters.Prisma.Adapter({ prisma }),
//     callbacks: {
//       session: async (session: Session, user: User) => {
//         session.user.id = user.id; // eslint-disable-line no-param-reassign
//         session.user.roles = user.roles; // eslint-disable-line no-param-reassign

//         return Promise.resolve(session);
//       },
//     },
//     debug: process.env.NODE_ENV === 'development',
//     providers: [
//       Providers.Google({
//         clientId: process.env.GOOGLE_ID!,
//         clientSecret: process.env.GOOGLE_SECRET!,
//       }),
//       Providers.Email({
//         server: {
//           host: process.env.EMAIL_SERVER_HOST!,
//           port: Number(process.env.EMAIL_SERVER_PORT!),
//           auth: {
//             user: process.env.EMAIL_SERVER_USER!,
//             pass: process.env.EMAIL_SERVER_PASS!,
//           },
//         },
//         from: process.env.EMAILING_FROM,
//         sendVerificationRequest: async ({ identifier: email, url, baseUrl }): Promise<void> => {
//           const site = baseUrl.replace(/^https?:\/\//, '');
//           const t = await getT(locale, 'singInMail');
//           const title = t('title');
//           const subtitle = t('subtitle');
//           const singIngConfirmationUrl = t('singIngConfirmationUrl');
//           const ignoreEmailInf = t('ignoreEmailInf');
//           const aboutEureka = t('aboutEureka');
//           const emailReason = t('emailReason');

//           const opt = {
//             to: [
//               {
//                 email,
//               },
//             ],
//             from: {
//               email: process.env.EMAILING_FROM!,
//               name: 'EUREKA-CLUB',
//             },
//             subject: `Sign in to ${site} on: ${new Date().toUTCString()}`,
//             html: '',
//           };

//           await sendMailSingIn(opt, {
//             to: email,
//             url,
//             title,
//             subtitle,
//             singIngConfirmationUrl,
//             ignoreEmailInf,
//             aboutEureka,
//             emailReason,
//           });
//         },
//       }),
//     ],
//     secret: process.env.SECRET,
//     pages: {
//       verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
//     },
//   };
//   return options;
// }; */
// const mailchimpErrorHandler = async (email_address:string,segment:string)=>{
//   const subject =`Failed subscribing ${email_address} to the segment: ${segment}`;
  
//   await sendMail({
//     from:{email:process.env.EMAILING_FROM!},
//     to:[{email:process.env.DEV_EMAIL!}],
//     subject,
//     html:`<p>${subject}</p>`
//   });
// }

// const joinToCycleHandler = async (req: NextApiRequest,cycle:Cycle & {
//   participants: {
//       id: number;
//   }[];
// },user:User)=>{
//   if(cycle?.access!==4){
//     let notificationMessage = `userJoinedCycle!|!${JSON.stringify({
//       userName: user?.name,
//       cycleTitle: cycle?.title,
//     })}`;

//     const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cycle/${cycle!.id}/join`, { 
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         userId:user.id,
//         notificationMessage,
//         notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
//         notificationToUsers:cycle.participants.map(i=>i.id),
//       }),
//     });
//   }
// }


// const res = (req: NextApiRequest, res: NextApiResponse): void | Promise<void> => {
//   const locale = req.cookies.NEXT_LOCALE || defaultLocale;
//   return NextAuth(req, res, config(req, locale));
// };

// export default res;
export default ()=>{}