import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { FileUpload, Languages, Session, StoredFileUpload } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import { asyncForEach } from '@/src/lib/utils';
import { Prisma } from '@prisma/client';
import {cors,middleware} from '@/src/lib/cors'

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    new Form().parse(req, async (err, fields, files) => {
      if (err != null) {
        console.error(err); // eslint-disable-line no-console
        res.status(500).json({ status: 'Server error' });
        return;
      }
      if (files?.coverImage == null) {
        res.status(422).json({ error: 'No cover image received' });
        return;
      }

      try {
        const { coverImage, ...complementaryMaterialsFiles } = files;
        const coverImageUploadData = await storeUpload(coverImage[0]);
        const complementaryMaterialsUploadData: Record<string, StoredFileUpload> = {};
        await asyncForEach(
          Object.entries(complementaryMaterialsFiles),
          async ([cmIndexName, cmFile]: [string, FileUpload[]]) => {
            complementaryMaterialsUploadData[cmIndexName] = await storeUpload(cmFile[0]);
          },
        );
        const cycleWorksDates = JSON.parse(fields.cycleWorksDates).map(
          (cw: { workId: string; startDate: string | number | Date; endDate: string | number | Date }) => ({
            workId: parseInt(cw.workId, 10),
            startDate: new Date(cw.startDate),
            endDate: new Date(cw.endDate),
          }),
        );

        const cycle = await createFromServerFields(
          session.user.id,
          fields,
          coverImageUploadData,
          complementaryMaterialsUploadData,
          JSON.parse(fields.guidelines),
          cycleWorksDates,
        );
        // await redis.flushall();
        res.status(201).json(cycle);
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ error: 'server error' });
      } finally {
        //prisma.$disconnect();
      }
    });
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    try {
      await middleware(req,res,cors)
      const session = (await getSession({ req })) as unknown as Session;

      const { q = null,props:p=undefined,lang:l } = req.query;
      const language = Languages[l?.toString()!];

      const props:Prisma.CycleFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
      let {where:w,take,cursor,skip} = props;
      let AND = w?.AND;
      delete w?.AND;
      let where = {...w,
        AND:{
          ... AND && {AND},
          languages:{contains:language}
        }
        // ... session?.user.language && {languages:{contains:session?.user.language}},
      };
      let data = null;
      
      // if (typeof q === 'string') {
      //   const terms = q.split(" ");
      //   where={
      //     AND:{
      //       ... where && where,
      //       OR:[
      //         {
      //           AND:terms.map(t=>(
      //             { 
      //               title: { contains: t } 
      //             }
      //           ))
    
      //         },
      //         {
      //           AND:terms.map(t=>(
      //             { 
      //               contentText: { contains: t } 
      //             }
      //           ))
    
      //         },
      //         {
      //           AND:terms.map(t=>(
      //             { 
      //                tags: { contains: t } 
      //             }
      //           ))
      //         },
      //         {
      //           AND:terms.map(t=>(
      //             { 
      //                topics: { contains: t } 
      //             }
      //           ))
      //         }
      //       ],
      //     ... session?.user.language && {languages:{contains:session?.user.language}},
      //     }
      //   };
      // } 
      
      let cr = await prisma?.cycle.aggregate({where,_count:true})
      const total = cr?._count;
      data = await findAll({take,where,skip,cursor});

      data.forEach((c) => {
          c.type ='cycle';
      }); 
      res.status(200).json({
        data,
        fetched:data.length,
        total,
      });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
