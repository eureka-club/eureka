import auth_config from "@/auth_config";
import { INVALID_FIELD, SERVER_ERROR } from "@/src/api_codes";
import { participants as cycleParticipants, find } from "@/src/facades/cycle";
import getLocale from "@/src/getLocale";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface Props{
    params:{id:string}
}
export const GET = async (req:NextRequest,props:Props) => {
  const locale = getLocale(req);debugger;
    const session = await getServerSession(auth_config(locale));
    try {
      const {id} = props.params;

        const idNum = parseInt(id, 10);
        if (!Number.isInteger(idNum)) {
            return NextResponse.json({error:INVALID_FIELD('id')});
        }
      
        const cycle = await find(idNum);
        
        if (cycle) {
          let ratingCount = cycle.ratings.length;
          const ratingAVG = cycle.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount;
          const participants = await cycleParticipants(cycle.id);
          let currentUserIsParticipant = false;
          let currentUserIsCreator = false;
          let currentUserIsPending = false;
          let currentUserRating = 0;
          if(session){
            currentUserIsCreator = cycle.creatorId == session.user.id
              currentUserIsParticipant =  currentUserIsCreator || participants?.findIndex(p=>p.id==session.user.id) > -1;
              currentUserIsPending = cycle.usersJoined.findIndex(p=>p.userId==session.user.id && p.pending) > -1;
              let r  = cycle.ratings.find(r=>r.userId==session.user.id)
              if(r)currentUserRating = r.qty;
          }
          cycle.currentUserIsParticipant = currentUserIsParticipant;
          cycle.currentUserIsCreator = currentUserIsCreator;
          cycle.currentUserIsPending = currentUserIsPending;
          cycle.currentUserRating = currentUserRating;
          cycle.ratingCount = ratingCount;
          cycle.ratingAVG = ratingAVG;
          return NextResponse.json({ cycle });
        }
        return NextResponse.json({ cycle: null });
      }

     catch (exc) {
      console.error(exc); // eslint-disable-line no-console
      return NextResponse.json({ error: SERVER_ERROR });
    } finally {
      ////prisma.$disconnect();
    }
}
export const PATCH = async (req:NextRequest,props:Props) =>{
  
}
export const dynamic = "force-dynamic";
export const revalidate = 60*60;