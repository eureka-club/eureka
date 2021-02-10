import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove } from '../../../src/facades/post';
import prisma from '../../../src/lib/prisma';

export default getApiHandler().delete<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as Session;
    if (session == null) {
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
      const post = await find(idNum);
      if (post == null) {
        res.status(404).end();
        return;
      }

      await remove(post);

      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  },
);
