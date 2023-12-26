// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BAD_REQUEST } from '@/src/api_codes';
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

  if(text && target){
    const [translation] = await translate.translate(text, target);
    return NextResponse.json({data:translation});
  }
  else 
    return NextResponse.json({error:BAD_REQUEST});
}
export const dynamic = 'force-dynamic'
