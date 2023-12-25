import { NextApiRequest, NextApiResponse } from 'next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import * as removeAccents from 'remove-accents';

// import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { NextRequest, NextResponse } from 'next/server';
import getLocale from '@/src/getLocale';

// import i18nConfig from '../../../i18n';
// import countries from '../../../locales/es/countries.json'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
dayjs.extend(utc);
export async function GET (req:NextRequest){
  // const session = (await getSession({ req })) as unknown as Session;
  // if (session == null || !session.user.roles.includes('admin')) {
  //   res.status(401).json({ status: 'Unauthorized' });
  //   return;
  // }

  try {
    // eslint-disable-next-line no-underscore-dangle
    // const namespace = await i18nConfig.loadLocaleFrom(req.cookies.NEXT_LOCALE || 'es', 'countries');
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q');
    const locale = getLocale(req);
    const codes: string[] = [];
    let getAll = false;
    if (q) {
      const dict = await getDictionary(locale as Locale);

      const fn = (qi: string) => {
        const qFormated = removeAccents.remove(qi as string).toLowerCase();
        const regExp = new RegExp(`${qFormated}`, 'i');
        codes.push(
          ...Object.entries(dict.countries)
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
      select:{
        label:true,
        code:true,
        parent:{select:{code:true}}
      },      
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
    return NextResponse.json({ result });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ status: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
};

export const dynamic = 'force-dynamic'
