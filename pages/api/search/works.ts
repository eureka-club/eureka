import { isEmpty } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import getApiHandler from '../../../src/lib/getApiHandler';
import { search } from '../../../src/facades/work';
import { getSession } from 'next-auth/react';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  const session = await getSession({req});
  if (!isEmpty(req.query)) {
    
    const works = await search(session,req.query);
    res.json(works);
    return;
  }

  throw new Error('[412] Query parameter(s) missing');
});
