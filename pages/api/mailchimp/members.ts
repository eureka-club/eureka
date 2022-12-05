// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  data: Record<string,any>
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
    const {count=100,offset,sort_field,sort_dir,email} = req.query
    let data = {}
    data = await client.lists.getListMembersInfo('5da7ce3893',{
      count,
      offset,
      sort_field,
      sort_dir
    });
    res.status(200).json({ data })
  }
}
