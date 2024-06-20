import { CircularProgress } from "@mui/material";
import { FC } from "react";

interface Props{
    size ?:'small'|'large';
}
const Spinner:FC<Props> = ({size})=>{
    const s=size=='small' ? '1rem' : '2rem';
    return <CircularProgress size={s}/>
}
export default Spinner;