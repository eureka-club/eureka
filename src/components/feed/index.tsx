import { Stack } from "@mui/material";
import { FeedWithInfiniteScroll } from "./components/FeedWithInfiniteScroll";

export const Feed = ()=>{
    return <Stack gap={2} id='feed-ctr'>
      <FeedWithInfiniteScroll/>
    </Stack>
}
