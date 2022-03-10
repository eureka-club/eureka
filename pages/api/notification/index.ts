// import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { findAll, find, create, update } from '../../../src/facades/notification';
import prisma from '../../../src/lib/prisma';
import { isArray } from 'lodash';

/* export const config = {
  api: {
    bodyParser: false,
  },
}; */

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { id,userId } = req.query;
    // const {userId} = req.body;
    if (id && !userId) {
      const notification = await find(parseInt(id.toString()));
      res.status(200).json({ notification });
    } else if(userId) {
      const notifications = await findAll(parseInt(userId.toString()));
      res.status(200).json({ notifications });
    }
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
  try {debugger;
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
