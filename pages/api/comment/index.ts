import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import getApiHandler from '../../../src/lib/getApiHandler';
import { createFromServerFields, findAll, update, find } from '../../../src/facades/comment';
import {prisma} from '@/src/lib/prisma';
import { create } from '@/src/facades/notification';

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = await getSession({ req });
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    try {
      // const payload = req.body;
      // const post = await createFromServerFields(payload, session.user);
      // const notification = await create(
      //   payload.notificationMessage,
      //   payload.notificationContextURL,
      //   session.user.id,
      //   [...new Set(payload.notificationToUsers as number[])],
      // );
      // res.status(201).json({ ok: true, post,notification });
    
    } catch (excp) {
      /* const excpMessageTokens = excp.message.match(/\[(\d{3})\] (.*)/);
      if (excpMessageTokens != null) {
        res.status(excpMessageTokens[1]).json({ status: 'client error', error: excpMessageTokens[2] });
        return;
      } */

      console.error(excp); // eslint-disable-line no-console
      res.status(500).json({ ok: false, status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const data = await findAll();
      res.status(200).json({ status: 'OK', data });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = await getSession({ req }); 
    if (session == null) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const {commentId, contentText, status} = req.body;
      // const c = await find(commentId);
      // if (c) {
      //   if (c.creatorId !== session.user.id)
      //     return res.status(403).json({ error: 'Comments can only be edited by creators' });
      // }
      const comment = await update(commentId, contentText, status);

      res.status(200).json({ comment });      
    } catch (excp) {
      console.error(excp); // eslint-disable-line no-console
      let message = 'server error';
      if (excp instanceof Error)
        message = (excp as Error).message;
      res.status(500).json({ error: message });
    } finally {
      //prisma.$disconnect();
    }
  });
