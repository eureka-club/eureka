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
    localImages: true;
  };
}>;

export type CycleMosaicItem = Prisma.CycleGetPayload<{
  include: {
    creator: {include:{photos:true}};
    localImages: true;
    complementaryMaterials: true;
    participants: {include:{photos:true}};
    favs: true;
    cycleWorksDates: true;
    ratings: true;
    posts: {
      include: {
        creator: {include:{photos:true}};
        localImages: true;
        works: {
          include: {
            localImages: true;
          };
        };
        cycles: {
          include: {
            localImages: true;
          };
        };
        likes: true;
        favs: true;
        comments: {
          include: {
            creator: { include: { photos:true } };
            comments: {
              include: {
                creator: { include: { photos:true } };
              };
            };
            work: {include:{cycles:true}};
            cycle:true,
          };
        };
      }
    };
    works:{
      include: {
        localImages: true;
        favs: true;
        ratings: true;
        comments: true;
        posts: {include: {
          creator: {include:{photos:true}};
          localImages: true;
          works: {
            include: {
              localImages: true;
            };
          };
          cycles: {
            include: {
              localImages: true;
            };
          };
          likes: true;
          favs: true;
          comments: {
            include: {
              creator: { include: { photos:true } };
              comments: {
                include: {
                  creator: { include: { photos:true } };
                };
              };
              work: {include:{cycles:true}};
              cycle:true,
            };
          };
        }};
        cycles: true;
      };
    };
    comments: {
      include: {
        creator: { include: { photos:true } };
        comments: {
          include: {
            creator: { include: { photos:true } };
          };
        };
        work: {include:{cycles:true}};
        cycle:true,
      };
    };
    guidelines: {
      select: { title: true; contentText: true };
    };
  };
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
