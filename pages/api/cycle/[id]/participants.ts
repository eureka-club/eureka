import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '@/src/lib/getApiHandler';
import { participants } from '@/src/facades/cycle';

export default getApiHandler()  
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { id:id_} = req.query;
      const id = +id_!.toString();
      const ps = await participants(id);
      res.status(200).json({ 
         participants:ps,
       });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  });
