import { NextApiRequest, NextApiResponse } from 'next';
import {Form} from 'multiparty';
import { getSession } from 'next-auth/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { find } from '../../../src/facades/user';

import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import prisma from '../../../src/lib/prisma';
import {storeUploadUserPhoto} from '@/src/facades/fileUpload'

export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
export default getApiHandler()
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    new Form().parse(req, async function(err, fields:Record<string,any[]>, files) {
      
      
        const { id } = req.query;
    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      // res.status(404).end();
      res.status(200).json({ status: 'OK', user: null });
      return;
    }

    const session = (await getSession({ req })) as unknown as Session;

    const actionAllowed = () => {
      if (('following' in fields && fields.following) || ('followedBy' in fields && fields.followedBy)) return true;
      return session.user.roles.includes('admin') || session.user.id === idNum;
    };
    if (session == null || !actionAllowed()) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    try {
      // delete data.id;
      
      let data = Object.entries(fields).reduce((prev, curr)=>{
        const [k,v] = curr;
        let val = v[0];
        switch(k){
          case 'dashboardType':
            val = parseInt(v[0])
            break;

        }
        prev = {...prev, [`${k}`]: val};
        return prev;
      },{});
      if(files.photo && files.photo[0]){
        const coverImageUploadData = await storeUploadUserPhoto(files.photo[0]);
        const existingLocalImage = await prisma.localImage.findFirst({
          where: { contentHash: coverImageUploadData.contentHash },
        });
        data = {
          ...data,
          photos: {
            connectOrCreate: {
              where: { id: existingLocalImage != null ? existingLocalImage.id : 0 },
              create: { ...coverImageUploadData },
            },
          }
        }
      }
      debugger;
      const r = await prisma.user.update({ where: { id: idNum }, data });
      res.status(200).json({ status: 'OK', r });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }})
  


  }).get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id, select: s, include: i } = req.query;
      let select = null;
      if(s){
        select = JSON.parse(s as string);
      }
      const include = i !== 'false';
      const user = await find({ id: parseInt(id as string, 10), select, include });
      res.status(200).json({ user });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ error: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
