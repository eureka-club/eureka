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

export const NotificationSumarySpec = {
  select: {
    notification:{select:{
      id:true,
      createdAt:true,
      message:true,
      contextURL:true,
      fromUser:{select:{id:true}},
    }},
    user:{select:{id:true}},
    viewed:true,
  },
};

export type NotificationSumary = Prisma.NotificationsOnUsersGetPayload<typeof NotificationSumarySpec> & {
  type?: 'notification';
};
