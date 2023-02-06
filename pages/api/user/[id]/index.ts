import { NextApiRequest, NextApiResponse } from 'next';
import {Form} from 'multiparty';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { find, update } from '@/src/facades/user';
import { create } from '@/src/facades/notification';

import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { UserMosaicItem } from '@/src/types/user';
import { Notification } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

dayjs.extend(utc);
export default getApiHandler()
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
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
      
    let session = await getSession({ req });
    if(!session && req.headers['cypress-session']) session = JSON.parse(req.headers['cypress-session'].toString());//cypress tests

    const actionAllowed = (fields:Record<string,any[]>) => {
      if(session){
        if (('following' in fields && fields.following) || ('followedBy' in fields && fields.followedBy)) return true;
        return session.user.roles.includes('admin') || session.user.id === idNum;
      }
    };
    if (session == null || !actionAllowed(fields)) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    try {
      // delete data.id;
      let notificationData:Record<string,any> = {}; 
      if(fields.notificationData){
        notificationData = JSON.parse(fields.notificationData[0]);
        delete fields.notificationData;
      }
      let data:Record<string,any> = Object.entries(fields).reduce((prev, curr)=>{
        const [k,v] = curr;
        let val = v[0];
        switch(k){
          case 'dashboardType':
            val = parseInt(v[0])
            break;
          case 'followedBy':
            val = JSON.parse(v[0])
            break;

        }
        prev = {...prev, [`${k}`]: val};
        return prev;
      },{});
      
      if(files.photo && files.photo[0]){
        const user = await find({where:{id:idNum}}) as UserMosaicItem;
        if(!user){
          res.statusMessage = 'User not found';
          return res.status(405).end();
        }
        if(user.photos && user.photos.length){
          const storedFile = (user as UserMosaicItem).photos[0].storedFile;
          const resImageRemoving = await storeDeleteFile(storedFile,'users-photos');
          if(!resImageRemoving){
            console.error('Removing image has failed')
          }
          const resPhotoRemoving = await update(idNum,{
            photos:{deleteMany:{}}
          });
          if(!resPhotoRemoving){
            console.error('Removing user photo has failed')
          }
        }
        const coverImageUploadData = await storeUploadPhoto(files.photo[0],'users-photos');
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
      const r = await update(idNum, data);
      let notification:Notification|null=null;
      if(r){
        if(data.followedBy && data.followedBy.connect){
          if(Object.keys(notificationData).length){
            notification = await create(
              notificationData.notificationMessage,
              notificationData.notificationContextURL,
              session.user.id,
              notificationData.notificationToUsers.map((i:string|number) => +i),
            );

          }

        }
      }
      res.status(200).json({ status: 'OK', r, notification });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }})
  


  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id:id_, select: s, include: i } = req.query;
    
      const id = parseInt(id_ as string, 10)
      const user = await find({where:{ id }});
      if(user)
        user.type = "user";
      res.status(200).json({ user });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ error: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
