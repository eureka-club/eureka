import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth /* , { InitOptions } */,{DefaultSession, Session} from 'next-auth';
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import {find} from '@/src/facades/user'
import getT from 'next-translate/getT';
import prisma from '../../../src/lib/prisma';
import { Session as MySession } from '@/src/types';
import { sendMailSingIn } from '../../../src/facades/mail';
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email"

interface S extends Session {
  user: MySession & DefaultSession["user"];  
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
    callbacks: {
      session: async (params):Promise<S> => {
        const {session, user} = params;
        // const sessionResult = {user,...session};
        const u = await find({id:user.id});
        (session as unknown as S).user.id = user.id; // eslint-disable-line no-param-reassign
        (session as unknown as S).user.roles = user.roles as string; // eslint-disable-line no-param-reassign
        (session as unknown as S).user.name = user.name as string; // eslint-disable-line no-param-reassign
        (session as unknown as S).user.photos = u && ('photos' in u) ? u.photos : [];
        return Promise.resolve(session as S);
      },
      // async jwt({ token, user, account, profile, isNewUser }) {debugger;
      //   return token
      // }
    },
    
    debug: process.env.NODE_ENV === 'development',
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
      }),
      EmailProvider({
        server: {
          host: process.env.EMAIL_SERVER_HOST!,
          port: Number(process.env.EMAIL_SERVER_PORT!),
          auth: {
            user: process.env.EMAIL_SERVER_USER!,
            pass: process.env.EMAIL_SERVER_PASS!,
          },
        },
        from: process.env.EMAILING_FROM,
        sendVerificationRequest: async ({ identifier: email, url }): Promise<void> => {debugger;
          const locale = 'es'
          // const site = req.headers.origin!.replace(/^https?:\/\//, '');
          const t = await getT(locale, 'singInMail');
          const title = t('title');
          const subtitle = t('subtitle');
          const singIngConfirmationUrl = t('singIngConfirmationUrl');
          const ignoreEmailInf = t('ignoreEmailInf');
          const aboutEureka = t('aboutEureka');
          const emailReason = t('emailReason');
          const opt = {
            to: [
              {
                email,
              },
            ],
            from: {
              email: process.env.EMAILING_FROM!,
              name: 'EUREKA-CLUB',
            },
            subject: `Sign in to ${process.env.NEXT_PUBLIC_WEBAPP_URL} on: ${new Date().toUTCString()}`,
            html: `<a href="{{url}}" target="_blank"
            style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid green; display: inline-block;">
            Click here to finalize your login to Eureka
          </a>`,
          };
          try {
            const emailRes = await sendMailSingIn(opt, {
              to: email,
              url,
              title,
              subtitle,
              singIngConfirmationUrl,
              ignoreEmailInf,
              aboutEureka,
              emailReason,
            });
            // if (!emailRes) res.redirect(404, '/');
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(JSON.stringify(e));
          }
        },
      }),
    ],
    secret: process.env.SECRET,
    // pages: {
    //   verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
    // },
})

// const res = (req: NextApiRequest, res: NextApiResponse) => {debugger;
//   const locale = req.cookies.NEXT_LOCALE || 'es';
  
//   return NextAuth(req, res, {
//     adapter: PrismaAdapter(prisma),
//     callbacks: {
//       session: async (params):Promise<S> => {
//         const {session, user} = params;
//         // const sessionResult = {user,...session};
//         const u = await find({id:user.id});
//         (session as unknown as S).user.id = user.id; // eslint-disable-line no-param-reassign
//         (session as unknown as S).user.roles = user.roles as string; // eslint-disable-line no-param-reassign
//         (session as unknown as S).user.name = user.name as string; // eslint-disable-line no-param-reassign
//         (session as unknown as S).user.photos = u && ('photos' in u) ? u.photos : [];
//         return Promise.resolve(session as S);
//       },
//       // async jwt({ token, user, account, profile, isNewUser }) {debugger;
//       //   return token
//       // }
//     },
    
//     debug: process.env.NODE_ENV === 'development',
//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_ID!,
//         clientSecret: process.env.GOOGLE_SECRET!,
//       }),
//       EmailProvider({
//         server: {
//           host: process.env.EMAIL_SERVER_HOST!,
//           port: Number(process.env.EMAIL_SERVER_PORT!),
//           auth: {
//             user: process.env.EMAIL_SERVER_USER!,
//             pass: process.env.EMAIL_SERVER_PASS!,
//           },
//         },
//         from: process.env.EMAILING_FROM,
//         sendVerificationRequest: async ({ identifier: email, url }): Promise<void> => {debugger;
//           const site = req.headers.origin!.replace(/^https?:\/\//, '');
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
//             html: `<a href="{{url}}" target="_blank"
//             style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid green; display: inline-block;">
//             Click here to finalize your login to Eureka
//           </a>`,
//           };
//           try {
//             const emailRes = await sendMailSingIn(opt, {
//               to: email,
//               url,
//               title,
//               subtitle,
//               singIngConfirmationUrl,
//               ignoreEmailInf,
//               aboutEureka,
//               emailReason,
//             });
//             // if (!emailRes) res.redirect(404, '/');
//           } catch (e) {
//             // eslint-disable-next-line no-console
//             console.log(JSON.stringify(e));
//           }
//         },
//       }),
//     ],
//     secret: process.env.SECRET,
//     pages: {
//       verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
//     },
//   });
// };

// export default res;