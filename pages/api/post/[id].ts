import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Form } from 'multiparty';
import { FileUpload } from '../../../src/types';
import { Work, Cycle } from '@prisma/client';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove, updateFromServerFields } from '../../../src/facades/post';
import { storeUpload } from '@/src/facades/fileUpload';
import { prisma } from '../../../src/lib/prisma';
import { storeDeleteFile } from '@/src/facades/fileUpload';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = await getSession({ req });

    let { id } = req.query;
    if (typeof id !== 'string') {
      id = req.body;
      if (!id) return res.status(404).end();
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
      if (session == null || (!session.user.roles.includes('admin') && post.creatorId != session.user.id)) {
        res.status(401).json({ status: 'Unauthorized' });
        return;
      }

      if (post.localImages && post.localImages.length) {
        await storeDeleteFile(post.localImages[0].storedFile);
      }
      await remove(post);

      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = await getSession({ req });
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
      let currentUserIsFav = false;
      if (session) currentUserIsFav = post.favs.findIndex((f) => f.id == session.user.id) > -1;
      post.currentUserIsFav = currentUserIsFav;
      post.type = 'post';
      res.status(200).json({ status: 'OK', post });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = await getSession({ req });
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }

      //fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
      const { id } = fields;

      const idNum = parseInt(id, 10);
      if (!Number.isInteger(idNum)) {
        res.status(200).json({ status: 'OK', post: null });
        return;
      }

      const coverImage: File = files?.image != null ? files.image[0] : null;
      try {
        
        const post = await find(idNum);
        if (!post) res.status(412).json({ status: 'notFound' });
        if (post?.creatorId !== session.user.id) res.status(401).json({ status: 'Unauthorized' });

        delete fields.id;
        let fieldsA = { ...fields };

        const uploadData = coverImage ? await storeUpload(coverImage) : null;
        
        const r = await updateFromServerFields(fieldsA, uploadData, idNum);
        res.status(200).json({ ...r });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });

    //let data = JSON.parse(req.body);
    // data.publicationYear = dayjs(`${data.publicationYear}`, 'YYYY').utc().format();
    //const { id:id_ } = req.query;
    /* if (typeof id !== 'string') {
      res.status(404).end();
      return;
    } */
    //ACACACA
    /*const id = id_ ? parseInt(id_.toString(), 10): undefined;
    if (!id) {
      res.status(404).end();
      return;
    }

    try {
      const post = await find(id);
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

      const r = await prisma.post.update({ where: { id }, data });
      res.status(200).json({ ...r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }*/
  });
