import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '@/src/types';
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

        const uploadData = await storeUpload(image);
        const post = await createFromServerFields(fields, uploadData, session.user.id);
        
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
      const { q = null, props:p="" } = req.query;
      const props:Prisma.PostFindManyArgs = p ? JSON.parse(decodeURIComponent(p.toString())):{};
      let {where:w,take,cursor,skip,select} = props;
      const session = await getSession({ req });
      let where:Prisma.PostWhereInput = {...w}
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

      let OR = undefined;
      if(session){
        const AND = {
          OR:[
            {
              cycles:{
                some:{
                  OR:[
                    {access:1},
                    {creatorId:session?.user.id},
                    {participants:{some:{id:session?.user.id}}},  
                  ]
                }
              }
            },
            {
              cycles:{
                none:{}
              }
            }
          ],
          ... session?.user.language && {language:session?.user.language}
        }
        where = {
          ...where,
          ...where.AND 
          ? {
            AND:{
              ...where.AND,
              ...AND
            }
          } 
          : {
            AND
          }
          
        }
      }
      else{
        const AND={
          OR:[
            {
              cycles:{
                some:{
                  access:1,
                }
              }

            },
            {
              cycles:{
                none:{}
              }
            }
          ]
        }
        where = {...where,
          ...where.AND 
          ? {
            AND:{
              ...where.AND,
              ...AND
            }
          } 
          : {
            AND
          }
          
        }
      }
      // if(where.OR){
      //   const whereOR = [...(where.OR as Array<Prisma.PostWhereInput>)];
      //   delete where.OR;
      //   where = {
      //     ...where,
      //     OR:[...whereOR,...OR]
      //   }   
      // }
      // else{
      //   where = {
      //     ...where,
      //     OR
      //   }
      // }

      let cr = await prisma?.post.aggregate({where,_count:true})
      const total = cr?._count;
      
      let data = await findAll({select,take,where,skip,cursor});

      data.forEach(p=>{
        p.type='post';
        let currentUserIsFav = false;
        if(session)
          currentUserIsFav = p.favs.findIndex(f=>f.id==session.user.id) > -1
        p.currentUserIsFav = currentUserIsFav;
      })

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

