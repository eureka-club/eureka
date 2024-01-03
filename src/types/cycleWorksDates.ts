import { Prisma } from '@prisma/client';

export type CycleWorksDates = Prisma.CycleWorkGetPayload<{
  select: {
    id: true,
    startDate:true,
    endDate:true,
    workId:true,
    work:{
      include:{
        localImages: { select: { id:true, storedFile: true } },
        _count: { select: { ratings: true } },
        favs: { select: { id: true } },
        ratings: { select: { userId: true, qty: true } },
        readOrWatchedWorks: { select: { userId: true, workId: true, year: true } },
        posts: {
          select: { id: true, updatedAt: true, localImages: { select: { storedFile: true } } },
        },
        editions: { include: { localImages: { select: { id:true, storedFile: true } } } },
      }
    },
  },
}>
