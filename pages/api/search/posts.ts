import { isEmpty } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import getApiHandler from '../../../src/lib/getApiHandler';
import { search } from '../../../src/facades/post';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    if (!isEmpty(req.query)) {
      const posts = await search(req.query);
      res.json(posts);
      return;
    }

    throw new Error('[412] Query parameter(s) missing');
  },
);
