import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '../../src/lib/getApiHandler';
import {SearchResult} from '@/src/types'
import { CycleMosaicItem } from '@/src/types/cycle';
import { WorkMosaicItem } from '@/src/types/work';
import { PostMosaicItem } from '@/src/types/post';
import dayjs from 'dayjs';
import prisma from '@/src/lib/prisma';
import { findAll as fap } from '@/src/facades/post';
import { findAll as fac } from '@/src/facades/cycle';
import { findAll as faw } from '@/src/facades/work';

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  try {
    const {q} = req.query;
    const query = q.toString()
    const responseWork =  await faw({where: {
      OR: [{ title: { contains: query } }, { contentText: { contains: query } }, { author: { contains: query } }],
    }}) as WorkMosaicItem[];
    const responseCycle = await fac({where: {
      AND:[{ access:{not:3}}],
      OR: [{title: { contains: query } }, { contentText: { contains: query } }, { tags: { contains: query } }],
    }}) as CycleMosaicItem[];
    const responsePost = await fap({where: {
      AND:[{
        cycles:{
          some:{
            access:{not:3}
          }
        }
      }],
      OR: [{ title: { contains: query } }, { contentText: { contains: query } }, { creator: { name:{contains: query} } }],
    }}) as PostMosaicItem[];
    responseCycle.forEach(c=>{c.type="cycle"})
    responsePost.forEach(p=>{p.type="post"})
    const data: SearchResult[] = [
      ...responseCycle,//.map(r=>({...r,type:'cycle'})),
      ...responseWork,
      ...responsePost,//.map(r=>({...r,type:'post'})),

    ].sort((f, s) => {
      const fCD = dayjs(f.createdAt);
      const sCD = dayjs(s.createdAt);
      if (fCD.isAfter(sCD)) return -1;
      if (fCD.isSame(sCD)) return 0;
      return 1;
    });

    return res.status(200).json({data});
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.statusMessage = 'server error'
    return res.status(500).end();
  } finally {
    //prisma.$disconnect();
  }
});
