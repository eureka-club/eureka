import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/src/lib/prisma';
import getApiHandler from '@/src/lib/getApiHandler';
import bcrypt from 'bcryptjs'

export default getApiHandler()
.patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const { id:i} = req.query;
    if(!i){
      res.status(404).json({error:'id are required'})
    }
    const id = +i.toString()
    const {password:p} = req.body;
    if(!p){
      res.status(404).json({error:'id are required'})
    }
    const password = p.toString();
    const hash = await bcrypt.hash(password,9);

    const user = await prisma.user.update({where:{id},data:{password:hash}}); 
    const data = !!(user && user.password);
    res.status(200).json({data})   
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
