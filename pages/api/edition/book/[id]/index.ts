import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
// import redis from '@/src/lib/redis';
import { findAllByWork, deleteAllByWork,createFromServerFields } from '@/src/facades/edition';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import { storeUpload } from '@/src/facades/fileUpload';
import { CreateEditionPayload } from '@/src/types/edition';

export const config = {
  api: { 
    bodyParser: false,
  },
};

const invalidRequest =  (
  session: Session,
  req: NextApiRequest,
  res: NextApiResponse,
): {error:string}|null => {
  if (session == null) {
    return { error: 'Unauthorized' };
  }
  const {id} = req.query;
  if(isNaN(+id!)){
    return { error: 'book\'s id (number) is required' };
  }
  return null;
};

const invalidRequieredFields =  (
  req: NextApiRequest,
  res: NextApiResponse,
  fields:any,
  files:any,
):  {error:string}|null => {
  const fieldsRequired = [
    "title","contentText","countryOfOrigin","publicationYear","length","language",
  ];
  
  if(!("cover" in files))return { error: `field cover (File) is required` };
      
  let i=0;
  let length = fieldsRequired.length;
  for(;i<length;i++){
    if(!(fieldsRequired[i] in fields))
      return { error: `field (${fieldsRequired[i]}) is required` };
  }
  return null;
};

export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    let error = invalidRequest(session,req,res);
    if(error)return res.status(200).json(error);
    
    const { id } = req.query;

    try {
      const editions = await findAllByWork(Number(id));
      if (editions == null) {
        res.status(404).end();
        return;
      }

      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    let error = invalidRequest(session,req,res);
    if(error)return res.status(200).json(error);
    
    const { id } = req.query;

    try {
      await deleteAllByWork(Number(id));
      // await redis.flushall();
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    let error = invalidRequest(session,req,res);
    if(error)return res.status(200).json(error);

    const {id:wi} = req.query;
    const workId = +wi!;

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        return res.status(500).json({ status: 'Server error' });
      }
      
      error = invalidRequieredFields(req,res,fields,files);
      if(error)return res.status(200).json(error);

      fields.publicationYear = dayjs(`${fields.publicationYear}`, 'YYYY').utc().format();

      try {
        const work = await prisma?.work.findFirst({include:{editions:{select:{language:true}}},where:{id:workId}});
        if(!work)
          return res.status(200).json({ error:`book ${workId} it is missing` });

        const existEditionInSameLang = work.editions.some(e=>e.language==fields?.language);

        if(work?.language==fields?.language)
          return res.status(200).json({ error:`book and it is edition have the same language: '${work?.language}'` });
        else if(existEditionInSameLang)
          return res.status(200).json({ error:`book already has an edition with the same language: '${work?.language}'` });

        if(work){
          const coverImage: FileUpload = files?.cover != null ? files.cover[0] : null;
          const uploadData = await storeUpload(coverImage);
          const fieldsA = { ...fields,ToCheck:false, workId };
          const edition = await createFromServerFields(fieldsA, uploadData);
          // await redis.flushall();
          return res.status(200).json({ edition });
        }
        return res.status(200).json({ error:"book not foud" });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  });
