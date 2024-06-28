import dayjs from 'dayjs';
import type { NextApiRequest, NextApiResponse } from 'next'

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
    // const filter = `(created_at>=${eightHoursAgo.unix()})`;
    //&filter=(created_at=1719582249)
    const url=`https://talk.hyvor.com/api/console/v1/${process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID}/comments?`;
    const fr=await fetch(url,{
      headers:{
          'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!
      }
  });
  if(fr.ok){
      const data=await fr.json();
      const today = dayjs();
      const eightHoursAgo = today.subtract(8,'hour');
      const result = data.reduce((prev:any,curr:any)=>{
        if(curr.page.identifier==id && eightHoursAgo.unix() <= curr.created_at)
            prev.push(curr);
        return prev;
      },[]);
      return res.json({data:result});
  }
  return res.status(200).json({ error:fr.statusText });

  // let r =  await fetch(`https://talk.hyvor.com/api/data/v1/comments?website_id=${HYVOR_WEBSITE_ID}&api_key=${apiKey}&page_identifier=${id}`)
  }
  catch(e){
    return res.status(400).json({ error:'Server Error' });
  }
}
