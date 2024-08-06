import { Avatar, Badge, Box, Stack} from "@mui/material";
import MenuAction from "./MenuAction";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import Notifications from "../../Notifications";
import useNotifications from "@/src/useNotifications";
import { useSession } from "next-auth/react";
import { WEBAPP_URL } from "@/src/constants";
import { QueryClient, useMutation } from "react-query";
import { useEffect, useState } from "react";

export const NotificationsLinks = () => {
  const qc = new QueryClient();
  const{data:session}=useSession();
  
  const{data:notificationsData}=useNotifications(session?.user?.id!);
  const [news,setnews]=useState(0);

  useEffect(()=>{
    if(notificationsData && notificationsData.news>0)
      setnews(notificationsData?.news);
  },[notificationsData?.news])

  const SetNotificationsViewed = async ()=>{
    if(news!=0){
      const url = `${WEBAPP_URL}/api/notification/updateToVieweds`;
      const fr =  await fetch(url,{
        method:'post',
        headers:{
          'Content-type':'application/json'
        },
        body:JSON.stringify({
          userId:session?.user.id,
        })
      });
      if(fr.ok){
        const {modified} = await fr.json();
        return {modified}
      }
    }
  }

  const {mutate}=useMutation({
    mutationFn:SetNotificationsViewed,
    onMutate(){
      setnews(0);
    },
    async onSettled(data) {
      const ck = ['USER', `${session?.user.id}`, 'NOTIFICATIONS'];
      await qc.invalidateQueries(ck);
    },
  })

  
  return <>
    <style jsx global>{`
      .MuiPaper-elevation:has(ul.MuiMenu-list #hasNotNotifications){
        display:none;
      }
    `}</style>
    <MenuAction key='NotificationsLinks' label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <a onClick={()=>mutate()}>
          <Badge badgeContent={news} color="secondary">
            <Avatar  sx={{width:32,height:32,bgcolor:'var(--color-primary)'}}>
              <IoNotificationsCircleOutline />
            </Avatar>
          </Badge>
        </a>
      </Stack>
    }
    disabled={!notificationsData?.notifications.length}
    >
        {
          notificationsData?.notifications.length
            ? <Box sx={{width:'350px'}}>
            <Notifications/>
          </Box>
          :<i id="hasNotNotifications"></i>
        }
    </MenuAction>
  </>
};