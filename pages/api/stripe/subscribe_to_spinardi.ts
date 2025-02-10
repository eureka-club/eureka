import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '@/src/lib/getApiHandler';
import {prisma} from '@/src/lib/prisma';
import { OncheckoutSessionCompleted } from './OncheckoutSessionCompleted';
import { WEBAPP_URL } from '@/src/constants';

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  try {
    const cycleTitle="Com Amor, Spinardi";
    const {identifier:e} = req.query;
    const identifier = e?.toString()||undefined;
    if (!identifier) {
      return res.status(400).json({ status: 'missing identifier' });
    }
    const email = atob(identifier.substring(1,identifier?.length))?.toString();
    const userT =  prisma.user.findFirst({where:{email}});
    const cycleT =  prisma?.cycle.findFirst({where:{title:cycleTitle}});
    const transactions = [userT,cycleT];
    const [user,cycle]:any = await prisma.$transaction(transactions);
    await OncheckoutSessionCompleted(email,user?.name!,cycle?.id!,cycleTitle);
    res.redirect(`${WEBAPP_URL}/cycle/${cycle?.id}`);
    // res.status(200).json({status:'ok'})
    
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(200).json({ status: 'server error' });
  } finally {
    ////prisma.$disconnect();
  }
});
