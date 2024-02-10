import { Cycle, CycleComplementaryMaterial, Prisma, User, RatingOnCycle } from '@prisma/client';

import { Session, StoredFileUpload } from '../types';
import { CreateCycleServerFields, CreateCycleServerPayload, CycleDetailSpec, CycleDetail, CycleSumary, CycleSumarySpec } from '../types/cycle';
import { prisma } from '@/src/lib/prisma';
import { subscribe_to_segment, unsubscribe_from_segment } from '@/src/lib/mailchimp';
import { sendMail } from './mail';
import { UserSumary, UserSumarySpec } from '../types/user';

export const NEXT_PUBLIC_MOSAIC_ITEMS_COUNT = +(process.env.NEXT_PUBLIC_NEXT_PUBLIC_MOSAIC_ITEMS_COUNT || 10);

const CycleSumaryWithExtrasSpec = {
  select:{
    ...CycleSumarySpec.select,
    ratings:{select:{userId:true,qty:true}},
    usersJoined:{select:{userId:true,pending:true}},
  }
}
type CycleSumaryWithExtras = CycleSumary & Prisma.CycleGetPayload<typeof CycleSumaryWithExtrasSpec>;
const CycleDetailWithExtrasSpec = {
  include:{
    ...CycleDetailSpec.include,
    ratings:{select:{userId:true,qty:true}},
    usersJoined:{select:{userId:true,pending:true}},
  }
}
type CycleDetailWithExtras = CycleDetail & Prisma.CycleGetPayload<typeof CycleDetailWithExtrasSpec>;

function PopulateCycleSumaryWithExtras(cycles:CycleSumaryWithExtras[],session:Session|null):CycleSumary[]{
  return  cycles.map(c=>{
    const fr = c.ratings.find(r=>r.userId==session?.user.id);
    const currentUserRating = fr?.qty??0;
    const ratingCount = c.ratings.length;
    const ratingAVG = c.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount;
    const currentUserJoinPending = c.usersJoined.findIndex(u=>u.userId==session?.user.id && u.pending==true) > -1;
    return {...c,type:'cycle', currentUserRating, ratingCount, ratingAVG, currentUserJoinPending};
  });  
}
function PopulateCycleDetailWithExtras(cycles:CycleDetailWithExtras[],session:Session|null):CycleDetail[]{
  return  cycles.map(c=>{
    const fr = c.ratings.find(r=>r.userId==session?.user.id);
    const currentUserRating = fr?.qty??0;
    const ratingCount = c.ratings.length;
    const ratingAVG = c.ratings.reduce((p,c)=>c.qty+p,0)/ratingCount;
    const currentUserJoinPending = c.usersJoined.findIndex(u=>u.userId==session?.user.id && u.pending==true) > -1;
    return {...c,type:'cycle', currentUserRating, ratingCount, ratingAVG, currentUserJoinPending};
  });  
}

export const find = async (id: number): Promise<CycleDetail | null> => {
  return prisma.cycle.findUnique({
    where: { id },
    include: CycleDetailSpec.include
  });
};
export const findSumary = async (id: number,session:Session|null): Promise<CycleSumary | null> => {
  const cycle = await prisma.cycle.findUnique({
    where: { id },
    select: {
      ...CycleSumarySpec.select,
      ratings:{select:{userId:true,qty:true}},
      usersJoined:{select:{userId:true,pending:true}},
    }
  });
  return PopulateCycleSumaryWithExtras([cycle as CycleSumaryWithExtras],session)[0];
};

export const findAll = async (session:Session|null,props?: Prisma.CycleFindManyArgs): Promise<CycleDetail[]> => {
  const { where, take, skip, cursor } = props || {};
  const res = await prisma.cycle.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    include:{
      ...CycleDetailSpec.include,
      ratings:{select:{userId:true,qty:true}},
      usersJoined:{select:{userId:true,pending:true}},

    }
  });
  return PopulateCycleDetailWithExtras(res as CycleDetailWithExtras[],session); 
};
export const findAllSumary = async (session:Session|null,props?: Prisma.CycleFindManyArgs): Promise<CycleSumary[]> => {
  const { where, take, skip, cursor } = props || {};
  const res = await prisma.cycle.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
    select: {
      ...CycleSumarySpec.select,
      ratings:{select:{userId:true,qty:true}},
      usersJoined:{select:{userId:true,pending:true}},
    }
  });
  return PopulateCycleSumaryWithExtras(res,session); 
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

export const search = async (query: { [key: string]: string | string[] | undefined }): Promise<Cycle[]> => {
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
        posts: {
          include: {
            favs: true,
          },
        },
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
      creator: { connect: { id: creatorId } },
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

export const addParticipant = async (cycleId: number, userId: number): Promise<boolean> => {
  const cycle = await prisma.cycle.findFirst({
    where:{
      id:cycleId,
    },
    select:{participants:{select:{id:true}}}
  });
  const alreadyParticipant = cycle?.participants.findIndex(p=>p.id==userId)!=-1;
  if(alreadyParticipant)return true;
  const res = await prisma.cycle.update({
    where: { id: cycleId },
    data: { participants: { connect: { id:userId } } },
  });
  if(res){
    const user = await prisma.user.findUnique({where:{id:userId}});

    const mailchimpErrorHandler = async (email_address:string,segment:string)=>{
      const subject =`Failed subscribing ${email_address} to the segment: ${segment}`;
      
      await sendMail({
        from:{email:process.env.EMAILING_FROM!},
        to:[{email:process.env.DEV_EMAIL!}],
        subject,
        html:`<p>${subject}</p>`
      });
    }
    
    const segment = `ciclo-${cycleId}-pax`;
    if(user){
      const r = await subscribe_to_segment({
        segment,
        email_address:user.email!,
        name:user.name||'unknown'
        // onSuccess: async (res)=>console.log('ok',res),
        // onFailure: async (err)=>console.error('error',err)
      });
      if(!r){
        await mailchimpErrorHandler(user.email!,segment);
      }
    }
  }
  return !!res;
};

export const removeParticipant = async (cycle: Cycle, id: number): Promise<Cycle> => {
  const res = await prisma.cycle.update({
    where: { id: cycle.id },
    data: { participants: { disconnect: { id } } },
  });
  if(res){
    const user = await prisma.user.findUnique({where:{id}});
    if(user){
      await unsubscribe_from_segment({
        segment:`ciclo-${cycle.id}-pax`,
          email_address:user.email!,
      });
    }
  }
  return res;
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

export const participants = async (id:number):Promise<UserSumary[]>=>{
  const cycle = await prisma.cycle.findFirst({
    where:{id},
    select:{
      creator:{select:UserSumarySpec.select},
      participants:{select:UserSumarySpec.select}
    }
  })
  const res =[...cycle?.participants??[],cycle?.creator!];
  return res;
}
