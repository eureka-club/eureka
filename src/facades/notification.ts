import { Prisma, Notification } from '@prisma/client';
import prisma from '../lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
/* export interface findProps {
  id: number;
  select?: Record<string, boolean>;
  include?: boolean;
} */
export const find = async (id: number): Promise<Notification | null> => {
  return prisma.notification.findUnique({
    where: { id },
  });
};

export const findAll = async (userId: number): Promise<Notification[] | null> => {
  return prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    where:{
      toUsers:{
        every:{
          userId
        }
      }
    }
  });
};

//TODO requires detach from NotificationsOnUsers
export const remove = async (id: number): Promise<Notification> => {
  return prisma.notification.delete({
    where: { id },
  });
};

export const update = async (
  notificationId: number, 
  userId: number,
  data:{
    message?:string,
    contextURL?:string,
    viewed?: boolean,
  },
  //TODO maybe it is not needed :|. Requires detach from NotificationsOnUsers 
  // fromUser:number,
  // toUsers:number[]
  )=>{
    try{debugger;
      if('viewed' in data){
        const {viewed} = data;        
        const nou = await prisma.notificationsOnUsers.update({
          where:{userId_notificationId:{
            userId,
            notificationId
          }},
          data:{
            viewed
          }
        });
        if(!nou)
          throw new Error('Error updating the notification');
      }
      const {message, contextURL} = data;
      return prisma.notification.update({
        data:{
          ... ('message' in data) && {message:data.message},
          ... ('contextURL' in data) && {contextURL:data.contextURL},
          updatedAt: dayjs.utc().format()
        },
        where:{id:notificationId}
      });
    }
    catch(e){
      console.error(e);
      throw new Error('Error updating the notification');
    }
};

export const create = async (
  message:string,
  contextURL:string,
  fromUser:number,
  toUsers:number[]
): Promise<Notification> => {
  return prisma.notification.create({data:{
    message,
    contextURL,
    fromUser:{connect:{id:fromUser}},
    toUsers:{createMany:{
      data: toUsers.map((id:number)=>({userId:id}))
    }},
    createdAt: dayjs.utc().format(),
    updatedAt: dayjs.utc().format()
  }});
};
