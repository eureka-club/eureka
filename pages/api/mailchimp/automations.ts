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
    let data={}
    const {count=100,offset,sort_field,sort_dir,workflow_id} = req.query
    if(workflow_id){
      data = await client.automations.get(workflow_id);
    }
    else{
      data = await client.automations.list({
        count,
        offset,
        sort_field,
        sort_dir
      });
    }
    res.status(200).json({ data })
  }
}
