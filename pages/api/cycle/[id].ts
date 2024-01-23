import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { Cycle } from '@prisma/client';
import getApiHandler from '@/src/lib/getApiHandler';
import { find, participants as cycleParticipants, remove } from '@/src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import {storeDeleteFile, storeUpload} from '@/src/facades/fileUpload'
import { Form } from 'multiparty';
// import redis from '@/src/lib/redis';
export const config = {
  api: {
    bodyParser: false,
  },
};


dayjs.extend(utc);
export default getApiHandler()
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = await getSession({ req });
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).end({ status: 'Unauthorized' });
    }
    
    try {
      const { id:id_ } = req.query;
      const id = parseInt((id_||'').toString());
      if(!isNaN(id)){
        const cycle = await find(id);
        if(cycle && cycle.localImages.length){
          const rmf = await storeDeleteFile(cycle.localImages[0].storedFile);
          if(!rmf){
            res.statusMessage = 'Removing image has failed';
            res.status(500).end();
          }
          else {
            let c = await remove(cycle);
            if(c)
              res.status(200).json({ status: 'OK' });
            else 
              res.status(404).end();        
          }
        }
      }
      else
        res.status(404).end();        
      // await redis.flushall();
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      ////prisma.$disconnect();
    }
  })
  .get<NextApiRequest, NextApiResponse>(async (req, res) => {
    const session = await getSession({ req }) ;
    try {
      const {id:id_} = req.query
      const id = parseInt((id_||'').toString())
      if(!isNaN(id)){
        const cycle = await find(id);
        
        if (cycle) {
          let ratingCount = cycle.ratings.length;
          const ratingAVG = cycle.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount;

          let currentUserIsParticipant = false;
          let currentUserIsCreator = false;
          let currentUserIsPending = false;
          let currentUserRating = 0;
          if(session){
            currentUserIsCreator = cycle.creatorId == session.user.id
            const c = await find(id)
            if(c){
              const participants = await cycleParticipants(c.id);
              currentUserIsParticipant =  currentUserIsCreator || participants.findIndex(p=>p.id==session.user.id) > -1;
              currentUserIsPending = c.usersJoined.findIndex(p=>p.userId==session.user.id && p.pending) > -1;
              let r  = c.ratings.find(r=>r.userId==session.user.id)
              if(r)currentUserRating = r.qty;
            }
            
          }
          cycle.currentUserIsParticipant = currentUserIsParticipant;
          cycle.currentUserIsCreator = currentUserIsCreator;
          cycle.currentUserIsPending = currentUserIsPending;
          cycle.currentUserRating = currentUserRating;
          cycle.ratingCount = ratingCount;
          cycle.ratingAVG = ratingAVG;
          res.status(200).json({ ok: true, cycle });
        }
        else
          res.status(200).json({ ok: true, cycle: null });
      }
      else
        res.status(404).json({ ok: false, cycle: null });

    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ ok: false, error: 'server error',cycle:null });
    } finally {
      ////prisma.$disconnect();
    }
  })
  .patch<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {//TODO not update with prisma, /faced/cycle -> update must be used !!!
    const session = await getSession({ req });
    if (session == null || !session.user.roles.includes('admin')) {
      res.status(401).end({ status: 'Unauthorized' });
    }
    new Form().parse(req, async (err, fields, files) => {
      let cover = null;
      const id = fields.id.length && +fields.id[0];
      const access = fields?.access.length && +fields.access[0];
      const startDate = fields?.startDate.length && dayjs(`${fields.startDate[0]}`, 'YYYY').utc().format();
      const endDate = fields?.endDate.length && dayjs(`${fields.endDate[0]}`, 'YYYY').utc().format();
      const includedWorksIds = fields?.includedWorksIds && fields?.includedWorksIds.length && fields.includedWorksIds[0];
      const cycle = await find(id);
      let li = null;
      if (files?.coverImage?.length && cycle) {
        const storedFile = cycle.localImages[0].storedFile;
        const deleted = await storeDeleteFile(storedFile);
        if(deleted){
          li = await prisma.localImage.findFirst({where:{storedFile}});
          if(li){
            await prisma.cycle.update({where:{id},data:{
              localImages:{disconnect:{id:li.id}}
            }});
            await prisma.localImage.delete({where:{id:li.id}});
            cover = await storeUpload(files?.coverImage[0]);
          }
        }
      }
      try {
        let r: Cycle;
        if (includedWorksIds?.length) {
          r = await prisma.cycle.update({
            where: { id },
            data: {
              updatedAt: dayjs().utc().format(),
              works: { connect: includedWorksIds.map((workId: number) => ({ id: workId })) },
              cycleWorksDates: {
                createMany:{
                  data:includedWorksIds.map((workId: number) => ({ 
                    workId,
                    startDate: dayjs().utc().format(),
                    endDate: dayjs().utc().format()
                  }))
                }
              },
              
            },
          });
        } 
        else {
          let title = fields?.title ? fields?.title[0] : undefined;
          let languages = fields?.languages ? fields?.languages[0] : undefined;
          let countryOfOrigin = fields?.countryOfOrigin ? fields?.countryOfOrigin[0] : undefined;
          let contentText = fields?.contentText ? fields?.contentText[0] : undefined;
          let tags = fields?.tags ? fields?.tags[0] : undefined;
          let topics = fields?.topics ? fields?.topics[0] : undefined;
          const data = {
            ...access && {access:access},
            ...startDate && {startDate},
            ...endDate && {endDate},
            ...title && {title},
            ...languages && {languages},
            ...countryOfOrigin && {countryOfOrigin},
            ...contentText && {contentText},
            ...tags && {tags},
            ...topics && {topics},
            ...cover && {
              localImages:{
                create:{
                  ...cover
                },
              }
            },
            
          }
          r = await prisma.cycle.update({ where: { id }, data });
        }
        // await redis.flushall();
        return res.status(200).json({ ...r });
      } catch (exc) {
        console.error(exc); // eslint-disable-line no-console
        res.status(500).json({ status: 'server error' });
      } finally {
        ////prisma.$disconnect();
      }

    });



    
  });
