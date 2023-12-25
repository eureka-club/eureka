import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { isEmpty } from 'lodash';
import * as removeAccents from 'remove-accents';
import {prisma} from '@/src/lib/prisma';
import { getDictionary } from '@/src/get-dictionary';
import getLocale from '@/src/getLocale';
import { NextRequest, NextResponse } from 'next/server';
import { Locale } from '@/i18n-config';

dayjs.extend(utc);
export async function GET(req:NextRequest){
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q');

    const codes: string[] = [];
    let getAll = false;
    const locale = getLocale(req);
    if (q) {
      const dict = await getDictionary(locale);
      const fn = (qi: string) => {
        const qFormated = removeAccents.remove(qi as string).toLowerCase();
        const regExp = new RegExp(`${qFormated}`, 'i');
        codes.push(
          ...Object.entries(dict.topics)
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
    }

    const result = await prisma.term.findMany({
      where: {
        taxonomy: {
          code: 'topic',
        },
        ...(!isEmpty(q) && {
          ...(!getAll && {
            OR: [
              { ...(codes && codes.length && { code: { in: codes } }) },
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

export const dynamic = 'force-dynamic';
