import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
// import redis from '@/src/lib/redis';
import { findAllByWork, deleteAllByWork,createFromServerFields } from '@/src/facades/edition';
import dayjs from 'dayjs';
import { storeUpload } from '@/src/facades/fileUpload';

const validateReq = async (
  session: Session,
  id: string|undefined,
  res: NextApiResponse,
): Promise<boolean> => {
  if (session == null) {
    res.status(401).json({ status: 'Unauthorized' });
    return false;
  }

  if (!id || !Number.isInteger(parseInt(id))) {
    res.status(404).end();
    return false;
  }
  return true;
};

export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id } = req.query;

    if (!(await validateReq(session, id?.toString(), res))) {
      return;
    }

    try {
      const editions = await findAllByWork(Number(id));
      if (editions == null) {
        res.status(404).end();
        return;
      }

      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id } = req.query;

    if (!(await validateReq(session, id?.toString(), res))) {
      return;
    }

    try {
      await deleteAllByWork(Number(id));
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
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
      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();
      const { id } = fields;

      const workId = parseInt(id, 10);
      if (!Number.isInteger(workId)) {
        res.status(200).json({ status: 'OK', work: null });
        return;
      }
      try {
        const work = await prisma?.work.findFirst({where:{id:workId}});
        if(work?.language==fields?.language)
          res.status(200).json({ error:`book and it is edition have the same language: ${work?.language}` });

        if(work){
          const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
          const uploadData = await storeUpload(coverImage);
          delete fields.id;
          const fieldsA = { ...fields, workId };
          const edition = await createFromServerFields(fieldsA, uploadData);
          // await redis.flushall();
          res.status(200).json({ edition });
        }
        res.status(200).json({ error:"book not foud" });

      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  });
  ;
