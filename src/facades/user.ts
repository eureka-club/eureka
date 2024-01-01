import { Prisma, User } from '@prisma/client';
import { UserMosaicItem } from '@/types/user';
// import { UserDetail } from '../types/user';
import {prisma} from '@/src/lib/prisma';
import { CycleMosaicItem } from '../types/cycle';
import { PostMosaicItem } from '../types/post';
import { WorkMosaicItem } from '../types/work';

const cycleInclude = {
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
    participants: { select: { id: true } },
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
};
const workInclude = {
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
export const find = async (props: Prisma.UserFindUniqueArgs,language?:string): Promise<UserMosaicItem | null> => {
  const { select = undefined, include = true,where } = props;
  const user: any = await prisma.user.findFirst({
    where,
    include: {
      followedBy: { select: { id: true } },
      following: { select: { id: true, name: true, image: true, photos: { select: { storedFile: true } } } },
      ratingWorks: {
        ...language && {where:{
          work:{language}
        }},
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
        ...language && {where:{
          work:{language}
        }},
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
      
      ratingCycles: { 
        select: { cycleId: true, qty: true },
        ...language && {where:{
          cycle:{languages:{contains:language}}
        }}
      },
      photos: { select: { storedFile: true } },
    }
  });
  return user;
};

export const findAll = async (props?:Prisma.UserFindManyArgs): Promise<UserMosaicItem[]> => {
  const {where,take,skip,cursor} = props||{};
  return prisma.user.findMany({
    take,
    skip,
    cursor,
    ...(where && { where }),
    orderBy: { createdAt: 'desc' },
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
      ratingCycles: { select: { cycleId: true, qty: true } },
      photos: { select: { storedFile: true } },
      reactions: true,
      language:true,
    },
  });
};

export const remove = async (id: number): Promise<User> => {
  return prisma.user.delete({
    where: { id },
  });
};

export const update = async (id: number, data: Prisma.UserUpdateInput)=>{
  return prisma.user.update({
    data,
    where:{id}
  });
};

export const joinedCycles = async (id:number,lang?:string): Promise<CycleMosaicItem[]> => {
  const res = await prisma.user.findFirst({
    where:{id},
    select: {
      joinedCycles:cycleInclude
    }
  });
  
  return res?.joinedCycles.map((c:Partial<CycleMosaicItem>)=>{
    c.type='cycle';
    return c as CycleMosaicItem;
  })
  ??[];
};
export const cyclesCreated = async (id:number,lang?:string): Promise<CycleMosaicItem[]> => {
  const res = await prisma.user.findFirst({
    where:{id},
    select: {
      cycles:cycleInclude
    }
  });
  
  return res?.cycles.map((c:Partial<CycleMosaicItem>)=>{
    c.type='cycle';
    return c as CycleMosaicItem;
  })
  ??[];
};
export const posts = async (id:number,lang?:string): Promise<PostMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      posts:{
        include:{
          works:{select:{id:true,author:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
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
          favs:{select:{id:true,}},
          creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
          localImages: {select:{storedFile:true}},
          reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}},
        }
      }
    }
  });
  
  return res?.posts.map((p:Partial<PostMosaicItem>)=>{
    p.type='post';
    return p as PostMosaicItem;
  })
  ??[];
};
export const favPosts = async (id:number,lang?:string): Promise<PostMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favPosts:{
        include:{
          works:{select:{id:true,author:true,title:true,type:true,localImages:{select:{storedFile:true}}}},
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
          favs:{select:{id:true,}},
          creator: {select:{id:true,name:true,photos:true,countryOfOrigin:true}},
          localImages: {select:{storedFile:true}},
          reactions:{select:{userId:true,unified:true,emoji:true,createdAt:true}},
        }
      }
    }
  });
  
  return res?.favPosts.map((p:Partial<PostMosaicItem>)=>{
    p.type='post';
    return p as PostMosaicItem;
  })
  ??[];
};
export const favCycles = async (id:number,lang?:string): Promise<CycleMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favCycles:cycleInclude
    }
  });
  
  return res?.favCycles.map((p:Partial<CycleMosaicItem>)=>{
    p.type='cycle';
    return p as CycleMosaicItem;
  })
  ??[];
};
export const favWorks = async (id:number,lang?:string): Promise<WorkMosaicItem[]> => {
  let res = await prisma.user.findFirst({
    where:{id},
    select: {
      favWorks:workInclude
    }
  });
  
  return res?.favWorks??[];
};
