import { Prisma } from '@prisma/client';

export interface EditReactionClientPayload {
  postId: number, 
  userId: number,
  data:{
    emoji:string,
    doCreate:string,
  },
  createdAt?:Date,
  updatedAt?:Date,
}

export const ReactionDetailSpec = {
  include: {
    post:{select:{id:true}},
    user:{select:{id:true}},
  }
};

export type ReactionMosaicItem = Prisma.PostReactionGetPayload<typeof ReactionDetailSpec> & {
  type?: 'reaction';
};
