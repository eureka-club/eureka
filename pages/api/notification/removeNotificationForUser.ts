import { NextApiRequest, NextApiResponse } from 'next';

import dayjs from 'dayjs'; 
import utc from 'dayjs/plugin/utc';
import { removeNotificationForUser } from '@/src/facades/notification';

import getApiHandler from '@/src/lib/getApiHandler';

dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { userId:userId_,notificationId:notificationId_ } = req.query;
      const userId = userId_ ? parseInt(userId_.toString()) : undefined
      const notificationId = notificationId_ ? parseInt(notificationId_.toString()) : undefined
      if(userId && notificationId){
        const notificationsOnUser = await removeNotificationForUser(notificationId,userId);
        res.status(200).json({ notificationsOnUser });
      }
      res.status(405).json({  });

    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.statusMessage = 'server error'
      res.status(500).end();
    } finally {
      // //prisma.$disconnect();
    }
  })
  
  
