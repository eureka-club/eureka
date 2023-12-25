import { addParticipant, find, removeParticipant } from '@/src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import { sendMailRequestJoinCycle } from '@/src/facades/mail';
import {create} from '@/src/facades/notification'
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import auth_config from '@/auth_config';
import { INVALID_FIELD, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED } from '@/src/api_codes';
import { WEBAPP_URL } from '@/src/constants';
import getLocale from '@/src/getLocale';
import { getDictionary, t } from '@/src/get-dictionary';
import { Locale } from '@/i18n-config';
import { NextApiRequest } from 'next';
const bcrypt = require('bcryptjs');

interface Props{
    params:{id:string}
}
export async function POST(req:NextRequest,props:Props) {
  const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    if (session == null) {
      return NextResponse.json({error:UNAUTHORIZED});
    }
    const {id} = props.params;
    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      return NextResponse.json({error:INVALID_FIELD('id')});
    }

    const body = await req.json();
    const {notificationMessage,notificationContextURL,notificationToUsers} = body;

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        return NextResponse.json({error:NOT_FOUND});
      }

      if (cycle.access === 2) {
        const params = `${cycle.id}!|!${session.user.id}`;
        const hash = bcrypt.hashSync(params, 8);
        const base64Hash = Buffer.from(hash, 'binary').toString('base64');
        const authorizeURL = `${WEBAPP_URL}/api/cycle/${cycle.id}/${session.user.id}/${base64Hash}/1`;
        const denyURL = `${WEBAPP_URL}/api/cycle/${cycle.id}/${session.user.id}/${base64Hash}/0`;
        const applicantMediathequeURL = `${WEBAPP_URL}/mediatheque/${session.user.id}`;
        
        const locale = getLocale(req);
        const dict = await getDictionary(locale);

        // const t = await getT(locale, 'cycleJoin');

        const title = `${t(dict.cycleJoin,'Hello')} ${cycle.creator.name}!`;
        const emailReason = `${session.user.name} ${t(dict.cycleJoin,'has asked to Join your cycle')} "${cycle.title}". ${t(dict.cycleJoin,
          'userMediathequeInfo',
        )}`;
        const authorizeText = t(dict.cycleJoin,'authorizeText');
        const denyText = t(dict.cycleJoin,'denyText');
        // const subtitle = `${t('Hello')} ${cycle.creator.name}[cycle creator’s name] !`
        const ignoreEmailInf = t(dict.cycleJoin,'ignoreEmailInf');
        const aboutEureka = t(dict.cycleJoin,'aboutEureka');
        const thanks = t(dict.cycleJoin,'thanks');
        const eurekaTeamThanks = t(dict.cycleJoin,'eurekaTeamThanks');
        
        const { email } = cycle.creator;
        if (email) {
          const opt = {
            to: [
              {
                email,
              },
            ],
            from: {
              email: process.env.EMAILING_FROM!,
              name: 'EUREKA-CLUB',
            },
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
                  userId:session.user.id,
                  cycleId:cycle.id
                }
              },
              create:{userId:session.user.id,cycleId:cycle.id,pending:true},
              update:{pending:true}
            });
      

            return NextResponse.json({
              success: mailSent,
              message: msg,
              error: !mailSent,
            });
          } catch (e) {
            console.error(JSON.stringify(e));
            return NextResponse.json({ error: SERVER_ERROR });
          }
        }
        return;
      }

      await addParticipant(cycle.id, session.user.id);

     await prisma.cycleUserJoin.upsert({
        where:{
          cycleId_userId:{
            userId:session.user.id,
            cycleId:cycle.id
          }
        },
        create:{userId:session.user.id,cycleId:cycle.id,pending:false},
        update:{pending:false}
      });

      const notification = await create(
        notificationMessage,
        notificationContextURL,
        session.user.id,
        notificationToUsers
      );
      return NextResponse.json({notification});
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR});
    } finally {
      // //prisma.$disconnect();
    }
  }
  export async function DELETE(req:NextRequest,props:Props) {
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    if (session == null) {
      return NextResponse.json({error:UNAUTHORIZED});
    }
    const { id } = props.params;
    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      return NextResponse.json({error:INVALID_FIELD('id')});
    }

    const body = await req.json();
    const {notificationMessage,notificationContextURL,notificationToUsers} = body;

    try {
      let cycle = await find(idNum);
      if (cycle == null) {
        return NextResponse.json({error:NOT_FOUND});
      }

      cycle = await removeParticipant(cycle, session.user.id);
      const notification = await create(
        notificationMessage,
        notificationContextURL,
        session.user.id,
        notificationToUsers
      );
        
      return NextResponse.json({ data: cycle });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({error:SERVER_ERROR});
    } finally {
      // //prisma.$disconnect();
    }
  }
