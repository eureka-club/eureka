import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { find, saveSocialInteraction } from '@/src/facades/post';
import {create,update,remove} from '@/src/facades/postReaction'

const validateReq = async (
  session: Session,
  id: unknown,
  res: NextApiResponse,
): Promise<boolean> => {
  if (session == null) {
    res.status(401).json({ status: 'Unauthorized' });
    return false;
  }

  if (
    typeof id !== 'string') {
    res.status(404).end();
    return false;
  }

  const idNum = parseInt(id, 10);
  if (!Number.isInteger(idNum)) {
    res.status(404).end();
    return false;
  }

  return true;
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id } = req.query;
    const { emoji,doCreate} = req.body;
debugger;
    if (!(await validateReq(session, id, res))) {
      return;
    }

    try {
      const post = await find(Number(id));
      if (post == null) {
        res.status(404).end();
        return;
      }
      let result = null;
      if(doCreate){
        result = await create(post.id,session.user.id,emoji);
      }
      else{
        result = await update(post.id,session.user.id,emoji);
      }
      res.status(200).json({ status: 'OK', result });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    const { id } = req.query;

    if (!(await validateReq(session, id, res))) {
      return;
    }

    try {
      const post = await find(Number(id));
      if (post == null) {
        res.status(404).end();
        return;
      }
      const result = await remove(session.user.id,post.id);
      res.status(200).json({ status: 'OK', result });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
