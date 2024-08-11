import { useCyclesActives } from "../hooks/useCyclesActives";
import { Stack } from "@mui/material";
import {  useEffect } from "react";
import CycleActiveMosaicItem from "./CycleActiveMosaicItem";

export const Actives = ()=>{
    const{data:actives}=useCyclesActives();
  
    useEffect(()=>{
      document.querySelectorAll('img.MuiCardMedia-img')
        .forEach(img=>{
          (img as HTMLImageElement).onerror = (e:any)=>{
            e.currentTarget.src = '/img/default-avatar.png';
          }
        });
    },[]);

    return <Stack gap={2} 
    // sx={{padding:1}}
    >
        {
            actives?.map((a:any)=>
            {
              return <CycleActiveMosaicItem key={`mi-${a.id}`} 
              cycleId={a.id}
              description={a.contentText}
            />
            }
            )
        }
    </Stack>
}
