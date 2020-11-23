import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Adapters from 'next-auth/adapters';
import Providers from 'next-auth/providers';

import { DATABASE_DB_NAME, DATABASE_ENGINE, DATABASE_HOST, DATABASE_PASSWORD, DATABASE_USER } from '../../../constants';
import { Session, User } from '../../../types';

const options = {
  adapter: Adapters.TypeORM.Adapter({
    ...(DATABASE_ENGINE != null && { type: DATABASE_ENGINE as 'mssql' }),
    ...(DATABASE_DB_NAME != null && { database: DATABASE_DB_NAME }),
    ...(DATABASE_HOST != null && { host: DATABASE_HOST }),
    ...(DATABASE_PASSWORD != null && { password: DATABASE_PASSWORD }),
    ...(DATABASE_USER != null && { username: DATABASE_USER }),
  }),
  callbacks: {
    session: async (session: Session, user: User) => {
      session.user.id = user.id; // eslint-disable-line no-param-reassign

      return Promise.resolve(session);
    },
  },
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
};

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => NextAuth(req, res, options);
