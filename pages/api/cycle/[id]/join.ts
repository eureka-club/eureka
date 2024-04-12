import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import getT from 'next-translate/getT';
import { WEBAPP_URL } from '../../../../src/constants';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { addParticipant, find, removeParticipant } from '../../../../src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import { sendMailRequestJoinCycle } from '../../../../src/facades/mail';
import {create} from '@/src/facades/notification'
import { find as findUser } from '@/src/facades/user';
const bcrypt = require('bcryptjs');

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    // const session = await getSession({ req });
    const session = await getSession({req});
    const {userId:ui}=req.body;
    if (session == null && !ui) {
      res.statusMessage = 'unauthorized';
      return res.status(400).end();      
    }
    const userId = session?.user.id ?? +ui;
    const { id } = req.query;
    const {notificationMessage,notificationContextURL,notificationToUsers} = req.body;
    if (typeof id !== 'string') {
      res.statusMessage = 'id is required';
      return res.status(400).end();
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(404).end();
      return;
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        res.status(404).end();
        return;
      }
      const user = await findUser({where:{id:userId}});

      if (user && cycle.access === 2) {
        const params = `${cycle.id}!|!${userId}`;
        const hash = bcrypt.hashSync(params, 8);
        const base64Hash = Buffer.from(hash, 'binary').toString('base64');
        const authorizeURL = `${WEBAPP_URL}/api/cycle/${cycle.id}/${userId}/${base64Hash}/1`;
        const denyURL = `${WEBAPP_URL}/api/cycle/${cycle.id}/${userId}/${base64Hash}/0`;
        const applicantMediathequeURL = `${WEBAPP_URL}/mediatheque/${userId}`;
        const locale = req.cookies.NEXT_LOCALE;
        const t = await getT(locale, 'cycleJoin');

        const title = `${t('Hello')} ${cycle.creator.name}!`;
        const emailReason = `${user.name} ${t('has asked to Join your cycle')} "${cycle.title}". ${t(
          'userMediathequeInfo',
        )}`;
        const authorizeText = t('authorizeText');
        const denyText = t('denyText');
        // const subtitle = `${t('Hello')} ${cycle.creator.name}[cycle creator’s name] !`
        const ignoreEmailInf = t('ignoreEmailInf');
        const aboutEureka = t('aboutEureka');
        const thanks = t('thanks');
        const eurekaTeamThanks = t('eurekaTeamThanks');
        const { email } = cycle.creator;
        if (email) {
          const opt = {
            to: [
              {
                email,
              },
            ],
            from: process.env.EMAILING_FROM!,
            subject: `${emailReason.slice(0, 50)}...`,
            html: '',
          };
          try {
            const mailSent = await sendMailRequestJoinCycle(opt, {
              to: email,
              applicantMediathequeURL,
              title,
              authorizeText,
              denyText,
              thanks,
              eurekaTeamThanks,
              authorizeURL,
              denyURL,
              ignoreEmailInf,
              aboutEureka,
              emailReason,
            });
            const msg = mailSent ? 'Request sent successfully' : 'Failed to send the mail';
            await prisma.cycleUserJoin.upsert({
              where:{
                cycleId_userId:{
                  userId:userId,
                  cycleId:cycle.id
                }
              },
              create:{userId:userId,cycleId:cycle.id,pending:true},
              update:{pending:true}
            });
      

            res.status(200).json({
              success: mailSent,
              message: msg,
              error: !mailSent,
            });
          } catch (e) {
            res.status(200).json({ status: 'error', message: JSON.stringify(e) });
          }
        }
        return;
      }

      await addParticipant(cycle.id, userId);

      await prisma.cycleUserJoin.upsert({
        where:{
          cycleId_userId:{
            userId:userId,
            cycleId:cycle.id
          }
        },
        create:{userId:userId,cycleId:cycle.id,pending:false},
        update:{pending:false}
      });

      const notification = await create(
        notificationMessage,
        notificationContextURL,
        userId,
        notificationToUsers
      );
      res.status(200).json({notification});
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.statusMessage = 'server error';
      res.status(500).end();
    } finally {
      // //prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
    const session = await getSession({req});
    if (session == null) {
      res.statusMessage = 'unauthorized';
      return res.status(300).end();
    ;
    }

    const { id } = req.query;
    const {notificationMessage,notificationContextURL,notificationToUsers} = req.body;
    if (typeof id !== 'string') {
      res.statusMessage = 'id is required';
      return res.status(400).end();      
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.statusMessage = 'id should be a number';
      return res.status(400).end();
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        res.statusMessage = 'cycle not found';
        return res.status(400).end();
      }

      await removeParticipant(cycle, session.user.id);
      await prisma.cycleUserJoin.delete({
        where:{
          cycleId_userId:{
            userId:session.user.id,
            cycleId:cycle.id
          }
        },
      });
      
      const notification = await create(
        notificationMessage,
        notificationContextURL,
        session.user.id,
        notificationToUsers
      );

      res.status(200).json({ data: cycle });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.statusMessage = 'server error';
      res.status(500).end();
    } finally {
      // //prisma.$disconnect();
    }
  });
