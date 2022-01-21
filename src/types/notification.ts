import { Prisma } from '@prisma/client';

export interface EditNotificationClientPayload {
  notificationId: number; 
  userId: number;
  data:{
    message?:string;
    contextURL?:string;
    viewed?: boolean;
  }
}

type NotificationIncludes = {
  include: {
    toUsers:{
      include:{
        user:true;
      }
    }
  };
};

export type NotificationMosaicItem = Prisma.NotificationGetPayload<NotificationIncludes> & {
  type?: 'notification';
};
