"use client"

import useCycle from "@/src/hooks/useCycle";
import { useParams } from "next/navigation";
import { FC } from "react";

const Cycle:FC =  ()=>{
    const {id}=useParams()
    const {data:cycle} = useCycle(+id);
    return <><p>{cycle?.title}</p></>
}
export default Cycle;