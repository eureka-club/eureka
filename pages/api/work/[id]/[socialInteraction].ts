import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Languages, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { find, saveSocialInteraction } from '@/src/facades/work';
// import redis from '@/src/lib/redis';
import {create} from '@/src/facades/notification'

const validateReq = async (
  session: Session,
  id: unknown,
  socialInteraction: unknown,
  res: NextApiResponse,
): Promise<boolean> => {
  if (session == null) {
    res.status(401).json({ status: 'Unauthorized' });
    return false;
  }

  if (
    typeof id !== 'string' ||
    typeof socialInteraction !== 'string' ||
    !['fav', 'like', 'readOrWatched', 'rating'].includes(socialInteraction)
  ) {
    res.status(404).end();
    return false;
  }

  const idNum = parseInt(id, 10);
  if (!Number.isInteger(idNum)) {
    res.status(404).end();
    return false;
  }
  return true;
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id, socialInteraction,lang:l } = req.query;
    const language = Languages[l?.toString()??"es"];
    const { qty,year,doCreate, notificationMessage,notificationContextURL,notificationToUsers } = req.body;

    if (!(await validateReq(session, id, socialInteraction, res))) {
      return;
    }

    try {
      const work = await find(Number(id),language,session);
      if (work == null) {
        res.status(404).end();
        return;
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(work, session.user, socialInteraction, doCreate, qty, year);
      if(doCreate && notificationMessage && notificationContextURL)
        await create(
          notificationMessage,
          notificationContextURL,
          session.user.id,
          notificationToUsers
        );

      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id, socialInteraction,lang:l } = req.query;
    const language = Languages[l?.toString()??"es"];


    if (!(await validateReq(session, id, socialInteraction, res))) {
      return;
    }

    try {
      const work = await find(Number(id),language,session);
      if (work == null) {
        res.status(404).end();
        return;
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(work, session.user, socialInteraction, false);
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
