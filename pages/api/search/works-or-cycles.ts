import { flatten, isEmpty, zip } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';

import getApiHandler from '../../../src/lib/getApiHandler';
import { search as searchCycle } from '../../../src/facades/cycle';
import { search as searchWork } from '../../../src/facades/work';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    if (!isEmpty(req.query)) {
      const cycles = await searchCycle(req.query);
      const works = await searchWork(req.query);
      const interleavedResults = flatten(zip(cycles, works)).filter((workOrCycle) => workOrCycle != null);

      res.json(interleavedResults);
      return;
    }

    throw new Error('[412] Query parameter(s) missing');
  },
);
