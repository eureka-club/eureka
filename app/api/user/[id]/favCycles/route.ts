
import { NextRequest, NextResponse } from 'next/server';
import { SERVER_ERROR } from '@/src/response_codes';
import getLocale from '@/src/getLocale';
import { getDictionary } from '@/src/get-dictionary';
import { favCycles } from '@/src/facades/user';

interface Props{
  params:{
    id:string;
  }
}
export async function GET(req:NextRequest,props:Props) {
  const {id}=props.params;
  const userId=+id;
  const locale = getLocale(req);
  const dict = await getDictionary(locale);

  try {
    const fcs = await favCycles(userId);
    return NextResponse.json({favCycles:fcs});
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
};
