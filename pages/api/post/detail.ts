import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import getApiHandler from '@/src/lib/getApiHandler';
import { find } from '@/src/facades/post';


export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    debugger;
    const {id,sessionId} = req.body as {id:number,sessionId:number};
    if (!id) {
      res.status(404).end();
      return;
    }

    try {
      const post = await find(id,sessionId);
      if (post == null) {
        // res.status(404).end();
        res.status(200).json({ status: 'OK', post: null });
        return;
      }
      res.status(200).json({ status: 'OK', post });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
