import { useCyclesActives } from "../hooks/useCyclesActives";
import dayjs from "dayjs";
import { Stack } from "@mui/material";
import {  useEffect } from "react";
import CycleActiveMosaicItem from "./CycleActiveMosaicItem";

export const Actives = ()=>{
    const{data:actives}=useCyclesActives();

    const GetDatesRange = (a:any)=>`${dayjs(a.startDate).format('YYYY-MM-DD')} - ${dayjs(a.endDate).format('YYYY-MM-DD')}`
  
    useEffect(()=>{
      document.querySelectorAll('img.MuiCardMedia-img')
        .forEach(img=>{
          (img as HTMLImageElement).onerror = (e:any)=>{
            e.currentTarget.src = '/img/default-avatar.png';
          }
        });
    },[]);

    return <Stack gap={2} sx={{padding:1}}>
        {
            actives?.map((a:any)=>
            {
              return <CycleActiveMosaicItem key={`mi-${a.id}`} 
              cycleId={a.id}
              participants={a.participants}
              usersJoined={a.usersJoined}
              title={a.creator.name??'unknown'} 
              description={a.contentText}
              localImages={a.localImages}
              subheader={GetDatesRange(a)}
              creatorImage={a.creator.image}
              creatorPhoto={(a.creator?.photos??[])[0]?.storedFile}
              creatorId={a.creator.id}
              creatorName={a.creator.name}
              access={a.access}
            />
            }
            )
        }
    </Stack>
}
