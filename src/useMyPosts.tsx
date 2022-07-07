import usePosts,{getPosts} from './usePosts';
import { Session } from './types';

export const myPostsWhere = (id: number)=> ({
  where:{
    creatorId:id,
    isPublic:true    
  }
});

export const getMyPosts = async (id:number,take:number)=>{
  return getPosts({...myPostsWhere(id),take});
}

const useMyPosts = (session:Session|null) => {
  return usePosts(myPostsWhere((session) ? session.user.id : 0  ),
    {enabled:!!session?.user.id.toString()}
  )
};

export default useMyPosts;
