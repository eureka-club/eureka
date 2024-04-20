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
  if(req.method=='PATCH'){
    const {email_address,full_name} = req.body;
    const list_id=process.env.MAILCHIMP_AUDIENCE;
    if(email_address){
        const subscriber_hash  = createHash('md5').update(email_address.toString()).digest('hex')

        let member = null
        if(list_id){
            try{
                member = await client.lists.updateListMember(
                  list_id,
                  subscriber_hash,
                  {
                    merge_fields:{
                      FNAME:full_name
                    }
                  }
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
