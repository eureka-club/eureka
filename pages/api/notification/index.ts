// import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { findAll, find, create, update } from '../../../src/facades/notification';
import {prisma} from '@/src/lib/prisma';
import { isArray } from 'lodash';
import { NotificationSumary } from '@/src/types/notification';

/* export const config = {
  api: {
    bodyParser: false,
  },
}; */

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { id,userId,take:take_ } = req.query;
    const take = take_?+take_.toString()!:undefined;
    let notifications;
    let total=-1;
    let news=0;
    // const {userId} = req.body;
    if (id && !userId) {
      notifications = await find(parseInt(id.toString()));
    } else if(userId) {
      const {notifications:notifications_,total:total_,news:news_} = await  findAll(parseInt(userId.toString()),take);
      total=total_;
      news=news_;
      notifications=notifications_;
      const allreadyExist = new Set();
      // const result:NotificationSumary[] | null = [];
      // notifications?.reduce((p,c)=>{
      //   const key = `${c.user.id}:${c.notification.contextURL}:${c.notification.message}:${c.notification.fromUser.id}`;
      //   if(!allreadyExist.has(key)){
      //     p.push(c)
      //     allreadyExist.add(key);
      //   }
      //   return p;
      // },result)
      return res.status(200).json({ notifications,total,news });
    }
    else {
      total=await prisma.notification.count();
      notifications = await prisma.notification.findMany();
    }
    res.status(200).json({ notifications,total,news });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    // //prisma.$disconnect();
  }
})
.post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.statusMessage = 'Unauthorized';
      res.status(401).end();
      return;
    }

    const {message, contextURL, toUsers} = req.body;
    if(toUsers && isArray(toUsers) && toUsers.length){
      const notification = await create(message,contextURL,session.user.id,toUsers);
      return res.status(201).json({ notification }); 
    }
    else return res.status(200).json({notification:null});

  } catch (exc) {
    console.error(exc);
    res.statusMessage = 'server error';
    res.status(500).end();
  } finally {
    // //prisma.$disconnect();
  }
})
.patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.statusMessage = 'Unauthorized';
      res.status(401).end();
      return;
    }

    const {userId,notificationId} = req.body;
    // const n = await prisma.notificationsOnUsers.findFirst({where:{userId:session.user.id,notificationId}});
    if(userId!=session.user.id && !session.user.roles.includes('admin')){
      res.statusMessage = 'Unauthorized';
      res.status(401).end();
      return;
    }
    const d = req.body.data;
    let data = {
      ... ('message' in d) && {message:d.message},
      ... ('contextURL' in d) && {contextURL:d.contextURL},
      ... ('viewed' in d) && {viewed:d.viewed},
    };

    const notification = await update(notificationId,userId,data);

    res.status(200).json({ notification });    
  } catch (exc) {
    console.error(exc);
    res.statusMessage = 'server error';
    res.status(500).end();
  } finally {
    // //prisma.$disconnect();
  }
});
