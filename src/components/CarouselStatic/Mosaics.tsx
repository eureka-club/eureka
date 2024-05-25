import { FC } from "react";
import GenericMosaicItem from "./GenericMosaicItem";
import { MosaicItem } from "@/src/types";
import { Box, Stack } from "@mui/material";

type MosaicProps = {
    data: MosaicItem[];
    showSocialInteraction?: boolean;
    cacheKey:string[];
    customMosaicStyle?: { [key: string]: string };
    size?: string,
    userMosaicDetailed?: boolean
    mosaicBoxClassName?:string;
}
const Mosaics:FC<MosaicProps> = ({
    data,
    showSocialInteraction = true,
    cacheKey,
    customMosaicStyle,
    size,
    userMosaicDetailed,
    mosaicBoxClassName
  }) => {
    if(!data)return <></>;
      
    return <Stack gap={2 } direction={'row'} flexWrap={'nowrap'} className="justify-content-xl-left">
        {data.map((i, idx: number) => (
            <Box key={`mosaic-${idx}-${i.type}`} className={`${mosaicBoxClassName}`}>
              <GenericMosaicItem cacheKey={cacheKey} item={i} showSocialInteraction={showSocialInteraction} customMosaicStyle={customMosaicStyle} size={size} userMosaicDetailed={userMosaicDetailed}/>
            </Box>
        ))}
    </Stack>
  };
export default Mosaics;