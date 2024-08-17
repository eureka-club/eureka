import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import { SERVER_ERROR } from '@/src/api_code';
// import { getSession } from 'next-auth/react';
import { PostSumarySpec } from '@/src/types/post';
import { WorkSumarySpec } from '@/src/types/work';
import { CycleSumarySpec } from '@/src/types/cycle';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  // const session = await getSession({ req });

  try{
    const{skip:skip_,take:take_}=req.query;
    const skip = skip_ ? +skip_! : undefined;
    const take = take_ ? +take_! : +process.env.NEXT_PUBLIC_TAKE!;

    const today = new Date();
    const daysToMilliseconds = ()=>{
      return 1*1000*60*60*24*(+process.env.DAYS_FOR_FEED!);
    }
    const till = new Date(today.getTime()-daysToMilliseconds());
    const actions = await prisma.action.findMany({
      skip,
      take,
      include:{
        user:{select:{id:true,name:true,image:true,photos:true}},
        post:{select:PostSumarySpec.select},
        work:{select:WorkSumarySpec.select},
        cycle:{select:CycleSumarySpec.select}
      },
      orderBy:{
        createdAt:'desc'
      },
      where:{
        createdAt:{
          lte:today,
          gte:till
        }
      }
    });
    const total = await prisma.action.count();
    
    return res.json({actions,total});
  }
  catch(e){
    return res.json({error:SERVER_ERROR});
  }
}
