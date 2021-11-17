import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Cycle } from '@prisma/client';
import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove } from '../../../src/facades/cycle';
import prisma from '../../../src/lib/prisma';
// import redis from '../../../src/lib/redis';

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    const { id } = req.query;
    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        res.status(404).end();
        return;
      }

      await remove(cycle);
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    // const session = (await getSession({ req })) as unknown as Session;
    // if (session == null || !session.user.roles.includes('admin')) {
    //   res.status(401).json({ status: 'Unauthorized' });
    //   return;
    // }
    const { id } = req.query;
    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        // res.status(404).end();
        res.status(200).json({ ok: true, cycle: null });
        return;
      }

      res.status(200).json({ ok: true, cycle });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ ok: false, error: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    let data = req.body;

    const { id, includedWorksIds } = data;

    try {
      let r: Cycle;
      if (includedWorksIds) {
        r = await prisma.cycle.update({
          where: { id },
          data: {
            updatedAt: dayjs().utc().format(),
            works: { connect: includedWorksIds.map((workId: number) => ({ id: workId })) },
          },
        });
      } else {
        data.startDate = dayjs(`${data.startDate}`, 'YYYY').utc().format();
        data.endDate = dayjs(`${data.endDate}`, 'YYYY').utc().format();
        delete data.id;
        data = {
          ...data,
        };
        r = await prisma.cycle.update({ where: { id }, data });
      }
      // await redis.flushall();
      res.status(200).json({ ...r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
