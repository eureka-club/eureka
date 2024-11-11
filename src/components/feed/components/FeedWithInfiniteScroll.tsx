import { useEffect, useRef, useState } from "react";
import { getActions } from "../useActions";
import { useInView } from "react-intersection-observer";
import { Box } from "@mui/material";
import PostOnCycleCard from "./PostOnCycleCard";
import CommentOnCycleCard from "./CommentOnCycleCard";
import PostOnWorkCard from "./PostOnWorkCard";
import { ActionType } from "@/src/types";
import { useInfiniteQuery } from "react-query";
import CommentOnWorkCard from "./CommentOnWorkCard";
import CommentOnPostCard from "./CommentOnPostCard";

export const FeedWithInfiniteScroll = ()=>{
    const[page,setpage]=useState(-1);
    const total=useRef<number|undefined>(undefined);

    const [ref, inView] = useInView({
        triggerOnce: false,
    });

    useEffect(()=>{
        if(inView){
            fetchNextPage();
            setpage(page+1);
        }
      },[inView])

    const {data,fetchNextPage,hasNextPage}=useInfiniteQuery({
        queryKey:['FEED'],
        queryFn:(props)=>getActions({total:total.current,skip:props?.pageParam}),
        getNextPageParam:(lastPage,pages)=>{
            total.current=lastPage?.total??-1;
            return lastPage?.nextSkip
        }
    });

    return <>
        {data?.pages.map(p=>p?.actions?.map(a=>{
          switch(a.type){
            case ActionType.PostCreatedOnCycleActive:
              return <PostOnCycleCard key={`${a.id}`} postId={a.postId!} createdAt={a.createdAt}/>;
            case ActionType.CommentCreatedOnPost:
              return <CommentOnPostCard key={`${a.id}`} postId={a.postId!} commentURL={a.commentURL!}/>
            case ActionType.CommentCreatedOnCycle:
              return <CommentOnCycleCard key={`${a.id}`} cycleId={a.cycleId!} page_id={a.page_id!} />;
            case ActionType.PostCreatedOnWork:
              return <PostOnWorkCard key={`${a.id}`} postId={a.postId!} workId={a.workId!} createdAt={a.createdAt}/>;
            case ActionType.CommentCreatedOnWork:
              return <CommentOnWorkCard key={`${a.id}`} workId={a.workId!} page_id={a.page_id!} />
          }
        }))}
        {
            hasNextPage ? <Box sx={{padding:'10rem 0'}}>
                    <hr ref={ref}/> 
                </Box>
            : <></>
        }
    </>
}