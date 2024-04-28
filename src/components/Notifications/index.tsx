import useNotifications from "@/src/useNotifications";
import { useSession } from "next-auth/react"
import MosaicItem from "../notification/MosaicItem";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NotificationSumary } from "@/src/types/notification";
import useTranslation from "next-translate/useTranslation";
import { BsEyeFill } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props{
    // onNotificationClick:(e:any,notificationId:number)=>void
}
const Notifications = ({}:Props)=>{
    const { t } = useTranslation('notification');
    const router=useRouter();
    const{data:session}=useSession();
    
    const notificationOnClick = (e: React.MouseEvent<Element>,  notification: NotificationSumary) => {
    e.preventDefault();
    /*if (notificationId) {
       const payload = {
         notificationId,
         userId,
         data: {
           viewed: true,
         }
       }
       execEditNotification(payload);
     }*/
    router.push(notification.notification.contextURL);
  }
    
    const{data}=useNotifications(+session?.user?.id!);
    const{notifications,total}=data??{notifications:[],total:0};
    
    return <List sx={{maxWidth: 360}}>
        {notifications?.map((n:NotificationSumary)=>{
            return <ListItem key={n.notification.id}>
                <ListItemButton onClick={(e)=>notificationOnClick(e,n)}>
                    <MosaicItem notification={n}/>
                </ListItemButton>
            </ListItem>
        })}
        {
            total>notifications.length
                ? <ListItem>
                    <Link href={`/notification`}>
                        <ListItemButton>
                            <ListItemText sx={{display:'inline-flex',color:'var(--color-primary)'}}>
                                {t('viewAllNotifications')}
                            </ListItemText>
                        </ListItemButton>
                    </Link>
                </ListItem>
                : <></>
        }
    </List>
}
export default Notifications;