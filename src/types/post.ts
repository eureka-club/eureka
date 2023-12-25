import { Prisma } from '@prisma/client';

// export interface PostWithImages extends Post {
//   localImages: LocalImage[];
//   // type: string;
// }

export type PostMosaicItem = Prisma.PostGetPayload<{
  include:{
    works:{select:{id:true,author:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
    cycles:{select:{id:true,access:true,localImages:{select:{storedFile:true}},creatorId:true,startDate:true,endDate:true,title:true,participants:{select:{id:true}}}},
    favs:{select:{id:true,}},
    creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
    localImages: {select:{storedFile:true}},
    reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}},
  }
}> & { 
  type?: 'post';
  currentUserIsFav?:boolean;
 };
// export type PostDetail = Prisma.PostGetPayload<{
//   include: {
//     creator: true;
//     localImages: true;
//     cycles: { include: { localImages: true } };
//     works: true;
//     likes: true;
//     favs: true;
//   };
// }> & { type?: string };

export type PostWithCyclesWorks = Prisma.PostGetPayload<{
  include: {
    cycles: true;
    works: true;
    comments: true;
  };
}>;

interface CreatePostClientPayloadBase {
  title: string;
  image: File;
  language: string;
  contentText: string;
  isPublic: boolean;
  topics?: string;
  tags?: string;
}
export interface CreatePostAboutCycleClientPayload extends CreatePostClientPayloadBase {
  selectedCycleId: number;
  selectedWorkId: null;
}

export interface EditPostAboutCycleClientPayload {
  id: string;
  title?: string;
  image?: File;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  selectedCycleId?: number | null;
  selectedWorkId?: null;
  topics?: string;
  tags?: string;
}
export interface CreatePostAboutWorkClientPayload extends CreatePostClientPayloadBase {
  selectedCycleId: number | null;
  selectedWorkId: number;
}

export interface EditPostAboutWorkClientPayload {
  id: string;
  title?: string;
  image?: File;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  selectedCycleId?: number | null;
  selectedWorkId?: number;
  topics?: string;
  tags?: string;
}

export interface CreatePostServerFields {
  selectedCycleId?: number;
  selectedWorkId?: number;
  title: string;
  language: string;
  contentText: string;
  isPublic: boolean;
  topics?: string;
  tags?: string;
  notificationToUsers:string;
  notificationMessage:string;
  notificationContextURL:string;
}

export interface EditPostServerFields {
  id: number;
  selectedCycleId?: number
  selectedWorkId?: number;
  title?: string;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  topics?: string;
  tags?: string;
}

export interface CreatePostServerPayload {
  selectedCycleId?: number;
  selectedWorkId?: number;
  title: string;
  language: string;
  contentText: string;
  isPublic: boolean;
  topics?: string;
  tags?: string;
}

export interface EditPostServerPayload {
  id: string;
  selectedCycleId?: number;
  selectedWorkId?: number;
  title?: string;
  language?: string;
  contentText?: string;
  isPublic?: boolean;
  topics?: string;
  tags?: string;
}
