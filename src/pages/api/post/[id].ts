import { NextApiRequest, NextApiResponse } from 'next';

import getApiHandler from '../../../lib/getApiHandler';
import { fetchFullPostDetail } from '../../../repositories/Post';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const { id } = req.query;
    if (typeof id !== 'string') {
      res.status(404).end();
      return;
    }

    try {
      const post = await fetchFullPostDetail(id);
      if (post == null) {
        res.status(404).end();
        return;
      }

      res.json({ post });
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      res.status(500).end();
    }
  },
);
