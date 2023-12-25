import { encode } from 'base64-arraybuffer'
import { NextRequest, NextResponse } from 'next/server';
import { SERVER_ERROR } from '@/src/api_codes';

export async function POST(req:NextRequest){
  const body=await req.json();
  const {url:imageUrl} = body;
    try {
      let fetchRes = await fetch(imageUrl, {
        method: 'GET',
        headers: {
          'Content-type': 'image/*',
        },
      });
      const blob = await fetchRes.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = encode(arrayBuffer);
      return NextResponse.json({ buffer });
    } catch (error: any) {
      console.error(error, 'error');
      return NextResponse.json({ error: SERVER_ERROR });
    }
}

