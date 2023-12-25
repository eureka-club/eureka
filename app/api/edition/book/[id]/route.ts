import { Form } from 'multiparty';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
// import redis from '@/src/lib/redis';
import { findAllByWork, deleteAllByWork,createFromServerFields } from '@/src/facades/edition';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { storeUpload } from '@/src/facades/fileUpload';
import { CreateEditionPayload, CreateEditionServerPayload } from '@/src/types/edition';
import { NextRequest, NextResponse } from 'next/server';
import { INVALID_FIELD, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import getLocale from '@/src/getLocale';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { NOTFOUND } from 'dns';

// export const config = {
//   api: { 
//     bodyParser: false,
//   },
// };

const invalidRequest =  (
  session: Session|null,
  id: number,
): {error:string}|null => {
  if (session == null) {
    return { error: UNAUTHORIZED };
  }
  if(isNaN(+id!)){
    return { error: INVALID_FIELD('id') };
  }
  return null;
};

const invalidRequieredFields =  (
  fields:any,
  cover:any,
):  {error:string}|null => {
  const fieldsRequired = [
    "title","contentText","countryOfOrigin","publicationYear","length","language",
  ];
  
  if(!cover)return { error: INVALID_FIELD('cover') };
      
  let i=0;
  let length = fieldsRequired.length;
  for(;i<length;i++){
    if(!(fieldsRequired[i] in fields))
      return { error: INVALID_FIELD(fieldsRequired[i]) };
  }
  return null;
};
interface Props{
  params:{id:number}
}
export const GET = async (req:NextRequest,{params}:Props)=>{
  const {id} = params;
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
    let error = invalidRequest(session,id);
    if(error)return NextResponse.json(error);

    try {
      const editions = await findAllByWork(Number(id));
      if (editions == null) {
        return NextResponse.json({error:NOTFOUND});
      }
      // await redis.flushall();
      return NextResponse.json({ editions });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
export const DELETE = async (req:NextRequest,{params:{id}}:Props)=>{
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
    let error = invalidRequest(session,id);
    if(error)return NextResponse.json(error);

    try {
      await deleteAllByWork(id);
      // await redis.flushall();
      return NextResponse.json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
export const POST = async (req:NextRequest,{params:{id}}:Props)=>{
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
    let error = invalidRequest(session,id);
    if(error)return NextResponse.json(error);
    const data = await req.formData();
    const cover:File = data.get('cover') as File;
    let fields: Partial<CreateEditionServerPayload>={};
    for(let [k,v] of Array.from(data))
      fields={...fields,[k]:v};

      error = invalidRequieredFields(fields,cover);
      if(error)return NextResponse.json(error);

      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();

      try {
        const work = await prisma?.work.findFirst({include:{editions:{select:{language:true,title:true}}},where:{id}});
        if(!work)
          return NextResponse.json({ error:NOTFOUND });

        const existEditionInSameLang = work.editions.some(e=>e.language==fields?.language);
        const existEditionInSameTitle = work.editions.some(e=>e.title==fields?.title);

        if(work?.language==fields?.language)
          return NextResponse.json({ error:`book and it is edition have the same language: '${work?.language}'` });
        else if(existEditionInSameLang)
          return NextResponse.json({ error:`book already has an edition with the same language: '${work?.language}'` });
        else if(existEditionInSameTitle){
          return NextResponse.json({ error:`book already has an edition with the same title: '${fields?.title}'` });
        }  

        if(work){
          const uploadData = await storeUpload(cover);
          const fieldsA = { ...fields,ToCheck:false, id };
          const edition = await createFromServerFields(fieldsA, uploadData);
          // await redis.flushall();
          return NextResponse.json({ edition });
        }
        return NextResponse.json({ error:NOTFOUND });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        return NextResponse.json({ error: SERVER_ERROR });
      } finally {
        //prisma.$disconnect();
      }
}  
