import { HYVOR_WEBSITE_ID } from '@/src/constants';
import type { NextApiRequest, NextApiResponse } from 'next'
const apiKey = process.env.HYVOR_TALK_DATA_API_KEY;

type Data = {
  data?: Object[];
  error?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try{debugger;
    const { id:id } = req.query;
    const url=`https://talk.hyvor.com/api/console/v1/${process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID}/comments?page_identifier=${id}`;
    const fr=await fetch(url,{
      headers:{
          'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!
      }
  });
  if(fr.ok){
      const data=await fr.json();
      return res.json({data});
  }
  // let r =  await fetch(`https://talk.hyvor.com/api/data/v1/comments?website_id=${HYVOR_WEBSITE_ID}&api_key=${apiKey}&page_identifier=${id}`)
  }
  catch(e){
    return res.status(400).json({ error:'Server Error' });
  }
}
