// import { post } from "cypress/types/jquery";
import Spinner from "../../Spinner";
import { usePostsOnActiveCycles } from "./hooks/usePostsOnActiveCycles";
import { Alert, Card, Stack } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
// import MosaicItem from "../../post/MosaicItem";
// import Masonry from "@mui/lab/Masonry";
import PostOnCycleActivesCard from "./PostOnCycleActiveCard";

export const PostsOnCyclesActive = ()=>{
    const{t}=useTranslation('common');
    const{data:posts,isLoading}=usePostsOnActiveCycles();
    if(isLoading)return <Spinner/>;
    else if(!posts)return <Alert>{t('Not Found')}</Alert>
    return <Stack gap={2}>
        {
            posts.map(p=><Card>
                <PostOnCycleActivesCard postId={p.id}/>
            </Card>
            )
        }
    </Stack>
}