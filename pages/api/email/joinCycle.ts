import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Session } from '../../../src/types';

import getApiHandler from '../../../src/lib/getApiHandler';
import { sendMailRequestJoinCycle } from '../../../src/facades/mail';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export default getApiHandler().post<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const session = (await getSession({ req })) as Session;
    if (session == null) {
      res.status(401).json({ status: 'Unauthorized' });
      return;
    }

    try {
      const { opt, specs } = JSON.parse(req.body);
      opt.from = {
        email: process.env.EMAILING_FROM!,
        name: 'Eureka-CLUB',
      };
      const r = await sendMailRequestJoinCycle(opt, specs);
      if (r) res.status(200).json({ ok: true, error: false });
      else res.status(304).json({ ok: false, error: true, status: 'server error' });
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      res.status(500).json({ ok: false, error: true, status: 'server error' });
    }
  },
);
