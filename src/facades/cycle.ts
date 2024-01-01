import { Cycle, CycleComplementaryMaterial, LocalImage, Prisma, User, RatingOnCycle } from '@prisma/client';

import { StoredFileUpload } from '../types';
import { CreateCycleServerFields, CreateCycleServerPayload, CycleMosaicItem } from '../types/cycle';
import { prisma } from '@/src/lib/prisma';
import { PostMosaicItem } from '../types/post';
import { UserMosaicItem } from '../types/user';
import { WorkMosaicItem } from '../types/work';

export const NEXT_PUBLIC_MOSAIC_ITEMS_COUNT = +(process.env.NEXT_PUBLIC_NEXT_PUBLIC_MOSAIC_ITEMS_COUNT || 10);

export const find = async (id: number): Promise<CycleMosaicItem | null> => {
  return prisma.cycle.findUnique({
    where: { id },
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
      favs: { select: { id: true } },
      cycleWorksDates: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          workId: true,
          work: {
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
        },
      },
      _count: {
        select: {
          participants: true,
          ratings: true,
        },
      },
      complementaryMaterials: true,
    }
  });
};

export const findAll = async (props?: Prisma.CycleFindManyArgs): Promise<CycleMosaicItem[]> => {
  const { include, where, take, skip, cursor } = props || {};
  return prisma.cycle.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    include: {
      creator: {
        select: { id: true, name: true, email: true, countryOfOrigin: true },
      },
      localImages: {
        select: {
          storedFile: true,
        },
      },
      //complementaryMaterials: true,
      guidelines: {
        select: {
          title: true,
          contentText: true,
        },
      },
      usersJoined: { select: { userId: true, pending: true } },
      ratings: { select: { userId: true, qty: true } },
      favs: {
        select: { id: true },
      },
      cycleWorksDates: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          workId: true,
          work: {
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
        },
      },
      complementaryMaterials: true,
      _count: {
        select: {
          participants: true,
          ratings: true,
        },
      },
    },
  });
};

export const addParticipant = async (cycleId: number, userId: number): Promise<Cycle> => {
  return prisma.cycle.update({
    where: { id: cycleId },
    data: { participants: { connect: { id: userId } } },
  });
};

export const removeParticipant = async (cycle: Cycle, id: number): Promise<CycleMosaicItem> => {
  return prisma.cycle.update({
    where: { id: cycle.id },
    data: { participants: { disconnect: { id } } },
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
      participants: { select: { id: true } },
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
      favs: {
        select: { id: true },
      },
      cycleWorksDates: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          workId: true,
          work: {
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
        },
      },
      complementaryMaterials: true,
      _count: {
        select: {
          participants: true,
          ratings: true,
        },
      },
    },
  });
};

export const remove = async (cycle: Cycle): Promise<Cycle> => {
  await prisma.cycle.update({
    where: { id: cycle.id },
    data: {
      localImages: { deleteMany: {} },
      guidelines: { deleteMany: { cycleId: cycle.id } },
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

export const search = async (query: {
  [key: string]: string | string[] | undefined;
}): Promise<Cycle[]> => {
  const { q, where /* , include */ } = query;
  if (where == null && q == null) {
    throw new Error(
      "[412] Invalid invocation! Either 'q' or 'where' query parameter must be provided"
    );
  }

  if (typeof q === "string") {
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
                comments: {
                  include: {
                    creator: { select: { id: true, name: true, image: true } },
                  },
                },
              },
            },
          },
        },
        comments: {
          include: {
            creator: { select: { id: true, name: true, image: true } },
            comments: {
              include: {
                creator: { select: { id: true, name: true, image: true } },
              },
            },
          },
        },
        posts: {
          include: {
            favs: true,
          },
        },
      },
    });
  }

  return prisma.cycle.findMany({
    ...(typeof where === "string" && { where: JSON.parse(where) }),
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
              comments: {
                include: {
                  creator: { select: { id: true, name: true, image: true } },
                },
              },
            },
          },
        },
      },
      comments: {
        include: {
          creator: { select: { id: true, name: true, image: true } },
          comments: {
            include: {
              creator: { select: { id: true, name: true, image: true } },
            },
          },
        },
      },
      posts: { include: { favs: true } },
    },
  });
};

export const createFromServerFields = async (
  creatorId: number,
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
          return { ...memo, [fieldName]: fieldValues === 'true' };

        case 'startDate':
        case 'endDate':
          return { ...memo, [fieldName]: new Date(fieldValues) };
        case 'access':
          return { ...memo, [fieldName]: parseInt(fieldValues, 10) };

        default:
          return { ...memo, [fieldName]: fieldValues };
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
      creator: { connect: { id: creatorId } },
      works: { connect: fields.includedWorksIds.map((id) => ({ id })) },
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

export const saveSocialInteraction = async (
  cycle: Cycle,
  user: User,
  socialInteraction: 'fav' | 'like' | 'rating',
  connect: boolean,
  qty?: number,
): Promise<Cycle | null> => {
  if (socialInteraction !== 'rating') {
    return prisma.cycle.update({
      where: { id: cycle.id },
      data: { [`${socialInteraction}s`]: { [connect ? 'connect' : 'disconnect']: { id: user.id } } },
    });
  }
  const rating: RatingOnCycle | null = await prisma.ratingOnCycle.findFirst({
    where: { userId: user.id, cycleId: cycle.id },
  });
  if (connect) {
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

export const posts = async (id: number): Promise<PostMosaicItem[]> => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
    select:{
      posts: {
        include: {
          works: { select: { id: true, title: true,author:true, type: true, localImages: { select: { storedFile: true } } } },
          cycles:{
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
                select: {
                  id: true,
                  startDate: true,
                  endDate: true,
                  workId: true,
                  work: {
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
                },
              },
              _count: {
                select: {
                  participants: true,
                  ratings: true,
                },
              },
              complementaryMaterials: true,
            }
          },
          favs: { select: { id: true } },
          creator: { select: { id: true, name: true, photos: true, countryOfOrigin: true } },
          localImages: { select: { storedFile: true } },
          reactions: true,
        }
      }
    },
  });
  return cycle?.posts??[];
};

export const participants = async (id: number): Promise<UserMosaicItem[]> => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
    select:{
      participants:{
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          createdAt: true,
          updatedAt: true,
          countryOfOrigin: true,
          aboutMe: true,
          dashboardType: true,
          tags: true,
          followedBy: { select: { id: true } },
          following: { select: { id: true, name: true, image: true, photos: { select: { storedFile: true } } } },
          ratingWorks: {
            select: {
              workId: true,
              qty: true,
              work: {
                select: {
                  id: true,
                  author: true,
                  title: true,
                  type: true,
                  countryOfOrigin: true,
                  countryOfOrigin2: true,
                  favs: { select: { id: true } },
                  localImages: { select: { storedFile: true } },
                },
              },
            },
          },
          readOrWatchedWorks: {
            select: {
              workId: true,
              year: true,
              work: {
                select: {
                  id: true,
                  author: true,
                  title: true,
                  type: true,
                  countryOfOrigin: true,
                  countryOfOrigin2: true,
                  favs: { select: { id: true } },
                  localImages: { select: { storedFile: true } },
                },
              },
            },
          },
          ratingCycles:{select:{cycleId:true,qty:true}},
          photos:{select:{storedFile:true}},
          reactions:{select:{postId:true,unified:true,emoji:true}},
          language:true,
        }
      }
    }
  });
  return cycle?.participants??[];
};

export const works = async (id: number): Promise<WorkMosaicItem[]> => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
    select:{
      works:{
        include: {
          _count: { select: { ratings: true } },
          localImages: { select: { id:true, storedFile: true } },
          favs: { select: { id: true } },
          ratings: { select: { userId: true, qty: true } },
          readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
          posts: {
            select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
          },
          editions:{include:{localImages: { select: { id:true, storedFile: true } }}},
        }
      }
    }
  });
  return cycle?.works??[];
};

