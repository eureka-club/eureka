import { NextApiRequest, NextApiResponse } from 'next';
import getApiHandler from '../../../src/lib/getApiHandler';

import en from './en';

export default getApiHandler().get<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  res.status(200).json({ en });
});
