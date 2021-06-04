import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { FileUpload, Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { storeUpload } from '../../../src/facades/fileUpload';
import { createFromServerFields } from '../../../src/facades/work';
import prisma from '../../../src/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler().post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
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

      res.status(201).json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
});
