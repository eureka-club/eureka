// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {prisma} from '@/src/lib/prisma'
import { emit } from 'process';
import {UserCustomData} from '@prisma/client'
const bcrypt = require('bcryptjs');


type Data = {
  data: UserCustomData|null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method=='POST'){
    const { identifier: i, password, fullName: name, joinToCycle:cycle } = req.body;
    const identifier = i.toString()
    const exist = await prisma.userCustomData.findFirst({
      where:{identifier}
    })
    if(!exist){
      const hash = await bcrypt.hash(password, 8);
      const resC = await prisma.userCustomData.create({
        data: {
          password: hash,
          name,
          identifier,
          joinToCycle: parseInt(cycle),
        },
      });
      return res.status(201).json({data:resC})
    }
    res.statusMessage ='identifier already used'
    res.status(400).json({data:null})
  }
  else if(req.method=='GET'){
    const {identifier:i} = req.query
    
    if(!i)return res.status(405).json({data:null})
    const identifier = i.toString()
    const data = await prisma.userCustomData.findUnique({
      where:{identifier}
    })
    res.status(200).json({ data: data || null })
      
  }
}
