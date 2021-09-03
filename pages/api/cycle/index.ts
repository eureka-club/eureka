import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { FileUpload, Session, StoredFileUpload } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { storeUpload } from '../../../src/facades/fileUpload';
import { createFromServerFields /* , findAll */ } from '../../../src/facades/cycle';
import prisma from '../../../src/lib/prisma';
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

        const cycle = await createFromServerFields(
          session.user,
          fields,
          coverImageUploadData,
          complementaryMaterialsUploadData,
        );

        res.status(201).json(cycle);
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        prisma.$disconnect();
      }
    });
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { q = null, where = null } = req.query;
      let data = null;
      if (typeof q === 'string') {
        data = await prisma.cycle.findMany({
          where: {
            OR: [{ title: { contains: q } }, { contentText: { contains: q } }, { tags: { contains: q } }],
          },

          include: { participants: true, localImages: true, ratings: true, favs: true },
        });
      } else if (where) {
        data = await prisma.cycle.findMany({
          ...(typeof where === 'string' && { where: JSON.parse(where) }),
          include: { participants: true, localImages: true, ratings: true, favs: true, comments: true },
        });
      } else {
        data = await prisma.cycle.findMany({
          include: { participants: true, localImages: true, ratings: true, favs: true, comments: true },
        });
      }

      res.status(200).json({ status: 'OK', data });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
