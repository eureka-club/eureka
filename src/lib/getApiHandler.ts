import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () =>
  nc<NextApiRequest, NextApiResponse>({
    onNoMatch(req, res) {
      res.status(405).end();
    },
  });
