import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/post';
import { create } from '@/src/facades/notification';
import prisma from '@/src/lib/prisma';
import { take } from 'lodash';
import { count } from 'console';
import { RiTruckLine } from 'react-icons/ri';
import { GiWhirlwind } from 'react-icons/gi';

export const config = {
  api: {
    bodyParser: false,
  },
};



export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {debugger;
    try {
        // const notificationToUsers = fields.notificationToUsers 
        // ? fields.notificationToUsers[0].split(',').filter((i:string)=>i!='').map((i:string) => +i)
        // : null;
        // if(notificationToUsers && notificationToUsers.length){
        //     const notification = await create(
        //     fields.notificationMessage[0],
        //     fields.notificationContextURL[0]+`/${post.id}`,
        //     session.user.id,
        //     fields.notificationToUsers[0].split(',').map((i:string) => +i),
        //     );
        // res.status(201).json({ post, notification });
        // return;
        // }
        // res.status(201).json({ notification:null });
        res.status(200).json({notification:{hyvortalk:{body:req.body,req:req}}})
    } catch (excp) {
   
      console.error(excp); // eslint-disable-line no-console
      res.statusMessage = 'server error';
      res.status(500).end();
    } finally {
      //prisma.$disconnect();
    }
  })
