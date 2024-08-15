import { Alert, Box, Stack } from "@mui/material";
import { ActiveCycles } from "./ActiveCycles";
import { PostsOnCyclesActive } from "./PostsOnActiveCycles!!!";
import { useActions } from "./useActions";
import { ActionType } from "@/src/types";
import PostOnCycleActiveCard from "./components/PostOnCycleActiveCard";
import Spinner from "../Spinner";
import useTranslation from "next-translate/useTranslation";
// import useTranslation from "next-translate/useTranslation";

export const Feed = ()=>{
    const { t } = useTranslation('common');
    const{data:actions,isLoading}=useActions();
    if(isLoading)return <Spinner/>;
    else if(!actions)return <Alert>{t('Not Found')}</Alert>;

    return <Stack gap={2}>
      {/* <ActiveCycles/> */}
      {/* <PostsOnCyclesActive/> */}
      {actions?.map(a=>{
        switch(a.type){
          case ActionType.PostCreatedOnCycleActive:
            return <PostOnCycleActiveCard postId={a.postId!}/>
        }
      })}
    </Stack>
}
