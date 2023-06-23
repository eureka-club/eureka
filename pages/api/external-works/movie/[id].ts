import type { NextApiRequest, NextApiResponse } from 'next';

const apiKeyTMDB = process.env.TMDB_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let id = req.query.id;
  try {
    const details = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKeyTMDB}`).then((r) => r.json());
    const { crew } = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKeyTMDB}`).then((r) =>
      r.json(),
    );
    /* const { translations } = await fetch(
       `https://api.themoviedb.org/3/movie/${id}/translations?api_key=${apiKeyTMDB}`,
     ).then((r) => r.json());

     console.log(translations, 'translations');*/

    if (details) {
      if (crew.length) {
        let director = crew.filter((x: any) => x.job == 'Director')[0];
        details.director = director ? director : '';
      }
      return res.status(200).json({ video: details });
    } else return res.status(200).json({ video: [] });
  } catch (error: any) {
    console.log(error, 'error');
    return res.status(400).json({ error: 'Server Error' });
  }
}
