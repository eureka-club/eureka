// import { filter } from "lodash";
// import { NextApiRequest, NextApiResponse } from "next";
// const apiKey = process.env.HYVOR_TALK_DATA_API_KEY;
// import dayjs from 'dayjs';
// import { HYVOR_WEBSITE_ID } from "@/src/constants";

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        const{id}=req.query;
        const{body,sso_id}=JSON.parse(req.body);
        const url = `https://talk.hyvor.com/api/console/v1/${process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID}/comment/${id}/reply`
        const {data:comment} = await axios.post(url,{
            body:`
                type: "paragraph"
                content: 
                    0:
                        type: "text"
                        text: "${body}"
            `
        },{
            headers:{
                'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!,
                'X-AUTH-USER-SSO-ID':sso_id
            },
        });
        return res.json({comment});
        // const fr = await fetch(url,{
        //     method:'POST',
        //     headers:{
        //         'Content-type':'application/json',
        //         'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!
        //     },
        //     body:JSON.stringify({body})
        // })
        // if(fr.ok){
        //     const comment = await fr.json();
        //     return res.json({comment});
        // }
        // return res.json({comment:null});
    }
    catch(e){
        return res.json({e})

    }
}