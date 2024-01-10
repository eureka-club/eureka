import { Prisma } from '@prisma/client';
import usePosts,{getPosts} from './usePosts';

export const myPostsProps = (id: number)=> ({
  include:{works:true},
  where:{
    creatorId:id,
    //isPublic:true    
  }
});

export const getMyPosts = async (id:number,take:number,origin='')=>{
  return getPosts({...myPostsProps(id),take},origin);
}

const useMyPosts = (id:number) => {
  return usePosts(myPostsProps(id),
    {enabled:!!id}
  )
};

export default useMyPosts;
