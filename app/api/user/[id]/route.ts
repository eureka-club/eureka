import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { find, update } from '@/src/facades/user';
import { create } from '@/src/facades/notification';
import {prisma} from '@/src/lib/prisma';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { EditUserServerPayload, UserMosaicItem } from '@/src/types/user';
import { Notification, Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { INVALID_FIELD, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import { getServerSession } from 'next-auth';
import getLocale from '@/src/getLocale';
import auth_config from '@/auth_config';
import { v4 } from 'uuid';

dayjs.extend(utc);
interface Props{
  params:{id:string}
}
export const PATCH = async (req:NextRequest,props:Props) => {
  const {id:id_} = props.params;
  const id = parseInt(id_);
  if(isNaN(id))return NextResponse.json({error:INVALID_FIELD('id')});
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
  // if(!session && req.headers['cypress-session']) session = JSON.parse(req.headers['cypress-session'].toString());//cypress tests
  const data = await req.formData();
  const photo:File = data.get('photo') as File;
  
  let fields: Partial<EditUserServerPayload>={};
  for(let [k,v] of Array.from(data)){
    let val:any=v;
    switch(k){
      case 'dashboardType':
        val = parseInt(v.toString())
        break;
      case 'followedBy':
        val = JSON.parse(v.toString())
        break;
    }
    fields={...fields,[k]:val}; 
  }

  const actionAllowed = (fields:Partial<EditUserServerPayload>) => {
    if(session){
      if (('following' in fields && fields.following) || ('followedBy' in fields && fields.followedBy)) return true;
      return session.user.roles.includes('admin') || session.user.id === id;
    }
  };

  if (session == null || !actionAllowed(fields)) {
    return NextResponse.json({ error: UNAUTHORIZED });
  }

  try {
    // delete data.id;
    let notificationData:Record<string,any> = {}; 
    if(fields.notificationData){
      notificationData = JSON.parse(fields.notificationData[0]);
      delete fields.notificationData;
    }
    
    if(photo){
      const user = await find({where:{id}}) as UserMosaicItem;
      if(!user){
        return NextResponse.json({error:NOT_FOUND});
      }
      if(user.photos && user.photos.length){
        const storedFile = (user as UserMosaicItem).photos[0].storedFile;
        const resImageRemoving = await storeDeleteFile(storedFile,'users-photos');
        if(!resImageRemoving){
          console.error('Removing image has failed')
        }
        const resPhotoRemoving = await update(id,{
          photos:{deleteMany:{}}
        });
        if(!resPhotoRemoving){
          console.error('Removing user photo has failed')
        }
      }
      const coverImageUploadData = await storeUploadPhoto(photo,'users-photos');
      const existingLocalImage = await prisma.localImage.findFirst({
        where: { contentHash: coverImageUploadData.contentHash },
      });
      fields = {
        ...fields,
        photos: {
          connectOrCreate: {
            where: { id: existingLocalImage != null ? existingLocalImage.id : 0 },
            create: { ...coverImageUploadData },
          },
        }
      }
    }
    const r = await update(id, fields);
    let notification:Notification|null=null;
    if(r){
      if(fields.followedBy && fields.followedBy.connect){
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
    return NextResponse.json({ r, notification });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}

  export async function GET(req:NextRequest,props:Props){
    try {
      const {id} = props.params;
      const user = await find({where:{ id:+id }});
      if(user)
        (user as unknown as UserMosaicItem).type = "user";

      return NextResponse.json({ user });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  }
