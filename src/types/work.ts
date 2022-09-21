import { Prisma } from '@prisma/client';

// export type WorkDetail = Prisma.WorkGetPayload<{
//   include: {
//     localImages: true;
//     favs: true;
//     ratings: true;
//   };
// }>;

export type WorkWithImages = Prisma.WorkGetPayload<{
  include: {
    localImages: {select:{storedFile:true}}
  };
}>;

export type WorkMosaicItem = Prisma.WorkGetPayload<{
  include:{
    localImages: {select:{storedFile:true}};     
    // favs: {select:{id:true}};
    _count:{select:{ratings:true}};
    // ratings: {
    //   select:{qty:true}
    // };
    // posts: {
    //   select:{
    //     id:true;
    //     title:true;
    //     contentText:true;
    //     createdAt:true;
    //     works:{select:{id:true;title:true}};
    //     cycles:{select:{id:true}};
    //     favs:{select:{id:true}};
    //     creator: {select:{id:true;name:true;photos:true}};
    //     localImages: {select:{storedFile:true}};
    //     type:'post';
    //   };
    //   orderBy:{id:'desc'}
    // };
    // cycles:{
    //   select:{
    //     id:true;
    //     title:true;
    //     startDate:true;
    //     endDate:true;
        
    //     ratings:{select:{qty:true}}
    //   }
    // },
  }
  // include: {
  //   localImages: true;
  //   favs: true;
  //   ratings: true;
  //   // comments: {include:{cycle:{include:{participants:true}}}};
  //   posts: {include: {
  //     creator: {include:{photos:true}};
  //     localImages: true;
  //     works: {
  //       include: {
  //         localImages: true;          
  //       };
  //     };
  //     cycles: {
  //       include: {
  //         localImages: true;
  //         participants:true;
  //       };
  //     };
  //     likes: true;
  //     favs: true;
  //     comments: {
  //       include: {
  //         creator: { include: { photos:true } };
  //         comments: {
  //           include: {
  //             creator: { include: { photos:true } };
  //           };
  //         };
  //         work: {include:{cycles:true}};
  //         cycle:{include:{participants:true}},
  //       };
  //     };
  //   }};
  //   cycles: true;
  // };
}> & {
  currentUserIsFav?:boolean;
  currentUserRating?:number;
  ratingCount?:number;
  ratingAVG?:number;
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
  countryOfOrigin: string | null;
  countryOfOrigin2: string | null;
  publicationYear: string | null;
  length: string | null;
  tags: string;
  topics: string;
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
}

export interface CreateWorkServerPayload {
  type: string;
  title: string;
  author: string;
  authorGender?: string;
  authorRace?: string;
  contentText?: string;
  link?: string;
  countryOfOrigin?: string;
  countryOfOrigin2?: string;
  publicationYear?: Date;
  length?: string;
  tags: string;
  topics: string;
  creatorId: number;
}

export interface EditWorkClientPayload {
  // cover: File;
  id: string;
  type?: string;
  title?: string;
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
  disabled?:boolean;
}
