import { NextApiRequest, NextApiResponse } from 'next';
import { Form } from 'multiparty';
import { getSession } from 'next-auth/react';
import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import { find,create,update } from '@/src/facades/backoffice';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'

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
        //console.log(files,'files')  
     try{ 

        const bs = await find({id:1});

        let data:Record<string,any> = Object.entries(fields).reduce((prev, curr)=>{
              const [k,v] = curr;
              let val = v[0];
              if(!['SlideImage1','SlideImage2','SlideImage3'].includes(k))
                 prev = {...prev, [`${k}`]: val};
              return prev;
            },{});    

          const ImagesFields = ['SlideImage1','SlideImage2','SlideImage3'];
          let Images = []; 

          for(let i = 0; i<=ImagesFields.length-1;i++){

               if(bs && bs.sliderImages[i]){
                   const storedFile = bs.sliderImages[i].storedFile;
                   const resImageRemoving = await storeDeleteFile(storedFile,'backoffice');
                   if(!resImageRemoving){
                       console.error('Removing image has failed')
                   }
                   const resPhotoRemoving = await update(1,{
                   sliderImages:{deleteMany:{storedFile: storedFile}}
                   });
                  if(!resPhotoRemoving)
                    console.error('Removing sliders photo  has failed')
              }

              if(files[ImagesFields[i]] && files[ImagesFields[i]][0]){
                const coverImageUploadData = await storeUploadPhoto(files[ImagesFields[i]][0],'backoffice');
                Images.push(coverImageUploadData);
              }
          }

         data = {
          ...data,
          sliderImages:{
          create:Images,  
           },
         }

         let r;
         if(!bs)
           r = await create(1, data);
         else          
           r = await update(1, data);          
          
    
      return res.status(200).json({ status: 'ok' });
     }
     catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  })
 