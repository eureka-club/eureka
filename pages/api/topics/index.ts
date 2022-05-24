import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '../../../src/lib/getApiHandler';

import topics from '../../../locales/en/topics.json';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  // const session = (await getSession({ req })) as unknown as Session;
  // if (session == null || !session.user.roles.includes('admin')) {
  //   res.status(401).json({ status: 'Unauthorized' });
  //   return;
  // }

  res.status(200).json({ topics });
});
