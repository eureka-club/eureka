import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth /* , { InitOptions } */ from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import getT from 'next-translate/getT';
import prisma from '../../../src/lib/prisma';
import { Session } from '../../../src/types';
import { sendMailSingIn } from '../../../src/facades/mail';

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

export default (req: NextApiRequest, res: NextApiResponse): void | Promise<void> => {
  const locale = req.cookies.NEXT_LOCALE || 'es';
  return NextAuth(req, res, {
    adapter: Adapters.Prisma.Adapter({ prisma }),
    callbacks: {
      session: async (session, user: User) => {
        (session as unknown as Session).user.id = user.id; // eslint-disable-line no-param-reassign
        (session as unknown as Session).user.roles = user.roles; // eslint-disable-line no-param-reassign
        (session as unknown as Session).user.name = user.name; // eslint-disable-line no-param-reassign
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
    pages: {
      verifyRequest: `/${locale}/auth/emailVerify`, // (used for check email message)
    },
  });
};
