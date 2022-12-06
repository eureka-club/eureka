// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: any
}

const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method=='GET'){
    const {count=100,offset,sort_field,sort_dir,segment,list_id=process.env.MAILCHIMP_AUDIENCE} = req.query
    let data = []
    
    data = await client.lists.listSegments(list_id,{
      count,
      offset,
      sort_field,
      sort_dir
    });
    if(segment){
      data = data.segments.filter((s:{name:string})=>s.name==segment);
      data = data && data.length ? data[0] : null
    }
    
    res.status(200).json({ data })
  }
}
