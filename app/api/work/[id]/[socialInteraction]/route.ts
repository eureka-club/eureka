import { Session } from '@/src/types';
import { find, saveSocialInteraction } from '@/src/facades/work';
// import redis from '@/src/lib/redis';
import {create} from '@/src/facades/notification'
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { INVALID_FIELD, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import getLocale from '@/src/getLocale';
import { NextApiRequest } from 'next';

const validateReq = async (
  session: Session,
  id: unknown,
  socialInteraction: unknown
) => {
  if (session == null) {
    return NextResponse.json({error:UNAUTHORIZED});
  }

  if (
    typeof id !== 'string' ||
    typeof socialInteraction !== 'string' ||
    !['fav', 'like', 'readOrWatched', 'rating'].includes(socialInteraction)
  ) {
    return NextResponse.json({error:SERVER_ERROR});
  }

  const idNum = parseInt(id, 10);
  if (!Number.isInteger(idNum)) {
    return NextResponse.json({error:INVALID_FIELD('id')});
  }
};

interface Props{
  params:{id:string;socialInteraction:string}
}
  export async function POST(req:NextRequest,props:Props){
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    const {id,socialInteraction} = props.params;
    const {searchParams}=new URL(req.url);
    const language=searchParams.get('lang')?.split(',');

    const body = await req.json();
    const { qty,year,doCreate, notificationMessage,notificationContextURL,notificationToUsers } = body;

    validateReq(session!, id, socialInteraction)

    try {
      const work = await find(Number(id),language!);
      if (work == null) {
        return NextResponse.json({error:NOT_FOUND});
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(work, session.user, socialInteraction, doCreate, qty, year);
      if(doCreate && notificationMessage && notificationContextURL)
        await create(
          notificationMessage,
          notificationContextURL,
          session?.user.id!,
          notificationToUsers
        );

      // await redis.flushall();
      return NextResponse.json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  }

  export async function DELETE(req:NextRequest,props:Props) {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    const {id,socialInteraction} = props.params;
    const {searchParams}=new URL(req.url);
    const language=searchParams.get('lang')?.split(',');

    validateReq(session!, id, socialInteraction)

    try {
      const work = await find(Number(id),language!);
      if (work == null) {
        return NextResponse.json({error:NOT_FOUND});
      }

      // @ts-ignore arguments checked in validateReq()
      await saveSocialInteraction(work, session.user, socialInteraction, false);
      // await redis.flushall();
      return NextResponse.json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  }
