import { Form } from 'multiparty';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { FileUpload, Session } from '@/src/types';
import getApiHandler from '@/src/lib/getApiHandler';
import { storeUpload } from '@/src/facades/fileUpload';
import { createFromServerFields, findAll } from '@/src/facades/post';
import { create } from '@/src/facades/notification';

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
    // const include =  {
    //   creator: true,
    //   localImages: true,
    //   works: true,
    //   cycles: true,
    //   favs: true,
    //   likes: true,
    //   comments: {
    //     include: {
    //       creator: { select: { id: true, name: true, image: true } },
    //       comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
    //     },
    //   },
    // };

    try {
      
      const { q = null, where:w, id = null, take:t,skip:s,cursor:c } = req.query;

      let where = w ? JSON.parse(decodeURIComponent(w.toString())) : undefined;
      const take = t ? parseInt(t?.toString()) : undefined;
      const skip = s ? parseInt(s.toString()) : undefined;
      const cursor = c ? JSON.parse(decodeURIComponent(c.toString())) : undefined;

      const session = await getSession({ req });
    
      let data = null;
      if(session){
        where = {
          AND:{
            ... where && where.AND,
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
              (where && where.OR)||{},
              {
                cycles:{none :{}}  
              }
            ],
          },          
        }
      }
      else{
        where = {
          AND:{
            ... where && where.AND,
            OR:[
              {
                cycles:{
                  some:{
                    access:1,
                  }
                }                  
              },
              (where && where.OR)||{},
              {
                cycles:{none :{}}  
              }
            ],
          },
        }   
      }
      // if(where && !('creatorId' in where)){
      // }
      debugger;
      if (typeof q === 'string') {
        where = {
          ...where,
          OR: [{ title: { contains: q } },{topics:{contains:q}},{tags:{contains:q}}, { contentText: { contains: q } }, { creator: { name:{contains: q} } }],
          
        }
        data = await findAll({take,skip,cursor,where});
      } else if (where) {
        data = await findAll({take,where,skip,cursor});
      } else if (id) {
        data = await findAll({where:{id: parseInt(id as string, 10)}});
      } else {
        data = await findAll({take,skip,where,cursor});
      }
      
      

      data.forEach(p=>{
        p.type='post';
        let currentUserIsFav = false;
        if(session)
          currentUserIsFav = p.favs.findIndex(f=>f.id==session.user.id) > -1
        p.currentUserIsFav = currentUserIsFav;
      })

      // const posts_ = await prisma.post.findMany({
      //   select:{
      //     _count:{
      //       select:{cycles:true}
      //     }

      //   },
        
      //   where
      // })

      res.status(200).json({ 
        data, 
        fetched:data.length
        //... (take&&page) && {hasNextPage: posts_.length > take * (page+1)}
      });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      //prisma.$disconnect();
    }
  });
