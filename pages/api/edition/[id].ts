import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form } from 'multiparty';
import { Session, FileUpload } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove, UpdateFromServerFields } from '@/src/facades/edition';
import { storeUpload } from '@/src/facades/fileUpload';
// import redis from '../../../src/lib/redis';
export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
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
      const edition = await find(idNum);
      if (edition == null) {
        res.status(404).end();
        return;
      }

      await remove(idNum);
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;

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
      const edition = await find(idNum);
      if (edition == null) {
        return res.status(200).json(null);
      }
      
      res.status(200).json(edition);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    
    
    let data = req.query;
    const  id = parseInt(data.id as string, 10);

  try {
    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }

      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
      const { workId } = fields;

      const idNum = parseInt(workId, 10);
      if (!Number.isInteger(idNum)) {
        res.status(200).json({ status: 'OK', work: null });
        return;
      }
      const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
      try {
        const uploadData = await storeUpload(coverImage);
        delete fields.id;
        const fieldsA = { ...fields };
        const edition = await UpdateFromServerFields(fieldsA, uploadData,workId);
        // await redis.flushall();
        res.status(200).json({ edition });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    ////prisma.$disconnect();
  }
  });
