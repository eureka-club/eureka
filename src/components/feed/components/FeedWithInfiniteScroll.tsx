import { useEffect, useRef, useState } from "react";
import { getActions } from "../useActions";
import { useInView } from "react-intersection-observer";
import { Box } from "@mui/material";
import PostOnCycleActiveCard from "./PostOnCycleActiveCard";
import CommentOnCycleActiveCard from "./CommentOnCycleActiveCard";
import PostOnWorkCard from "./PostOnWorkCard";
import { ActionType } from "@/src/types";
import { useInfiniteQuery } from "react-query";

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
              return <PostOnCycleActiveCard key={`${a.type}-${a.postId!}`} postId={a.postId!}/>;
            case ActionType.CommentCreatedOnCycleActive:
              return <CommentOnCycleActiveCard key={`${a.type}-${a.cycleId!}`} userId={a.userId} cycleId={a.cycleId!} commentURL={a.commentURL!} commentText={a.commentText!} createdAt={a.createdAt}/>;
            case ActionType.PostCreatedOnWork:
              return <PostOnWorkCard key={`${a.type}-${a.postId!}`} postId={a.postId!}/>
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