import type { NextApiRequest, NextApiResponse } from 'next';
import { APIMediaSearchResult } from '@/src/types';

const apiKeyTMDB = process.env.NEXT_PUBLIC_TMDB_API_KEY;

type Data = {
  data?: APIMediaSearchResult[];
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method == 'POST') {
    let type = req.body.type;

    let searchCriteria = req.body.search;

    if (['book', 'fiction-book'].includes(type)) {
      try {
        const {
          items: data,
          //totalItems,
          //error,
        } = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q="${searchCriteria}"&maxResults=20&key=AIzaSyCw90FMmKJl2eYADMDLYpjHeCW44f5KROc`,
        ).then((r) => r.json());
        if (data.length) {
          return res.status(200).json({ data: data });
        }
        if (!data.length) return res.status(200).json({ data: [] });
      } catch (error: any) {
        return res.status(400).json({ error: 'Server Error' });
      }
    }

    if (['documentary', 'movie'].includes(type)) {
      try {
        const {
          results: data,
          //total_results: totalItems,
          // success,
          //status_code,
          //status_message,
        } = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&query=${searchCriteria}`).then(
          (r) => r.json(),
        );
        if (data.length) {
          return res.status(200).json({ data: data });
        }
        if (!data.length) return res.status(200).json({ data: [] });
      } catch (error: any) {
        return res.status(400).json({ error: 'Server Error' });
      }
    }
  }
}
