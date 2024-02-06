import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '../../src/lib/getApiHandler';
import {Languages, SearchResult} from '@/src/types'
import { CycleDetail } from '@/src/types/cycle';
import { WorkDetail } from '@/src/types/work';
import { PostDetail } from '@/src/types/post';
import dayjs from 'dayjs';
import {prisma} from '@/src/lib/prisma';
import { findAll as fap } from '@/src/facades/post';
import { findAll as fac } from '@/src/facades/cycle';
import { findAll as faw } from '@/src/facades/work';

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  try {
    const {q:q_,lang:l} = req.query;
    const language = Languages[l?.toString()??"es"];

    const query = q_ ? q_.toString() : undefined;
    const terms = query ? query.split(" ") : [];

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

    const responseWork =  await faw(language,{where: worksWhere}) as WorkDetail[];

    const cyclesWhere={
      AND:[{ access:{not:3}}],

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
               tags: { contains: t } 
            }
          ))
        },
        {
          AND:terms.map(t=>(
            { 
               topics: { contains: t } 
            }
          ))
        }
      ]
    };

    const responseCycle = await fac({where: cyclesWhere}) as CycleDetail[];

    const postsWhere = {
        AND:[{
        cycles:{
          some:{
            access:{not:3}
          }
        }
      }],
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
              creator: { name:{contains: t}}
            }
          ))

        },
      ]
    }

    const responsePost = await fap({where:postsWhere}) as PostDetail[];
    responseCycle.forEach(c=>{c.type="cycle"})
    responsePost.forEach(p=>{p.type="post"})
    const data: SearchResult[] = [
      ...responseCycle,
      ...responseWork,
      ...responsePost,

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
