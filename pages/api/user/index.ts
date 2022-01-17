// import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { findAll, find } from '../../../src/facades/user';
import prisma from '../../../src/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler().get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { id } = req.query;
    if (!id) {
      const data = await findAll();
      res.status(200).json({ data });
    } else {
      const user = await find({ id: parseInt(id as string, 10),include:true });//UserMosaicItem
      res.status(200).json({ user });
    }
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    prisma.$disconnect();
  }
});
