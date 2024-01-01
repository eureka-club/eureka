import { SERVER_ERROR } from "@/src/api_codes";
import { find } from "@/src/facades/user";
import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
interface Props{
  params:{id:string}
}
export async function GET(req: Request,props:Props) {
  try {
    const { id:id_ } = props.params;
    const id = +id_;
    const user = await find({where:{id}});
    return NextResponse.json({
      user
    });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ error: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 60*60 
