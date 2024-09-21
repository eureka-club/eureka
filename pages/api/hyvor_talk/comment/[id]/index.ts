import { NOT_FOUND, SERVER_ERROR } from "@/src/api_code";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const{id}=req.query;
    try{
        const url=`https://talk.hyvor.com/api/console/v1/${process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID}/comment/${id}`
        const fr=await fetch(url,{
            headers:{
                'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!
            }
        });
        if(fr.ok){
            const comment=await fr.json();
            if(comment)
                return res.json({comment});
            return res.json({error:NOT_FOUND});
        }
        return res.json({error:fr.statusText})
    }
    catch(e){
        return res.json({error:SERVER_ERROR})
    }
}