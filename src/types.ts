import { Cycle, Post, User, Work, Prisma } from '@prisma/client';

import { CycleDetail, CycleSumary } from './types/cycle';
import { PostSumary } from './types/post';
import { GoogleBooksProps, TMDBVideosProps, WorkSumary } from './types/work';
import { Session as S } from 'next-auth';
import { UserSumary } from './types/UserSumary';
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
export type MosaicItem = CycleSumary | PostSumary | WorkSumary //| UserSumary;
export type SearchResult = CycleSumary | PostSumary | WorkSumary | UserSumary;
export type APIMediaSearchResult = GoogleBooksProps | TMDBVideosProps;

export const isCycle = (obj: BasicEntity): obj is Cycle =>
  obj &&
  typeof (obj as Cycle).title === 'string' &&
  (obj as CycleDetail).startDate !== undefined &&
  (obj as CycleDetail).endDate !== undefined;
export const isPost = (obj: BasicEntity): obj is Post =>
  obj &&
  typeof (obj as Post).title === 'string' &&
  typeof (obj as Post).creatorId === 'number' &&
  typeof (obj as Post).language === 'string';
export const isWork = (obj: BasicEntity): obj is Work =>
  obj &&
  typeof (obj as Work).title === 'string' &&
  typeof (obj as Work).author === 'string' &&
  typeof (obj as Work).type === 'string';

export const isUser = (obj: BasicEntity): obj is User =>
  typeof (obj as User).roles === 'string' && typeof (obj as User).email === 'string';

// TODO separate type-guards for MosaicItem and SearchResult
export const isCycleMosaicItem = (obj: MosaicItem | SearchResult): obj is CycleSumary =>
  obj && 'type' in obj && obj.type == 'cycle';

export const isWorkMosaicItem = (obj: MosaicItem | SearchResult): obj is WorkSumary =>
  obj &&
  'type' in obj &&
  ['work', 'book', 'fiction-book', 'movie', 'documentary'].includes((obj as WorkSumary).type);

export const isPostMosaicItem = (obj: MosaicItem | SearchResult): obj is PostSumary =>
  obj && 'type' in obj && obj.type == 'post';

export const isBookGoogleBookApi = (obj: GoogleBooksProps | APIMediaSearchResult): obj is GoogleBooksProps =>
  obj && 'volumeInfo' in obj; ;

export const isVideoTMDB = (obj: TMDBVideosProps | APIMediaSearchResult): obj is TMDBVideosProps =>
  obj && 'release_date' in obj;

export const isUserMosaicItem = (obj: MosaicItem | SearchResult): obj is UserSumary =>
  obj && 'name' in obj && ('image' in obj || 'photos' in obj);

export interface NotifierResponse {
  data: Record<string, any>;
}
export interface NotifierRequest {
  toUsers: number[];
  data: Record<string, any>;
}

export interface GetAllByResonse {
  data: MosaicItem[];
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
export const CountrySpec={
  select: {
    label: true,
    code: true,
    parent: { select: { code: true, label:true } },
  }
}
export type Country = Prisma.TermGetPayload<typeof CountrySpec>;

export const Languages:Record<string,string> = {
  "en":"english",
  "es":"spanish",
  "pt":"portuguese",
  "fr":"french"
};

export const UserLanguages: Record<string, string> = {
  english: 'en',
  spanish: 'es',
  portuguese: 'pt',
  french: 'fr',
};

export type Size = 'small'|'medium'|'large';

export enum ActionType {
  CommentCreatedOnPost=1,
  CommentCreatedOnCycle=2,
  PostCreatedOnCycleActive=3,
  PostCreatedOnWork=4,
  CommentCreatedOnWork=5,
}
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
