import { NextApiRequest, NextApiResponse } from 'next';
import { Languages } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { findAll } from '@/src/facades/edition';
import { Prisma } from '@prisma/client';
import {prisma} from '@/src/lib/prisma'
// import redis from '@/src/lib/redis';

export const config = {
  api: { 
    bodyParser: false,
  },
};

export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { q = null,props:p=undefined,lang:l } = req.query;
      const language = Languages[l?.toString()!];
      const props:Prisma.WorkFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
      let {where:w,take,cursor,skip} = props;

      let AND = w?.AND;
      delete w?.AND;
      let where = {...w,AND:{
        ...AND && {AND},
        language
      }};
      let data = null;

      let cr = await prisma?.edition.aggregate({where,_count:true})
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
  })
