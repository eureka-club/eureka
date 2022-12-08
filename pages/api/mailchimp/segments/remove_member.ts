// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
// import { createHash } from 'node:crypto'

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
  if(req.method=='DELETE'){
    const {segment,email_address} = req.query
    const list_id=process.env.MAILCHIMP_AUDIENCE;
    let data = null
    const {segments} = await client.lists.listSegments(list_id)
    const s = segments.filter((s:{name:string})=>s.name==segment)
    const segment_id = s && s.length ? s[0].id : undefined
    const member = await client.lists.getListMember(
      list_id,
      email_address
    );
    // const subscriber_hash = createHash('md5').update(email_address.toLowerCase()).digest('hex')
    if(member){
      if(segment_id){
        await client.lists.removeSegmentMember(
          list_id,
          segment_id,
          member.id
          );
          data = member
          return res.status(200).json({ data })
      }
    }
    return res.status(405).json({ error:'wrong request' })
    
  }
}
