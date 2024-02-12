import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';

import {findAll as findAllPosts} from '@/src/facades/post'
import getApiHandler from '@/src/lib/getApiHandler';
import { PostDetail } from '@/src/types/post';
import { getSession } from 'next-auth/react';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()  
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const session = await getSession({req});
      const { q = null, where:w = null,take:t,page:p=1,id:id_} = req.query;
      if(!p)
        res.status(400).end()
      const id = id_ ? id_.toString():undefined;  
      let page = parseInt(p.toString())-1;
      const take = page >-1 ? +(process.env.NEXT_PUBLIC_MOSAIC_ITEMS_COUNT||10):undefined
      const skip = page >-1 ? page * take!:undefined;
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
        posts = await findAllPosts(session?.user.id!, {where});
      } else if (where) {
        posts = await findAllPosts(session?.user.id!, {where});
      } else {
        posts = await findAllPosts(session?.user.id!, {where});
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
      } else if (where) {
      } else {
      }

      const it = [        
        ...posts.map(p=>{(p as PostDetail).type='post';return p;})
      ]

      let items = page>-1 
        ? it.sort((x,y)=>x.createdAt > y.createdAt ? -1 : 1).splice(skip!,take)
        : it.sort((x,y)=>x.createdAt > y.createdAt ? -1 : 1);

      res.status(200).json({ 
         items,
         total:(posts.length),
        // hasNextPage: (comments.length+posts.length) > take * (page+1)
       });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  });
