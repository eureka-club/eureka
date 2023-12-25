import type {  NextAuthOptions, User } from "next-auth"
import Google from "next-auth/providers/google"
import {prisma} from '@/src/lib/prisma';
import { subscribe_to_segment } from "./src/lib/mailchimp";
import { sendMail, sendMailSingIn } from "./src/facades/mail";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";
import { Locale } from "./i18n-config";
import { getDictionary, t } from "./src/get-dictionary";
const bcrypt = require('bcryptjs');
import { PrismaAdapter } from "@auth/prisma-adapter"
import { NextApiRequest } from "next";
import { Cycle } from "@prisma/client";
import { NextRequest } from "next/server";
import getLocale from "./src/getLocale";
// declare module "next-auth/jwt" {
//   interface JWT {
//     /** The user's role. */
//     userRole?: "admin"
//   }
// }

const mailchimpErrorHandler = async (email_address:string,segment:string)=>{
  const subject =`Failed subscribing ${email_address} to the segment: ${segment}`;
  
  await sendMail({
    from:{email:process.env.EMAILING_FROM!},
    to:[{email:process.env.DEV_EMAIL!}],
    subject,
    html:`<p>${subject}</p>`
  });
}

const joinToCycleHandler = async (cycle:Cycle & {
  participants: {
      id: number;
  }[];
},user:User)=>{
  if(cycle?.access!==4){
    let notificationMessage = `userJoinedCycle!|!${JSON.stringify({
      userName: user?.name,
      cycleTitle: cycle?.title,
    })}`;

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cycle/${cycle!.id}/join`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId:user.id,
        notificationMessage,
        notificationContextURL: `/cycle/${cycle!.id}?tabKey=participants`,
        notificationToUsers:cycle.participants.map(i=>i.id),
      }),
    });
  }
}

const config =  (locale:Locale,nextauth?:string[],nextAuthCallbackUrl?:string)=>{

  return {
    adapter: PrismaAdapter(prisma),
    callbacks: {
      session: async ({ session }) => {
        const u = await prisma.user.findFirst({
          where: { email: session.user.email },
          include: { photos: true },
        });
        if (u) {
          const s = session;
          s.user.id = +u.id; // eslint-disable-line no-param-reassign
          s.user.roles = u.roles; // eslint-disable-line no-param-reassign
          s.user.name = u.name; // eslint-disable-line no-param-reassign
          s.user.photos = u.photos || [];
          s.user.language = u.language;
        }
        return Promise.resolve(session);
      },
    },
    session: {
      strategy: 'jwt',
    },
    jwt: {
      secret: process.env.SECRET,
      maxAge: 60 * 60 * 24 * 30,
    },
    events: {
      updateUser: async ({ user }) => {
        const vt = await prisma.userCustomData.findFirst({ where: { identifier: user.email! } });
        if (vt) {
          const res = await prisma.user.update({
            where: { email: user.email! },
            data: {
              password: vt.password,
              name: vt.name,
            },
          });
        }
      },
      createUser: async ({ user }) => {debugger;
        const segment = 'eureka-all-users';
        const r = await subscribe_to_segment({
          segment,
          email_address: user.email!,
          name: user.name || 'unknown',
          // onSuccess: async (res)=>console.log('ok',res),
          // onFailure: async (err)=>console.error('error',err)
        });
        if (!r) {
          mailchimpErrorHandler(user.email!, segment);
        }
        debugger;
        // const {
        //   cookies,
        //   // query: { nextauth },
        // } = req;

        //TODO remove this  -just for testing
        // var nextauth = 'google';

        // const cbu = cookies.get('next-auth.callback-url')?.value;
        let joinToCycle = -1;

        if (nextAuthCallbackUrl?.match(/cycle\/(\d+)\?join=true/)) {
          joinToCycle = +RegExp.$1;
        }
        if (!nextauth?.includes('google')) {
          const vt = await prisma.userCustomData.findFirst({ where: { identifier: user.email! } });

          if (vt) {
            // const hash = bcrypt.hashSync(vt.password, 8);
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                password: vt.password,
                name: vt.name,
              },
            });
          }
          // await prisma.userCustomData.update({
          //   data:{
          //     joinToCycle:-1
          //   },
          //   where:{identifier:user.email!}
          // });
        }
        if (joinToCycle > -1) {
          const cycle = await prisma.cycle.findUnique({
            where: { id: joinToCycle },
            include: { participants: { select: { id: true } } },
          });
          if (cycle) await joinToCycleHandler(cycle, user);
        }
      },
    },
    debug: process.env.NODE_ENV === 'development',
      providers: [
        Google({ 
          clientId: process.env.GOOGLE_ID!,
          clientSecret: process.env.GOOGLE_SECRET!,
        }),
        Email({
          server: {
            host: process.env.EMAIL_SERVER_HOST!,
            port: Number(process.env.EMAIL_SERVER_PORT!),
            auth: {
              user: process.env.EMAIL_SERVER_USER!,
              pass: process.env.EMAIL_SERVER_PASS!,
            },          
          },
          from: process.env.EMAILING_FROM,
          sendVerificationRequest: async ({ identifier: email, url }): Promise<void> => {
            // const site = url.replace(/^https?:\/\//, ''); 
            // const t = await getT(locale, 'singInMail');
            const {singInMail:dict} = await getDictionary(locale);
            const title = t(dict,'title');
            const subtitle = t(dict,'subtitle');
            const singIngConfirmationUrl = t(dict,'singIngConfirmationUrl');
            const ignoreEmailInf = t(dict,'ignoreEmailInf');
            const aboutEureka = t(dict,'aboutEureka');
            const emailReason = t(dict,'emailReason');
            const opt = {
              to: [
                {
                  email,
                  name:'EUREKA'
                },
              ],
              from: process.env.EMAILING_FROM!,
              subject: `Sign in to EUREKA on: ${new Date().toUTCString()}`,
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
              console.error(JSON.stringify(e));
            }
          },
        }),
        Credentials({
          // The name to display on the sign in form (e.g. "Sign in with...")
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          email: { label: 'User name', type: 'text', placeholder: 'User name' },
          password: { label: 'Password', type: 'password', placeholder: 'Password' },
        },
        async authorize(credentials, req) {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });

          if (user && credentials) {
            const c = await bcrypt.compare(credentials.password, user.password);
            if (c) {
              return { id: +user.id, email: user.email, image: user.image } as unknown as User;
            }
            return null;
            // Any object returned will be saved in `user` property of the JWT
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        },
        })
      ],
      secret: process.env.SECRET,
      pages: {
        verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
      },
  } satisfies NextAuthOptions
}
export default  config;

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
// export function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
//   return getServerSession(...args, auth_config)
// }

// export const handler = NextAuth(auth_config);
// export {handler as GET, handler as POST};

// We recommend doing your own environment variable validation
// declare global {
//   namespace NodeJS {
//     export interface ProcessEnv {
//       NEXTAUTH_SECRET: string
//       GOOGLE_ID: string;
//       GOOGLE_SECRET: string
//     }
//   }
// }
