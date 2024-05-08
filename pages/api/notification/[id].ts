import { NextApiRequest, NextApiResponse } from 'next';

import dayjs from 'dayjs'; 
import utc from 'dayjs/plugin/utc';
import { find, remove, removeNotificationForUser } from '@/src/facades/notification';

import getApiHandler from '@/src/lib/getApiHandler';
import { SERVER_ERROR } from '@/src/api_code';
import notification from '.';

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id:id_ } = req.query;
      const id = id_ ? parseInt(id_.toString()) : undefined
      if(id){
        const notification = await find(parseInt(id.toString()));
        res.status(200).json({ notification });
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
  .delete<NextApiRequest,NextApiResponse>(async (req,res)=>{
    try{
      const{id:id_}=req.query;
      const{userId:userId_}=req.body;
      const id=id_ ? +id_?.toString() : undefined;
      const userId=userId_ ? +userId_?.toString() : undefined;
      if(id && userId){
        const _ = await removeNotificationForUser(id,userId);
        const notification = await remove(id);
        return res.status(200).json({notification});
      }
      return res.status(500).json({SERVER_ERROR});
    }
    catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.statusMessage = 'server error'
      res.status(500).end();
    } finally {
      // //prisma.$disconnect();
    }
  });
  
  
