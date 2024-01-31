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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  
  //  const session = (await getSession({ req })) as unknown as Session;
  //   if (session == null) {
  //     res.status(401).json({ status: 'Unauthorized' });
  //     return;
  //   }
    await middleware(req,res,cors)

    new Form().parse(req, async function(err, fields:Record<string,any[]>, files) {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }
     //console.log(files,'files')  
     try{ 
       const bs = await find({id:1});
        const imagen = files.images[0];
        delete fields.images;

        let data:Record<string,any> = Object.entries(fields).reduce((prev, curr)=>{
          const [k,v] = curr;
          let val = v[0];
            prev = {...prev, [`${k}`]: val};
          return prev;
        },{});  
        
        const uploadImage = await storeUploadPhoto(imagen,'backoffice');
        const backOfficeSettingsSlider = await prisma?.backOfficeSettingsSliders.create({
          data:{
            backOfficeSettingId:1,
            ...data,
            images:{
              create:uploadImage
            }
          } 
        })
          
      return res.status(200).json({ backOfficeSettingsSlider });
     }
     catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  })

 
 