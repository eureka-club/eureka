// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextRequest, NextResponse } from 'next/server';
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
interface Props{
  params:{
    text:string;
    target:string;
  }
}
export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const text = searchParams.get('text');
  const target = searchParams.get('target')||'es';


  const [translation] = await translate.translate(text, target);
  return NextResponse.json({data:translation});
}
export const dynamic = 'force-dynamic'
