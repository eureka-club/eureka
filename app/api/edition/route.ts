import { NextApiRequest, NextApiResponse } from 'next';
import { Languages } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { findAll } from '@/src/facades/edition';
import { Prisma } from '@prisma/client';
import {prisma} from '@/src/lib/prisma'
import { NextRequest, NextResponse } from 'next/server';
import { SERVER_ERROR } from '@/src/api_codes';
import getLocale from '@/src/getLocale';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
// import redis from '@/src/lib/redis';

interface Props{
  params:{
    q:string;
    props:string;
  }
}
export const GET = async (req:NextRequest,{params}:Props)=>{
  try {
    const { q = null,props:p=undefined } = params;
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    const languages = session ? session.user.language?.split(',') : [Languages[locale]];
    const props:Prisma.EditionFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
    let {where:w,take,cursor,skip} = props;

    let AND = w?.AND;
    delete w?.AND;
    let where = {...w,AND:{
      ...AND && {AND},
      language:{
        in:languages
      }
    }};
    let data = null;

    let cr = await prisma?.edition.aggregate({where,_count:true})
    const total = cr?._count;
    data = await findAll({take,where,skip,cursor});

    return NextResponse.json({
      data,
      fetched:data.length,
      total
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 