import { Alert, Box, Stack } from "@mui/material";
import { ActiveCycles } from "./ActiveCycles";
import { PostsOnCyclesActive } from "./PostsOnActiveCycles!!!";
import { getActions, useActions } from "./useActions";
import { ActionType } from "@/src/types";
import PostOnCycleActiveCard from "./components/PostOnCycleActiveCard";
import Spinner from "../Spinner";
import useTranslation from "next-translate/useTranslation";
import CommentOnCycleActiveCard from "./components/CommentOnCycleActiveCard";
import PostOnWorkCard from "./components/PostOnWorkCard";
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from "react";

export const Feed = ()=>{
    const[page,setpage]=useState(0);
    const { t } = useTranslation('feed');
    const{data,isLoading}=useActions({skip:(+process.env.NEXT_PUBLIC_TAKE!)*page});
    const[actions,setactions]=useState(data?.actions??[]);

    useEffect(()=>{
      if(data?.actions?.length){
        setactions(p=>{
          let res = p.concat(data.actions);
          return res;
        });
      }
    },[data]);

    const [ref, inView] = useInView({
      triggerOnce: false,
    });

    useEffect(()=>{
      if(inView){
        setpage(page+1);
      }
    },[inView])

    if(isLoading)return <Spinner/>;
    else if(!actions)return <Alert>{t('common:Not Found')}</Alert>;

    return <Stack gap={2} id='feed-ctr'>
      {/* <ActiveCycles/> */}
      {/* <PostsOnCyclesActive/> */}
      {actions?.map(a=>{
        switch(a.type){
          case ActionType.PostCreatedOnCycleActive:
            return <PostOnCycleActiveCard key={`${a.type}-${a.postId!}`} postId={a.postId!}/>;
          case ActionType.CommentCreatedOnCycleActive:
            return <CommentOnCycleActiveCard key={`${a.type}-${a.cycleId!}`} userId={a.userId} cycleId={a.cycleId!} commentURL={a.commentURL!} commentText={a.commentText!} createdAt={a.createdAt}/>;
          case ActionType.PostCreatedOnWork:
            return <PostOnWorkCard key={`${a.type}-${a.postId!}`} postId={a.postId!}/>
        }
      })}
       <Box sx={{padding:'1rem'}}>
      {isLoading || actions?.length>=data?.total! ? <></> : <hr ref={ref}/>}
    </Box>
    </Stack>
}
