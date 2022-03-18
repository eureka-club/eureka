import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { FileUpload, Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { storeUpload } from '../../../src/facades/fileUpload';
import { createFromServerFields, findAll } from '../../../src/facades/work';
import prisma from '../../../src/lib/prisma';
// import redis from '../../../src/lib/redis';
// import { WorkWithImages } from '../../../src/types/work';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
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
      if (files?.cover == null) {
        res.status(422).json({ error: 'No cover image received' });
        return;
      }

      const coverImage: FileUpload = files.cover[0];
      try {
        const uploadData = await storeUpload(coverImage);
        const fieldsA = { ...fields, creatorId: [session.user.id] };
        const work = await createFromServerFields(fieldsA, uploadData);
        // await redis.flushall();
        res.status(201).json(work);
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { q = null, where = null, id = null,take:t=undefined } = req.query;
      const take = t ? parseInt(t?.toString()) : undefined;
      let data = null;
      if (typeof q === 'string') {
        data = await findAll({
          take,
          where: {
            OR: [{ title: { contains: q } },{topics:{contains:q}},{tags:{contains:q}}, { contentText: { contains: q } }, { author: { contains: q } }],
          }
        });
      } else if (where) {
        data = await findAll({
          take,
          ...(typeof where === 'string' && { where: JSON.parse(where) }),
        });
      } else if (id) {
        data = await findAll({
          take,
          where: { id: parseInt(id as string, 10) }
        });
      } else {
        data = await findAll({});
      }

      res.status(200).json({ status: 'OK', data });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
