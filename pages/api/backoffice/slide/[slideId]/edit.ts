import { NextApiRequest, NextApiResponse } from 'next';
import { Form } from 'multiparty';
import {prisma} from '@/src/lib/prisma';

import { getSession } from 'next-auth/react';
import { Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { find } from '@/src/facades/backoffice';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { backOfficeData } from '@/src/types/backoffice';
import {cors,middleware} from '@/src/lib/cors'

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default getApiHandler()
  .put<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const{slideId}=req.query;
    const{title,text,language}=req.body;
   const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    await middleware(req,res,cors)

      
     try{ 
       const bs = await find({id:1});
        
        const backOfficeSettingsSlider = await prisma?.backOfficeSettingsSliders.update({
          where:{
            id:+slideId!
          },
          data:{
            title,
            text,
            language
          } 
        })
          
      return res.status(200).json({ ok:!!backOfficeSettingsSlider });
     }
     catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
  })

 
 