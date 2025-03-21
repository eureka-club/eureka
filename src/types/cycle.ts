import { Prisma } from '@prisma/client';
import { CycleWorkSpec } from './cycleWork';
import { UserSumarySpec } from './UserSumary';
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
export const CycleDetailSpec = {
  include: {
    creator: {
      select: { id: true, name: true, email: true, countryOfOrigin: true },
    },
    localImages: {
      select: {
        storedFile: true,
      },
    },
    guidelines: {
      select: {
        title: true,
        contentText: true,
      },
    },
    usersJoined: { select: { userId: true, pending: true } },
    ratings: { select: { userId: true, qty: true } },
    works: {
      include: {
        _count: { select: { ratings: true } },
        localImages: { select: { id:true,storedFile: true } },
        favs: { select: { id: true } },
        ratings: { select: { userId: true, qty: true } },
        readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
        posts: {
          select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
        },
        editions:{include:{localImages: { select: { id:true,storedFile: true } }}},
      },
    },
    favs: { select: { id: true } },
    cycleWorksDates: {
      select:CycleWorkSpec.select
    },
    participants:{select:{id: true, name: true, email: true, countryOfOrigin: true}},
    _count: {
      select: {
        // participants: true,
        ratings: true,
      },
    },
    complementaryMaterials: true,
  }
}
export type CycleDetail = Prisma.CycleGetPayload<typeof CycleDetailSpec> & {
  type?: 'cycle';
  currentUserIsCreator?: boolean;
  currentUserIsParticipant?: boolean;
  currentUserIsFav?: boolean;
  currentUserIsPending?: boolean;
  currentUserRating?: number;
  ratingCount?: number;
  ratingAVG?: number;
};

export const CycleSumarySpec = {
  select: {
    id:true,
    title:true,
    languages:true,
    access:true,
    // tags:true,
    product_id:true,
    price:true,
    priceInPlots:true,
    iterations:true,
    // topics:true,
    countryOfOrigin:true,
    startDate:true,
    endDate:true,
    createdAt:true,
    // updatedAt:true,
    creator: {
      select: {
        id:true,
        name:true,
        photos:true,
        image:true
      }
    },
    localImages: {
      select: {
        storedFile: true,
      },
    },
    participants:{
      select:{id:true},
    },
    usersJoined:{
      select:{userId:true,pending:true},
    }
    // usersJoined: { select: { userId: true, pending: true } },
    // ratings: { select: { userId: true, qty: true } },
    // favs: { select: { id: true } },
    // participants:{select:{id: true}},
  }
}
export type CycleSumary = Prisma.CycleGetPayload<typeof CycleSumarySpec> & {
  type: string;
  // joinPending:boolean;
  // joinCompleted:boolean;
  // currentUserRating?: number;
  // ratingCount?: number;
  // ratingAVG?: number;
}
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
  coverImage?: File|null;
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
