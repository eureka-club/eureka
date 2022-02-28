import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import {findAll as findAllPosts} from '@/src/facades/post'
import {findAll as findAllComments} from '@/src/facades/comment'
import getApiHandler from '@/src/lib/getApiHandler';
import prisma from '@/src/lib/prisma';
import { PostMosaicItem } from '@/src/types/post';
import { CommentMosaicItem } from '@/src/types/comment';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()  
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {debugger;
      const { q = null, where:w = null,take:t,page:p} = req.query;
      if(!p)
        res.status(400).end()
      const id = +req.query.id.toString()  
      let page = parseInt(p.toString())-1;
      const take = +(process.env.NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT||10)
      const skip = page * take;
      let where = w ? JSON.parse(w.toString()) : undefined;
      
      let posts = null;
      where = {...where,AND:[
        {cycles:{some:{id}}},
      ]}
      if (typeof q === 'string') {
        where = {
          ...where,
          OR: [            
            { title: { contains: q } }, { contentText: { contains: q } }, { tags: { contains: q } }
          ],          
        };
        posts = await findAllPosts({where});
      } else if (where) {
        posts = await findAllPosts({where});
      } else {
        posts = await findAllPosts({where});
      }

      let comments = null;
      where = {...where,
        commentId:null,
          postId:null,
          //workId:null,
        AND:[
        {cycleId:id},
      ]}
      if (typeof q === 'string') {
        where = {
          ...where,
          OR: [
            { contentText: { contains: q } }
          ]          
        };
        comments = await findAllComments({where});
      } else if (where) {
        comments = await findAllComments({where});
      } else {
        comments = await findAllComments({where});
      }

      const it = [        
        ...comments.map(p=>{(p as CommentMosaicItem).type='comment';return p;}),
        ...posts.map(p=>{(p as PostMosaicItem).type='post';return p;})
      ]

      let items = it.sort((x,y)=>x.createdAt > y.createdAt ? -1 : 1).splice(skip,take)

      res.status(200).json({ 
         items,
         total:(comments.length+posts.length),
         hasNextPage: (comments.length+posts.length) > take * (page+1)
       });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
