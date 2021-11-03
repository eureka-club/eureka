import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Session } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { find, saveSocialInteraction } from '../../../../src/facades/cycle';
import prisma from '../../../../src/lib/prisma';
import redis from '../../../../src/lib/redis';

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
    !['fav', 'like', 'rating'].includes(socialInteraction)
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
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id, socialInteraction } = req.query;
    const { qty } = req.body;

    if (!(await validateReq(session, id, socialInteraction, res))) {
      return;
    }

    try {
      const cycle = await find(Number(id));
      if (cycle == null) {
        res.status(404).end();
        return;
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(cycle, session.user, socialInteraction, true, qty);
      await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id, socialInteraction } = req.query;

    if (!(await validateReq(session, id, socialInteraction, res))) {
      return;
    }

    try {
      const cycle = await find(Number(id));
      if (cycle == null) {
        res.status(404).end();
        return;
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(cycle, session.user, socialInteraction, false);
      await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
