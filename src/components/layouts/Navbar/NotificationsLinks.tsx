import { Avatar, Badge, Box, Stack,Typography} from "@mui/material";
import MenuAction from "./MenuAction";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import useTranslation from "next-translate/useTranslation";
import Notifications from "../../Notifications";
import useNotifications from "@/src/useNotifications";
import { useSession } from "next-auth/react";

export const NotificationsLinks = () => {
  const { t } = useTranslation('navbar');

  const{data:session}=useSession();
  // if(!session?.user)return <></>;
  
  const{data:notificationsData}=useNotifications(session?.user?.id!);
  const{news}=notificationsData??{news:0};
  return <MenuAction key='NotificationsLinks' label={
    <Stack justifyContent={'center'} alignItems={'center'}>
      <Badge badgeContent={news} color="secondary">
        <Avatar sx={{width:32,height:32,bgcolor:'var(--color-primary)'}}>
          <IoNotificationsCircleOutline />
        </Avatar>
      </Badge>
      {/* <Typography variant="caption" gutterBottom>
          {t('Notifications')}
        </Typography> */}
    </Stack>
  }
  disabled={!notificationsData?.notifications.length}
  // title={t('Notifications')}
  >
    {
      notificationsData?.notifications.length
        ? <Box sx={{width:'350px'}}>
        <Notifications/>
      </Box>
      :<></>
    }
    
  </MenuAction>;
};