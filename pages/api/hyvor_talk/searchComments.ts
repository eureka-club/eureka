import type { NextApiRequest, NextApiResponse } from 'next'

const apiKey = process.env.HYVOR_TALK_API_KEY;

type Data = {
  data?: Object[];
  error?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method=='GET'){
       try{
      const { id:id } = req.query;
      let r =  await fetch(`https://talk.hyvor.com/api/v1/comments?website_id=3377&api_key=${apiKey}&sort=most_upvoted&page_identifier=${id}`)
      let data = await r.json();
      //console.log(r,'r')
       //if(r.data){
            return res.status(200).json({ data:data });
      //    }
       }
       catch(e){
        return res.status(400).json({ error:'Server Error' });
      }
    
  }
}
