import { NextApiRequest, NextApiResponse } from 'next';
import { Form } from 'multiparty';
import { getSession } from 'next-auth/react';
import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { find,create,update } from '@/src/facades/backoffice';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { backOfficeData } from '@/src/types/backoffice';


export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = await getSession({ req });
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).end({ status: 'Unauthorized' });
    }
        try{
          const { storedFile:storedFile_ } = req.query;
          const storedFile = (storedFile_||'').toString();

         const updateImage = async function(bsData:backOfficeData, originalFilename:string){
          const file = bsData.sliderImages.filter(x=> x.originalFilename == originalFilename);
          if(file.length){
            const storedFile = file[0].storedFile;
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
       }


         if(storedFile){
             const bs = await find({id:1});
              if(bs && bs.sliderImages.length){
                  let resSliderRemoving;   
                  if(bs.SlideImage1 == storedFile ){
                      updateImage(bs,bs.SlideImage1 as string);
                        resSliderRemoving = await update(1,{SlideImage1: "null"});
                  }    
                  if(bs.SlideImage2 == storedFile){
                      updateImage(bs,bs.SlideImage2 as string);
                      resSliderRemoving = await update(1,{SlideImage2: "null"});
                  }    
                  if(bs.SlideImage3 == storedFile ){
                      updateImage(bs,bs.SlideImage3 as string);
                      resSliderRemoving = await update(1,{SlideImage3: "null"});
                  }    
                   if(!resSliderRemoving)
                      console.error('Removing sliders photo  has failed')
               }
               
           }
          return res.status(200).json({ status: 'ok' });

        }
        catch (exc) {
          console.error(exc); // eslint-disable-line no-console
          res.status(500).json({ status: 'server error' });
        } 

  }
  );
 