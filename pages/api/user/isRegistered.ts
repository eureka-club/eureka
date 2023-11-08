import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import getApiHandler from '@/src/lib/getApiHandler';

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { identifier} = req.query; 
    if(!identifier){
      return res.status(404).json({error:'email is required'})
    }
    let email = identifier.toString();
    const user = await prisma.user.findFirst({where:{email},include:{accounts:{select:{provider :true}}}}); 
    if(user){
      const provider = user?.accounts.length ? user.accounts[0].provider : null;
      res.status(200).json({isUser:true,provider,hasPassword:!!user.password}) 
    }
    else
      res.status(200).json({isUser:false,hasPassword:false});
    
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
