import { Box, Button, Stack, Typography } from "@mui/material";
import MenuAction from "./MenuAction";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { Person, Settings } from "@mui/icons-material";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import Notifications from "../../Notifications";

export const NotificationsLinks = () => {
    const { t } = useTranslation('navbar');
    
    const onNotificationClickHandler=(e:any,id:number)=>{
      alert(id)
    }

    const notificationLinksInfo = [
        {label:'',link:'/a',icon:<Person />},
        {label:t('B'),link:'/b',icon:<Settings fontSize="small" />},
    ];
    return <MenuAction key='NotificationsLinks' label={
      <Stack justifyContent={'center'} alignItems={'center'}>
        <IoNotificationsCircleOutline fontSize={'2rem'} />
      </Stack>
    }
    title={t('Account')}
    
    >
      <Box sx={{width:'300px'}}>
        <Notifications onNotificationClick={onNotificationClickHandler}/>
      </Box>
    </MenuAction>;
  };