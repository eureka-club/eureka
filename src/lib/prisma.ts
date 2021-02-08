import { Prisma, PrismaClient } from '@prisma/client';

const { NODE_ENV } = process.env;
const log: Prisma.LogLevel[] = [];

if (NODE_ENV === 'development') {
  log.push('query');
}

const prisma = new PrismaClient({ log });

export default prisma;
