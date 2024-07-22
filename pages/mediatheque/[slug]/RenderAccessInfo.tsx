import { Session } from "@/src/types";
import { UserDetail } from "@/src/types/user";
import { Alert } from "@mui/material";
import { FC } from "react";
import {isAccessAllowed} from '@/src/lib/utils';

interface Props{
    user:UserDetail;
    t:(val:string)=>string;
    isLoadingUser:boolean;
    isFollowedByMe:boolean;
    session:Session
}
const RenderAccessInfo:FC<Props> = ({session,user,t,isLoadingUser,isFollowedByMe}) => {
    if (!(isLoadingUser)) {
      if (user) {
        const aa = isAccessAllowed(session,user,isLoadingUser,isFollowedByMe);
        if (user.dashboardType === 3 && !aa)
          return <Alert variant="filled" severity="warning">{t('secretMediathequeNotification')}</Alert>;
        if (!aa) return <Alert variant="filled" color="warning">{t('notAuthorized')}</Alert>;
      }
    }
    return <></>;
  };

  export default RenderAccessInfo