import { Box } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { Actives } from "./cycle/Actives";

export const FeedNotSession = ()=>{
    const { t } = useTranslation('common');

    return <Box sx={{padding:1}}>
      <Actives/>
    </Box>
}
