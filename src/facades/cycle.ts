import { Cycle, CycleComplementaryMaterial, LocalImage, Prisma, User, RatingOnCycle } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreateCycleServerFields, CreateCycleServerPayload, CycleMosaicItem } from '../types/cycle';
import prisma from '../lib/prisma';

export const NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT = +(process.env.NEXT_PUBLIC_NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT || 10);

export const find = async (id: number): Promise<CycleMosaicItem | null> => {
  return prisma.cycle.findUnique({
    where: { id },
    include: {
      creator: {include:{photos:true}},
      localImages: true,
      complementaryMaterials: true,
      guidelines: {
        select: {
          title: true,
          contentText: true,
        },
      },
      participants: {include:{photos:true}},
      ratings: { include: { cycle: true } },
      favs: true,
      cycleWorksDates: true,
      // posts: {
      //   take:NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT,
      //   orderBy:{id:'desc'},
      //   include: {
      //     creator: {include:{photos:true}},
      //     localImages: true,
      //     works: {
      //       include: {
      //         localImages: true,
      //       },
      //     },
      //     cycles: {
      //       include: {
      //         localImages: true,
      //       },
      //     },
      //     likes: true,
      //     favs: true,
      //     comments: {
      //       include: {
      //         creator: { include: { photos:true } },
      //         comments: {
      //           include: {
      //             creator: { include: { photos:true } },
      //           },
      //         },
      //         work: {include:{cycles:true}},
      //         cycle:true,
      //       },
      //     },
      //   }
      // },
      works:{
        // take:NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT,
        orderBy:{id:'desc'},
        include: {
          localImages: true,
          favs: true,
          ratings: true,
          comments: true,
          posts: {include: {
            creator: {include:{photos:true}},
            localImages: true,
            works: {
              include: {
                localImages: true,
              },
            },
            cycles: {
              include: {
                localImages: true,
              },
            },
            likes: true,
            favs: true,
            comments: {
              include: {
                creator: { include: { photos:true } },
                comments: {
                  include: {
                    creator: { include: { photos:true } },
                  },
                },
                work: {include:{cycles:true}},
                cycle:true,
              },
            },
          }},
          cycles: true,
        },
      },
      comments: {
        // take:NEXT_PUBLIC_CYCLE_DETAIL_ITEMS_COUNT,
        orderBy:{id:'desc'},
        include: {
          creator: { include: { photos:true } },
          comments: {
            include: {
              creator: { include: { photos:true } },
            },
          },
          work: {include:{cycles:true}},
          cycle:true,
        },
      },
    },
  });
};

export const findAll = async (props?:Prisma.CycleFindManyArgs): Promise<Cycle[] | CycleMosaicItem[]> => {
  const {include,where,take} = props || {};
  return prisma.cycle.findMany({
    take,
    ... where && {where},
    orderBy: { createdAt: 'desc' },
    ... include 
      ? {include} 
      : {include: { 
        participants: true, 
        localImages: true, 
        ratings: true, 
        favs: true, 
        comments: true, 
        posts: true 
      }
      },
  });
};

export const findParticipant = async (user: User, cycle: Cycle): Promise<User | null> => {
  return prisma.user.findFirst({
    where: {
      id: user.id,
      joinedCycles: { some: { id: cycle.id } },
    },
  });
};

// export const countParticipants = async (
//   cycle: Cycle,
// ): Promise<Prisma.GetUserAggregateType<{ count: true; where: { cycles: { some: { id: number } } } }>> => {
//   return prisma.user.aggregate({
//     count: true,
//     where: { joinedCycles: { some: { id: cycle.id } } },
//   });
// };

export const countPosts = async (
  cycle: Cycle,
): Promise<Prisma.GetPostAggregateType<{ count: true; where: { cycles: { some: { id: number } } } }>> => {
  return prisma.post.count({
    where: { cycles: { some: { id: cycle.id } } },
  });
};

export const countWorks = async (
  cycle: Cycle,
): Promise<Prisma.GetWorkAggregateType<{ count: true; where: { cycles: { some: { id: number } } } }>> => {
  return prisma.work.count({
    where: { cycles: { some: { id: cycle.id } } },
  });
};

export const search = async (query: { [key: string]: string | string[] }): Promise<Cycle[]> => {
  const { q, where /* , include */ } = query;
  if (where == null && q == null) {
    throw new Error("[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided");
  }

  if (typeof q === 'string') {
    return prisma.cycle.findMany({
      where: { title: { contains: q } },
      // ...(typeof include === 'string' && { include: JSON.parse(include) }),
      include: {
        creator: true,
        localImages: true,
        complementaryMaterials: true,
        participants: true,
        ratings: { include: { cycle: true } },
        favs: true,
        works: {
          include: {
            localImages: true,
            favs: true,
            ratings: { include: { work: true } },
            comments: {
              include: {
                creator: { select: { id: true, name: true, image: true } },
                comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
              },
            },
          },
        },
        comments: {
          include: {
            creator: { select: { id: true, name: true, image: true } },
            comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
          },
        },
        posts: { include: { favs: true } },
      },
    });
  }

  return prisma.cycle.findMany({
    ...(typeof where === 'string' && { where: JSON.parse(where) }),
    // ...(typeof include === 'string' && { include: JSON.parse(include) }),
    include: {
      creator: true,
      localImages: true,
      complementaryMaterials: true,
      participants: true,
      ratings: { include: { cycle: true } },
      favs: true,
      works: {
        include: {
          localImages: true,
          favs: true,
          ratings: { include: { work: true } },
          comments: {
            include: {
              creator: { select: { id: true, name: true, image: true } },
              comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
            },
          },
        },
      },
      comments: {
        include: {
          creator: { select: { id: true, name: true, image: true } },
          comments: { include: { creator: { select: { id: true, name: true, image: true } } } },
        },
      },
      posts: { include: { favs: true } },
    },
  });
};

export const isFavoritedByUser = async (cycle: Cycle, user: User): Promise<number> => {
  return prisma.cycle.count({
    where: {
      id: cycle.id,
      favs: { some: { id: user.id } },
    },
  });
};

export const isLikedByUser = async (cycle: Cycle, user: User): Promise<number> => {
  return prisma.cycle.count({
    where: {
      id: cycle.id,
      likes: { some: { id: user.id } },
    },
  });
};

export const createFromServerFields = async (
  creator: User,
  fields: CreateCycleServerFields,
  coverImageUpload: StoredFileUpload,
  complementaryMaterialsUploadData: Record<string, StoredFileUpload>,
  guidelines: Prisma.GuidelineCreateWithoutCycleInput[],
  cycleWorksDates: Prisma.CycleWorkCreateManyCycleInput[],
): Promise<Cycle> => {
  const payload = Object.entries(fields)
    .filter(([fieldName]) => !fieldName.match(/CM\d_/))
    .reduce((memo, field) => {
      const [fieldName, fieldValues] = field;

      switch (fieldName) {
        case 'includedWorksIds':
          return memo; // we don't want IDs of Works in Cycle payload

        case 'isPublic':
          return { ...memo, [fieldName]: fieldValues[0] === 'true' };

        case 'startDate':
        case 'endDate':
          return { ...memo, [fieldName]: new Date(fieldValues[0]) };
        case 'access':
          return { ...memo, [fieldName]: parseInt(fieldValues[0], 10) };

        default:
          return { ...memo, [fieldName]: fieldValues[0] };
      }
    }, {} as CreateCycleServerPayload);
  const complementaryMaterialsPayload = Object.entries(fields)
    .filter(([fieldName]) => fieldName.match(/CM\d_/))
    .reduce((memo, [cmFieldName, value]) => {
      const m = cmFieldName.match(/CM(\d)_(\w+)/);
      if (m == null) return memo;

      const idx = Number(m[1]);
      const fieldName = m[2];

      if (memo[idx] == null) {
        // @ts-ignore
        memo[idx] = {}; // eslint-disable-line no-param-reassign
      }

      switch (fieldName) {
        case 'publicationDate':
          memo[idx] = { ...memo[idx], [fieldName]: new Date(value[0]) }; // eslint-disable-line no-param-reassign
          break;
        default:
          memo[idx] = { ...memo[idx], [fieldName]: value[0] }; // eslint-disable-line no-param-reassign
          break;
      }

      if (complementaryMaterialsUploadData[`CM${idx}_file`] != null) {
        // eslint-disable-next-line no-param-reassign
        memo[idx] = { ...memo[idx], ...complementaryMaterialsUploadData[`CM${idx}_file`] };
      }

      return memo;
    }, [] as CycleComplementaryMaterial[]);

  const existingLocalImage = await prisma.localImage.findFirst({
    where: { contentHash: coverImageUpload.contentHash },
  });

  return prisma.cycle.create({
    data: {
      ...payload,
      creator: { connect: { id: creator.id } },
      works: { connect: fields.includedWorksIds.map((id) => ({ id: parseInt(id, 10) })) },
      complementaryMaterials: { create: complementaryMaterialsPayload },
      localImages: {
        connectOrCreate: {
          where: { id: existingLocalImage != null ? existingLocalImage.id : 0 },
          create: { ...coverImageUpload },
        },
      },
      guidelines: {
        create: guidelines,
      },
      cycleWorksDates: {
        create: cycleWorksDates.map((cw) => ({
          startDate: cw.startDate,
          endDate: cw.endDate,
          work: {
            connect: {
              id: cw.workId,
            },
          },
        })),
      },
    },
  });
};

export const addParticipant = async (cycle: Cycle, userId: number): Promise<Cycle> => {
  return prisma.cycle.update({
    where: { id: cycle.id },
    data: { participants: { connect: { id: userId } } },
  });
};

export const removeParticipant = async (cycle: Cycle, user: User): Promise<Cycle> => {
  return prisma.cycle.update({
    where: { id: cycle.id },
    data: { participants: { disconnect: { id: user.id } } },
  });
};

export const saveSocialInteraction = async (
  cycle: Cycle,
  user: User,
  socialInteraction: 'fav' | 'like' | 'rating',
  create: boolean,
  qty?: number,
): Promise<Cycle | null> => {
  if (socialInteraction !== 'rating') {
    return prisma.cycle.update({
      where: { id: cycle.id },
      data: { [`${socialInteraction}s`]: { [create ? 'connect' : 'disconnect']: { id: user.id } } },
    });
  }
  const rating: RatingOnCycle | null = await prisma.ratingOnCycle.findFirst({
    where: { userId: user.id, cycleId: cycle.id },
  });
  if (create) {
    if (rating) {
      const q1 = prisma.cycle.update({
        where: { id: cycle.id },
        data: {
          ratings: {
            disconnect: {
              ratingOnCycleId: rating.ratingOnCycleId,
            },
          },
        },
      });

      const q2 = prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          ratingCycles: {
            disconnect: {
              ratingOnCycleId: rating.ratingOnCycleId,
            },
          },
        },
      });

      const q3 = prisma.ratingOnCycle.delete({
        where: {
          ratingOnCycleId: rating.ratingOnCycleId,
        },
      });

      await prisma.$transaction([q1, q2, q3]);

      return prisma.cycle.update({
        where: { id: cycle.id },
        data: {
          ratings: {
            connectOrCreate: {
              where: {
                ratingOnCycleId: -1, // faild always, so a create will be executed :-)
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

    return prisma.cycle.update({
      where: { id: cycle.id },
      data: {
        ratings: {
          connectOrCreate: {
            where: {
              ratingOnCycleId: -1, // faild always, so a create will be executed :-)
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
    const q1 = prisma.cycle.update({
      where: { id: cycle.id },
      data: {
        ratings: {
          disconnect: {
            ratingOnCycleId: rating.ratingOnCycleId,
          },
        },
      },
    });

    const q2 = prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ratingCycles: {
          disconnect: {
            ratingOnCycleId: rating.ratingOnCycleId,
          },
        },
      },
    });

    const q3 = prisma.ratingOnCycle.delete({
      where: {
        ratingOnCycleId: rating.ratingOnCycleId,
      },
    });

    const res = await prisma.$transaction([q1, q2, q3]);
    return res[0];
  }
  return null;
};

export const remove = async (cycle: Cycle): Promise<Cycle> => {

  await prisma.cycle.update({
    where: { id: cycle.id },
    data: {
      localImages: {deleteMany: {}},
      guidelines: {deleteMany: {cycleId: cycle.id}},
      complementaryMaterials: { deleteMany: { cycleId: cycle.id } },
      participants: { set: [] },
      posts: { set: [] },
      works: { set: [] },
    },
    include: {
      complementaryMaterials: true,
      participants: true,
      posts: true,
      works: true,
    },
  });

  return prisma.cycle.delete({
    where: { id: cycle.id },
  });
};
