import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () =>
  nc<NextApiRequest, NextApiResponse>({
    onError(err, req, res) {
      const matches = err.message.match(/^\[(\d+)]\s(.*)/);
      if (matches != null) {
        const [, status, message] = matches;
        res.status(status).json({ error: message });
        return;
      }

      console.error(err); // eslint-disable-line no-console
      res.status(500).json({ error: 'Server error' });
    },

    onNoMatch(req, res) {
      res.status(405).end();
    },
  });
