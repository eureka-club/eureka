// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data?: any;
  error?:string
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
  if(req.method=='POST'){
    const {list_id=process.env.MAILCHIMP_AUDIENCE,segment,email_address} = req.body
    let data = null
    const {segments} = await client.lists.listSegments(list_id)
    const s = segments.filter((s:{name:string})=>s.name==segment)
    const segment_id = s && s.length ? s[0].id : undefined
    if(segment_id){
      data = await client.lists.createSegmentMember(
        list_id,
        segment_id,
        { email_address}
      );
      res.status(200).json({ data })

    }
    else{
      res.status(405).json({ error:'wrong request' })
    }
  }
}
