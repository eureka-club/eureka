import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { updateToVieweds } from '@/src/facades/notification';

export default getApiHandler().patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  const session = (await getSession({ req })) as unknown as Session;
  const { user } = req.query;

  try {
    if (!user) {
      res.status(404).end();
      return;
    }
    let result = await updateToVieweds(parseInt(user.toString()));
    res.status(200).json({ status: 'OK', result });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
