import useNotifications from "@/src/useNotifications";
import { useSession } from "next-auth/react"
import MosaicItem from "../notification/MosaicItem";
import { List, ListItem, ListItemButton } from "@mui/material";

interface Props{
    onNotificationClick:(e:any,notificationId:number)=>void
}
const Notifications = ({onNotificationClick}:Props)=>{
    const{data:session}=useSession();
    
    const{data:notifications}=useNotifications(+session?.user?.id!);
    
    return <List sx={{maxWidth: 360}}>
        {notifications?.map(n=>{
            return <ListItem key={n.notification.id}>
                <ListItemButton onClick={(e)=>onNotificationClick(e,n.notification.id)}>
                    <MosaicItem notification={n}/>
                </ListItemButton>
            </ListItem>
        })}
    </List>
}
export default Notifications;