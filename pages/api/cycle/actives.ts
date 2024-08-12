import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import { SERVER_ERROR } from '@/src/api_code';
import { getSession } from 'next-auth/react';
import { CycleAcces } from '@/src/constants';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const session = await getSession({ req });

  try{
    const today = new Date();
    const actives = await prisma.cycle.findMany({
      where:{
        ...!session?.user.id
        ?{
          OR:[
            {access:CycleAcces.public},
          ]
        }
        :{
          OR:[
            {access:CycleAcces.public},
            {participants:{
              some:{
                id:session?.user.id
              }
            }},
            {creatorId:session?.user.id}
          ]
        },
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
