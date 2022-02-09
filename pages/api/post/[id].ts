import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Work, Cycle } from '@prisma/client';
import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove } from '../../../src/facades/post';
import prisma from '../../../src/lib/prisma';

export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }debugger;

    let { id } = req.query;
    if (typeof id !== 'string') {
      id = req.body;
      if(!id)
        return res.status(404).end();
    }

    const idNum = parseInt(id.toString(), 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      const post = await find(idNum);
      if (post == null) {
        res.status(404).end();
        return;
      }

      await remove(post);

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
      const post = await find(idNum);
      if (post == null) {
        // res.status(404).end();
        res.status(200).json({ status: 'OK', post: null });
        return;
      }

      res.status(200).json({ status: 'OK', post });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;debugger;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    let data = JSON.parse(req.body);
    // data.publicationYear = dayjs(`${data.publicationYear}`, 'YYYY').utc().format();
    const { id } = data;
    /* if (typeof id !== 'string') {
      res.status(404).end();
      return;
    } */

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      const post = await find(+data.id);
      if (!post) res.status(412).json({ status: 'notFound' });
      if (post?.creatorId !== session.user.id) res.status(401).json({ status: 'Unauthorized' });
      delete data.id;
      let existingCycle: Cycle | null = null;
      if (data.selectedCycleId != null) {
        existingCycle = await prisma.cycle.findUnique({ where: { id: data.selectedCycleId } });
        if (existingCycle == null) {
          throw new Error('[412] Invalid Cycle ID provided');
        }
      }

      let existingWork: Work | null = null;
      if (data.selectedWorkId != null) {
        existingWork = await prisma.work.findUnique({ where: { id: data.selectedWorkId } });
        if (existingWork == null) {
          throw new Error('[412] Invalid Work ID provided');
        }
      }
      const cycles = existingCycle ? [{ id: existingCycle.id }] : [];
      const works = existingWork ? [{ id: existingWork.id }] : [];
      data = {
        ...data,
        cycles: { set: cycles },
        works: { set: works },
        // ...(existingCycle != null && { cycles: { set: [{ id: existingCycle.id }] } }),
        // ...(existingWork != null && { works: { set: [{ id: existingWork.id }] } }),
      };
      delete data.selectedWorkId;
      delete data.selectedCycleId;

      const r = await prisma.post.update({ where: { id: idNum }, data });
      res.status(200).json({ ...r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
