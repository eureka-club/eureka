import { Prisma } from '@prisma/client';


export type CommentMosaicItem = Prisma.CommentGetPayload<{
  include: {
    creator: {
      include: { photos:true };
    };
    cycle: {
      select:{
        id:true;
        title:true;
        creatorId:true;
        participants:{select:{id:true}};
        comments: {
          select: {
            creator: { select: { photos:true } };
          };
        }
      }
    };
    work:{
      select:{
        id:true;
        title:true;
        comments: {
          select: {
            creator: { select: { photos:true } };
          };
      }}
    };
    post:{
      select:{
        id:true;
        title:true;
        comments: {
          select: {
            creator: { select: { id:true;photos:true } };
          };
        }
    };
    };
    comment:{
      select: {
        id:true;
        creator: { select: { id:true;photos:true } };
        comments: {
          select: {
            creator: { select: { id:true;photos:true } };
          };
        };
        work: {include:{cycles:true}};
        cycle:{select:{participants:{select:{id:true}}}};
      }
    };
    comments: {
      include: {
        creator: { select: { id:true;photos:true } };
        comments: {
          select: {
            creator: { select: { id:true;photos:true } };
          };
        };
        work: {include:{cycles:true}};
        cycle:{select:{participants:{select:{id:true}}}};
      };
    };
  }
}> & { type?: 'comment' };


export type CommentWithCycleWorkComment = Prisma.CommentGetPayload<{
  include: {
    cycle: true;
    work: true;
    comment: true;
  };
}>;



interface CreateNotificationClientPayload{
  notificationMessage:string;
  notificationContextURL:string;
  notificationToUsers:number[];
}
interface CreateCommentClientPayloadBase extends CreateNotificationClientPayload{
  contentText: string;
  creatorId: number;
}
export interface CreateCommentClientPayload extends CreateCommentClientPayloadBase {
  selectedCycleId?: number;
  selectedWorkId?: number;
  selectedCommentId?: number;
  selectedPostId?: number;
}

export interface EditCommentClientPayload {
  id: string;
  contentText?: string;
  selectedCycleId?: number;
  selectedWorkId?: null;
  selectedCommentId?: null;
  creatorId?: number;
}

export interface CreateCommentServerPayload  extends CreateNotificationClientPayload {
  selectedCycleId?: number;
  selectedWorkId?: number;
  selectedCommentId?: number;
  selectedPostId?: number;
  contentText: string;
  creatorId: number;
}

export interface EditCommentServerPayload {
  id: string;
  selectedCycleId?: number;
  selectedWorkId?: number;
  selectedCommentId?: number;
  selectedPostId?: number;
  contentText?: string;
  creatorId?: number;
}
