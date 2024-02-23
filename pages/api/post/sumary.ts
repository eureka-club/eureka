import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '@/src/lib/getApiHandler';
import { findAllSumary } from '@/src/facades/post';
import { Prisma } from '@prisma/client';
import { Languages } from '@/src/types';
import {prisma} from '@/src/lib/prisma'

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const {sessionId,props,lang:l}=req.body;
    const locale = l?.toString();
    const language = locale ? Languages[locale!] : '';

    let {where:w,take,cursor,skip} = props;
    let AND = w?.AND;
    delete w?.AND;
    let where:Prisma.PostWhereInput = {...w,AND:{
      ... AND && {AND},
      ... language && {language}
    }}

    let cr = await prisma?.post.aggregate({where,_count:true})
    const total = cr?._count;

    try {
      const posts = await findAllSumary(sessionId,{take,where,skip,cursor});
      res.status(200).json({ 
        posts, 
        fetched:posts.length,
        total,
      });
    } catch (excp) {
      console.error(excp); // eslint-disable-line no-console
      res.statusMessage = 'server error';
      res.status(500).end();
    } finally {
      //prisma.$disconnect();
    }
  })
