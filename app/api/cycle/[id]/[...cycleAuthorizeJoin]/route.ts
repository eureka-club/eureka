
import { WEBAPP_URL } from '@/src/constants';
import { addParticipant, find } from '@/src/facades/cycle';
import {prisma} from '@/src/lib/prisma';
import { sendMailRequestJoinCycleResponse } from '@/src/facades/mail';
import { NextRequest, NextResponse } from 'next/server';
import { BAD_REQUEST, INVALID_FIELD, NOT_FOUND, SERVER_ERROR } from '@/src/response_codes';
import getLocale from '@/src/getLocale';
import { getDictionary, t } from '@/src/get-dictionary';

const bcrypt = require('bcryptjs');

interface Props{
  params:{
    id:string;
    cycleAuthorizeJoin:string[]
  }
}
export async function GET(req:NextRequest,props:Props) {

  // const { id: cycleId } = req.query;
  const {id:cycleId,cycleAuthorizeJoin}=props.params;
  const [userId, base64Hash, authorized] = cycleAuthorizeJoin;

  if (typeof cycleId !== 'string') {
    return NextResponse.json({error:BAD_REQUEST});
  }

  const idNum = parseInt(cycleId, 10);
  if (!Number.isInteger(idNum)) {
    return NextResponse.json({error:INVALID_FIELD('id')});
  }
  const hash = Buffer.from(base64Hash, 'base64').toString('binary');
  if (!bcrypt.compareSync(`${cycleId}!|!${userId}`, hash)) {
    return NextResponse.json({error:BAD_REQUEST});
  }

  const locale = getLocale(req);
  const dict = await getDictionary(locale);

  try {
    const cycle = await find(idNum);
    if (cycle == null) {
      return NextResponse.json({error:NOT_FOUND});
    }
    const user = await prisma.user.findFirst({ where: { id: parseInt(userId, 10) } });
    if (authorized === '1') {
      await addParticipant(cycle.id, +userId);
      
      let cuj = await prisma.cycleUserJoin.update({
        where:{
          cycleId_userId:{
            cycleId:cycle.id,
            userId:parseInt(userId, 10)
          }
        },
        data:{pending:false}
      });
    }
    if (user && user.email) {
      const title = `${t(dict.cycleJoin,'Hello')} ${user.name}!`;
      /// Your request to Join the cycle [name of the cycle] has been approved.
      const emailReason = `${t(dict.cycleJoin,'Your request to Join the cycle')} "${cycle.title}" ${t(dict.cycleJoin,'has been')} ${
        authorized === '1' ? t(dict.cycleJoin,'approved') : t(dict.cycleJoin,'denied')
      }`;
      const cycleURL = `${WEBAPP_URL}/cycle/${cycle.id}`;
      const visitCycleInfo = t(dict.cycleJoin,'visitCycleInfo');
      const thanks = t(dict.cycleJoin,'thanks');
      const eurekaTeamThanks = t(dict.cycleJoin,'eurekaTeamThanks');
      const ignoreEmailInf = t(dict.cycleJoin,'ignoreEmailInf');
      const aboutEureka = t(dict.cycleJoin,'aboutEureka');
      const gotToCycle = {
        ...(authorized === '1' && {
          cycleURL,
          visitCycleInfo,
        }),
      };

      const { email } = user;
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
          subject: `${emailReason.slice(0, 50)}`,
          html: '',
        };
        const mailRes = await sendMailRequestJoinCycleResponse(opt, {
          to: email,
          title,
          emailReason,
          ignoreEmailInf,
          aboutEureka,
          thanks,
          eurekaTeamThanks,
          ...gotToCycle,
        });
        return NextResponse.redirect(cycleURL);
      }
    }
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
};
