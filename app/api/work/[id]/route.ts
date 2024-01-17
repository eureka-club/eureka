import { NOT_FOUND, SERVER_ERROR } from "@/src/response_codes";
import { find } from "@/src/facades/work";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/src/lib/prisma';
import { getServerSession } from "next-auth";
import auth_config from "auth_config";
import getLocale from "@/src/getLocale";

export const GET = async (req:NextRequest): Promise<any> => {
    debugger;
    // const session = await getSession({req});
    const locale = getLocale(req);
    const session = await getServerSession(auth_config(locale));
    // if (session == null) {
    //   res.status(200).json({ error: 'Unauthorized', work: null });
    //   return;
    // }
    // const { id, lang: l } = req.query;
    // const language = l ? Languages[l.toString()] : null;
    let language = 'fr'
  
    const idNum = 338;
   
  
    try {
      let work = null;debugger;
      work = await find(idNum);
      // else work = await findWithoutLangRestrict(idNum);
      if (work == null) {
        return NextResponse.json({error:NOT_FOUND});
      }
      if(language){
        const cycle = await prisma.cycle.findFirst({
          where:{
            works:{
              some:{id:work.id}
            }
          },
          select:{creatorId:true,participants:{select:{id:true}}}
        })
        let q1 = cycle && (cycle.creatorId==session?.user.id || cycle.participants.findIndex(p=>p.id==session?.user.id)>-1);
        if(work.language==language || q1)return NextResponse.json(work);
        else return NextResponse.json({error:NOT_FOUND})
      }
      // let currentUserIsFav = false;
      // let currentUserRating = 0;
      // let ratingAVG = 0;
  
      let ratingCount = work._count.ratings;
      const ratingAVG = work.ratings.reduce((p, c) => c.qty + p, 0) / ratingCount;
      // if(session){
      //     let r  = work.ratings.find(r=>r.userId==session.user.id)
      //     if(r)currentUserRating = r.qty;
      //     currentUserIsFav = work.favs.findIndex(f=>f.id==session.user.id) > -1
      // }
      // work.currentUserRating = currentUserRating;
      work.ratingAVG = ratingAVG;
      // work.currentUserIsFav = currentUserIsFav;
      return NextResponse.json(work);
    } catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      //prisma.$disconnect();
    }
  }