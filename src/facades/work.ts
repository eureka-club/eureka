import { Prisma, Work, Edition, User, RatingOnWork, ReadOrWatchedWork } from '@prisma/client';
import { Languages, Session, StoredFileUpload } from '../types';
import { CreateWorkServerFields, CreateWorkServerPayload, EditWorkServerFields, WorkDetail, WorkDetailSpec, WorkSumary, WorkSumarySpec } from '../types/work';
import { prisma } from '@/src/lib/prisma';
import { MISSING_FIELD, WORK_ALREADY_EXIST } from '@/src/api_code';
import { defaultLocale } from 'i18n';


const WorkSumaryWithExtrasSpec = {
  select:{
    ...WorkSumarySpec.select,
    editions: { include: { localImages: { select: { id:true, storedFile: true } } } },
    favs: { select: { id: true } },
    ratings: { select: { userId: true, qty: true } },
  }
}
type WorkSumaryWithExtras = WorkSumary & Prisma.WorkGetPayload<typeof WorkSumaryWithExtrasSpec>;

const WorkDetailWithExtrasSpec = {
  include: {
    ...WorkDetailSpec.include,
    editions: { include: { localImages: { select: { id:true, storedFile: true } } } },
    favs: { select: { id: true } },
    ratings: { select: { userId: true, qty: true } },
  }
}
type WorkDetailWithExtras = WorkDetail & Prisma.WorkGetPayload<typeof WorkDetailWithExtrasSpec>;

const PopulateWorkWithExtras =(w:WorkDetailWithExtras|WorkSumaryWithExtras,session:Session|null)=>{
  w.currentUserIsFav = w.favs.findIndex(f=>f.id==session?.user.id) > -1;
  w.currentUserRating = w.ratings.find(r=>r.userId==session?.user.id)?.qty??0;
  w.ratingCount = w.ratings.length;
  w.ratingAVG = w.ratings.reduce((p, c) => c.qty + p, 0) / w.ratingCount;
}
const editionsToBookDetail = (book: WorkDetail, language: string): WorkDetail | null => {
  if (book.language == language) {
    return book;
  }
  let i = 0,
    count = book.editions?.length;
  for (; i < count; i++) {
    const e = book?.editions[i];
    if (e.language == language) {
      book.title = e.title;
      book.contentText = e.contentText;
      book.publicationYear = e.publicationYear;
      book.language = e.language;
      book.countryOfOrigin = e.countryOfOrigin;
      book.length = e.length;
      book.ToCheck = e.ToCheck;
      book.localImages = e.localImages;
      return book;
    }
  }
  return book;
};
const editionsToBookSumary = (book: WorkSumaryWithExtras, language: string|null): WorkSumary | null => {
  if (book.language == language) {
    return book;
  }
  let i = 0,
    count = book.editions?.length;
  for (; i < count; i++) {
    const e = book?.editions[i];
    if (e.language == language) {
      book.title = e.title;
      return book;
    }
  }
  return book;
};

export const find = async (id: number, language: string, session:Session|null): Promise<WorkDetail | null> => {
  let work = await prisma.work.findUnique({
    where: { id },
    include:WorkDetailWithExtrasSpec.include,
  });
  if(work){
    let ws = (work as WorkDetailWithExtras);
    PopulateWorkWithExtras(ws,session);
    return editionsToBookDetail(ws, language);
  }
  return null;
};

export const findSumary = async (id: number, language: string|null,session:Session|null): Promise<WorkSumary | null> => {
  let work = await prisma.work.findUnique({
    where: { 
      id,
      ... language && {language}, 
    },
    select:WorkSumaryWithExtrasSpec.select,
  });
  if(work){
    let ws = (work as WorkSumaryWithExtras);
    PopulateWorkWithExtras(ws,session);
    return editionsToBookSumary(ws, language);
  }
  return null
};

export const findWithoutLangRestrict = async (id: number,session:Session|null): Promise<WorkDetail | null> => {
  let work = await prisma.work.findUnique({
    where: { id },
    include:WorkDetailWithExtrasSpec.include,
  });
  if (work) {
    PopulateWorkWithExtras(work as WorkDetailWithExtras,session);
    return work;
  }
  return null;
};

export const findAll = async (language: string,session:Session|null, props?: Prisma.WorkFindManyArgs): Promise<WorkDetail[]> => {
  const { where, take, skip, cursor } = props || {};

  let works = await prisma.work.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include:WorkDetailWithExtrasSpec.include,
    where,
  });

  return works 
    ? works.map((w) => {
      if(w){
        let ws = (w as WorkDetailWithExtras);
        PopulateWorkWithExtras(ws,session);
      }
      return editionsToBookDetail(w as WorkDetailWithExtras, language)!
    })
    : [];
};
export const findAllSumary = async (language: string,session:Session|null, props?: Prisma.WorkFindManyArgs): Promise<WorkSumary[]> => {
  const { where, take, skip, cursor } = props || {};

  let works = await prisma.work.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    select: WorkSumaryWithExtrasSpec.select,
    where,
  });

  return works 
    ? works.map((w) => {
      if(w){
        let ws = (w as WorkSumaryWithExtras);
        PopulateWorkWithExtras(ws,session);
      }
      return editionsToBookSumary(w as WorkSumaryWithExtras, language)!
    })
    : [];
};

export const findAllWithoutLangRestrict = async (session:Session|null,props?: Prisma.WorkFindManyArgs): Promise<WorkDetail[]> => {
  const { where, take, skip, cursor } = props || {};

  let works = await prisma.work.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include: WorkDetailWithExtrasSpec.include,
    where,
  });

  return works 
    ? works.map((w) => {
      PopulateWorkWithExtras(w as WorkDetailWithExtras,session);
      return editionsToBookDetail(w as WorkDetailWithExtras, w.language)!
    })
    : [];
};

export const findAllWithoutLangRestrictSumary = async (session:Session|null,props?: Prisma.WorkFindManyArgs): Promise<WorkSumary[]> => {
  const { where, take, skip, cursor } = props || {};

  let works = await prisma.work.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    select: WorkSumaryWithExtrasSpec.select,
    where,
  });

  return works 
    ? works.map((w) => {
      PopulateWorkWithExtras(w as WorkSumaryWithExtras,session);
      return editionsToBookSumary(w as WorkSumaryWithExtras, w.language)!
    })
    : [];
};

export const search = async (session: Session|null, query: { [key: string]: string | string[] | undefined }): Promise<WorkSumary[]> => {
  const { q, where, include, lang: l } = query;
  const language = Languages[l?.toString() ?? defaultLocale];

  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  let works = await prisma.work.findMany({
    ...(typeof q === 'string') && {
      where: {
        OR: [{ title: { contains: q } }, { author: { contains: q } }],
      }
    },
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    select: WorkSumaryWithExtrasSpec.select,
  });
  works.forEach(work=>{
    const ws = (work as WorkSumaryWithExtras)
    PopulateWorkWithExtras(ws,session)
  })
  return works
  ? works.map((w) => editionsToBookSumary(w as WorkSumaryWithExtras, language)!)
  :[];
};

export const countCycles = async (
  work: Work,
): Promise<Prisma.GetCycleAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.cycle.count({
    where: { works: { some: { id: work.id } } },
  });
};

export const countPosts = async (
  work: Work,
): Promise<Prisma.GetPostAggregateType<{ count: true; where: { works: { some: { id: number } } } }>> => {
  return prisma.post.count({
    where: { works: { some: { id: work.id } } },
  });
};

export const isFavoritedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      favs: { some: { id: user.id } },
    },
  });
};

export const isLikedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      likes: { some: { id: user.id } },
    },
  });
};

export const isReadOrWatchedByUser = async (work: Work, user: User): Promise<number> => {
  return prisma.work.count({
    where: {
      id: work.id,
      readOrWatchedWorks: { some: { userId: user.id } },
    },
  });
};

export const createFromServerFields = async (
  fields: CreateWorkServerFields,
  coverImageUpload: StoredFileUpload,
): Promise<{ error?: string; work?: Work | Edition | null }> => {
  const payload = Object.entries(fields).reduce((memo, field) => {
    const [fieldName, fieldValues] = field;

    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues[0]) };
    }
    return { ...memo, [fieldName]: fieldValues[0] };
  }, {} as CreateWorkServerPayload);

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  if (['book', 'fiction-book'].includes(payload.type)) {
    if ('isbn' in payload) {
      if (!payload.isbn) return { error: MISSING_FIELD('isbn') };
      const w = await prisma.work.findFirst({
        where: {
          isbn: payload.isbn,
        },
      });
      if (w) return { work: w, error: WORK_ALREADY_EXIST };
      const e = await prisma.edition.findFirst({
        where: {
          isbn: payload.isbn,
        },
      });
      if (e) return { work: e, error: WORK_ALREADY_EXIST };
    }
  }

  const w = await prisma.work.create({
    include:WorkDetailSpec.include,
    data: {
      ...payload,
      ToCheck: true,
      localImages: {
        ...(existingLocalImage
          ? {
              connect: {
                id: existingLocalImage.id,
              },
            }
          : {
              create: { ...coverImageUpload },
            }),
      },
    },
  });
  return { work: w };
};

export const updateFromServerFields = async (
  fields: EditWorkServerFields,
  coverImageUpload: StoredFileUpload | null,
  workId: number,
  editions:{id:number}[]
): Promise<Work> => {
  const payload = Object.entries(fields).reduce((memo, field) => {
    const [fieldName, fieldValues] = field;
    if(fieldName=='creatorId') return {...memo, [fieldName]:parseInt(fieldValues)};
    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues) };
    }
    if (fieldName === 'ToCheck') {
      return { ...memo, [fieldName]: (fieldValues == '0' ? false : true) };
    }
    
    return { ...memo, [fieldName]: fieldValues[0] };
  }, {} as CreateWorkServerPayload);
  
  //console.log(payload, 'payload');
  const existingLocalImage = coverImageUpload //NO EXISTE IMAGEN EN TABLA localImage
    ? await prisma.localImage.findFirst({
        where: { contentHash: coverImageUpload.contentHash },
      })
    : null;

    let editionsPayload={};
    if(editions?.length){
      editionsPayload = {
        editions:{
          connect:editions.map(({id})=>({id}))
        }
      };
      payload.ToCheck = false;
    }

  if (existingLocalImage != null) {
    const q1 = prisma.work.update({
      where: { id: workId },
      data: {
        localImages: {
          set: [],
        },
      },
    });

    await prisma.$transaction([q1]);
    //TODO delete the localImage that already exist if new one comes

    return prisma.work.update({
      where: { id: workId },
      data: {
        ...payload,
        localImages: {
          connect: {
            id: existingLocalImage.id,
          },
        },
       ... editionsPayload
      },
    });
  }

  if (coverImageUpload !== null && !existingLocalImage) {
    const q1 = prisma.work.update({
      where: { id: workId },
      data: {
        localImages: {
          set: [],
        },
      },
    });

    await prisma.$transaction([q1]);

    return prisma.work.update({
      where: { id: workId },
      data: {
        ...payload,
        localImages: {
          create: { ...coverImageUpload! },
        },
        ... editionsPayload
      },
    });
  }

  return prisma.work.update({
    where: { id: workId },
    data: {
      ...payload,
      ... editionsPayload
    },
  });
};

export const saveSocialInteraction = async (
  work: Work,
  user: User,
  socialInteraction: 'fav' | 'rating' | 'readOrWatched',
  create: boolean,
  qty?: number,
  year?: number,
): Promise<Work | null> => {
  if (!['readOrWatched', 'rating'].includes(socialInteraction)) {
    return prisma.work.update({
      where: { id: work.id },
      data: { [`${socialInteraction}s`]: { [create ? 'connect' : 'disconnect']: { id: user.id } } },
    });
  }

  if (socialInteraction == 'rating') {
    const rating: RatingOnWork | null = await prisma.ratingOnWork.findFirst({
      where: { userId: user.id, workId: work.id },
    });

    if (create) {
      if (rating) {
        const q1 = prisma.work.update({
          where: { id: work.id },
          data: {
            ratings: {
              disconnect: {
                ratingOnWorkId: rating.ratingOnWorkId,
              },
            },
          },
        });

        const q2 = prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            ratingWorks: {
              disconnect: {
                ratingOnWorkId: rating.ratingOnWorkId,
              },
            },
          },
        });

        const q3 = prisma.ratingOnWork.delete({
          where: {
            ratingOnWorkId: rating.ratingOnWorkId,
          },
        });

        await prisma.$transaction([q1, q2, q3]);

        return prisma.work.update({
          where: { id: work.id },
          data: {
            ratings: {
              connectOrCreate: {
                where: {
                  ratingOnWorkId: -1, // faild always, so a create will be executed :-)
                },
                create: {
                  userId: user.id,
                  qty,
                },
              },
            },
          },
        });
      }

      return prisma.work.update({
        where: { id: work.id },
        data: {
          ratings: {
            connectOrCreate: {
              where: {
                ratingOnWorkId: -1, // faild always, so a create will be executed :-)
              },
              create: {
                userId: user.id,
                qty,
              },
            },
          },
        },
      });
    }
    if (rating) {
      const q1 = prisma.work.update({
        where: { id: work.id },
        data: {
          ratings: {
            disconnect: {
              ratingOnWorkId: rating.ratingOnWorkId,
            },
          },
        },
      });

      const q2 = prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ratingWorks: {
            disconnect: {
              ratingOnWorkId: rating.ratingOnWorkId,
            },
          },
        },
      });

      const q3 = prisma.ratingOnWork.delete({
        where: {
          ratingOnWorkId: rating.ratingOnWorkId,
        },
      });

      const res = await prisma.$transaction([q1, q2, q3]);
      return res[0];
    }
  }

  if (socialInteraction == 'readOrWatched') {
    const readOrWatched: ReadOrWatchedWork | null = await prisma.readOrWatchedWork.findFirst({
      where: { userId: user.id, workId: work.id },
    });
    if (create) {
      return prisma.work.update({
        where: { id: work.id },
        data: {
          readOrWatchedWorks: {
            connectOrCreate: {
              where: {
                readOrWatchedWorkId: -1, // faild always, so a create will be executed :-)
              },
              create: {
                userId: user.id,
                year,
              },
            },
          },
        },
      });
    } else {
      const q1 = prisma.work.update({
        where: { id: work.id },
        data: {
          readOrWatchedWorks: {
            disconnect: {
              readOrWatchedWorkId: readOrWatched!.readOrWatchedWorkId,
            },
          },
        },
      });

      const q2 = prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          readOrWatchedWorks: {
            disconnect: {
              readOrWatchedWorkId: readOrWatched!.readOrWatchedWorkId,
            },
          },
        },
      });
      const q3 = prisma.readOrWatchedWork.delete({
        where: {
          readOrWatchedWorkId: readOrWatched!.readOrWatchedWorkId,
        },
      });

      const res = await prisma.$transaction([q1, q2, q3]);
      return res[0];
    }
  }

  return null;
};

export const remove = async (id: number): Promise<Work> => {
  return prisma.work.delete({
    where: { id },
  });
};
