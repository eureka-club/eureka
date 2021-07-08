import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/client';
// import { Session } from '../../src/types';
import { Work, Cycle } from '@prisma/client';
import getApiHandler from '../../src/lib/getApiHandler';
import prisma from '../../src/lib/prisma';
// import { WorkWithImages } from '../../../src/types/work';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler().get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const data: (Work | (Cycle & { type: string }))[] = [];
    // const result: { [index: string]: (Work | (Cycle & { type: string }))[] } = {};
    const { cursor, topic, extraCyclesRequired = 0, extraWorksRequired = 0 } = req.query;

    const c = parseInt(cursor as string, 10);
    const countItemsPerPage = 2;
    const toShow = ['work', 'cycle'];
    // const topicsRes = await prisma.term.findMany({
    //   where: { taxonomy: { code: 'topic' } },
    //   select: { code: true },
    // });
    // const topics = topicsRes.map((t) => t.code);
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

    const getOpt = (takePlus = 0, skipPlus = 0) => ({
      skip: c * countItemsPerPage + skipPlus,
      take: takePlus || countItemsPerPage,

      include: { localImages: true, likes: true, favs: true },
      where,
    });

    // const getOptCount = () => ({
    //   skip: c * countItemsPerPage,
    //   take: countItemsPerPage,
    //   where,
    // });

    // const promisesWorks: PrismaPromise<Work[]>[] = [];
    // const promisesCycles: PrismaPromise<Cycle[]>[] = [];

    // topics.forEach(async (topic) => {

    const totalWorks = await prisma.work.count({ where });
    const totalCycles = await prisma.cycle.count({ where });

    const ewr = parseInt(extraWorksRequired as string, 10);
    const works = await prisma.work.findMany(getOpt(0, ewr));

    let cyclesPlus = 0;
    if (works.length !== countItemsPerPage) cyclesPlus = countItemsPerPage - works.length;
    // promisesWorks.push(works);
    const ecr = parseInt(extraCyclesRequired as string, 10);
    const cycles = await prisma.cycle.findMany(getOpt(countItemsPerPage + cyclesPlus, ecr));

    let worksPlus = 0;
    if (cycles.length < 2 && works.length === 2) {
      worksPlus = countItemsPerPage - cycles.length;
      const extraWorks = await prisma.work.findMany(getOpt(worksPlus, ewr + 2));
      works.push(...extraWorks);
    }
    // promisesCycles.push(cycles);
    // result[topic] = [];
    // });
    // result.uncategorized = [];

    // const promisesWorksRes = await Promise.all(promisesWorks);
    // let works = promisesWorksRes.reduce((p, current) => {
    //   return [...p, ...current];
    // }, []);
    data.push(...works);

    // const promisesCyclesRes = await Promise.all(promisesCycles);
    // let cycles = promisesCyclesRes.reduce((p, current) => {
    //   return [...p, ...current];
    // }, []);

    data.push(...cycles.map((c1) => ({ ...c1, type: 'cycle' })));

    // const o = getOpt('', true);
    // works = await prisma.work.findMany(o);
    // data.push(...works);

    // cycles = await prisma.cycle.findMany(o);
    // data.push(...cycles.map((c1) => ({ ...c1, type: 'cycle' })));

    // const already = new Set();
    // data.forEach((item) => {
    //   (item.topics || 'uncategorized').split(',').forEach((topic) => {
    //     const key = `${topic}${item.type}${item.id}`;
    //     if (!already.has(key)) {
    //       result[topic].push(item);
    //       already.add(key);
    //     }
    //   });
    // });

    res.status(200).json({
      status: 'OK',
      data,
      extraCyclesRequired: cyclesPlus,
      extraWorksRequired: worksPlus,
      hasMore: c + 1 < (totalWorks + totalCycles) / (countItemsPerPage * toShow.length),
      prevCursor: c,
      nextCursor: c + 1,
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    prisma.$disconnect();
  }
});
