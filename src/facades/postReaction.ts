import { PostReaction } from '@prisma/client';
import {prisma} from '@/src/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ReactionMosaicItem } from '@/src/types/reaction';
dayjs.extend(utc);

export const find = async (userId: number,postId:number): Promise<ReactionMosaicItem | null> => {
  return prisma.postReaction.findFirst({
    include:{
      user:{select:{id:true}},
      post:{select:{id:true}},
    },
    where:{
      userId,
      postId
    }
  });
};

export const findAllByUser = async (userId: number): Promise<ReactionMosaicItem[] | null> => {
  return prisma.postReaction.findMany({
    orderBy: { updatedAt: 'desc' }, 
    include:{
      post:{select:{id:true}},
    },
    where:{
      userId,
    }
  });
};

export const findAllByPost = async (postId: number): Promise<ReactionMosaicItem[] | null> => {
  return prisma.postReaction.findMany({
    orderBy: { updatedAt: 'desc' }, 
    include:{
      user:{select:{id:true}},
    },
    where:{
      postId,
    }
  });
};

export const remove = async (userId: number,postId:number,unified:string): Promise<PostReaction> => {
  const pr = await  prisma.postReaction.delete({
    where: { userId_postId_unified:{
      userId,
      postId,
      unified
    } },
  });
  // if(pr){
  //   await prisma.user.update({
  //     where:{
  //       id:userId
  //     },
  //     data:{
  //       reactions:{
  //         disconnect:[{userId_postId:{postId,userId}}]
  //       }
  //     }
  //   })
  //   await prisma.post.update({
  //     where:{
  //       id:userId
  //     },
  //     data:{
  //       reactions:{
  //         disconnect:[{userId_postId:{postId,userId}}]
  //       }
  //     }
  //   })
  // }
  return pr;
};

export const update = async (
  postId: number, 
  userId: number,
  unified: string,
  emoji?:string
  )=>{
    try{
        const res = await prisma.postReaction.update({
          where:{userId_postId_unified:{
            userId,
            postId,
            unified
          }},
          data:{
            unified,
            emoji,
            updatedAt: dayjs.utc().format()
          }
        });
        if(!res)
          throw new Error('Error updating the reaction');
      // const {message, contextURL} = data;
      // return prisma.notification.update({
      //   data:{
      //     ... ('message' in data) && {message:data.message},
      //     ... ('contextURL' in data) && {contextURL:data.contextURL},
      //     updatedAt: dayjs.utc().format()
      //   },
      //   where:{id:notificationId}
      // });
      return res;
    }
    catch(e){
      console.error(e);
      throw new Error('Error updating the reaction');
    }
};
interface CreateProps{
  postId: number, 
  userId: number,
  unified: string,
  emoji:string
}
export const create = async (props:CreateProps): Promise<ReactionMosaicItem> => {
  const {postId,userId,unified,emoji} = props;
  const r = await prisma.postReaction.create({data:{
    emoji,
    unified,
    user:{connect:{id:userId}},
    post:{connect:{id:postId}},
   
    createdAt: dayjs.utc().format(),
    updatedAt: dayjs.utc().format()
  }});
  return r;
};


