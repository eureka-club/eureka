import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
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
    const language =  l? l?.toString():undefined;
    const data: { id:number;type: string }[] = [];
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
    interface PropsArgs {
      isWork?: boolean;
      isCycle?: boolean;
      isPost?: boolean;
    }
    const getOpt = (takePlus = 0, skipPlus = 0, args: PropsArgs = { isPost:false,isWork: false, isCycle: false }) => {
      const w = {
        ... (args.isCycle && language) && {languages:{contains:language}},
        ... args.isPost && language && {language},
        ... args.isWork && language && {language},
        ...where
      };
      return {
        skip: c * countItemsPerPage + skipPlus,
        take: takePlus || countItemsPerPage,
        include:{
          localImages: {select:{storedFile:true}},
          ... args.isCycle && {
            usersJoined:{select:{userId:true,pending:true}},
            participants:{select:{id:true}},
          },
        },
        where:w
      }
    };
   
    if (totalWorks === -1) totalWorks = await prisma.work.count({ where });
    if (totalCycles === -1) totalCycles = await prisma.cycle.count({ where });

    const ewr = parseInt(extraWorksRequired as string, 10);
    const works = await prisma.work.findMany({
      ...getOpt(0, ewr, { isWork: true }),
      orderBy: {
        id: 'desc',
      },
    });

    let cyclesPlus = 0;
    if (works.length !== countItemsPerPage) cyclesPlus = countItemsPerPage - works.length;
    const ecr = parseInt(extraCyclesRequired as string, 10);
    const cycles = await prisma.cycle.findMany({
      ...getOpt(countItemsPerPage + cyclesPlus, ecr, { isCycle: true }),
      orderBy: {
        id: 'desc',
      },
    });

    let worksPlus = 0;
    if (cycles.length !== countItemsPerPage && works.length === countItemsPerPage) {
      worksPlus = countItemsPerPage - cycles.length;
      const extraWorks = await prisma.work.findMany({
        ...getOpt(worksPlus, ewr + countItemsPerPage, { isWork: true }),
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
