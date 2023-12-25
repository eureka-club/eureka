import { SERVER_ERROR } from '@/src/api_codes';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const {to,subject,text,html,from_name} = body;
    
    const message = {
      from_email: process.env.EMAILING_FROM,
      from_name: from_name||'EUREKA',
      subject,
      ...text && {text},
      ...html && {html},
      to
    };
    
    const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.EMAIL_SERVER_PASS);
    const response = await mailchimp.messages.send({message});
    if(response.isAxiosError){
      console.error(response.message);
      return NextResponse.json({error:SERVER_ERROR});
    }
    return NextResponse.json({data:response});
}

export async function GET(req:NextRequest){
  return NextResponse.json({data:'ok'})
}
