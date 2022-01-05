import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { Work, Cycle } from '@prisma/client';
import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
import { find, remove } from '../../../src/facades/post';
import prisma from '../../../src/lib/prisma';

export default getApiHandler()
  .post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as unknown as Session;
    if (session == null) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { idSession } = req.body;
    if (typeof idSession !== 'number') {
      res.status(404).json({error:'Invalid session id'});
      return;
    }

    // const idNum = parseInt(idSession, 10);
    // if (!Number.isInteger(idNum)) {
    //   res.status(404).end();
    //   return;
    // }

    try {
      const Pusher = require("pusher");
      debugger;
      const pusher = new Pusher({
        appId: "1326943",
        key: "5093c051cfd50ada97e5",
        secret: "adae694f181d2e17c5fa",
        cluster: "sa1",
        useTLS: true
      });

      pusher.trigger(`my-channel-${idSession}`, "my-event", {
        message: `hello world - ${(new Date()).toLocaleString()}`
      });
      res.status(200).json({ status: 'OK' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    } finally {
      prisma.$disconnect();
    }
  });
  