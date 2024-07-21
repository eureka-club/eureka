import MosaicItem from "./MosaicItem";
import { useCyclesActives } from "./hooks/useCyclesActives";
import dayjs from "dayjs";
import { Box, Stack } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import {  useEffect } from "react";
import { AZURE_STORAGE_URL } from '@/src/constants';


export const Actives = ()=>{
    const { t } = useTranslation('common');
    const router=useRouter();
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
    const creatorImage = (user:any)=>{
      if(user.photos.length){
        return `${AZURE_STORAGE_URL}/users-photos/${user.photos[0].storedFile}`;
      }
      return user.image!;
    }

    return <Stack gap={2} sx={{padding:1}}>
        {
            actives?.map((a:any)=>
            {
              return <MosaicItem key={`mi-${a.id}`} 
              cycleId={a.id}
              title={a.creator.name??'unknown'} 
              description={a.contentText}
              image={a.localImages[0].storedFile}
              subheader={GetDatesRange(a)}
              creatorImage={a.creator.image}
              creatorPhoto={(a.creator?.photos??[])[0]?.storedFile}
              creatorId={a.creator.id}
              creatorName={a.creator.name}
            />
            }
            )
        }
    </Stack>
}
