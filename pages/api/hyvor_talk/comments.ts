// import { filter } from "lodash";
// import { NextApiRequest, NextApiResponse } from "next";
// const apiKey = process.env.HYVOR_TALK_DATA_API_KEY;
// import dayjs from 'dayjs';
// import { HYVOR_WEBSITE_ID } from "@/src/constants";

import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req:NextApiRequest,res:NextApiResponse){
//     const today = dayjs();
//     const onehourAgo = today.subtract(1,'hour');
//     const filter = `created_at>=${onehourAgo.unix()}`;
//     const url = `https://talk.hyvor.com/api/data/v1/comments?website_id=${HYVOR_WEBSITE_ID}&api_key=${apiKey}&filter=${filter}`;
//     console.log(url)
//     const fr = await fetch(url);
//     if(fr.ok){
//         const comments = await fr.json();
//         if(comments?.length){
//             return res.status(200).json({ok:true,comments})
//         }
//     }
//     return res.status(200).json({ok:false})
// }

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    try{
        const{page_id,count}=req.query;
        const url=`https://talk.hyvor.com/api/console/v1/${process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID}/comments`
        const {data} = await axios.get(url,{
            headers:{
                'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!
            },
            ...page_id ? {params:{page_id}} :{}
        });
        return res.json({data})
    // const fr=await fetch(url,{
    //     headers:{
    //         'X-API-KEY':process.env.HYVOR_TALK_CONSOLE_API_KEY!
    //     },
    // });
    // if(fr.ok){
    //     const r=await fr.json();
    //     return res.json({r});
    // }
    // return res.json({error:fr.statusText})
    }
    catch(e){
        return res.json({e})

    }
}