import {prisma} from '@/src/lib/prisma'
import {UserCustomData} from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server';
import { MISSING_FIELD, USER_REGISTERED } from '@/src/api_codes';
const bcrypt = require('bcryptjs');

type Data = {
  data: UserCustomData|null
}

export const POST = async (req:NextRequest)=>{
  const body = await req.json();
  const { identifier: i, password, fullName: name, joinToCycle:cycle } = body;
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
          ... !!cycle && {joinToCycle: parseInt(cycle)},
        },
      });
      return NextResponse.json({data:resC})
    }
    return NextResponse.json({error:USER_REGISTERED})
}

export const GET = async (req:NextRequest)=>{
  const {searchParams} = new URL(req.url);
  const i = searchParams.get('identifier');
    
    if(!i)return NextResponse.json({error:MISSING_FIELD('Identifier')});
    const identifier = i.toString();
    const data = await prisma.userCustomData.findUnique({
      where:{identifier}
    })
    return NextResponse.json({ data: data || null })
}
