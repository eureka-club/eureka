import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Cycle } from '@prisma/client';
import getApiHandler from '@/src/lib/getApiHandler';
import { find, remove } from '@/src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import {storeDeleteFile} from '@/src/facades/fileUpload'
// import redis from '@/src/lib/redis';

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = await getSession({ req });
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).end({ status: 'Unauthorized' });
    }

    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(404).end();
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        res.status(404).end();        
      }
      if(cycle && cycle.localImages.length){
        const rmf = await storeDeleteFile(cycle.localImages[0].storedFile);
        if(!rmf){
          res.statusMessage = 'Removing image has failed';
          res.status(500).end();
        }
      }
      if(cycle)
        await remove(cycle);
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = await getSession({ req }) ;
    // if (session == null || !session.user.roles.includes('admin')) {
    //   res.status(401).json({ status: 'Unauthorized' });
    //   return;
    // }
    const { id } = req.query;
    if (typeof id !== 'string') {
     return res.status(404).end();
      
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        // res.status(404).end();
        return res.status(200).json({ ok: true, cycle: null });
        
      }

      let currentUserIsParticipant = false;
      let currentUserIsCreator = false;
      let currentUserIsFav = false;
      let currentUserIsPending = false;
      let currentUserRating = 0;
      let ratingCount = cycle._count.ratings;
      let ratingAVG = 0;
      if(session){
        currentUserIsCreator = cycle.creatorId == session.user.id
        const c = await prisma.cycle.findUnique({
          where:{id:idNum},
          select:{
            participants:{select:{id:true}},
            usersJoined:{select:{userId:true,cycleId:true,pending:true}},
            ratings:true,
          }
        })
        if(c){
          currentUserIsParticipant =  currentUserIsCreator || c.participants.findIndex(p=>p.id==session.user.id) > -1;
          currentUserIsPending = c.usersJoined.findIndex(p=>p.userId==session.user.id && cycle.id==p.cycleId && p.pending) > -1;
          ratingAVG = c.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount
          let r  = c.ratings.find(r=>r.userId==session.user.id)
          if(r)currentUserRating = r.qty;
        }
        currentUserIsFav = cycle.favs.findIndex(p=>p.id==session.user.id) > -1;
        
      }
      cycle.currentUserIsParticipant = currentUserIsParticipant;
      cycle.currentUserIsCreator = currentUserIsCreator;
      cycle.currentUserIsFav = currentUserIsFav;
      cycle.currentUserIsPending = currentUserIsPending;
      cycle.currentUserRating = currentUserRating;
      cycle.ratingCount = ratingCount;
      cycle.ratingAVG = ratingAVG;

      res.status(200).json({ ok: true, cycle });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ ok: false, error: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {//TODO not update with prisma, /faced/cycle -> update must be used !!!
    const session = await getSession({ req });
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).end({ status: 'Unauthorized' });
      
    }
    let data = req.body;

    const { id, includedWorksIds } = data;

    try {
      let r: Cycle;
      if (includedWorksIds) {
        r = await prisma.cycle.update({
          where: { id },
          data: {
            updatedAt: dayjs().utc().format(),
            works: { connect: includedWorksIds.map((workId: number) => ({ id: workId })) },
          },
        });
      } else {
        data.startDate = dayjs(`${data.startDate}`, 'YYYY').utc().format();
        data.endDate = dayjs(`${data.endDate}`, 'YYYY').utc().format();
        delete data.id;
        data = {
          ...data,
        };
        r = await prisma.cycle.update({ where: { id }, data });
      }
      // await redis.flushall();
      res.status(200).json({ ...r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  });
