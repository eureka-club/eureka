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
      select:{id:true;name:true;email:true}
    };
    localImages: {select:{
      storedFile:true
    }};
    //complementaryMaterials: true;
    guidelines: {
      select: {
        title: true;
        contentText: true;
      };
    };
    // participants:{
    //   select:{
    //     id:true;
    //     name:true;
    //     countryOfOrigin:true;
    //     favWorks:{select:{id:true}};
    //     ratingWorks:{select:{workId:true}};
    //     photos:{select:{storedFile:true}};
    //     notifications:{
    //       select:{
    //         viewed:true;
    //         notification:{select:{message:true;createdAt:true}}}
    //       }
    //   }
    // };     
    ratings: { 
      select: { 
        qty:true;
        userId:true;
      } 
    };
    favs: {
      select:{id:true}
    };
    cycleWorksDates: {
      select:{
        id:true;
        startDate:true;
        endDate:true;
        workId:true;
      }
    };
    comments:true;
    complementaryMaterials:true;
    
  }
}> & { type?: 'cycle' };

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
