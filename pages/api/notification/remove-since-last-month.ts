import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import {  create, update } from '@/src/facades/notification';
import {prisma} from '@/src/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

/* export const config = {
  api: {
    bodyParser: false,
  },
}; */

export default getApiHandler()
.delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const session = await getSession({ req });
    if(session && session.user.roles=='admin'){
      const lastMonth = dayjs().utc().subtract(1,'month');
      const notifications = await prisma.notification.deleteMany({
        where:{
          createdAt:{
            lte:lastMonth.toDate()
          }
      },
      });
      return res.status(200).json({ notifications });
    }
    return res.status(200).json({ error:'unauthorized' });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    // //prisma.$disconnect();
  }
})
