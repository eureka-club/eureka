import { Prisma } from '@prisma/client';
import usePosts,{getPosts} from './usePosts';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from 'react-query';
import { GetPostBySessionFilter, PostDetail, PostSumary } from './types/post';
import { Session } from '@/src/types';
import { useSession } from 'next-auth/react';
import { getPostsSumary } from './usePostsSumary';

export const myPostsProps = (id: number,session:Session|null)=> {
  const gpsf = GetPostBySessionFilter(session);
  return {
    include:{works:true},
    where:{
      AND:{
        creatorId:id,
        ... id!=session?.user.id && gpsf
      }
    }
  }
};

export const getMyPosts = async (id:number,session:Session|null,take=6)=>{
  const res =await  getPostsSumary(session?.user.id!,'',{...myPostsProps(id,session),take});
  return res;
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}

const useMyPosts = (id:number,take=6,options?:Options) => {
  const {data:session}=useSession();
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = [`MY-POSTS-${take}`, id.toString()]
  return useQuery<{posts:PostSumary[],fetched:number,total:number}>(ck, async () => await getMyPosts(id,session,take), {
    staleTime,
    enabled,
    // retry:3
  });
};

export default useMyPosts;
