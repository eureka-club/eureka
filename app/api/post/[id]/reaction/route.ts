import { find } from '@/src/facades/post';
import { NextRequest, NextResponse } from 'next/server';
import getLocale from '@/src/getLocale';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { BAD_REQUEST, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import { NOTFOUND } from 'dns';
import { create, remove, update } from '@/src/facades/postReaction';

const MAX_REACTIONS = 2;
interface Props {
  params:{id:string}
}
export const POST = async (req:NextRequest, props:Props) => {
  const locale = getLocale(req)
  const session = await getServerSession(auth_config(locale))
  if (session == null) {
    return NextResponse.json({error:UNAUTHORIZED});
  }
    const { id:id_ } = props.params;
    const id = parseInt(id_);

    const {emoji,unified} = await req.json();

    try {
      const post = await find(Number(id));
      if (post == null) {
        return NextResponse.json({error:NOTFOUND})
      }
      const reactions_per_current_user = post.reactions.filter(r=>r.userId==session.user.id)
      if(reactions_per_current_user.length<MAX_REACTIONS){
        let result = await create({
          postId:post.id,
          userId:session.user.id,
          emoji,
          unified
        });
        return NextResponse.json({result})
      }
      else{
        return NextResponse.json({error:BAD_REQUEST})
      }
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR})
    } finally {
      //prisma.$disconnect();
    }
  }
export const PATCH = async (req:NextRequest, props:Props) => {
  const locale = getLocale(req)
  const session = await getServerSession(auth_config(locale))
  if (session == null) {
    return NextResponse.json({error:UNAUTHORIZED});
  }
  const { id:id_ } = props.params;
  const id = parseInt(id_);

  const data = await req.formData();
  const emoji = data.get('emoji')?.toString()!

  try {
    const post = await find(Number(id));
    if (post == null) {
      return NextResponse.json({error:NOTFOUND})
    }
    let result = await update(post.id,session.user.id,emoji);
    return NextResponse.json({result})
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({error:SERVER_ERROR})
  } finally {
    //prisma.$disconnect();
  }
}
export const DELETE = async (req:NextRequest, props:Props) => {
  const locale = getLocale(req)
  const session = await getServerSession(auth_config(locale))
  if (session == null) {
    return NextResponse.json({error:UNAUTHORIZED});
  }
  const { id:id_ } = props.params;
  const id = parseInt(id_);

  const data = await req.formData();
    const emoji = data.get('emoji')?.toString()!
    const unified = data.get('unified')?.toString()!

    try {
      const post = await find(Number(id));
      if (post == null) {
        return NextResponse.json({error:NOTFOUND})
      }
      const result = await remove(session.user.id,post.id,unified);
      return NextResponse.json({ result });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error:SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}
