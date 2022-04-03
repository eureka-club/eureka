import { NextApiRequest, NextApiResponse } from 'next';
// import { getSession } from 'next-auth/client';
import getT from 'next-translate/getT';
import { WEBAPP_URL } from '../../../../src/constants';
// import { Session } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { addParticipant, find } from '../../../../src/facades/cycle';
import prisma from '../../../../src/lib/prisma';
import { sendMailRequestJoinCycleResponse } from '../../../../src/facades/mail';
import { session } from 'next-auth/client';

const bcrypt = require('bcryptjs');

export default getApiHandler()
.get<NextApiRequest, NextApiResponse>(async (req, res): Promise<any> => {
  // const session = (await getSession({ req })) as unknown as Session;
  const { id: cycleId } = req.query;
  const [userId, base64Hash, authorized] = req.query.cycleAuthorizeJoin as string[];
  if (typeof cycleId !== 'string') {
    res.status(404).end();
    return;
  }

  const idNum = parseInt(cycleId, 10);
  if (!Number.isInteger(idNum)) {
    res.status(404).end();
    return;
  }
  const hash = Buffer.from(base64Hash, 'base64').toString('binary');
  if (!bcrypt.compareSync(`${cycleId}!|!${userId}`, hash)) {
    res.status(404).end();
    return;
  }

  try {
    const cycle = await find(idNum);
    if (cycle == null) {
      res.status(404).end();
      return;
    }
    const user = await prisma.user.findFirst({ where: { id: parseInt(userId, 10) } });
    if (authorized === '1') {
      await addParticipant(cycle, +userId);debugger;
      
      let cuj = await prisma.cycleUserJoin.update({
        where:{
          cycleId_userId:{
            cycleId:cycle.id,
            userId:parseInt(userId, 10)
          }
        },
        data:{pending:false}
      });
      // res.redirect('/cycle/cycleJoinedSuccefully');
    }
    if (user && user.email) {
      const locale = req.cookies.NEXT_LOCALE;
      const t = await getT(locale, 'cycleJoin');
      const title = `${t('Hello')} ${user.name}!`;
      /// Your request to Join the cycle [name of the cycle] has been approved.
      const emailReason = `${t('Your request to Join the cycle')} "${cycle.title}" ${t('has been')} ${
        authorized === '1' ? t('approved') : t('denied')
      }`;
      const cycleURL = `${WEBAPP_URL}/cycle/${cycle.id}`;
      const visitCycleInfo = t('visitCycleInfo');
      const thanks = t('thanks');
      const eurekaTeamThanks = t('eurekaTeamThanks');
      const ignoreEmailInf = t('ignoreEmailInf');
      const aboutEureka = t('aboutEureka');
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
        res.redirect(mailRes ? 307 : 404, `/cycle/${cycleId}`);
      }
    }
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    res.status(500).json({ status: 'server error' });
  } finally {
    //prisma.$disconnect();
  }
});
