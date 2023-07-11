import { Prisma, Work, User, RatingOnWork, ReadOrWatchedWork } from '@prisma/client';
import { Languages, StoredFileUpload } from '../types';
import { CreateWorkServerFields, CreateWorkServerPayload, WorkMosaicItem } from '../types/work';
import { prisma } from '@/src/lib/prisma';
import { MISSING_FIELD, WORK_ALREADY_EXIST } from '@/src/api_code';

const  include = {
  localImages: { select: { storedFile: true } },
  _count: { select: { ratings: true } },
  favs: { select: { id: true } },
  ratings: { select: { userId: true, qty: true } },
  readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
  posts: {
    select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
  },
  editions:{include:{localImages: { select: { storedFile: true } }}},
}
const editionsToBook = (book:WorkMosaicItem, language:string):WorkMosaicItem|null => {
  if(book.language==language){
    return book;
  }
  let i = 0, count = book.editions?.length;
  for(;i<count;i++){
    const e = book?.editions[i];
    if(e.language==language){
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
  return null;
}

export const find = async (id: number,language:string): Promise<WorkMosaicItem | null> => {
  let work = await prisma.work.findUnique({
    where: { id },
    include,
  });
  if(work){
    work = editionsToBook(work,language);
    return work;
  }
  return null;
};

export const findAll = async (language:string, props?: Prisma.WorkFindManyArgs): Promise<WorkMosaicItem[]> => {
  const { where, include = null, take, skip, cursor } = props || {};
  
  let works = await prisma.work.findMany({
    take,
    skip,
    cursor,
    orderBy: { createdAt: 'desc' },
    include:{
      localImages: { select: { storedFile: true } },
      _count: { select: { ratings: true } },
      favs: { select: { id: true } },
      ratings: { select: { userId: true, qty: true } },
      readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
      posts: {
        select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
      },
      editions:{include:{localImages: { select: { storedFile: true } }}},
    },
    where,
  });

  if(works){
    works = works.map(w=>editionsToBook(w,language)!);
  }
  return works;
};

export const search = async (query: { [key: string]: string | string[] | undefined }): Promise<Work[]> => {
  const { q, where, include,lang:l } = query;
  const language = Languages[l?.toString()??"es"];
  
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.work.findMany({
      include:{
        localImages: { select: { storedFile: true } },
        _count: { select: { ratings: true } },
        favs: { select: { id: true } },
        ratings: { select: { userId: true, qty: true } },
        readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
        posts: {
          select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
        },
        editions:{include:{localImages: { select: { storedFile: true } }}},
      },
      where: {
        OR: [{ title: { contains: q } }, { author: { contains: q } }],
      },
      ...(typeof include === 'string' && { include: JSON.parse(include) }),
    });
  }

  let works = await prisma.work.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    include:{
      localImages: { select: { storedFile: true } },
      _count: { select: { ratings: true } },
      favs: { select: { id: true } },
      ratings: { select: { userId: true, qty: true } },
      readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
      posts: {
        select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
      },
      editions:{include:{localImages: { select: { storedFile: true } }}},
    },
  });
  if(works)
    works = works.map(w=>editionsToBook(w, language)!);
  return works;
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
): Promise<{error?:string,work?:Work|null}> => {
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
    }
  }

  const w = await prisma.work.create({
    include,
    data: {
      ...payload,
      ToCheck: true,
      localImages: {
        ... existingLocalImage 
        ? {
          connect: {
            id: existingLocalImage.id,
          }
        }
        : {
          create: { ...coverImageUpload }
        }
      },
    },
  });
  return {work:w};
};

export const UpdateFromServerFields = async (
  fields: CreateWorkServerFields,
  coverImageUpload: StoredFileUpload | null,
  workId: number,
): Promise<Work> => {
  const payload = Object.entries(fields).reduce((memo, field) => {
    const [fieldName, fieldValues] = field;

    if (fieldName === 'publicationYear') {
      return { ...memo, [fieldName]: new Date(fieldValues) };
    }

    return { ...memo, [fieldName]: fieldValues[0] };
  }, {} as CreateWorkServerPayload);

  const existingLocalImage = coverImageUpload //NO EXISTE IMAGEN EN TABLA localImage
    ? await prisma.localImage.findFirst({
        where: { contentHash: coverImageUpload.contentHash },
      })
    : null;

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


    return prisma.work.update({
      where: { id: workId },
      data: {
        ...payload,
        localImages: {
          connect: {
            id: existingLocalImage.id,
          },
        },
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
      },
    });
  }

  return prisma.work.update({
    where: { id: workId },
    data: {
      ...payload,
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
