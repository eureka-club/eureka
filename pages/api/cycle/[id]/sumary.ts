import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import getApiHandler from '@/src/lib/getApiHandler';
import { findSumary } from '@/src/facades/cycle';

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res) => {
    // const session = await getSession({ req }) ;
    try {
      const {id:id_} = req.query
      const id = parseInt((id_||'').toString())
      if(!isNaN(id)){
        const cycle = await findSumary(id);
        res.status(200).json({ cycle });
      }
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ ok: false, error: 'server error',cycle:null });
    } finally {
      ////prisma.$disconnect();
    }
  })
