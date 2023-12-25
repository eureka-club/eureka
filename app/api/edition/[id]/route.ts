import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs, { locale } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Form } from 'multiparty';
import { Session, FileUpload } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { find, remove, updateFromServerFields } from '@/src/facades/edition';
import { storeUpload } from '@/src/facades/fileUpload';
import { NextRequest, NextResponse } from 'next/server';
import { INVALID_FIELD, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import { getServerSession } from 'next-auth';
import getLocale from '@/src/getLocale';
import auth_config from '@/auth_config';
import { NOTFOUND } from 'dns';
import { EditEditionPayload } from '@/src/types/edition';
// import redis from '../../../src/lib/redis';


dayjs.extend(utc);
const userCan = async (req:NextRequest,id:number)=>{
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));

  if (session == null || (!session.user.roles.includes('admin') && session.user.id !=id)) {
    return { error: UNAUTHORIZED };
  }
  return null;
}
interface Props{
  params:{id:number}
}
export const DELETE = async (req:NextRequest,{params}:Props)=>{
  const {id} = params;
  let error = await userCan(req,id);
  if(error)
    return NextResponse.json(error);

  if (!Number.isInteger(id)) {
    return NextResponse.json({error:INVALID_FIELD('id')});
  }

  try {
    const edition = await find(id);
    if (edition == null) {
      return NextResponse.json({error:"not found"});
    }

    await remove(id);
    // await redis.flushall();
    return NextResponse.json({ edition });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}
export const GET = async (req:NextRequest,{params}:Props)=>{
  const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));

    const { id } = params;

    if (!Number.isInteger(id)) {
      return NextResponse.json({error:INVALID_FIELD('id')});
    }

    try {
      const edition = await find(id);
      if (edition == null) {
        return NextResponse.json({error:NOTFOUND});
      }
      return NextResponse.json(edition);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
export const PATCH = async (req:NextRequest,{params}:Props)=>{
  const {id} = params;
  let error = await userCan(req,id);
    if(error)return NextResponse.json({error});
    
    const data = await req.formData();
    const cover:File = data.get('cover') as File;

    let fields: Partial<EditEditionPayload>={};
    for(let [k,v] of Array.from(data))
      fields={...fields,[k]:v}; 

  try {

      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();

      if (isNaN(id)) {
        return NextResponse.json({ error: INVALID_FIELD('id') });
      }
      try {
        const uploadData = await storeUpload(cover);
        const fieldsA = { ...fields };
        const edition = await updateFromServerFields(fieldsA, uploadData,id);
        // await redis.flushall();
        return NextResponse.json({ edition });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        return NextResponse.json({ error: SERVER_ERROR });
      } finally {
        //prisma.$disconnect();
      }
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    ////prisma.$disconnect();
  }
}
