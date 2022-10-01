import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/work';
import { Prisma } from '@prisma/client';
import {prisma} from '@/src/lib/prisma'
// import redis from '@/src/lib/redis';

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
    try {debugger;
      const { q = null,props:p=undefined } = req.query;
      const props:Prisma.WorkFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
      let {where:w,take,cursor,skip} = props;

      let where = w;
      let data = null;
      if (typeof q === 'string') {
        const terms = q.split(" ");
        where = {
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
                   topics: { contains: t } 
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
        
      } 

      let cr = await prisma?.work.aggregate({where,_count:true})
      const total = cr?._count;
      data = await findAll({take,where,skip,cursor});

      res.status(200).json({
        data,
        fetched:data.length,
        total
      });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
