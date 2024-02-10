import { Prisma } from '@prisma/client';
import usePosts,{getPosts} from './usePosts';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from 'react-query';
import { GetPostBySessionFilter, PostDetail } from './types/post';
import { Session } from '@/src/types';
import { useSession } from 'next-auth/react';

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

export const getMyPosts = async (id:number,session:Session|null,take:number,origin='')=>{
  const res =await  getPosts('',{...myPostsProps(id,session),take},origin);
  return res;
}

interface Options {
  staleTime?: number;
  enabled?: boolean;
  cacheKey?:string|string[];
}

const useMyPosts = (id:number,take=8,options?:Options) => {
  const {data:session}=useSession();
  const { staleTime, enabled, cacheKey } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  let ck = ['MY-POSTS', id.toString()]
  return useQuery<{posts:PostDetail[],fetched:number,total:number}>(ck, async () => await getMyPosts(id,session,take), {
    staleTime,
    enabled,
    retry:3
  });
};

export default useMyPosts;
