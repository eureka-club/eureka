import { Prisma } from '@prisma/client';

export type CommentMosaicItem = Prisma.CommentGetPayload<{
  include: {
    creator: {
      select: { id: true; name: true; image: true };
    };
    // work: true;
    // cycle: true;
    comments: {
      include: {
        creator: { select: { id: true; name: true; image: true } };
        comments: {
          include: {
            creator: { select: { id: true; name: true; image: true } };
          };
        };
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

interface CreateCommentClientPayloadBase {
  contentText: string;
  creatorId: number;
}
export interface CreateCommentAboutCycleClientPayload extends CreateCommentClientPayloadBase {
  selectedCycleId: number;
  selectedWorkId?: number;
  selectedCommentId?: number;
  selectedPostId?: number;
}
export interface CreateCommentAboutWorkClientPayload extends CreateCommentClientPayloadBase {
  selectedWorkId: number;
  selectedCycleId?: number;
  selectedCommentId?: number;
  selectedPostId?: number;
}
export interface CreateCommentAboutCommentClientPayload extends CreateCommentClientPayloadBase {
  selectedCommentId: number;
  selectedPostId?: number;
  selectedCycleId?: number;
  selectedWorkId?: number;
}
export interface CreateCommentAboutPostClientPayload extends CreateCommentClientPayloadBase {
  selectedPostId: number;
  selectedCycleId?: number;
  selectedWorkId?: number;
  selectedCommentId?: number;
}

export interface EditCommentAboutCycleClientPayload {
  id: string;
  contentText?: string;
  selectedCycleId?: number;
  selectedWorkId?: null;
  selectedCommentId?: null;
  creatorId?: number;
}

export interface EditCommentAboutWorkClientPayload {
  id: string;
  contentText?: string;
  selectedCycleId?: number | null;
  selectedWorkId?: number;
  selectedCommentId?: null;
  creatorId?: number;
}

export interface EditCommentAboutCommentClientPayload {
  id: string;
  contentText?: string;
  selectedCycleId?: number | null;
  selectedWorkId?: null;
  selectedCommentId?: number;
  creatorId?: number;
}

export interface CreateCommentServerFields {
  selectedCycleId?: string;
  selectedWorkId?: string;
  selectedCommentId?: string;
  selectedPostId?: string;
  contentText: string;
  creatorId: number;
}

export interface EditCommentServerFields {
  id: string;
  selectedCycleId?: string;
  selectedWorkId?: string;
  selectedCommentId?: string;
  selectedPostId?: string;
  contentText?: string[];
  creatorId?: number;
}

export interface CreateCommentServerPayload {
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
