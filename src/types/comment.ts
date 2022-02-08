import { Prisma } from '@prisma/client';

export type CommentMosaicItem = Prisma.CommentGetPayload<{
  include: {
    creator: {
      select: { id: true; name: true; image: true };
    };
    work: {include:{cycles:true}};
    cycle: true;
    post: {include:{cycles:true}};
    comments: {
      include: {
        creator: { select: { id: true; name: true; image: true } };
        comments: {
          include: {
            creator: { select: { id: true; name: true; image: true } };
          };
        };
        work: {include:{cycles:true}};
        cycle:true,
      };
    };
    // { include: { creator: true; comments: true } };
  };
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
