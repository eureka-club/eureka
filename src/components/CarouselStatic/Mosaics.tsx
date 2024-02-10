import { FC } from "react";
import GenericMosaicItem from "./GenericMosaicItem";
import { MosaicItem } from "@/src/types";

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
      
    return <div className="d-flex flex-nowrap w-100 justify-content-xl-left">
        {data.map((i, idx: number) => (
            <div key={`mosaic-${i.id}-${i.type}`} className={`${mosaicBoxClassName} mx-2`}/*className="pb-5 mx-2"*/>
            <GenericMosaicItem item={i} showSocialInteraction={showSocialInteraction} customMosaicStyle={customMosaicStyle} size={size} userMosaicDetailed={userMosaicDetailed} cacheKey={cacheKey}/>
            </div>
        ))}
    </div>
  };
export default Mosaics;