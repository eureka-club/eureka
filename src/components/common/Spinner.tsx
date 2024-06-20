// import { CircularProgress } from "@mui/material";
import { FC } from "react";
import SpinnerSkeleton from "../SpinnerSkeleton";

interface Props{
  size?:'small'|'mediun'|'large';
}
const Spinner:FC<Props> = ({size})=>{
    // return <CircularProgress {... size ? {size:s} : {}}/>
    return <SpinnerSkeleton size={size}/>
}
export default Spinner;