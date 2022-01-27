import { Cycle, Comment, User, Work, Post } from '@prisma/client';

import { CreateCommentServerPayload, CommentMosaicItem } from '../types/comment';
import prisma from '../lib/prisma';
import { Exception } from 'handlebars';
import comment from 'pages/api/comment';

export const find = async (id: number): Promise<CommentMosaicItem | null> => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      creator: { select: { id: true, name: true, image: true } },
      work: true,
      cycle: true,
      comments: {
        include: {
          creator: { select: { id: true, name: true, image: true } },
          comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
        },
      },
    },
  });
};

export const findAll = async (): Promise<CommentMosaicItem[]> => {
  return prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      creator: { select: { id: true, name: true, image: true } },
      work: true,
      cycle: true,
      comments: {
        include: {
          creator: { select: { id: true, name: true, image: true } },
          comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
        },
      },
    },
  });
};

export const search = async (query: { [key: string]: string | string[] }): Promise<Comment[]> => {
  const { q, where } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.comment.findMany({
      where: { contentText: { contains: q } },
      // ...(typeof include === 'string' && { include: JSON.parse(include) }),
      include: { creator: true, work: true, cycle: true, comment: true },
    });
  }

  return prisma.comment.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    include: { creator: true, work: true, cycle: true, comment: true },
  });
};

export const createFromServerFields = async (fields: CreateCommentServerPayload, creator: User): Promise<Comment> => {
  const payload = Object.entries(fields).reduce((memo, [fieldName, fieldValue]) => {
    switch (fieldName) {
      case 'selectedCycleId':
      case 'selectedWorkId':
      case 'selectedCommentId':
        return { ...memo, [fieldName]: Number(fieldValue) };
      default:
        return { ...memo, [fieldName]: fieldValue };
    }
  }, {} as CreateCommentServerPayload);

  let existingCycle: Cycle | null = null;
  if (payload.selectedCycleId) {
    existingCycle = await prisma.cycle.findUnique({ where: { id: payload.selectedCycleId } });
    if (existingCycle == null) {
      throw new Error('[412] Invalid Cycle ID provided');
    }
  }

  let existingWork: Work | null = null;
  if (payload.selectedWorkId) {
    existingWork = await prisma.work.findUnique({ where: { id: payload.selectedWorkId } });
    if (existingWork == null) {
      throw new Error('[412] Invalid Work ID provided');
    }
  }

  let existingComment: Comment | null = null;
  if (payload.selectedCommentId) {
    existingComment = await prisma.comment.findUnique({ where: { id: payload.selectedCommentId } });
    if (existingComment == null) {
      throw new Error('[412] Invalid Comment ID provided');
    }
  }

  let existingPost: Post | null = null;
  if (payload.selectedPostId) {
    existingPost = await prisma.post.findUnique({ where: { id: payload.selectedPostId } });
    if (existingPost == null) {
      throw new Error('[412] Invalid Post ID provided');
    }
  }

  return prisma.comment.create({
    data: {
      contentText: payload.contentText,
      creator: { connect: { id: creator.id } },
      ...(existingCycle && { cycle: { connect: { id: existingCycle.id } } }),
      ...(existingWork && { work: { connect: { id: existingWork.id } } }),
      ...(existingComment && { comment: { connect: { id: existingComment.id } } }),
      ...(existingPost && { post: { connect: { id: existingPost.id } } }),
    },
  });
};

export const remove = async (comment: CommentMosaicItem): Promise<Comment> => {
  if (comment.cycleId) {
    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        cycle: {
          disconnect: true,
        },
      },
    });
  }

  if (comment.workId) {
    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        work: {
          disconnect: true,
        },
      },
    });
  }

  if (comment.commentId) {
    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        comment: {
          disconnect: true,
        },
      },
    });
  }

  return prisma.comment.delete({
    where: { id: comment.id },
  });
};

export const update = async (commentId: number, contentText: string, status: number): Promise<Comment|null> => {
  if (commentId) {
    if(!contentText){
      const comment = await find(commentId);
      if(comment){
        if(comment.comments && comment.comments.length){
          throw new Exception('Comment can not be deletede because has comments related');
        }
        const res = await remove(comment);
        return res ? comment : null;
      }
      // return prisma.comment.delete({where:{ id: commentId }});
    }
    return prisma.comment.update({
      where: { id: commentId },
      data: {
        contentText,
        status,
      },
    });
  }
  return null;
};

