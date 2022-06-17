import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import getApiHandler from '@/src/lib/getApiHandler';

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { identifier} = req.query; 
    if(!identifier){
      res.status(404).json({error:'email is required'})
    }
    let email = identifier.toString();
    const user = await prisma.user.findFirst({where:{email}}); 
    if(user)
      res.status(200).json({data:{isUser:true,hasPassword:!!user.password}}) 
    else
      res.status(200).json({data:{isUser:false,hasPassword:false}});
    
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
