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

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { where:w = null,take:t } = req.query;
    let where = w ? JSON.parse(w.toString()) : undefined;
    const data = await findAll({where}); 
    data.forEach(u=>{u.type='user'})
    res.status(200).json({
      data,
      fetched:data.length
    })   
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
