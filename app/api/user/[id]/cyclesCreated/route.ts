import { cyclesCreated } from '@/src/facades/user';
import { NextRequest, NextResponse } from 'next/server';
import { SERVER_ERROR } from '@/src/api_codes';

  interface Props{
    params:{id:string}
  }

  export async function GET(req:NextRequest,props:Props){
    try {
      const {id} = props.params;
      const cc = await cyclesCreated(+id);
      return NextResponse.json({ cyclesCreated :cc});
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  }
