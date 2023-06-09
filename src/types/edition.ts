import { Prisma } from '@prisma/client';

export type EditionMosaicItem = Prisma.EditionGetPayload<{
  include: {
    localImages: { select: { storedFile: true } };
  };
}>;

export interface CreateEditionPayload {
  cover: File;
  title: string;
  contentText?: string;
  countryOfOrigin?: string;
  publicationYear?: string;
  length?: string;
  language: string;
  ToCheck: boolean;
  workId: number;
}

export interface EditEditionPayload {
  cover?: File;
  title?: string;
  contentText?: string;
  countryOfOrigin?: string;
  publicationYear?: string;
  length?: string;
  language?: string;
  ToCheck?: boolean;
  workId?: number;
}