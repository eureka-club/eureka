import { NextApiRequest, NextApiResponse } from 'next';
import { Form } from 'multiparty';
import { getSession } from 'next-auth/react';
import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import { find,create,update } from '@/src/facades/backoffice';
import {storeDeleteFile, storeUploadUserPhoto} from '@/src/facades/fileUpload'

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  
   const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    new Form().parse(req, async function(err, fields:Record<string,any[]>, files) {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }
        console.log(files,'files')  
      
        let data:Record<string,any> = Object.entries(fields).reduce((prev, curr)=>{
              const [k,v] = curr;
              let val = v[0];
              if(!['SlideImage1','SlideImage2','SlideImage3'].includes(k))
                 prev = {...prev, [`${k}`]: val};
              return prev;
            },{});    

         console.log(data,'data')  

         const bs = await find({id:1});
         console.log(bs,'bs');
         let r;
         if(!bs){
           r = await create(1, data);
         }
          else{
             r = await update(1, data);
         }   
      //ver esto
      return res.status(200).json({ status: 'OKOKOKOKOKOK' });


     /* const coverImage: FileUpload = files.cover[0];
      try {
        const uploadData = await storeUpload(coverImage);
        const fieldsA = { ...fields, creatorId: [session.user.id] };
        const work = await createFromServerFields(fieldsA, uploadData);
        // await redis.flushall();
        res.status(201).json(work);
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }*/
    });

  })
 