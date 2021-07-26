import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { FileUpload, Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { storeUpload } from '../../../src/facades/fileUpload';
import { createFromServerFields, findAll } from '../../../src/facades/post';
import prisma from '../../../src/lib/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    try {
      new Form().parse(req, async (err, fields, files) => {
        if (err != null) {
          console.error(err); // eslint-disable-line no-console
          res.status(500).json({ ok: false, error: 'Server error' });
          return;
        }
        if (files?.image == null) {
          res.status(422).json({ ok: false, error: 'No image received' });
          return;
        }

        const image: FileUpload = files.image[0];

        const uploadData = await storeUpload(image);
        const post = await createFromServerFields(fields, uploadData, session.user);

        res.status(201).json({ ok: true, post });
      });
    } catch (excp) {
      const excpMessageTokens = excp.message.match(/\[(\d{3})\] (.*)/);
      if (excpMessageTokens != null) {
        res.status(excpMessageTokens[1]).json({ status: 'client error', error: excpMessageTokens[2] });
        return;
      }

      console.error(excp); // eslint-disable-line no-console
      res.status(500).json({ ok: false, status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const data = await findAll();
      res.status(200).json({ status: 'OK', data });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
