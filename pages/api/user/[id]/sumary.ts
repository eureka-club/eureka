import { NextApiRequest, NextApiResponse } from 'next';
import {Form} from 'multiparty';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { find, findSumary, update } from '@/src/facades/user';
import { create } from '@/src/facades/notification';

import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { UserDetail, UserSumary } from '@/src/types/user';
import { Notification } from '@prisma/client';

dayjs.extend(utc);
export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id:id_,language:l} = req.query;
    
      const id = parseInt(id_ as string, 10)
      let language = l?.toString();
      const user = await findSumary(id);

      if(user)
        (user as unknown as UserSumary).type = "user";

      res.status(200).json({ user });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ error: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
