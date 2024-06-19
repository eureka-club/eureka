import { NOT_FOUND, SERVER_ERROR } from "@/src/api_code";
import { filter } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
const apiKey = process.env.HYVOR_TALK_API_KEY;

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const{id}=req.query;
    const url = `https://talk.hyvor.com/api/data/v1/comments?website_id=3377&api_key=${apiKey}&filter=(id=${id})`;
    console.log(url)
    const fr = await fetch(url);
    if(fr.ok){
        const r = await fr.json();
        if(r?.length){
            return res.status(200).json({comment:r[0]})
        }
        return res.status(200).json({comment:null})
    }
    return res.status(200).json({error:SERVER_ERROR})
}