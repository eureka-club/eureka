import { CycleDetail } from "@/src/types/cycle";
import CycleDetailHeader from "./CycleDetailHeader";
import { useCycleParticipants } from "@/src/hooks/useCycleParticipants";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import usePosts from "@/src/usePosts";

type Props={
    cycle:CycleDetail;
    // onParticipantsAction:()=>Promise<void>;
    onCarouselSeeAllAction:()=>Promise<void>;
}
export const  RenderCycleDetailHeader = ({cycle,onCarouselSeeAllAction}:Props) => {
  const{data:session}=useSession();
  const{data:participants}=useCycleParticipants(cycle?.id!
      ,{enabled:!!cycle?.id!}
    );

  const cyclePostsProps = {take:8,where:{cycles:{some:{id:cycle?.id}}}}
  const {data:dataPosts} = usePosts(cyclePostsProps,['CYCLE',`${cycle?.id}`,'POSTS']
    //   ,{
    //   enabled:!!cycleId,
    //   cacheKey:['CYCLE',`${cycle?.id}`,'POSTS']
    // }
  )
  const [posts,setPosts] = useState(dataPosts?.posts)
  const [hasMorePosts,setHasMorePosts] = useState(dataPosts?.fetched);

  useEffect(()=>{
    if(dataPosts && dataPosts.posts){
      setHasMorePosts(dataPosts.fetched)
      setPosts(dataPosts.posts)
    }
  },[dataPosts])

    if (cycle) {
      const res = (
        <CycleDetailHeader
          cycleId={cycle.id}
          // onParticipantsAction={onParticipantsAction}
          onCarouselSeeAllAction={onCarouselSeeAllAction}
        />
      );
      const allowed = participants && participants.findIndex(p=>p.id==session?.user.id)>-1
        || cycle.creatorId == session?.user.id;
      if(allowed)return res;  
      else if([1,2,4].includes(cycle.access))return res;
      if (cycle.access === 3) return '';
    }
    return '';
  };