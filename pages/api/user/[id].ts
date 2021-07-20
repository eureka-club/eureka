import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import prisma from '../../../src/lib/prisma';

dayjs.extend(utc);
export default getApiHandler().patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  const data = req.body;
  const { id } = data;
  if (typeof id !== 'string') {
    res.status(404).end();
    return;
  }

  const idNum = parseInt(id, 10);
  if (!Number.isInteger(idNum)) {
    // res.status(404).end();
    res.status(200).json({ status: 'OK', user: null });
    return;
  }

  const session = (await getSession({ req })) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin') || session.user.id !== idNum) {
    res.status(401).json({ status: 'Unauthorized' });
    return;
  }

  try {
    delete data.id;
    const r = await prisma.user.update({ where: { id: idNum }, data });
    res.status(200).json({ status: 'OK', r });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    prisma.$disconnect();
  }
});
