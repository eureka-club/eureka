import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Languages, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { findAllSumary } from '@/src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';
import {cors,middleware} from '@/src/lib/cors'


export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    try {
      await middleware(req,res,cors)
      const session = (await getSession({ req })) as unknown as Session;
      const { q = null,props:p=undefined,lang:l } = req.query;
      const language = l ? Languages[l?.toString()!] : '';

      const props:Prisma.CycleFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
      let {where:w,take,cursor,skip} = props;
      let AND = w?.AND;
      delete w?.AND;
      let where = {...w,
        AND:{
          ... AND && {AND},
          ... language && {languages:{contains:language}}
        }
        // ... session?.user.language && {languages:{contains:session?.user.language}},
      };
      let data = null;
      
      let cr = await prisma?.cycle.aggregate({where,_count:true})
      const total = cr?._count;
      data = await findAllSumary(session,{take,where,skip,cursor});

      res.status(200).json({
        data,
        fetched:data.length,
        total,
      });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
