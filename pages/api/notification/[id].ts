import { NextApiRequest, NextApiResponse } from 'next';

import dayjs from 'dayjs'; 
import utc from 'dayjs/plugin/utc';
import { find } from '@/src/facades/notification';

import getApiHandler from '@/src/lib/getApiHandler';
import prisma from '@/src/lib/prisma';

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id } = req.query;
      const notification = await find(parseInt(id.toString()));
      res.status(200).json({ notification });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.statusMessage = 'server error'
      res.status(500).end();
    } finally {
      // //prisma.$disconnect();
    }
  })
  
