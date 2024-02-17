import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '@/src/lib/getApiHandler';
import { findAllSumary } from '@/src/facades/user';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { where:w = null,take:t,skip:s,cursor:c } = req.query;
    
    const where = w ? JSON.parse(decodeURIComponent(w.toString())) : undefined;
    const take = t ? parseInt(t?.toString()) : undefined;
    const skip = s ? parseInt(s.toString()) : undefined;
    const cursor = c ? JSON.parse(decodeURIComponent(c.toString())) : undefined;

    const data = await findAllSumary({where,take,skip,cursor}); 
    // data.forEach(u=>{u.type='user'})
    res.status(200).json({
      data,
      fetched:data.length
    })   
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
