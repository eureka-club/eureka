// import { CircularProgress } from "@mui/material";
import { FC } from "react";
import SpinnerSkeleton from "../SpinnerSkeleton";
import { Box, BoxProps } from "@mui/material";

interface Props extends BoxProps{
  size?:'small'|'mediun'|'large';
} 
const Spinner:FC<Props> = ({size,...others})=>{
    // return <CircularProgress {... size ? {size:s} : {}}/>
    return <Box {...others}>
        <SpinnerSkeleton size={size}/>
      </Box>
}
export default Spinner;