import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session, StoredFileUpload } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { storeUpload } from '../../../src/facades/fileUpload';
import { createFromServerFields, findAll } from '../../../src/facades/cycle';
import {find as findUser} from '@/src/facades/user'
import prisma from '../../../src/lib/prisma';
// import redis from '../../../src/lib/redis';
import { asyncForEach } from '../../../src/lib/utils';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }
      if (files?.coverImage == null) {
        res.status(422).json({ error: 'No cover image received' });
        return;
      }

      try {
        const { coverImage, ...complementaryMaterialsFiles } = files;
        const coverImageUploadData = await storeUpload(coverImage[0]);
        const complementaryMaterialsUploadData: Record<string, StoredFileUpload> = {};
        await asyncForEach(
          Object.entries(complementaryMaterialsFiles),
          async ([cmIndexName, cmFile]: [string, FileUpload[]]) => {
            complementaryMaterialsUploadData[cmIndexName] = await storeUpload(cmFile[0]);
          },
        );
        const cycleWorksDates = JSON.parse(fields.cycleWorksDates).map(
          (cw: { workId: string; startDate: string | number | Date; endDate: string | number | Date }) => ({
            workId: parseInt(cw.workId, 10),
            startDate: new Date(cw.startDate),
            endDate: new Date(cw.endDate),
          }),
        );
          const user = await findUser({id:session.user.id})
          if(user){
            const cycle = await createFromServerFields(
              user,
              fields,
              coverImageUploadData,
              complementaryMaterialsUploadData,
              JSON.parse(fields.guidelines),
              cycleWorksDates,
            );
            // await redis.flushall();
            return res.status(201).json(cycle);

          }
          res.statusMessage = 'user not found';
          res.status(400).end();
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ error: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    });
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { q = null, where:w = null,take:t } = req.query;
      let where = w ? JSON.parse(w.toString()) : undefined;
      const take = t ? parseInt(t.toString()) : undefined;

      let data = null;
      if (typeof q === 'string') {
        where = {
          OR: [{ title: { contains: q } }, { contentText: { contains: q } }, { tags: { contains: q } }],
        };
        data = await findAll({take,where});
      } else if (where) {
        data = await findAll({take,where});
      } else {
        data = await findAll({take});
      }

      res.status(200).json({ status: 'OK', data });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
