import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Session } from '../../../src/types';
import getApiHandler from '../../../src/lib/getApiHandler';
// import dataSource from './en';

// const languages = ['es', 'fr', 'pt'];
// console.log(dataSource);

export default getApiHandler().post<NextApiRequest, NextApiResponse>(async (req, res): Promise<void> => {
  const session = (await getSession({ req })) as unknown as Session;
  if (session == null || !session.user.roles.includes('admin')) {
    res.status(401).json({ status: 'Unauthorized' });
    // return;
  }

  /* fetch('https://google-translate1.p.rapidapi.com/language/translate/v2', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'accept-encoding': 'application/gzip',
      'x-rapidapi-key': '02f6bcbd9emsh3396c8e743cdf00p1e1287jsne4ea9b145092',
      'x-rapidapi-host': 'google-translate1.p.rapidapi.com',
    },
    body: {
      q: 'Hello, world!',
      target: 'es',
      source: 'en',
    },
  })
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.error(err);
    }); */
});
