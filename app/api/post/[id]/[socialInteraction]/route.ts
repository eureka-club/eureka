import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { Session } from '@/src/types';
import { find, saveSocialInteraction } from '@/src/facades/post';
import { NextRequest, NextResponse } from 'next/server';
import getLocale from '@/src/getLocale';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { BAD_REQUEST, INVALID_FIELD, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import { NOTFOUND } from 'dns';
// import {create} from '@/src/facades/notification'

const validateReq = async (
  session: Session|null,
  id: unknown,
  socialInteraction: unknown,
) => {
  if (session == null) {
    return NextResponse.json({ error: UNAUTHORIZED });
  }

  if (
    typeof id !== 'string' ||
    typeof socialInteraction !== 'string' ||
    (socialInteraction !== 'fav' && socialInteraction !== 'like')
  ) {
    return NextResponse.json({error:BAD_REQUEST});
  }

  const idNum = parseInt(id, 10);
  if (!Number.isInteger(idNum)) {
    return NextResponse.json({error:INVALID_FIELD('id')});
  }

  return true;
};
interface Props{
  params:{
    id:string;
    socialInteraction:string;
  }
}
export const  POST = async (req:NextRequest, props:Props) => {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    const { id, socialInteraction } = props.params;
    // const { notificationMessage,notificationContextURL,notificationToUsers } = req.body;

    if (!(await validateReq(session, id, socialInteraction))) {
      return;
    }

    try {
      const post = await find(Number(id));
      if (post == null) {
        return NextResponse.json({error:NOTFOUND})
      }

      // @ts-ignore arguments checked in validateReq()
      const res = await saveSocialInteraction(post, session.user, socialInteraction, true);
      // const notification = await create(
      //   notificationMessage,
      //   notificationContextURL,
      //   session.user.id,
      //   notificationToUsers
      // );

      return NextResponse.json({post:res});
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR});
    } finally {
      //prisma.$disconnect();
    }
  }
  export const DELETE  = async (req:NextRequest, props:Props) => {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    const { id, socialInteraction } = props.params;

    if (!(await validateReq(session, id, socialInteraction))) {
      return;
    }

    try {
      const post = await find(Number(id));
      if (post == null) {
        return NextResponse.json({error:NOTFOUND})
      }

      // @ts-ignore arguments checked in validateReq()
      const res = await saveSocialInteraction(post, session.user, socialInteraction, false);
      return NextResponse.json({post:res});
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR});

    } finally {
      //prisma.$disconnect();
    }
  }
