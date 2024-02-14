import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { Languages } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { findAllSumary, findAllWithoutLangRestrict } from '@/src/facades/work';
import { Prisma } from '@prisma/client';
import { prisma } from '@/src/lib/prisma';
import { SERVER_ERROR } from '@/src/api_code';
// import redis from '@/src/lib/redis';

export default getApiHandler()
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { props: p = undefined, lang: l } = req.query;

      const language = l ? Languages[l.toString()] : null;
      const props: Prisma.WorkFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())) : {};
      let { where: w, take, cursor, skip } = props;
      const session = await getSession({ req });

      let AND = w?.AND;
      delete w?.AND;
      let data = null;

      if (language) {
        let where = {
          ...w,
          AND: {
            ...(AND && { AND }),
            OR: [
              {
                language,
              },
              {
                editions: {
                  some: { language },
                },
              },
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
        data = await findAllSumary(language, session, { take, where, skip, cursor });

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
        data = await findAllWithoutLangRestrict(session,{ take, where, skip, cursor });

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
