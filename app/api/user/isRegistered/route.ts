import {prisma} from '@/src/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { MISSING_FIELD, SERVER_ERROR } from '@/src/api_codes';

export const GET = async (req:NextRequest) => {
  try {
    const { searchParams} = new URL(req.url); 
    const identifier = searchParams.get('identifier');

    if(!identifier){
      return NextResponse.json({error:MISSING_FIELD('email')});
    }
    let email = identifier.toString();
    const user = await prisma.user.findFirst({where:{email},include:{accounts:{select:{provider :true}}}}); 
    if(user){
      const provider = user?.accounts.length ? user.accounts[0].provider : null;
      return NextResponse.json({isUser:true,provider,hasPassword:!!user.password}) 
    }
    else
      return NextResponse.json({isUser:false,hasPassword:false});
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 
