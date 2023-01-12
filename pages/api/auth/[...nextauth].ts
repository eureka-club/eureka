import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { User }  from 'next-auth';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
// import Providers from 'next-auth/providers';
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

import getT from 'next-translate/getT';
import {prisma} from '@/src/lib/prisma';
import { sendMailSingIn } from '@/src/facades/mail';
const bcrypt = require('bcryptjs');
import { subscribe_to_segment } from '@/src/lib/mailchimp';

/* const getOptions = (req: NextApiRequest) => {
  const locale = req.cookies.NEXT_LOCALE;
  const options = {
    adapter: Adapters.Prisma.Adapter({ prisma }),
    callbacks: {
      session: async (session: Session, user: User) => {
        session.user.id = user.id; // eslint-disable-line no-param-reassign
        session.user.roles = user.roles; // eslint-disable-line no-param-reassign

        return Promise.resolve(session);
      },
    },
    debug: process.env.NODE_ENV === 'development',
    providers: [
      Providers.Google({
        clientId: process.env.GOOGLE_ID!,
        clientSecret: process.env.GOOGLE_SECRET!,
      }),
      Providers.Email({
        server: {
          host: process.env.EMAIL_SERVER_HOST!,
          port: Number(process.env.EMAIL_SERVER_PORT!),
          auth: {
            user: process.env.EMAIL_SERVER_USER!,
            pass: process.env.EMAIL_SERVER_PASS!,
          },
        },
        from: process.env.EMAILING_FROM,
        sendVerificationRequest: async ({ identifier: email, url, baseUrl }): Promise<void> => {
          const site = baseUrl.replace(/^https?:\/\//, '');
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
            subject: `Sign in to ${site} on: ${new Date().toUTCString()}`,
            html: '',
          };

          await sendMailSingIn(opt, {
            to: email,
            url,
            title,
            subtitle,
            singIngConfirmationUrl,
            ignoreEmailInf,
            aboutEureka,
            emailReason,
          });
        },
      }),
    ],
    secret: process.env.SECRET,
    pages: {
      verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
    },
  };
  return options;
}; */
const res = (req: NextApiRequest, res: NextApiResponse): void | Promise<void> => {
  const locale = req.cookies.NEXT_LOCALE || 'es';
  return NextAuth(req, res, {
    adapter: PrismaAdapter(prisma),
    callbacks: {
      session: async ({session}) => {
        const u = await prisma.user.findFirst({
          where:{email:session.user.email},
          include:{photos:true}
        });
        if(u){
          const s = session;
          s.user.id = +u.id; // eslint-disable-line no-param-reassign
          s.user.roles = u.roles; // eslint-disable-line no-param-reassign
          s.user.name = u.name; // eslint-disable-line no-param-reassign
          s.user.photos = u.photos||[];
        }
        return Promise.resolve(session);        
      },
      // async jwt({ token, user, account, profile, isNewUser }) {
      //   if(user)
      //   return {token,roles:user.roles}
      //   return token
      // }
      // async signIn(user, account, profile:{verificationRequest?:boolean}) {
        
      //   if(profile.verificationRequest){

      //   }
      //   return true
      // },
    },
    session:{
      strategy:"jwt",
    },
    jwt:{
      secret:process.env.SECRET,
      maxAge: 60 * 60 * 24 * 30,
    },
    events:{
      updateUser:async({user})=>{
        
        const vt = await prisma.userCustomData.findFirst({where:{identifier:user.email!}})
        if(vt){
        // const hash = bcrypt.hashSync(vt.password, 8);

          const res = await prisma.user.update({
            where:{email:user.email!},
            data:{
              password:vt.password,
              name:vt.name
            }
          })

        }
      },
      createUser:async({user})=>{
        const vt = await prisma.userCustomData.findFirst({where:{identifier:user.email!}});

        await subscribe_to_segment({
          segment:'eureka-all-users',
          email_address:user.email!,
          // onSuccess: async (res)=>console.log('ok',res),
          // onFailure: async (err)=>console.error('error',err)
        })

        if(vt){
        // const hash = bcrypt.hashSync(vt.password, 8);

          await prisma.user.update({
            where:{email:user.email!},
            data:{
              password:vt.password,
              name:vt.name
            }
          })
          

        }
      }
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
        sendVerificationRequest: async ({ identifier: email, url }): Promise<void> => {
          // const site = url.replace(/^https?:\/\//, '');
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
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          email: { label: "User name", type: "text", placeholder: "User name" },
          password: {  label: "Password", type: "password", placeholder:'Password' }
        },
        async authorize(credentials, req) {
          const user = await prisma.user.findFirst({where:{
            email:credentials?.email
          }})
          
          if (user && credentials) {
            const c = await bcrypt.compare(credentials.password, user.password);
            if(c){
              
              return {id:user.id,email:user.email,image:user.image} as unknown as User
            }
            return null;
            // Any object returned will be saved in `user` property of the JWT
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null    
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        }
      })
    ],
    secret: process.env.SECRET,
    pages: {
      verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
    },
  });
};

export default res;