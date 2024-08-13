import { usePostsOnActiveCycles } from "./hooks/usePostsOnActiveCycles";
import { Alert, Card, Stack } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import PostOnCycleActivesCard from "./PostOnCycleActiveCard";
import Spinner from "@/src/components/Spinner";

export const PostsOnCyclesActive = ()=>{
    const{t}=useTranslation('common');
    const{data:posts,isLoading}=usePostsOnActiveCycles();
    if(isLoading)return <Spinner/>;
    else if(!posts)return <Alert>{t('Not Found')}</Alert>
    return <Stack gap={2}>
        {
            posts.map(p=><Card key={`post-${p.id}-on-active-cycle`}>
                <PostOnCycleActivesCard postId={p.id}/>
            </Card>
            )
        }
    </Stack>
}