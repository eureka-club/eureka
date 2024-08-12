import { Box, Stack } from "@mui/material";
import { ActiveCycles } from "./ActiveCycles";
import { PostsOnCyclesActive } from "./PostsOnActiveCycles";
// import useTranslation from "next-translate/useTranslation";

export const FeedNotSession = ()=>{
    // const { t } = useTranslation('common');

    return <Stack gap={2}>
      <ActiveCycles/>
      <PostsOnCyclesActive/>
    </Stack>
}
