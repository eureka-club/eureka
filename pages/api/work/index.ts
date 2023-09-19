import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Languages, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll, findAllWithoutLangRestrict } from '@/src/facades/work';
import { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { NOT_COVER_IMAGE_RECEIVED, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_code';
// import redis from '@/src/lib/redis';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(200).json({ status: UNAUTHORIZED });
      return;
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(200).json({ status: SERVER_ERROR, error: SERVER_ERROR });
        return;
      }
      if (files?.cover == null) {
        res.status(200).json({ error: NOT_COVER_IMAGE_RECEIVED });
        return;
      }

      const coverImage: FileUpload = files.cover[0];
      try {
        const uploadData = await storeUpload(coverImage);
        const fieldsA = { ...fields, creatorId: [session.user.id] };
        const { work, error } = await createFromServerFields(fieldsA, uploadData);
        if (work) return res.status(201).json({ work, error });
        return res.status(200).json({ work, error });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(200).json({ status: SERVER_ERROR, error: SERVER_ERROR });
      } finally {
        //prisma.$disconnect();
      }
    });
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { q = null, props: p = undefined, language: l } = req.query;
      const languages:string[] = l?.toString().split(',')||[];

      const props: Prisma.WorkFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())) : {};
      let { where: w, take, cursor, skip } = props;
      const session = await getSession({ req });

      let AND = w?.AND;
      delete w?.AND;
      let data = null;

      if (languages?.length) {
        let where = {
          ...w,
          AND: {
            ...(AND && { AND }),
            OR: [
              ... languages.map(language=>({language})),
              ... languages.map(language=>({
                editions: {
                  some: { language },
                }
              }))
            ],
          },
        };
        // if (typeof q === 'string') {
        //   const terms = q.split(" ");
        //   where = {

        //     OR:[
        //       {
        //         AND:terms.map(t=>(
        //           {
        //             title: { contains: t }
        //           }
        //         ))

        //       },
        //       {
        //         AND:terms.map(t=>(
        //           {
        //             contentText: { contains: t }
        //           }
        //         ))

        //       },
        //       {
        //         AND:terms.map(t=>(
        //           {
        //              topics: { contains: t }
        //           }
        //         ))
        //       },
        //       {
        //         AND:terms.map(t=>(
        //           {
        //              author: { contains: t }
        //           }
        //         ))
        //       }
        //     ]
        //   };

        // }

        let cr = await prisma?.work.aggregate({ where, _count: true });
        const total = cr?._count;
        data = await findAll(languages, { take, where, skip, cursor });

        res.status(200).json({
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
        data = await findAllWithoutLangRestrict(languages,{ take, where, skip, cursor });

        res.status(200).json({
          data,
          fetched: data.length,
          total,
        });
      }
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(200).json({ status: SERVER_ERROR, error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  });
