import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Session, Languages } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { SERVER_ERROR } from '@/src/response_codes';
import { findSumary, findWithoutLangRestrict } from '@/src/facades/work';
// import redis from '../../../src/lib/redis';
export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    // if (session == null) {
    //   res.status(200).json({ error: 'Unauthorized', work: null });
    //   return;
    // }
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
      let work = null; 
      if (language) work = await findSumary(idNum,language);
      else work = await findWithoutLangRestrict(idNum);
      if (work == null) {
        return res.status(200).json(null);
      }
      // let currentUserIsFav = false;
      // let currentUserRating = 0;
      // let ratingAVG = 0;

      let ratingCount = work.ratings.length;
      const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
      // if(session){
      //     let r  = work.ratings.find(r=>r.userId==session.user.id)
      //     if(r)currentUserRating = r.qty;
      //     currentUserIsFav = work.favs.findIndex(f=>f.id==session.user.id) > -1
      // }
      // work.currentUserRating = currentUserRating;
      // work.ratingAVG = ratingAVG;
      // work.currentUserIsFav = currentUserIsFav;
      res.status(200).json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: SERVER_ERROR, error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  })
  