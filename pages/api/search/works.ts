import { NextApiRequest, NextApiResponse } from 'next';

import getApiHandler from '../../../src/lib/getApiHandler';
import { search } from '../../../src/facades/work';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const { q } = req.query;
    if (typeof q !== 'string') {
      res.status(412).json({ error: 'Required parameter "q" is invalid/missing' });
      return;
    }

    try {
      const results = await search(q);
      res.json(results);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    }
  },
);
