import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import getT from 'next-translate/getT';
import * as removeAccents from 'remove-accents';

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
    const t = await getT('en', 'countries');
    const { q } = req.query;
    const qWithoutAccents = removeAccents.remove(q as string);
    const toEn = t(q as string); //TODO in fr user type "Allemagne" and the db store "germany" 😕
    const qCmp = !toEn.match(/:/g) ? toEn : qWithoutAccents;
    const result = await prisma.term.findMany({
      ...(!isEmpty(q) && {
        where: {
          parentId: {
            not: null,
          },
          OR: [
            { label: { contains: qCmp as string } },
            { code: { contains: qCmp as string } },
            { description: { contains: qCmp as string } },
            {
              parent: {
                code: { contains: qCmp as string },
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
