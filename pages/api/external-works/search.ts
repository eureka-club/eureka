import type { NextApiRequest, NextApiResponse } from 'next';
import { APIMediaSearchResult } from '@/src/types';
import { GoogleBooksProps } from '@/src/types/work';
import { TMDBVideosProps } from '@/src/types/work';

const apiKeyTMDB = process.env.TMDB_API_KEY;

type Data = {
  data?: APIMediaSearchResult[];
  error?: string;
};
const available_languages = ['en','es','fr','pt'];

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method == 'POST') {
    let type = req.body.type;
    let searchCriteria = req.body.search;
    let language = req.body.language;

    if (['book', 'fiction-book'].includes(type)) {
      try {
        const {
          items: data,
          //totalItems,
          //error,
        } = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q="${searchCriteria}"+intitle:"${searchCriteria}"&maxResults=20&printType=books&langRestrict=${language}&key=${process.env.GOOGLE_CLOUD_BOOKS_CREDENTIALS}`,
        ).then((r) => r.json());
        if (data.length) {
          const d:APIMediaSearchResult[]=[];
          let i = 0;
          let length = data.length;
          for(;i<length;i++){
            const aux = (data[i] as GoogleBooksProps).volumeInfo.language.split("-");
            const l = aux.length ? aux[0].toLowerCase() : undefined;
            if(l && available_languages.includes(l)){
              d.push(data[i]);
            }
          }
          return res.status(200).json({ data: d });
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
        } = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}&query=${searchCriteria}`,
        ).then((r) => r.json());
        if (data.length) {
          const d:APIMediaSearchResult[]=[];
          let i = 0;
          let length = data.length;
          for(;i<length;i++){
            const l = (data[i] as TMDBVideosProps).original_language;
            if(l && available_languages.includes(l)){
              d.push(data[i]);
            }
          }
          return res.status(200).json({ data: d });
        }
        if (!data.length) return res.status(200).json({ data: [] });
      } catch (error: any) {
        return res.status(400).json({ error: 'Server Error' });
      }
    }
  }
}
