import { filter } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
const apiKey = process.env.HYVOR_TALK_API_KEY;
import dayjs from 'dayjs';
import { HYVOR_WEBSITE_ID } from "@/src/constants";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const today = dayjs();
    const onehourAgo = today.subtract(1,'hour');
    const filter = `created_at>=${onehourAgo.unix()}`;
    const url = `https://talk.hyvor.com/api/data/v1/comments?website_id=${HYVOR_WEBSITE_ID}&api_key=${apiKey}&filter=${filter}`;
    console.log(url)
    const fr = await fetch(url);
    if(fr.ok){
        const comments = await fr.json();
        if(comments?.length){
            return res.status(200).json({ok:true,comments})
        }
    }
    return res.status(200).json({ok:false})
}