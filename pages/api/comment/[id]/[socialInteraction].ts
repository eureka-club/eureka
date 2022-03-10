import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Session } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { find, saveSocialInteraction } from '../../../../src/facades/post';
import prisma from '../../../../src/lib/prisma';

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
    (socialInteraction !== 'fav' && socialInteraction !== 'like')
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

    if (!(await validateReq(session, id, socialInteraction, res))) {
      return;
    }

    try {
      const post = await find(Number(id));
      if (post == null) {
        res.status(404).end();
        return;
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(post, session.user, socialInteraction, true);

      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id, socialInteraction } = req.query;

    if (!(await validateReq(session, id, socialInteraction, res))) {
      return;
    }

    try {
      const post = await find(Number(id));
      if (post == null) {
        res.status(404).end();
        return;
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(post, session.user, socialInteraction, false);

      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
