import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { storeUpload } from '../../../src/facades/fileUpload';
import { createFromServerFields, findAll } from '../../../src/facades/work';
// import redis from '../../../src/lib/redis';

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
      const { q = null, where:w = null, id = null,take:t=undefined,skip:s=undefined,cursor:c=undefined } = req.query;
      
      const where = w ? JSON.parse(decodeURIComponent(w.toString())) : undefined;
      const take = t ? parseInt(t?.toString()) : undefined;
      const skip = s ? parseInt(s.toString()) : undefined;
      const cursor = c ? JSON.parse(decodeURIComponent(c.toString())) : undefined;

      debugger;
      let data = null;
      if (typeof q === 'string') {
        const terms = q.split(" ");
        const worksWhere={
          OR:[
            {
              AND:terms.map(t=>(
                { 
                  title: { contains: t } 
                }
              ))
  
            },
            {
              AND:terms.map(t=>(
                { 
                  contentText: { contains: t } 
                }
              ))
  
            },
            {
              AND:terms.map(t=>(
                { 
                   author: { contains: t } 
                }
              ))
            }
          ]
        };
        data = await findAll({
          take,
          skip,
          cursor,
          where: worksWhere
        });
      } else if (where) {
        data = await findAll({
          take,
          skip,
          cursor,
          where,
        });
      } else if (id) {
        data = await findAll({
          take,
          skip,
          cursor,
          where: { id: parseInt(id as string, 10) }
        });
      } else {
        data = await findAll({
          take,
          skip,
          cursor,
        });
      }
      res.status(200).json({
        data,
        fetched:data.length
      });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
