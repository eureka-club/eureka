import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Languages } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { findSumary } from '@/src/facades/work';
import { SERVER_ERROR} from '@/src/api_code';
// import redis from '@/src/lib/redis';

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = await getSession({ req });
    const { id, lang: l } = req.query;
    const language = l ? Languages[l.toString()] : null;

    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      let work = await findSumary(idNum, language, session);
      if (work == null) {
        return res.status(200).json(null);
      }
      
      res.status(200).json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: SERVER_ERROR, error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  });
 