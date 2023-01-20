import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove } from '../../../src/facades/work';
import {prisma} from '@/src/lib/prisma';
// import redis from '../../../src/lib/redis';

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    const { id } = req.query;
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
      const work = await find(idNum);
      if (work == null) {
        res.status(404).end();
        return;
      }

      await remove(idNum);
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    // if (session == null) {
    //   res.status(200).json({ error: 'Unauthorized', work: null });
    //   return;
    // }


    const { id } = req.query;
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
      const work = await find(idNum);
      if (work == null) {
        return res.status(200).json(null);
      }
      let currentUserIsFav = false;
      let currentUserRating = 0;
      let ratingCount = work._count.ratings;
      let ratingAVG = 0;

      if(session){
        const w = await prisma.work.findUnique({
          where:{id:work.id},
          select:{
            favs:{select:{id:true}},
            ratings:true,
          }
        })
        if(w){
          let r  = w.ratings.find(r=>r.userId==session.user.id)
          if(r)currentUserRating = r.qty;
          ratingAVG = w.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount
          currentUserIsFav = w.favs.findIndex(f=>f.id==session.user.id) > -1
        }

      }
      work.currentUserIsFav= currentUserIsFav
      work.currentUserRating = currentUserRating;
      work.ratingAVG = ratingAVG;
      work.currentUserIsFav = currentUserIsFav;
      res.status(200).json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    const data = req.body;
    data.publicationYear = dayjs(`${data.publicationYear}`, 'YYYY').utc().format();
    const { id } = data;
    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      // res.status(404).end();
      res.status(200).json({ status: 'OK', work: null });
      return;
    }

    try {
      delete data.id;
      const work = await prisma.work.update({ where: { id: idNum }, data });
      // await redis.flushall();
      res.status(200).json({ work });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
