
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll, findAllWithoutLangRestrict } from '@/src/facades/work';
import { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { NOT_COVER_IMAGE_RECEIVED, SERVER_ERROR, UNAUTHORIZED } from '@/src/response_codes';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import auth_config from 'auth_config';
import { CreateWorkServerFields } from '@/src/types/work';
import getLocale from '@/src/getLocale';
// import redis from '@/src/lib/redis';

export async function GET(req:NextRequest){
  try {debugger;
    const { searchParams } = new URL(req.url)
    const lang = getLocale(req);
    const p = searchParams.get('props');
    const props: Prisma.WorkFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())) : {};
    let { where: w, take, cursor, skip } = props;

      let AND = w?.AND;
      delete w?.AND;
      let data = null;

      if (lang) {
        let where = {
          ...w,
          AND: {
            ...(AND && { AND }),
            ... lang && {
              OR: [
                {language:lang},
                {
                  editions: {
                    some: { language:lang },
                  }
                }
              ],
            }
          },
        };

        let cr = await prisma?.work.aggregate({ where, _count: true });
        const total = cr?._count;
        data = await findAll(lang, { take, where, skip, cursor });

        return NextResponse.json({
          data,
          fetched: data.length,
          total,
        });
      } else {
        let where = {
          ...w,
        };
        let cr = await prisma?.work.aggregate({ where, _count: true });
        const total = cr?._count;
        data = await findAllWithoutLangRestrict({ take, where, skip, cursor });

        return NextResponse.json({
          data,
          fetched: data.length,
          total,
        });
      }
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ status: SERVER_ERROR, error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}

export async function POST(req:NextRequest){
  const locale = getLocale(req);
  const session = await getServerSession(auth_config(locale));
  if (session == null) {
    return NextResponse.json({ error: UNAUTHORIZED });
  }
  const data = await req.formData();
  const cover:File = data.get('cover') as File;

  if (cover == null) {
    return NextResponse.json({ error: NOT_COVER_IMAGE_RECEIVED });
  }
  
  data.delete('cover');
  
  try {
      let fieldsA: Partial<CreateWorkServerFields>={};
      for(let [k,v] of Array.from(data))
        fieldsA={...fieldsA,[k]:v}; 
        fieldsA['creatorId'] = session.user.id;
      fieldsA.publicationYear = new Date(fieldsA.publicationYear!);

      const uploadData = await storeUpload(cover);
      const { work, error } = await createFromServerFields(fieldsA as CreateWorkServerFields, uploadData);
      if (work) return NextResponse.json({ work, error });
      return NextResponse.json({ work, error });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 
