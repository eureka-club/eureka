import { Prisma } from '@prisma/client';
export interface ComplementaryMaterial {
  author: string;
  title: string;
  publicationDate: Date;
  link: string | null;
  file: File | null;
}

export type CycleWithImages = Prisma.CycleGetPayload<{
  include: {
    localImages: {select:{
      storedFile:true
    }};
  };
}>;

export type CycleMosaicItem = Prisma.CycleGetPayload<{
  include: {
    creator:{
      select:{id:true;name:true;email:true;countryOfOrigin:true}
    };
    localImages: {select:{
      storedFile:true
    }};
    guidelines: {
      select: {
        title: true;
        contentText: true;
      };
    };
    usersJoined:true;
    participants:true;
    works:{include:{
      localImages: {select:{storedFile:true}};
      _count:{select:{ratings:true}};
    }};
    favs: {
      select:{id:true}
    };
    cycleWorksDates: {
      select:{
        id:true;
        startDate:true;
        endDate:true;
        workId:true;
        work:{
          include:{
            localImages: {select:{storedFile:true}};
            _count:{select:{ratings:true}};
          }
        };
      }
    };
    _count:{
      select:{
        participants:true;
        ratings:true;
      },
    };
    complementaryMaterials:true;
  }
}> & { 
  type?: 'cycle';
  currentUserIsCreator?:boolean;
  currentUserIsParticipant?:boolean;
  currentUserIsFav?:boolean; 
  currentUserIsPending?:boolean;
  currentUserRating?:number;
  ratingCount?:number;
  ratingAVG?:number;
};

// export type CycleDetail = Prisma.CycleGetPayload<{
//   include: {
//     creator: true;
//     localImages: true;
//     complementaryMaterials: true;
//     participants: true;
//     favs: true;
//     works: true;
//     ratings: true;
//     posts: true;
//   };
// }> & { type?: string };

export interface CreateCycleClientPayload {
  includedWorksIds: number[];
  coverImage: File;
  title: string;
  languages: string;
  startDate: string;
  countryOfOrigin?: string;
  endDate: string;
  contentText: string;
  complementaryMaterials: ComplementaryMaterial[];
  guidelines: Prisma.GuidelineCreateManyCycleInput[];
  topics?: string;
  access: number;
  cycleWorksDates?: {
    [workId: string]: { startDate?: string; endDate?: string };
  };
}

export interface EditCycleClientPayload {
  id: number;
  includedWorksIds?: number[];
  coverImage?: File;
  access: number;
  title?: string;
  languages?: string;
  startDate?: string;
  endDate?: string;
  countryOfOrigin?: string | null;
  contentText?: string;
  complementaryMaterials?: ComplementaryMaterial[];
  tags?: string;
  topics?: string;
}

export interface CreateCycleServerFields {
  includedWorksIds: string[];
  isPublic: boolean[];
  title: string[];
  languages: string[];
  startDate: string[];
  endDate: string[];
  countryOfOrigin?: string[];
  contentText: string[];
}

export interface EditCycleServerFields {
  // includedWorksIds: string[];
  id: number;
  isPublic?: boolean[];
  title?: string[];
  languages?: string[];
  startDate?: string[];
  endDate?: string[];
  countryOfOrigin?: string[];
  contentText?: string[];
  tags?: string;
  topics?: string;
}

export interface CreateCycleServerPayload {
  isPublic: boolean;
  title: string;
  languages: string;
  contentText: string;
  startDate: Date;
  endDate: Date;
  countryOfOrigin?: string;
}

export interface EditCycleServerPayload {
  id: number;
  isPublic?: boolean;
  title?: string;
  languages?: string;
  contentText?: string;
  startDate?: Date;
  endDate?: Date;
  countryOfOrigin?: string;
  tags?: string;
  topics?: string;
}
