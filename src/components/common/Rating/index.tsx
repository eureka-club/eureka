import { Box, BoxProps, RatingProps } from "@mui/material";
import React, {ReactNode} from "react";
import RatingMUI from "./RatingMUI";

interface Props extends BoxProps {
 stop?:number;
 qty:number;
 OnChange:(value:number)=>void;
 readonly?:boolean;
 size?:RatingProps["size"];
 icon?:ReactNode;
 emptyIcon?:ReactNode;
 iconColor?:string;
}

const Rating:React.FC<Props> = ({qty,OnChange:ock,readonly,size=undefined,icon=undefined,emptyIcon=undefined,iconColor="var(--eureka-green)"})=>{
    return <Box>
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