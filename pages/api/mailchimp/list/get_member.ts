// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createHash } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  member?: Record<string,any>
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
  if(req.method=='GET'){
    const {list_id=process.env.MAILCHIMP_AUDIENCE,email_address} = req.query
    if(email_address){
        const subscriber_hash  = createHash('md5').update(email_address.toString()).digest('hex')

        let member = null
        if(list_id){
            try{
                member = await client.lists.getListMember(
                  list_id,
                  subscriber_hash
                );
                return res.status(200).json({ member })

            }
            catch(e){
                return res.status(200).json({ member})
            }
        }
    }
    res.status(405).json({ error:'bad request' })
  }
}
