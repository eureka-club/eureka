import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { InitOptions } from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import prisma from '../../../src/lib/prisma';
import { Session } from '../../../src/types';

const options: InitOptions = {
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
    }),
  ],
  secret: process.env.SECRET,
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, options);
