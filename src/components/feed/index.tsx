import Masonry from "@mui/lab/Masonry";
import MosaicItem from "./cycle/MosaicItem";
import MosaicItemUser from '@/components/user/MosaicItem';
import { useCyclesActives } from "./cycle/hooks/useCyclesActives";
import dayjs from "dayjs";
import useTopics from "@/src/useTopics";

import Link from "next/link";
import { Avatar, Box, Card, CardActionArea, CardContent, CardMedia, Chip, IconButton, Stack, Typography } from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import useFeaturedUsers from "@/src/useFeaturedUsers";
import UserAvatar from "../common/UserAvatar";
import { AiOutlineEnvironment } from "react-icons/ai";
import slugify from "slugify";
import { useRouter } from "next/router";
import { SyntheticEvent, useEffect } from "react";
import { Actives } from "./cycle/Actives";

const getMediathequeSlug = (user:any)=>{
  if(user){
    const s =`${user.name}`
    const slug = `${slugify(s,{lower:true})}-${user.id}` 
    return slug
  }
  return ''
}

export const Feed = ()=>{
    const { t } = useTranslation('common');
    const router=useRouter();
    const{data:topics}=useTopics();
    const{data:actives}=useCyclesActives();
    const { data: users } = useFeaturedUsers();

    const GetDatesRange = (a:any)=>`${dayjs(a.startDate).format('YYYY-MM-DD')} - ${dayjs(a.endDate).format('YYYY-MM-DD')}`
  //  e.currentTarget.src = '/img/default-avatar.png';
  
    useEffect(()=>{
      document.querySelectorAll('img.MuiCardMedia-img')
        .forEach(img=>{
          (img as HTMLImageElement).onerror = (e:any)=>{
            e.currentTarget.src = '/img/default-avatar.png';
          }
        });
    },[]);

    return <Box sx={{padding:1}}>
      <Actives/>
    </Box>
}
