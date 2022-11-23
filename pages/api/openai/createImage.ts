// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi,ImagesResponse } from "openai";


const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

type Data = {
  data: ImagesResponse
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method=='POST'){
      const {n:n_,size:s} = req.body
      const n = n_ ? n_ : 3
      const size = s ? s : '256x256'

      const {data} = await openai.createImage({
        prompt: req.body.text,
        n,
        size,
        response_format:'b64_json'
    });
    debugger;

    res.status(200).json({ data });
  }
}
