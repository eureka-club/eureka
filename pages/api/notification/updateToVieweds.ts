import { updateToVieweds } from "@/src/facades/notification";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    debugger;
    if(req.method?.toLowerCase()=='post'){
        const {userId}=req.body;
        const modified = await updateToVieweds(userId);
        return res.json({modified});    
    }
    return res.json({ok:true});    
}