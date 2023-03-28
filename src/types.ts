import { Cycle, Post, User, Work, Prisma } from '@prisma/client';

import { CycleMosaicItem } from './types/cycle';
import { PostMosaicItem } from './types/post';
import { WorkMosaicItem } from './types/work';
import { UserMosaicItem } from '@/src/types/user';
import {Session as S} from 'next-auth'
export interface FileUpload {
  fieldName: string;
  originalFilename: string;
  path: string;
  headers: Record<string, string>;
  size: number;
}

export type Session = S;

// export interface Session {
//   accessToken?: string;
//   expires: string;
//   user: Prisma.UserGetPayload<{
//     include:{
//       photos:true, 
//       notifications:{include:{notification:true}}
//     }
//   }>;
// }



export interface StoredFileUpload {
  contentHash: string;
  originalFilename: string;
  storedFile: string;
  mimeType: string;
}

export interface MySocialInfo {
  favoritedByMe?: boolean | undefined;
  // likedByMe: boolean | undefined;
  // readOrWatchedByMe?: boolean | undefined;
  ratingByMe?: boolean | undefined;
}

/*
 * TS type guards
 */

export type BasicEntity = Cycle | Post | Work | User | Comment;
export type MosaicItem = CycleMosaicItem | PostMosaicItem | WorkMosaicItem | UserMosaicItem;
export type SearchResult = CycleMosaicItem | PostMosaicItem | WorkMosaicItem | UserMosaicItem;

export const isCycle = (obj: BasicEntity): obj is Cycle =>
  obj && typeof (obj as Cycle).title === 'string' &&
  (obj as CycleMosaicItem).startDate !== undefined &&
  (obj as CycleMosaicItem).endDate !== undefined;
export const isPost = (obj: BasicEntity): obj is Post =>
  obj && typeof (obj as Post).title === 'string' &&
  typeof (obj as Post).creatorId === 'number' &&
  typeof (obj as Post).language === 'string';
export const isWork = (obj: BasicEntity): obj is Work =>
  obj && typeof (obj as Work).title === 'string' &&
  typeof (obj as Work).author === 'string' &&
  typeof (obj as Work).type === 'string';

export const isUser = (obj: BasicEntity): obj is User =>
  typeof (obj as User).roles === 'string' && typeof (obj as User).email === 'string';


// TODO separate type-guards for MosaicItem and SearchResult
export const isCycleMosaicItem = (obj: MosaicItem | SearchResult): obj is CycleMosaicItem => 
  obj && ('type' in obj && obj.type=='cycle');

  
export const isWorkMosaicItem = (obj: MosaicItem | SearchResult): obj is WorkMosaicItem =>
  obj && ('type'in obj) && ['work','book', 'fiction-book', 'movie', 'documentary'].includes((obj as WorkMosaicItem).type);

export const isPostMosaicItem = (obj: MosaicItem | SearchResult): obj is PostMosaicItem => 
  obj && ('type' in obj && obj.type=='post');
  

export const isUserMosaicItem = (obj: MosaicItem | SearchResult): obj is UserMosaicItem =>
  obj && 'name' in obj && ('image' in obj || 'photos' in obj);

export interface NotifierResponse{
    data: Record<string,any>;
  } 
export  interface NotifierRequest {
    toUsers: number[];
    data: Record<string,any>;
  }

  export interface GetAllByResonse{
    data: (WorkMosaicItem|CycleMosaicItem)[];
    extraCyclesRequired: number;
    extraWorksRequired: number;
    hasMore: boolean;
    nextCursor: number;
    prevCursor: number;
    status: string;
    totalCycles: number;
    totalWorks: number;
}

// export interface Country {
//   id:number; 
//   taxonomyCode:string;
//   parentId:number;
//   creatorId:number;
//   label:string;
//   code: string;
//   description:string;
  
//   parent:{
//     code:string;
//   }



// }

export type Country = Prisma.TermGetPayload<{
  select:{
    label:true,
    code:true,
    parent:{select:{code:true}}
  }
}>

/**
 * 
 {
id: 103,
taxonomyCode: "region",
parentId: 17,
creatorId: 1,
label: "Afghanistan",
code: "afghanistan",
description: "Afghanistan",
weight: 1,
createdAt: "2021-08-11T15:13:01.000Z",
updatedAt: "2021-08-11T15:13:01.000Z",
parent: {
code: "Asia"
}
}
 */
