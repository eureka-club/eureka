import { NextApiRequest, NextApiResponse } from 'next';
import { Form } from 'multiparty';
import { getSession } from 'next-auth/react';
import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { find,create,update, removeSlide } from '@/src/facades/backoffice';
import {storeDeleteFile, storeUploadPhoto} from '@/src/facades/fileUpload'
import { backOfficeData } from '@/src/types/backoffice';
import {cors,middleware} from '@/src/lib/cors'
import { SERVER_ERROR, UNAUTHORIZED } from '@/src/api_code';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
 .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  const session = (await getSession({ req })) as unknown as Session;
  await middleware(req,res,cors)

    try {
      if(session){debugger;
        const {slideId:id_} = req.query
        const id = +id_!;
        const slide = await removeSlide(id);
        if (!slide ) {
          res.status(200).json({ error:SERVER_ERROR });
        }
        else{
          const image = slide.images[0];
          await storeDeleteFile(image.storedFile,'backoffice')
          res.status(200).json({slide});
        }
      }
      else
        res.status(200).json({ error:UNAUTHORIZED });

    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  })
 