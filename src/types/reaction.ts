import { Prisma } from '@prisma/client';

export interface EditReactionClientPayload {
  postId: number; 
  userId: number;
  data:{
    emoji?:string;
    doCreate?:string;
  }
}

type ReactionIncludes = {
  include: {
    post?:{select:{id:true}};
    user?:{select:{id:true}};
  };
};

export type ReactionMosaicItem = Prisma.PostReactionsGetPayload<ReactionIncludes> & {
  type?: 'reaction';
};
