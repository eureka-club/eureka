import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form } from 'multiparty';
import { Session, FileUpload } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove, UpdateFromServerFields } from '../../../src/facades/work';
import { prisma } from '@/src/lib/prisma';
import { storeUpload } from '@/src/facades/fileUpload';
import { cors, middleware } from '@/src/lib/cors';
import { Work } from '@prisma/client';
// import redis from '../../../src/lib/redis';
export const config = {
  api: {
    bodyParser: false,
  },
};

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
      // let currentUserIsFav = false;
      // let currentUserRating = 0;
      // let ratingAVG = 0;

      let ratingCount = work._count.ratings;
      const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
      // if(session){
      //     let r  = work.ratings.find(r=>r.userId==session.user.id)
      //     if(r)currentUserRating = r.qty;
      //     currentUserIsFav = work.favs.findIndex(f=>f.id==session.user.id) > -1
      // }
      // work.currentUserRating = currentUserRating;
      work.ratingAVG = ratingAVG;
      // work.currentUserIsFav = currentUserIsFav;
      res.status(200).json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    /*  const data = req.body;
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
    }*/

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }

      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
      const { id } = fields;

      const idNum = parseInt(id, 10);
      if (!Number.isInteger(idNum)) {
        res.status(200).json({ status: 'OK', work: null });
        return;
      }
      const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
      try {
        const uploadData = coverImage ? await storeUpload(coverImage) : null;
        delete fields.id;
        const fieldsA = { ...fields };
        const work = await UpdateFromServerFields(fieldsA, uploadData, idNum);
        //const work = await prisma.work.update({ where: { id: idNum }, data });
        // await redis.flushall();
        res.status(200).json({ work });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });

    /*  try {
      delete data.id;
      const work = await prisma.work.update({ where: { id: idNum }, data });
      // await redis.flushall();
      res.status(200).json({ work });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }*/
  })

.patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  const session = (await getSession({ req })) as unknown as Session;
  if (session == null) {
    res.status(401).json({ status: 'Unauthorized' });
    return;
  }
  
 let data = req.query;
 const  id = parseInt(data.id as string, 10);

 try {
   let r: Work;
     r = await prisma.work.update({  //Esto lo uso para el validar obra en BackOffice, se puede llevar a un facade
       where: { id },
       data: {
         ToCheck: false
       },
     });
   res.status(200).json({ ...r });
 } catch (exc) {
   console.error(exc); // eslint-disable-line no-console
   res.status(500).json({ status: 'server error' });
 } finally {
   ////prisma.$disconnect();
 }
});
