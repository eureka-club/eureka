import { PrismaClient, Prisma } from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
// const forceDelete = true;
const prisma = new PrismaClient();

const cleanTables = async () => {
  const transactions = [
    // prisma.$queryRaw('use eureka_db;'),
    prisma.$queryRaw(Prisma.sql`delete terms where id > 0`),
    prisma.$queryRaw(Prisma.sql`DBCC CHECKIDENT (terms, RESEED, 0)`),
    prisma.$queryRaw(Prisma.sql`delete taxonomies where id > 0`),
    prisma.$queryRaw(Prisma.sql`DBCC CHECKIDENT (taxonomies, RESEED, 0)`),
  ];
  try {
    await prisma.$transaction(transactions);
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
};

const topicsData = (topics: { [index: string]: string }, taxonomyCode: string, creatorId: number) => {
  return Object.keys(topics).map((d) => {
    return {
      creatorId,
      label: topics[d],
      code: d,
      description: d,
      createdAt: dayjs().utc().format(),
      updatedAt: dayjs().utc().format(),
      taxonomyCode,
    };
  });
};

const populateTopics = async (admin: { id: number }) => {
  const {
    data: { topics },
  } = await axios.get('http://127.0.0.1:3000/api/topics');

  let topicTax = await prisma.taxonomy.findFirst({ where: { code: 'topic' } });

  if (!topicTax) {
    topicTax = await prisma.taxonomy.create({
      data: {
        creatorId: admin.id,
        label: 'Topic',
        code: 'topic',
        description: 'Topic',
        createdAt: dayjs().utc().format(),
        updatedAt: dayjs().utc().format(),
      },
    });
  }
  const topicsAll = await prisma.term.findMany({
    where: {
      taxonomy: { code: 'topic' },
    },
  });
  if (!topicsAll.length) {
    await prisma.term.createMany({ data: topicsData(topics, topicTax.code, admin.id) });
  }
};

type TermCreateManyInput = {
  taxonomyCode: string;
  parentId?: number | null;
  creatorId?: number | null;
  label: string;
  code: string;
  description: string;
  weight?: number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const countriesData = (
  countries: { [index: string]: { [index: string]: string } },
  r: string,
  taxonomyCode: string,
  creatorId: number,
  parentId?: number,
): TermCreateManyInput[] => {
  // const data = countries[r] as Record<string, unknown>;
  const res = Object.keys(countries[r]).map((c) => ({
    creatorId,
    label: countries[r][c],
    code: c,
    description: countries[r][c],
    createdAt: dayjs().utc().format(),
    updatedAt: dayjs().utc().format(),
    taxonomyCode,
    parentId: parentId || null,
  }));
  return res;
};

const regionsData = (
  countries: { [index: string]: string | { [key: string]: string } }[],
  taxonomyCode: string,
  creatorId: number,
) => {
  // const data = regions as Record<string, unknown>;
  return Object.keys(countries).map((d) => {
    return {
      creatorId,
      label: d,
      code: d,
      description: d,
      createdAt: dayjs().utc().format(),
      updatedAt: dayjs().utc().format(),
      taxonomyCode,
    };
  });
};

// const forceDeleteCountriesFn = async () => {
//   const removedTerms = prisma.taxonomy.update({
//     where: {
//       code: 'region',
//     },
//     data: {
//       terms: {
//         deleteMany: {},
//       },
//     },
//   });
//   const transactions = [
//     removedTerms,
//     prisma.taxonomy.delete({
//       where: {
//         code: 'region',
//       },
//     }),
//   ];

//   try {
//     await prisma.$transaction(transactions);
//   } catch (error) {
//     throw new Error(error);
//   } finally {
//     prisma.$disconnect();
//   }
// };

const populateRegions = async (admin: { id: number }) => {
  // if (forceDelete) await forceDeleteCountriesFn();
  // let regionTax = await prisma.taxonomy.findFirst({ where: { code: 'region' } });
  const {
    data: { en: countries },
  } = await axios.get('http://127.0.0.1:3000/api/countries');
  // if (!regionTax) {
  const regionTax = await prisma.taxonomy.create({
    data: {
      creatorId: admin.id,
      label: 'Region',
      code: 'region',
      description: 'Region',
      createdAt: dayjs().utc().format(),
      updatedAt: dayjs().utc().format(),
    },
  });
  // }

  // if (!regionsAll.length) {
  await prisma.term.createMany({ data: regionsData(countries, regionTax.code, admin.id) });
  // }
  // regionsAll = await prisma.term.findMany();
  const regionsAll = await prisma.term.findMany({
    where: {
      taxonomy: { code: 'region' },
    },
  });

  // const countriesAll = await prisma.term.findMany({
  //   where: { parentId: { not: null } },
  // });
  // console.log("countriesAll ",countriesAll);
  // if (!countriesAll.length) {
  const promises: unknown[] = [];
  regionsAll.forEach((r: { code: string; id: number }) => {
    if (regionTax) {
      const countr = countriesData(countries, r.code, regionTax.code, admin.id, r.id);
      // console.log('countr ', countr);
      promises.push(prisma.term.createMany({ data: countr }));
    }
  });
  await Promise.all(promises);
  // }
};

async function main() {
  const admin = await prisma.user.findFirst({ where: { roles: 'admin' } });
  if (admin) {
    cleanTables();
    await populateTopics(admin);
    await populateRegions(admin);
  } else console.error('Not user admin found');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
