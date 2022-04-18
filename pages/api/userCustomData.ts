// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/src/lib/prisma'
import { emit } from 'process';
import {UserCustomData} from '@prisma/client'
type Data = {
  data: UserCustomData|null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method=='POST'){
    debugger;
    const {identifier:i,password,fullName:name} = req.body;
    const identifier = i.toString()
    const exist = await prisma.userCustomData.findUnique({
      where:{identifier}
    })
    if(!exist){
      const resC = await prisma.userCustomData.create({
        data:{
          password,
          name,
          identifier,
        }
      })
      return res.status(201).json({data:resC})
    }
    res.statusMessage ='identifier already used'
    res.status(400).json({data:null})
  }
  else if(req.method=='GET'){
    const {identifier:i} = req.query
    const identifier = i.toString()
    const data = await prisma.userCustomData.findUnique({
      where:{identifier}
    })
    res.status(200).json({ data: data || null })
      
  }
}
