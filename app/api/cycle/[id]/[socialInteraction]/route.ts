import { Session } from '@/src/types';
import { find, saveSocialInteraction } from '@/src/facades/cycle';
import { NextRequest, NextResponse } from 'next/server';
import { BAD_REQUEST, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import getLocale from '@/src/getLocale';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { NOTFOUND } from 'dns';

const validateReq = async (
  session: Session|null,
  id: unknown,
  socialInteraction: unknown,
) => { 
  if (session == null) {
    return NextResponse.json({error:UNAUTHORIZED})
  }

  if (
    typeof id !== 'string' ||
    typeof socialInteraction !== 'string' ||
    !['fav', 'like', 'rating'].includes(socialInteraction)
  ) {
    return NextResponse.json({error:BAD_REQUEST})
  }

  return true;
};

interface Props{
  params:{id:string;socialInteraction:string}
}
export const  POST = async (req:NextRequest, {params:{id:id_,socialInteraction}}:Props) => {
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
  const id = Number(id_)
  const body = await req.json()
    const { qty,/* notificationMessage,notificationContextURL,notificationToUsers*/ } = body;

    await validateReq(session, id, socialInteraction)

    try {
      const cycle = await find(Number(id));
      if (cycle == null) {
        return NextResponse.json({error:NOTFOUND})
      }

      // @ts-ignore arguments checked in validateReq()
      let cycleRes = await saveSocialInteraction(cycle, session.user, socialInteraction, true, qty);
      // if(socialInteraction!='rating'){
      //   const notification = await create(
      //     notificationMessage,
      //     notificationContextURL,
      //     session.user.id,
      //     notificationToUsers
      //   );
      // }
      
      // await redis.flushall();
      return NextResponse.json({cycle:cycleRes})
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR})
    } finally {
      ////prisma.$disconnect();
    }
  }
export const DELETE = async (req:NextRequest, {params:{id:id_,socialInteraction}}:Props) => {
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
  const id = Number(id_)
  await validateReq(session, id, socialInteraction)

    try {
      const cycle = await find(Number(id));
      if (cycle == null) {
        return NextResponse.json({error:NOTFOUND})
      }
      // @ts-ignore arguments checked in validateReq()
      const res = await saveSocialInteraction(cycle, session.user, socialInteraction, false);
      // await redis.flushall();
      return NextResponse.json({res})
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR})
    } finally {
      ////prisma.$disconnect();
    }
  }
