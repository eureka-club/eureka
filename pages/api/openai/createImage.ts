// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi,ImagesResponseDataInner } from "openai";


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  data?: ImagesResponseDataInner[];
  error?:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method=='POST'){
      const {n:n_,size:s} = req.body
      const n = n_ ? n_ : 3
      const size = s ? s : '256x256'
      try{
        const r = await openai.createImage({
          prompt: req.body.text.replace(/,|;/g,''),
          n,
          size,
          response_format:'b64_json'
          });
          if(r.data){
            return res.status(200).json({ data:r.data?.data });
          }
      }
      catch(e){
        const error = (e as {response:{statusText:string}})
        return res.status(400).json({ error:error.response.statusText });
      }

  }
}
