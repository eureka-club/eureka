"use client"

import { Box, RatingProps } from "@mui/material";
import React, {ReactNode} from "react";
import RatingMUI from "./RatingMUI";
import { t } from "@/src/get-dictionary";
import { useDictContext } from "@/src/hooks/useDictContext";

interface Props {
 stop?:number;
 qty:number;
 onChange:(value:number)=>void;
 readonly?:boolean;
 size?:RatingProps["size"];
 icon?:ReactNode;
 emptyIcon?:ReactNode;
 iconColor?:string;
}

const Rating:React.FC<Props> = ({qty,onChange:ock,readonly,size=undefined,icon=undefined,emptyIcon=undefined,iconColor="var(--eureka-green)"})=>{
//   const { t } = useTranslation('common');
    const {dict}=useDictContext()
    return <Box sx={{display:'flex'}}>
    {!readonly ? <span>{qty==0 ? t(dict,'Rate it') : t(dict,'My rating')}:</span> : <></>}
        <RatingMUI 
            icon={icon} 
            emptyIcon={emptyIcon} 
            size={size} 
            qty={qty} 
            onChange={ock} 
            readonly={readonly} 
            iconColor={iconColor}
        />
    </Box>
}
export default Rating;