import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/post';
import { create } from '@/src/facades/notification';
import prisma from '@/src/lib/prisma';

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
        const post = await createFromServerFields(fields, uploadData, session.user);debugger;
        const notification = await create(
          fields.notificationMessage[0],
          fields.notificationContextURL[0],
          session.user.id,
          fields.notificationToUsers[0].split(',').map((i:string) => +i),
        );
        res.status(201).json({ post, notification });
      });
    } catch (excp) {
      /* const excpMessageTokens = excp.message.match(/\[(\d{3})\] (.*)/);
      if (excpMessageTokens != null) {
        res.status(excpMessageTokens[1]).json({ status: 'client error', error: excpMessageTokens[2] });
        return;
      }
 */
      console.error(excp); // eslint-disable-line no-console
      res.statusMessage = 'server error';
      res.status(500).end();
    } finally {
      prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const include =  {
      creator: true,
      localImages: true,
      works: true,
      cycles: true,
      favs: true,
      likes: true,
      comments: {
        include: {
          creator: { select: { id: true, name: true, image: true } },
          comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
        },
      },
    };

    try {
      const { q = null, where = null, id = null } = req.query;
      let data = null;
      if (typeof q === 'string') {
        data = await prisma.post.findMany({
          where: {
            OR: [{ title: { contains: q } }, { contentText: { contains: q } }, { creator: { name:{contains: q} } }],
          },
          include,
        });
      } else if (where) {
        data = await prisma.post.findMany({
          ...(typeof where === 'string' && { where: JSON.parse(where) }),
          include,
        });
      } else if (id) {
        data = await prisma.post.findMany({
          where: { id: parseInt(id as string, 10) },
          include,
        });
      } else {
        data = await prisma.post.findMany({
          include,
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
