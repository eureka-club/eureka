import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/src/lib/prisma';
import { SERVER_ERROR } from '@/src/api_code';
import { getSession } from 'next-auth/react';
import { PostSumarySpec } from '@/src/types/post';

export default async function handler(req:NextApiRequest,res:NextApiResponse){
  const session = await getSession({ req });

  try{
    const today = new Date();
    const actions = await prisma.action.findMany({
      include:{
        user:{select:{id:true,name:true,image:true,photos:true}},
        post:{select:PostSumarySpec.select}
      },
      orderBy:{
        createdAt:'desc'
      }
    });
    return res.json({actions});
  }
  catch(e){
    return res.json({error:SERVER_ERROR});
  }
}
