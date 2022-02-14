import { Prisma } from '@prisma/client';


export interface EditNotificationClientPayload {
  notificationId: number; 
  userId: string;
  data:{
    message?:string;
    contextURL?:string;
    viewed?: boolean;
  }
}

type NotificationIncludes = {
  include: {
    notification:true;
    user?:true;
  };
};

export type NotificationMosaicItem = Prisma.NotificationsOnUsersGetPayload<NotificationIncludes> & {
  type?: 'notification';
};
