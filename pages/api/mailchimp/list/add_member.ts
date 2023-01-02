// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createHash } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  member?: Record<string,any>|null;
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
    const {list_id=process.env.MAILCHIMP_AUDIENCE,email_address,status='subscribed'} = req.body.params
    if(email_address){
        if(list_id){
            try{
              const rblm = await client.lists.batchListMembers(list_id, {
                members:[{email_address,status}],
              });
              if(rblm.new_members.length)
                return res.status(200).json({ member:rblm.new_members[0] })
              else if(rblm.errors.length)  
                return res.status(200).json({ error:rblm.errors[0].error })
            }
            catch(e){
                return res.status(200).json({ member:null})
            }
        }
    }
    res.status(405).json({ error:'Bad Request' })
  }
}
