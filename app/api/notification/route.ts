import { MISSING_FIELD, SERVER_ERROR } from "@/src/api_codes";
import { findAll } from "@/src/facades/notification";
import { NotificationMosaicItem } from "@/src/types/notification";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const {searchParams}=new URL(req.url);
        const userId = searchParams.get('userId');
        
        if(!userId)return NextResponse.json({error:MISSING_FIELD('userId')});
        
        const notifications = await findAll(parseInt(userId));
        const allreadyExist = new Set();
        const result:NotificationMosaicItem[] | null = [];
        notifications?.reduce((p,c)=>{
          const key = `${c.userId}:${c.notification.contextURL}:${c.notification.message}:${c.notification.fromUserId}`;
          if(!allreadyExist.has(key)){
            p.push(c)
            allreadyExist.add(key);
          }
          return p;
        },result)
        return NextResponse.json({ notifications:result });
      
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      // //prisma.$disconnect();
    }
}

export const dynamic = 'force-dynamic';