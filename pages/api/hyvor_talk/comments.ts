import { NextApiRequest, NextApiResponse } from "next";
const apiKey = process.env.HYVOR_TALK_API_KEY;

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const today = new Date();
    const oneHourAgo = today.getTime()-(3.6e+6);
    //& created_at > '2022-12-31  | is_featured=true'
    // const created_at=`(created_at <= ${today} & created_at >= ${oneHourAgo}) `;
    const filter=`created_at='2022-12-31'`//`(created_at>'-7 days')`;
    debugger;
    const url = `https://talk.hyvor.com/api/v1/comments?website_id=3377&api_key=${apiKey}&filter=${filter}`;
    const fr = await fetch(url);
    if(fr.ok){
        const {data} = await fr.json();
        const dates = data.map((d:any)=>{
            const d_ = new Date();
            d_.setTime(d.created_at*1000);
            return {created_at:d_};
        })  
        if(data?.length && data[0].id){
            return res.status(200).json({ok:true,dates})
        }
    }
    return res.status(200).json({ok:false})
}