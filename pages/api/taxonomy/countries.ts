import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import * as removeAccents from 'remove-accents';

import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';

// import i18nConfig from '../../../i18n';
import countries from '../../../locales/es/countries.json'
import { CountrySpec } from '@/src/types';

export const config = {
  api: {
    bodyParser: false,
  },
};
dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  // const session = (await getSession({ req })) as unknown as Session;
  // if (session == null || !session.user.roles.includes('admin')) {
  //   res.status(401).json({ status: 'Unauthorized' });
  //   return;
  // }

  try {
    // eslint-disable-next-line no-underscore-dangle
    // const namespace = await i18nConfig.loadLocaleFrom(req.cookies.NEXT_LOCALE || 'es', 'countries');
    const { q } = req.query;
    const codes: string[] = [];
    let getAll = false;
    if (q) {
      const fn = (qi: string) => {
        const qFormated = removeAccents.remove(qi as string).toLowerCase();
        const regExp = new RegExp(`${qFormated}`, 'i');
        codes.push(
          ...Object.entries(countries)
            .filter(([code, value]) => {
              return (value as string).toLowerCase().match(regExp) || (code as string).toLowerCase().match(regExp);
            })
            .map((i) => i[0]),
        );
      };
      const queries = (q as string).split(',');
      getAll = !!queries.filter((i) => i === 'all').length;
      if (!getAll)
        queries.forEach((qi: string) => {
          fn(qi);
        });
      // const qFormated = removeAccents.remove(q as string).toLowerCase();
      // const regExp = new RegExp(`${qFormated}`, 'i');
      // codes = Object.entries(namespace)
      //   .filter(([code, value]) => {
      //     return (value as string).toLowerCase().match(regExp) || (code as string).toLowerCase().match(regExp);
      //   })
      //   .map((i) => i[0]);
    }

    const result = await prisma.term.findMany({
      select:CountrySpec.select,      
      where: {
        taxonomy: {
          code: 'region',
        },
        parentId: {
          not: null,
        },
        ...(!isEmpty(q) && {
          ...(!getAll && {
            OR: [
              { ...(codes && codes.length && { code: { in: codes } }) },
              {
                parent: {
                  ...(codes && codes.length && { code: { in: codes } }),
                },
              },
            ],
          }),
        }),
      },
      orderBy: [
        {
          code: 'asc',
        },
      ],
    });
    res.status(200).json({ result });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
