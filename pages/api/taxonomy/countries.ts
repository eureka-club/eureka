import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import * as removeAccents from 'remove-accents';

import getApiHandler from '../../../src/lib/getApiHandler';
import prisma from '../../../src/lib/prisma';

import i18nConfig from '../../../i18n';

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
    // eslint-disable-next-line no-underscore-dangle
    const namespace = await i18nConfig.loadLocaleFrom(req.cookies.NEXT_LOCALE, 'countries');
    const { q } = req.query;
    const qFormated = removeAccents.remove(q as string).toLowerCase();
    const regExp = new RegExp(`${qFormated}`);
    const codes = Object.entries(namespace)
      .filter(([, value]) => (value as string).toLowerCase().match(regExp))
      .map((i) => i[0]);

    const result = await prisma.term.findMany({
      ...(!isEmpty(q) && {
        where: {
          parentId: {
            not: null,
          },
          OR: [
            { code: { in: codes } },
            {
              parent: {
                code: { in: codes },
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
