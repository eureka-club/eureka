import { NextRequest, NextResponse } from "next/server";
import { SERVER_ERROR } from "@/src/api_codes";

const apiKeyTMDB = process.env.TMDB_API_KEY;

interface GetProps {
  params: { id: string };
}

export const GET = async (req: NextRequest, props: GetProps) => {
  const { id } = props.params;
  console.log(props.params, id, "id", "apiKeyTMDB", apiKeyTMDB);
  try {
    const details = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKeyTMDB}`
    ).then((r) => r.json());
    const { crew } = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKeyTMDB}`
    ).then((r) => r.json());

    if (details) {
      if (crew.length) {
        let director = crew.filter((x: any) => x.job == "Director")[0];
        details.director = director ? director : "";
      }
      console.log(details, "details");
      return NextResponse.json({ video: details });
    } else return NextResponse.json({ video: [] });
  } catch (exc) {
    console.error(exc); // eslint-disable-line no-console
    return NextResponse.json({ status: SERVER_ERROR });
  }
};
