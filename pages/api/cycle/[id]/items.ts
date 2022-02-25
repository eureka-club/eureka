import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import {findAll as findAllPosts} from '@/src/facades/post'
import {findAll as findAllComments} from '@/src/facades/comment'
import getApiHandler from '@/src/lib/getApiHandler';
import prisma from '@/src/lib/prisma';
import { PostMosaicItem } from '@/src/types/post';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()  
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {debugger;
      const { q = null, where:w = null,take:t,lastPostId = undefined,lastCommentId = undefined } = req.query;
      let where = w ? JSON.parse(w.toString()) : undefined;
      const take = t ? parseInt(t.toString()) : undefined;
      let cursorPost = lastPostId ? {id:+lastPostId.toString()} : undefined;
      let cursorComment = lastCommentId ? {id:+lastCommentId.toString()} : undefined;


      let posts = null;
      if (typeof q === 'string') {
        where = {
          OR: [{ title: { contains: q } }, { contentText: { contains: q } }, { tags: { contains: q } }],
        };
        posts = await findAllPosts({take,where,cursor:cursorPost});
      } else if (where) {
        posts = await findAllPosts({take,where,cursor:cursorPost});
      } else {
        posts = await findAllPosts({take,cursor:cursorPost});
      }

      const items = [
        ...posts.map(p=>{(p as PostMosaicItem).type='post';return p;})
      ]

      res.status(200).json({ status: 'OK', items });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
