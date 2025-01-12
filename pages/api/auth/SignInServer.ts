import { WEBAPP_URL } from "@/src/constants";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if(req.method=='POST'){
        const{email,password}=req.body;
    
        const authUrl = `${WEBAPP_URL}/api/auth/signin`
        const fr = await fetch(authUrl,{
        method:'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    
        });
        if(fr.ok){
            const result = await fr.text();
            res.write(result);
            res.end()
            // res.json({session})
        }
    }
    else{
        res.json({error:'invalid request'});
    }
    
};
