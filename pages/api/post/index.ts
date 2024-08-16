import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { ActionType, FileUpload, Languages, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/post';
import { create } from '@/src/facades/notification';
import {prisma} from '@/src/lib/prisma'
import { Prisma } from '@prisma/client';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }
    try {
      new Form().parse(req, async (err, fields, files) => {
        if (err != null) {
          console.error(err); // eslint-disable-line no-console
          res.status(500).json({ ok: false, error: 'Server error' });
          return;
        }
        if (files?.image == null) {
          res.status(422).json({ ok: false, error: 'No image received' });
          return;
        }

        const image: FileUpload = files.image[0];
        const cycleId = +fields.selectedCycleId;
        const workId = +fields.selectedWorkId;
        
        const uploadData = await storeUpload(image);
        const post = await createFromServerFields(fields, uploadData, session.user.id);

        if(cycleId){
          const today = new Date();

          const cycleActive=await prisma.cycle.findFirst({
            where:{
              id:cycleId,
              startDate:{
                lte:today
              },
              endDate:{
                gte:today
              }
            },
            select:{id:true}
          });
          if(cycleActive)
            await prisma.action.create({
              data:{
                cycleId,
                postId:+post.id,
                type:ActionType.PostCreatedOnCycleActive,
                userId:session.user.id,
              }
            });
        }
        else if(workId){
          await prisma.action.create({
            data:{
              workId,
              postId:+post.id,
              type:ActionType.PostCreatedOnWork,
              userId:session.user.id,
            }
          });
        }
        
        const notificationToUsers = fields.notificationToUsers 
          ? fields.notificationToUsers[0].split(',').filter((i:string)=>i!='').map((i:string) => +i)
          : null;
        if(notificationToUsers && notificationToUsers.length){
          const notification = await create(
            fields.notificationMessage[0],
            fields.notificationContextURL[0]+`/${post.id}`,
            session.user.id,
            fields.notificationToUsers[0].split(',').map((i:string) => +i),
          );
          res.status(201).json({ post, notification });
          return;
        }
        res.status(201).json({ post, notification:null });
      });
    } catch (excp) {
      /* const excpMessageTokens = excp.message.match(/\[(\d{3})\] (.*)/);
      if (excpMessageTokens != null) {
        res.status(excpMessageTokens[1]).json({ status: 'client error', error: excpMessageTokens[2] });
        return;
      }
 */
      console.error(excp); // eslint-disable-line no-console
      res.statusMessage = 'server error';
      res.status(500).end();
    } finally {
      //prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    try {
      const { q = null, props:p=""} = req.query;
      // const locale = l?.toString();
      // const language = locale ? Languages[locale!] : '';
 
      const props:Prisma.PostFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
      let {where:w,take,cursor,skip,select} = props;
      const session = await getSession({ req });
      let AND = w?.AND;
      delete w?.AND;
      let where:Prisma.PostWhereInput = {...w,AND:{
        ... AND && {AND},
        // ... language && {language}
      }}
      if (typeof q === 'string') {
        const terms = q.split(" ");
        where = {
          OR:[
            {
              AND:terms.map(t=>(
                { 
                  title: { contains: t } 
                }
              ))
  
            },
            {
              AND:terms.map(t=>(
                { 
                  contentText: { contains: t } 
                }
              ))
  
            },
            {
              AND:terms.map(t=>(
                { 
                   topics: { contains: t } 
                }
              ))
            },
          ]
        };
      }

      let cr = await prisma?.post.aggregate({where,_count:true})
      const total = cr?._count;
      let data = await findAll(session?.user.id!,{select,take,where,skip,cursor});

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

