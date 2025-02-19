import { Prisma } from '@prisma/client';
import { Session } from '../types';
import { UserSumarySpec } from './UserSumary';
import { storeUpload } from '../facades/fileUpload';

// export interface PostWithImages extends Post {
//   localImages: LocalImage[];
//   // type: string;
// }
export const PostDetailSpec = {
  include:{
    works:{select:{id:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
    cycles:{select:{id:true,localImages:{select:{storedFile:true}},creatorId:true,startDate:true,endDate:true,title:true}},
    favs:{select:{id:true,}},
    creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
    localImages: {select:{storedFile:true}},
    reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}},
  }
}
export type PostDetail = Prisma.PostGetPayload<typeof PostDetailSpec> & { 
  type?: 'post';
  currentUserIsFav?:boolean;
 };

 export const PostSumarySpec = {
  select:{
    id:true,
    title:true,
    contentText:true,
    language:true,
    createdAt:true,
    creator:{select:UserSumarySpec.select},
    localImages: {select:{storedFile:true}},
    favs:{select:{id:true,}},
    works:{select:{id:true,title:true}},
    cycles:{select:{id:true,title:true}},
    reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}}
  }
 }
 export type PostSumary = Prisma.PostGetPayload<typeof PostSumarySpec>&{
  type?: 'post';
  currentUserIsFav?:boolean;
 }
 
 export const PostOnActiveCycleSpec = {
  select:{
    id:true,
    localImages:{select:{storedFile:true}}
  }
 }
 export type PostOnActiveCycle = Prisma.PostGetPayload<typeof PostOnActiveCycleSpec>&{
  type:'post'
 }

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
  selectedCycleId?: string[];
  selectedWorkId?: string[];
  title: string[];
  language: string[];
  contentText: string[];
  isPublic: boolean[];
  topics?: string;
  tags?: string;
}

export interface EditPostServerFields {
  id: string;
  selectedCycleId?: string[];
  selectedWorkId?: string[];
  title?: string[];
  language?: string[];
  contentText?: string[];
  isPublic?: boolean[];
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

export const GetPostBySessionFilter = (session:Session|null)=>{
  if(session){
    return {
      OR:[
        {
          cycles:{
            some:{
              OR:[
                {access:1},
                {creatorId:session?.user.id},
                {participants:{some:{id:session?.user.id}}},  
              ]
            }
          }
        },
        {
          cycles:{
            none:{}
          }
        }
      ]}
    }
  else{
    return {
      OR:[
        {
          cycles:{
            some:{
              access:1,
            }
          }

        },
        {
          cycles:{
            none:{}
          }
        }
      ]
    }
  }
}