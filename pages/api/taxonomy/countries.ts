import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';

// import { Prisma, Taxonomy, Term } from '@prisma/client';
import getApiHandler from '../../../src/lib/getApiHandler';
import prisma from '../../../src/lib/prisma';

import { Session } from '../../../src/types';

export const config = {
  api: {
    bodyParser: false,
  },
};
dayjs.extend(utc);
export default getApiHandler().get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  const session = (await getSession({ req })) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin')) {
    res.status(401).json({ status: 'Unauthorized' });
    return;
  }

  try {
    const { q } = req.query;
    const result = await prisma.term.findMany({
      ...(!isEmpty(q) && {
        where: {
          parentId: {
            not: null,
          },
          OR: [
            { label: { contains: q as string } },
            { code: { contains: q as string } },
            { description: { contains: q as string } },
            {
              parent: {
                code: { contains: q as string },
              },
            },
          ],
        },
      }),
    });
    res.status(200).json({ result });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    prisma.$disconnect();
  }
});
