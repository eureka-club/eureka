import { NextApiRequest, NextApiResponse } from 'next';
import {Form} from 'multiparty';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { find } from '@/src/facades/notification';

import { Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import prisma from '@/src/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id } = req.query;
      const notification = await find(parseInt(id.toString()));
      res.status(200).json({ notification });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ error: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
