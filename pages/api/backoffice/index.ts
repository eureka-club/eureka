import { NextApiRequest, NextApiResponse } from 'next';
import { Form } from 'multiparty';
import { getSession } from 'next-auth/react';
import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { find,create,update } from '@/src/facades/backoffice';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { backOfficeData } from '@/src/types/backoffice';
import {cors,middleware} from '@/src/lib/cors'

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
      //  const FileFields = ['Image1','Image2','Image3'];
       //const SlidersImagesFields = ['SlideImage1','SlideImage2','SlideImage3'];

      //  const updateImage = async function(bsData:backOfficeData, originalFilename:string){
       
      //     const file = bsData.sliderImages.filter(x=> x.originalFilename == originalFilename);
      //     if(file.length){
      //       const storedFile = file[0].storedFile;
      //       const resImageRemoving = await storeDeleteFile(storedFile,'backoffice');
      //       if(!resImageRemoving){
      //        console.error('Removing image has failed')
      //       }
      //       const resPhotoRemoving = await update(1,{
      //       sliderImages:{deleteMany:{storedFile: storedFile}}
      //       });
      //       if(!resPhotoRemoving)
      //         console.error('Removing sliders photo  has failed')
      //     }
      //  }
        
        let data:Record<string,any> = Object.entries(fields).reduce((prev, curr)=>{
              const [k,v] = curr;
              let val = v[0];
              // if(!FileFields.includes(k))
                 prev = {...prev, [`${k}`]: val};
              return prev;
            },{});    

          // let Images = []; 

          // if(Object.entries(files).length){
          //      if(bs && bs.sliderImages.length){
                 
          //         if(bs.SlideImage1 != 'null' && data.SlideImage1 != 'null')
          //             updateImage(bs,bs.SlideImage1 as string);
          //         if(bs.SlideImage2 != 'null' &&  data.SlideImage2 != 'null')
          //             updateImage(bs,bs.SlideImage2 as string);
          //         if(bs.SlideImage3 != 'null' && data.SlideImage3 != 'null')
          //             updateImage(bs,bs.SlideImage3 as string);
          //      }

          //     for(let i = 0; i<=FileFields.length-1;i++){
          //         if(files[FileFields[i]] && files[FileFields[i]][0]){
          //           const coverImageUploadData = await storeUploadPhoto(files[FileFields[i]][0],'backoffice');
          //           Images.push(coverImageUploadData);
          //       }
          //       else{
          //        if(data.SlideImage1 == 'null' && bs && bs.SlideImage1 != 'null')
          //           data.SlideImage1 = bs.SlideImage1;
          //         if(data.SlideImage2 == 'null' && bs && bs.SlideImage2 != 'null')
          //           data.SlideImage2 = bs.SlideImage2;
          //         if(data.SlideImage3 == 'null' && bs && bs.SlideImage3 != 'null')
          //           data.SlideImage3 = bs.SlideImage3;
          //       }
          //     }    
          //    data = {
          //       ...data,
          //       sliderImages:{
          //       create:Images,  
          //       },
          //     }
          //  }
          //  else{
          //   if(data.SlideImage1 == 'null' && bs && bs.SlideImage1 != 'null')
          //     data.SlideImage1 = bs.SlideImage1;
          //   if(data.SlideImage2 == 'null' && bs && bs.SlideImage2 != 'null')
          //     data.SlideImage2 = bs.SlideImage2;
          //   if(data.SlideImage3 == 'null' && bs && bs.SlideImage3 != 'null')
          //     data.SlideImage3 = bs.SlideImage3;
          //  }

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

 .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  const session = (await getSession({ req })) as unknown as Session;
  await middleware(req,res,cors)

    try {
      const backoffice =  await find({id:1});
      if (!backoffice ) {
        // res.status(404).end();
        res.status(200).json({ status: 'OK', backoffice: null });
        return;
      }
      else
            res.status(200).json({ status: 'ok', backoffice });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
 