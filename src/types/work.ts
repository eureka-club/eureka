import { Edition, Prisma } from '@prisma/client';

// export type WorkDetail = Prisma.WorkGetPayload<{
//   include: {
//     localImages: true;
//     favs: true;
//     ratings: true;
//   };
// }>;

export const getWorksProps = (terms:string[])=>{
  return {
    OR: [
      {
        AND: terms.map((t) => ({
          title: { contains: t },
        })),
      },
      {
        AND: terms.map((t) => ({
          contentText: { contains: t },
        })),
      },
      {
        AND: terms.map((t) => ({
          tags: { contains: t },
        })),
      },
      {
        AND: terms.map((t) => ({
          topics: { contains: t },
        })),
      },
      {
        editions:{
          some:{
            OR:[
              {
                AND: terms.map((t) => ({
                  title: { contains: t },
                })),
              },
              {
                AND: terms.map((t) => ({
                  contentText: { contains: t },
                })),
              },
      
            ]
          }
        }
      }
    ],
  }
};

export type WorkWithImages = Prisma.WorkGetPayload<{
  include: {
    localImages: {select:{storedFile:true}}
  };
}>;

export const WorkDetailSpec = {
  include: {
    localImages: { select: { id:true, storedFile: true } },
    favs: { select: { id: true } },
    ratings: { select: { userId: true, qty: true } },
    readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
    posts: {
      select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
    },
    editions:{include:{localImages: { select: { id:true, storedFile: true } }}},
    _count: {
      select: {
        ratings: true,
      },
    },
  }
}
export type WorkDetail = Prisma.WorkGetPayload<typeof WorkDetailSpec> & {
  currentUserRating?: number;
  currentUserIsFav?:boolean;
  ratingCount?: number;
  ratingAVG?: number;
};
export const WorkSumarySpec = {
  select:{
    id:true,
    title:true,
    type:true,
    language:true,
    ToCheck:true,
    author:true,
    createdAt:true,
    updatedAt:true,
    publicationYear:true,
    countryOfOrigin:true,
    length:true,
    localImages: { select: { storedFile: true } },
    // readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
  }
}
export type WorkSumary = Prisma.CycleGetPayload<typeof WorkSumarySpec> & {
  // currentUserRating?: number;
  // currentUserIsFav?:boolean;
  // ratingCount?: number;
  // ratingAVG?: number;
}
export interface CreateWorkClientPayload {
  cover: File;
  type: string;
  isbn?: string | null;
  title: string;
  author: string;
  authorGender: string | null;
  authorRace: string | null;
  contentText: string | null;
  link: string | null;
  countryOfOrigin: string[] | null;
  //countryOfOrigin2: string | null;
  publicationYear: string | null;
  length: string | null;
  tags: string;
  topics: string;
  language: string;
}

export interface CreateWorkServerFields {
  type: string[];
  title: string[];
  author: string[];
  authorGender?: string[];
  authorRace?: string[];
  contentText?: string[];
  link?: string[];
  countryOfOrigin?: string[];
  countryOfOrigin2?: string[];
  publicationYear?: string[];
  length?: string[];
  tags?: string[];
  topics?: string;
  creatorId?: string[];
  language?: string[];
}

export interface CreateWorkServerPayload {
  type: string;
  title: string;
  author: string;
  authorGender?: string;
  authorRace?: string;
  contentText?: string;
  link?: string;
  isbn?:string;
  countryOfOrigin?: string;
  countryOfOrigin2?: string;
  publicationYear?: Date;
  length?: string;
  tags: string;
  topics: string;
  creatorId: number;
  language: string;
  ToCheck?:boolean;
}

export interface EditWorkServerFields {
  id: string[];
  type?: string[];
  title?: string[];
  author?: string[];
  authorGender?: string[];
  authorRace?: string [];
  contentText?: string[];
  link?: string[];
  isbn?:string[];
  countryOfOrigin?: string [];
  countryOfOrigin2?: string [];
  publicationYear?: string [];
  length?: string[];
  tags?: string[];
  topics?: string[];
  creatorId?: string[];
  language?: string[];
}
export interface EditWorkServerPayload {
  id: string[];
  type?: string[];
  title?: string[];
  author?: string[];
  authorGender?: string[];
  authorRace?: string [];
  contentText?: string[];
  link?: string[];
  isbn?:string[];
  countryOfOrigin?: string [];
  countryOfOrigin2?: string [];
  publicationYear?: string [];
  length?: string[];
  tags?: string[];
  topics?: string[];
  creatorId?: string[];
  language?: string[];
  // editions?:  {id:number}[];
}
export interface EditWorkClientPayload {
  id: string|number;
  type?: string;
  title?: string;
  author?: string;
  authorGender?: string | null;
  authorRace?: string | null;
  contentText?: string | null;
  link?: string | null;
  cover?: File | null;
  isbn?:string|null;
  countryOfOrigin?: string | null;
  countryOfOrigin2?: string | null;
  publicationYear?: Date|string | null;
  length?: string | null;
  tags?: string | null;
  topics?: string | null;
  creatorId?: number;
  language?: string | null;
  editions?:  Edition[];
}
export interface GoogleBooksProps {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    publishedDate: string;
    description: string;
    publisher: string;
    language: string;
    pageCount: number;
    printType: string;
    imageLinks: {
      thumbnail: string;
    };
    infoLink: string;
    industryIdentifiers: { type: string; identifier: string }[];//aca viene isbn de 10 y 13 
  };
  saleInfo: {
    saleability: string;
    buyLink: string;
  };
}
export interface TMDBVideosProps {
  id: number;
  title:string;
  original_title: string;
  release_date:string;
  overview: string;
  original_language: string;
  poster_path: string;
}
