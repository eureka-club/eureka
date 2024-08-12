import { SERVER_ERROR } from "@/src/api_code";
import { postsOnActiveCycles, postsOnActiveCyclesTotal } from "@/src/facades/postsOnActiveCycles";
import { PostOnActiveCycle } from "@/src/types/post";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function(req:NextApiRequest,res:NextApiResponse){
    try{
        const session = await getSession({ req });
        const promises = [
            postsOnActiveCyclesTotal(session?.user.id),
            postsOnActiveCycles(session?.user.id)
        ]
        const [totalRes,postsRes] = await Promise.allSettled(promises);
        const total = totalRes.status=='fulfilled' ? totalRes.value as number : null;
        const posts = postsRes.status=='fulfilled' ? postsRes.value as PostOnActiveCycle[] : null;
        return res.json({posts,fetched:posts?.length??0,total});
    }
    catch(e){
        return res.json({error:SERVER_ERROR});
    }
}