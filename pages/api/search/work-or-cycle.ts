import { flatten, zip } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import getApiHandler from '../../../src/lib/getApiHandler';
import { search as searchCycle } from '../../../src/facades/cycle';
import { search as searchWork } from '../../../src/facades/work';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const { q } = req.query;
    if (typeof q !== 'string') {
      res.status(412).json({ error: 'Required parameter "q" is invalid/missing' });
      return;
    }

    try {
      const cycles = await searchCycle(q);
      const works = await searchWork(q);
      const interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);

      res.json(interleavedResults);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.status(500).json({ status: 'server error' });
    }
  },
);
