import { FC } from "react";
import GenericMosaicItem from "./GenericMosaicItem";
import { MosaicItem, Size } from "@/src/types";
import { Box, Stack } from "@mui/material";

type MosaicProps = {
    data: MosaicItem[];
    showSocialInteraction?: boolean;
    cacheKey:string[];
    customMosaicStyle?: { [key: string]: string };
    size?: Size,
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
      
    return <Stack gap={2} direction={'row'} flexWrap={'nowrap'} className="justify-content-xl-left">
        {data.map((i, idx: number) => (
            <Box key={`mosaic-${idx}-${i.type}`} className={`${mosaicBoxClassName}`} sx={{padding:'1rem .5rem'}}>
              <GenericMosaicItem 
                cacheKey={cacheKey} 
                item={i} 
                showSocialInteraction={showSocialInteraction} 
                customMosaicStyle={customMosaicStyle} 
                size={size} 
                userMosaicDetailed={userMosaicDetailed}
                sx={{
                  '.post-mosaic-img':{
                    height:'370px',
                  },
                  '.work-mosaic-img':{
                    height:'370px',
                  }
                }}
              />
            </Box>
        ))}
    </Stack>
  };
export default Mosaics;