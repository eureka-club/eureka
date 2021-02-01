import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import qs from 'qs';

import { FileUpload, Session } from '../../../types';
import getApiHandler from '../../../lib/getApiHandler';
import { storeUpload } from '../../../facades/fileUpload';
import { createWork } from '../../../facades/work';
import { findAll } from '../../../repositories/Work';
import prisma from '../../../lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const { all, q } = req.query;
      let criteria;

      if (typeof q === 'string') {
        criteria = qs.parse(q);
      }

      try {
        const results = await findAll(criteria, all != null);
        res.json(results);
      } catch (err) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      }
    },
  )
  .post<NextApiRequest, NextApiResponse>(
    async (req, res): Promise<void> => {
      const session = (await getSession({ req })) as Session;
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
          const work = await createWork(fields, uploadData);

          res.status(201).json(work);
        } catch (exc) {
          console.error(exc); // eslint-disable-line no-console
          res.status(500).json({ status: 'server error' });
        } finally {
          prisma.$disconnect();
        }
      });
    },
  );
