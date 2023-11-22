// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { defaultLocale } from 'i18n';
import type { NextApiRequest, NextApiResponse } from 'next'
const {Translate} = require('@google-cloud/translate').v2;

type Data = {
  data: string
}

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const credentials = JSON.parse(process.env.GOOGLE_CLOUD_TRANSLATE_CREDENTIALS||'');

const translate = new Translate({
  credentials,
  projectId
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if(req.method=='GET'){
    const {text:t,target:ta} = req.query
    const text = t?t.toString():'';
    const target = ta?ta.toString():defaultLocale;

    const [translation] = await translate.translate(text, target);
    return res.status(200).json({data:translation})
  }
}
