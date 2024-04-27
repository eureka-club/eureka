import { Prisma } from '@prisma/client';
import { UserSumarySpec } from './UserSumary';


export interface EditNotificationClientPayload {
  notificationId: number; 
  userId: number;
  data:{
    message?:string;
    contextURL?:string;
    viewed?: boolean;
  }
}

export const NotificationSumarySpec = {
  select: {
    notification:{select:{
      id:true,
      createdAt:true,
      message:true,
      contextURL:true,
      fromUser:{select:UserSumarySpec.select},
    }},
    user:{select:{id:true}},
    viewed:true,
  },
};

export type NotificationSumary = Prisma.NotificationsOnUsersGetPayload<typeof NotificationSumarySpec> & {
  type?: 'notification';
};
