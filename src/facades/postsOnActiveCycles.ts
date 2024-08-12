import { Prisma } from "@prisma/client";
import { prisma } from '@/src/lib/prisma';
import { PostSumary, PostSumarySpec } from "../types/post";
import { CycleAcces } from "../constants";

export const postsOnActiveCycles = async (sessionId?:number|null, props?: Prisma.PostFindManyArgs, page?: number): Promise<PostSumary[]> => {
    const today = new Date();
    const { take, skip, cursor } = props || {};

    const psf = await prisma.post.findMany({
      take,
      skip,
      cursor,
      orderBy: { createdAt: 'desc' },
      where:{
        ...sessionId 
        ? {
            cycles:{
                some:{
                    AND:[
                        {
                            startDate:{
                                lte:today
                            },
                        },
                        {
                            endDate:{
                                gte:today
                            }
                        }
                    ],
                    OR:[
                        {access:CycleAcces.public},
                        {
                            participants:{
                                some:{id:sessionId}
                            }
                        },
                        {creatorId:sessionId}
                    ]
                }
            }
        } 
        : {
            cycles:{
                every:{
                    access:CycleAcces.public
                }
            }
        }
      },
      select:PostSumarySpec.select
    });
    return psf.map(p=>({...p,type:'post'}));
};
export const postsOnActiveCyclesTotal = async (sessionId?:number|null): Promise<number> => {
   const today = new Date();
   const psf = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      where:{
        ...sessionId 
        ? {
            cycles:{
                some:{
                    AND:[
                        {
                            startDate:{
                                lte:today
                            },
                        },
                        {
                            endDate:{
                                gte:today
                            }
                        }
                    ],
                    OR:[
                        {access:CycleAcces.public},
                        {
                            participants:{
                                some:{id:sessionId}
                            }
                        },
                        {creatorId:sessionId}
                    ]
                }
            }
        } 
        : {
            cycles:{
                every:{
                    access:CycleAcces.public
                }
            }
        }
      },
      select:{id:true}
    });
    return psf.length;
};