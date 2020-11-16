import { NextApiRequest, NextApiResponse } from 'next';
import multiparty from 'multiparty';

import getApiHandler from '../../../lib/getApiHandler';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default getApiHandler().post<NextApiRequest, NextApiResponse>(
  async (req, res): Promise<void> => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
      console.log('>>>', { err, fields, image: files.image });

      res.json({ status: 'OK!' });
    });
  },
);
