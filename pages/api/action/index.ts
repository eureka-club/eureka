import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import { SERVER_ERROR } from '@/src/api_code';
// import { getSession } from 'next-auth/react';
// import { PostSumarySpec } from '@/src/types/post';
// import { WorkSumarySpec } from '@/src/types/work';
// import { CycleSumarySpec } from '@/src/types/cycle';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  // const session = await getSession({ req });

  try{
    const{skip:skip_,total:total_}=req.query;
    const skip = skip_ ? +skip_! : undefined;
    const take = +process.env.NEXT_PUBLIC_TAKE!;
    let total=total_ ? +total_ : 0;

    // const today = new Date();
    // const daysToMilliseconds = ()=>{
    //   return 1*1000*60*60*24*(+process.env.DAYS_FOR_FEED!);
    // }
    // const till = new Date(today.getTime()-daysToMilliseconds());
    const actions = await prisma.action.findMany({
      skip,
      take,
      include:{
        user:{select:{id:true,name:true,image:true,photos:true}},
        // post:{select:PostSumarySpec.select},
        // work:{select:WorkSumarySpec.select},
        // cycle:{select:CycleSumarySpec.select}
      },
      orderBy:{
        createdAt:'desc'
      },
      // distinct:['page_id','type'],
      // where:{
      //   createdAt:{
      //     lte:today,
      //     gte:till
      //   }
      // }
    });
    
    if(!total)
      total = await prisma.action.count({
        // where:{
        //   createdAt:{
        //     lte:today,
        //     gte:till
        //   }
        // }
      });
    
    let nextSkip = (skip??0)+take < total ? (skip??0) + take: undefined;

    return res.json({actions,nextSkip,total});
  }
  catch(e){
    return res.json({error:SERVER_ERROR});
  }
}
