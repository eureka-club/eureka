import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Session } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { updateAction, find } from '../../../../src/facades/post';
import prisma from '../../../../src/lib/prisma';

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const session = (await getSession({ req })) as Session;
      if (session == null) {
        res.status(401).json({ status: 'Unauthorized' });
        return;
      }

      const { id, user_action } = req.query;
      if (typeof id !== 'string' || typeof user_action !== 'string') {
        res.status(404).end();
        return;
      }

      const idNum = parseInt(id, 10);
      if (!Number.isInteger(idNum)) {
        res.status(404).end();
        return;
      }

      try {
        const post = await find(idNum);
        if (post == null) {
          res.status(404).end();
          return;
        }

        const isAdd = true
        await updateAction(post, session.user, `${user_action}s`, isAdd);

        res.status(200).json({ status: 'OK' });
      } catch (exc) {
        console.error("VA UN ERRROR");
        console.error(exc);
        res.status(500).json({ status: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    },
  )
  .delete<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const session = (await getSession({ req })) as Session;
      if (session == null) {
        res.status(401).json({ status: 'Unauthorized' });
        return;
      }

      const { id, user_action } = req.query;
      if (typeof id !== 'string' || typeof user_action !== 'string') {
        res.status(404).end();
        return;
      }

      const idNum = parseInt(id, 10);
      if (!Number.isInteger(idNum)) {
        res.status(404).end();
        return;
      }

      try {
        const post = await find(idNum);
        if (post == null) {
          res.status(404).end();
          return;
        }

        const isAdd = false
        await updateAction(post, session.user, `${user_action}s`, isAdd);

        res.status(200).json({ status: 'OK' });
      } catch (exc) {
        console.error("VA UN ERRROR");
        console.error(exc);
        res.status(500).json({ status: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    },
  )  