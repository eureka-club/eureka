import { NextApiRequest, NextApiResponse } from 'next';
import { findSumary } from '@/src/facades/user';
import { UserSumary } from '@/src/types/UserSumary';

export default async (req:NextApiRequest, res:NextApiResponse): Promise<void> => {
  try {
    const { id:id_,language:l} = req.query;
  
    const id = parseInt(id_ as string, 10)
    const user = await findSumary(id);

    if(user)
      (user as unknown as UserSumary).type = "user";

    res.status(200).json({ user });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ error: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
}