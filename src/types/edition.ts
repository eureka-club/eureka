import { Prisma } from '@prisma/client';

export const EditionDetailSpec = {
  localImages: { select: { id:true, storedFile: true } }
} satisfies Prisma.EditionInclude;

export type EditionDetail = Prisma.EditionGetPayload<{
  include: typeof EditionDetailSpec
}>;

export interface CreateEditionPayload {
  cover: File;
  title: string[];
  contentText?: string[];
  countryOfOrigin?: string[];
  publicationYear?: string;
  length?: string[];
  language: string[];
  ToCheck?: boolean;
  workId: number;
}
export interface CreateEditionServerPayload {
  title:string,             
  isbn:string,               
  contentText:string,
  publicationYear:Date|string,
  language:string,
  countryOfOrigin:string,
  length:string,
  workId:number,
  ToCheck:boolean,
  creatorId:number,
  localImages?:{id:number}[],
  createdAt?:Date|string,
  updatedAt?:Date|string
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