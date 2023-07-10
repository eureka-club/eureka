import { Prisma } from '@prisma/client';

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

export type WorkMosaicItem = Prisma.WorkGetPayload<{
  include: {
    _count: { select: { ratings: true } };
    localImages: { select: { storedFile: true } };
    favs: { select: { id: true } };
    ratings: { select: { userId: true; qty: true } };
    readOrWatchedWorks: { select: { userId: true; workId: true; year: true } };
    posts: {
      select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
    },
    editions:{include:{localImages: { select: { storedFile: true } }}};
  };
}> & {
  currentUserRating?: number;
  ratingCount?: number;
  ratingAVG?: number;
};

export interface CreateWorkClientPayload {
  cover: File;
  type: string;
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
  tags: string;
  topics: string;
  creatorId: number;
  language: string;
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

}

export interface EditWorkClientPayload {
  cover: File | null;
  id: string;
  type?: string;
  title?: string;
  language?: string;
  author?: string;
  authorGender?: string | null;
  authorRace?: string | null;
  contentText?: string | null;
  link?: string | null;
  countryOfOrigin?: string | null;
  countryOfOrigin2?: string | null;
  publicationYear?: string | null;
  length?: string | null;
  tags?: string;
  topics?: string;
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
    pageCount:number;
    printType:string;
    imageLinks: {
      thumbnail: string;
    };
    infoLink:string;
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
