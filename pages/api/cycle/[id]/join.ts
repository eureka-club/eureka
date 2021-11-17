import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import getT from 'next-translate/getT';
import { WEBAPP_URL } from '../../../../src/constants';
import { Session } from '../../../../src/types';
import getApiHandler from '../../../../src/lib/getApiHandler';
import { addParticipant, find, removeParticipant } from '../../../../src/facades/cycle';
import prisma from '../../../../src/lib/prisma';
import { sendMailRequestJoinCycle } from '../../../../src/facades/mail';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(200).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { id } = req.query;
    if (typeof id !== 'string') {
      res.status(200).json({ status: 'error', message: 'id is required' });
      return;
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

      if (cycle.access === 2) {
        const params = `${cycle.id}!|!${session.user.id}`;
        const hash = bcrypt.hashSync(params, 8);
        const base64Hash = Buffer.from(hash, 'binary').toString('base64');
        const authorizeURL = `${WEBAPP_URL}/api/cycle/${cycle.id}/${session.user.id}/${base64Hash}/1`;
        const denyURL = `${WEBAPP_URL}/api/cycle/${cycle.id}/${session.user.id}/${base64Hash}/0`;
        const applicantMediathequeURL = `${WEBAPP_URL}/mediatheque/${session.user.id}`;
        const locale = req.cookies.NEXT_LOCALE;
        const t = await getT(locale, 'cycleJoin');

        const title = `${t('Hello')} ${cycle.creator.name}!`;
        const emailReason = `${session.user.name} ${t('has asked to Join your cycle')} "${cycle.title}". ${t(
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
            const msg = mailSent ? 'Request sent successfully' : 'Failed to send the request';

            res.status(200).json({
              status: 'success',
              message: msg,
              // data: 'Your request has been sent successfully, you will recive a response by email',
              error: mailSent,
            });
          } catch (e) {
            res.status(200).json({ status: 'error', message: JSON.stringify(e) });
          }
        }
        return;
      }

      await addParticipant(cycle, session.user.id);

      res.status(200).json({ status: 'success' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(200).json({ status: 'error', message: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  })
  .delete<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(200).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const { id } = req.query;
    if (typeof id !== 'string') {
      res.status(200).json({ status: 'error', message: 'id is required' });
      return;
    }

    const idNum = parseInt(id, 10);
    if (!Number.isInteger(idNum)) {
      res.status(200).json({ status: 'error', message: 'id should be a number' });
      return;
    }

    try {
      const cycle = await find(idNum);
      if (cycle == null) {
        res.status(200).json({ status: 'error', message: 'cycle not found' });
        return;
      }

      await removeParticipant(cycle, session.user);

      res.status(200).json({ status: 'success', data: cycle });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'error', message: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
