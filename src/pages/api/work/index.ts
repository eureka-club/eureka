import { NextApiRequest, NextApiResponse } from 'next';
import qs from 'qs';

import getApiHandler from '../../../lib/getApiHandler';
import { findAll } from '../../../repositories/Work';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const { q } = req.query;
    let criteria;

    if (typeof q === 'string') {
      criteria = qs.parse(q);
    }

    try {
      const results = await findAll(criteria);
      res.json(results);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.status(500).end();
    }
  },
);
