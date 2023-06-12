import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form } from 'multiparty';
import { Session, FileUpload } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove, UpdateFromServerFields } from '@/src/facades/edition';
import { storeUpload } from '@/src/facades/fileUpload';
import { use } from 'chai';
// import redis from '../../../src/lib/redis';
export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
const userCan = async (req:NextApiRequest)=>{
  const { id } = req.query;
  const session = (await getSession({ req })) as unknown as Session;
  if (session == null || (!session.user.roles.includes('admin') && session.user.id.toString() !=id)) {
    return { error: 'Unauthorized' };
  }
  return null;
}
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    let error = await userCan(req);
    if(error)
      return res.status(200).json(error);

    const { id:id_ } = req.query;
    const id = id_ ? parseInt(id_?.toString(), 10) : NaN;
    if (!Number.isInteger(id)) {
      return res.status(200).json({error:'invalid id'});
    }

    try {
      const edition = await find(id);
      if (edition == null) {
        return res.status(200).json({error:"not found"});
      }

      await remove(id);
      // await redis.flushall();
      res.status(200).json({ edition });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return res.status(500).json({ status: 'server error' });
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
    let error = await userCan(req);
    if(error)return res.status(200).json(error);
    
    let data = req.query;
    const  id = parseInt(data.id as string, 10);

  try {
    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        return res.status(200).json({ error: 'Server error' });
      }

      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
      const { id:id_ } = fields;
      const id = id_ ? parseInt(id_.toString(), 10) : NaN;

      if (isNaN(id)) {
        return res.status(200).json({ error: 'invalid id' });
      }
      const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
      try {
        const uploadData = await storeUpload(coverImage);
        delete fields.id;
        const fieldsA = { ...fields };
        const edition = await UpdateFromServerFields(fieldsA, uploadData,id);
        // await redis.flushall();
        res.status(200).json({ edition });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ error: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    ////prisma.$disconnect();
  }
  });
