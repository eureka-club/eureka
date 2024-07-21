import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import { SERVER_ERROR } from '@/src/api_code';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  try{
    const today = new Date();
    const actives = await prisma.cycle.findMany({
      where:{
        startDate:{
          lte:today
        },
        endDate:{
          gte:today
        }
      },
      select:{
        id:true,
        title:true,
        contentText:true,
        startDate:true,
        endDate:true,
        creator:{select:{id:true,name:true,image:true,photos:true}},
        localImages:{select:{storedFile:true}}
      }
    });
    return res.json({actives});
  }
  catch(e){
    return res.json({error:SERVER_ERROR});
  }
}
