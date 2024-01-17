import { Box, RatingProps } from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import RatingMUI from "./RatingMUI";
import { GiBrain } from 'react-icons/gi';
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
  const { t, dict } = useDictContext();
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