import { Box, RatingProps } from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import RatingMUI from "./RatingMUI";
import { GiBrain } from 'react-icons/gi';
import useTranslation from 'next-translate/useTranslation';

interface Props {
 stop?:number;
 qty:number;
 onChange:(value:number)=>void;
 readonly?:boolean;
 size?:RatingProps["size"];
 icon?:ReactNode;
 emptyIcon?:ReactNode;
}

const Rating:React.FC<Props> = ({qty,onChange:ock,readonly,size=undefined,icon=undefined,emptyIcon=undefined})=>{
  const { t } = useTranslation('common');
    return <Box sx={{display:'flex'}}>
    {qty==0 ? <span>{t('Rate it')}</span> : <></>}
        <RatingMUI 
            icon={icon} 
            emptyIcon={emptyIcon} 
            size={size} 
            qty={qty} 
            onChange={ock} 
            readonly={readonly} 
        />
    </Box>
}
export default Rating;