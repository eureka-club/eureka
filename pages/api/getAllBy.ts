import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import { Languages } from '@/src/types';
import { findAll } from '@/src/facades/work';
import { CycleSumarySpec } from '@/src/types/cycle';
import { getSession } from 'next-auth/react';
// import redis from '../../src/lib/redis';

export const config = {
  api: {
    bodyParser: false,
  },
};
export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  try {
    const {language:l} = req.query;
    const lstr = l?.toString();
    const language = Languages[lstr!];
    const data: { id:number;type: string }[] = [];
    // const origin = process.env.NEXT_PUBLIC_WEBAPP_URL;
    const session = await getSession({req});
    // const result: { [index: string]: (Work | (Cycle & { type: string }))[] } = {};
    const { cursor, topic, extraCyclesRequired = 0, extraWorksRequired = 0 } = req.query;
    const c = parseInt(cursor as string, 10);
    
    let { totalWorks = -1, totalCycles = -1 } = req.query;
    totalWorks = parseInt(totalWorks as string, 10);
    totalCycles = parseInt(totalCycles as string, 10);

    const countItemsPerPage = 3;
    const toShow = ['work', 'cycle'];
    
    const where = {
      ...(topic !== 'uncategorized' && {
        topics: {
          contains: topic as string,
        },
      }),
      ...(topic === 'uncategorized' && {
        OR: [
          {
            topics: {
              equals: null,
            },
          },
          {
            topics: {
              equals: '',
            },
          },
        ],
      }),
    };

    if (totalWorks === -1) totalWorks = await prisma.work.count({ where });
    if (totalCycles === -1) totalCycles = await prisma.cycle.count({ where });

    const getOptCycle = (takePlus = 0, skipPlus = 0) => {
      const w = {
        ...where,
        languages:{contains:language}
      };
      return {
        skip: c * countItemsPerPage + skipPlus,
        take: takePlus || countItemsPerPage,
        select:CycleSumarySpec.select,
        where:w
      }
    };

    const getOptWork = (takePlus = 0, skipPlus = 0) => {
      const w = {
        ...where,
        OR:[
          {
            language
          },
          {
            editions:{
              some:{language}
            }
          }
        ]
      };
      return {
        skip: c * countItemsPerPage + skipPlus,
        take: takePlus || countItemsPerPage,
        include:{
          localImages: {select:{storedFile:true}},
          editions:{include:{localImages: { select: { storedFile: true } }}},
        },
        where:w
      }
    };

    const ewr = parseInt(extraWorksRequired as string, 10);
    let works = await findAll(language,session,{
      ...getOptWork(0, ewr),
      orderBy: {
        id: 'desc',
      },
    });

    let cyclesPlus = 0;
    if (works.length !== countItemsPerPage) cyclesPlus = countItemsPerPage - works.length;
    const ecr = parseInt(extraCyclesRequired as string, 10);
    const cycles = await prisma.cycle.findMany({
      ...getOptCycle(countItemsPerPage + cyclesPlus, ecr),
      orderBy: {
        id: 'desc',
      },
    });

    let worksPlus = 0;
    if (cycles.length !== countItemsPerPage && works.length === countItemsPerPage) {
      worksPlus = countItemsPerPage - cycles.length;
      const extraWorks = await findAll(language,session,{
        ...getOptWork(worksPlus, ewr + countItemsPerPage),
        orderBy: {
          id: 'desc',
        },
      });
      works.push(...extraWorks);
    }

    data.push(...cycles.map((c1) => ({ ...c1, type: 'cycle' })));
    data.push(...works);

    const result = {
      status: 'OK',
      data,
      extraCyclesRequired: cyclesPlus,
      extraWorksRequired: worksPlus,
      hasMore: c + 1 < (totalWorks + totalCycles) / (countItemsPerPage * toShow.length),
      totalWorks,
      totalCycles,
      prevCursor: c,
      nextCursor: c + 1,
    };
    res.status(200).json(result);
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    ////prisma.$disconnect();
  }
});
