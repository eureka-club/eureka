import { SERVER_ERROR } from '@/src/api_codes';
import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi,ImagesResponseDataInner } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// type Data = {
//   data?: ImagesResponseDataInner[];
//   error?:string;
// }
export async function POST(req:NextRequest){
  const body = await req.json();
  const {n:n_,size:s,text:prompt}=body;

  const n = n_ ? n_ : 3
  const size = s ? s : '256x256'
  try{debugger;
    const r = await openai.createImage({
      prompt,
      n,
      size,
      response_format:'b64_json'
      });
      if(r.data){
        return NextResponse.json({ data:r.data?.data });
      }
  }
  catch(e){
    return NextResponse.json({ error:SERVER_ERROR });
  }

}
