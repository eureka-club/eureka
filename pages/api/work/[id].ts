import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove } from '../../../src/facades/work';
import prisma from '../../../src/lib/prisma';

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const session = (await getSession({ req })) as Session;
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
        const work = await find(idNum);
        if (work == null) {
          res.status(404).end();
          return;
        }

        await remove(idNum);

        res.status(200).json({ status: 'OK' });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    },
  )
  .get<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const session = (await getSession({ req })) as Session;
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
        const work = await find(idNum);
        if (work == null) {
          res.status(404).end();
          return;
        }

        res.status(200).json({ status: 'OK', work });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    },
  )
  .patch<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const session = (await getSession({ req })) as Session;
      if (session == null || !session.user.roles.includes('admin')) {
        res.status(401).json({ status: 'Unauthorized' });
        return;
      }

      const data = req.body;
      data.publicationYear = dayjs(`${data.publicationYear}`, 'YYYY').utc().format();
      const { id } = data;
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
        delete data.id;
        const r = await prisma.work.update({ where: { id: idNum }, data });
        res.status(200).json({ status: 'OK', r });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    },
  );
