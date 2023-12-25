
import { NextApiRequest, NextApiResponse } from "next";
import { Form } from "multiparty";
import { getSession } from "next-auth/react";
import { FileUpload, Session } from "@/src/types";
import getApiHandler from "@/src/lib/getApiHandler";
import { find, create, update } from "@/src/facades/backoffice";
import { storeDeleteFile, storeUploadPhoto } from "@/src/facades/fileUpload";
import { backOfficeData } from "@/src/types/backoffice";
import { cors, middleware } from "@/src/lib/cors";
import { SERVER_ERROR } from "@/src/api_codes";
import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };


export async function GET(req: Request) {

  try {
    const backoffice = await find({ id: 1 });
    if (!backoffice) {
      // res.status(404).end();
      return NextResponse.json({ status: "OK", backoffice: null });
    } else return NextResponse.json({ status: "OK", backoffice });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ status: SERVER_ERROR });
  } finally {
    //prisma.$disconnect();
  }
}