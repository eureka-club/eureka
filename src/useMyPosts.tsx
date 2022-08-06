import usePosts,{getPosts} from './usePosts';

export const myPostsWhere = (id: number)=> ({
  where:{
    creatorId:id,
    isPublic:true    
  }
});

export const getMyPosts = async (id:number,take:number,origin='')=>{
  return getPosts({...myPostsWhere(id),take},origin);
}

const useMyPosts = (id:number) => {
  return usePosts(myPostsWhere(id),
    {enabled:!!id}
  )
};

export default useMyPosts;
