import usePosts,{getPosts} from './usePosts';

export const myPostsWhere = (id: number)=> ({
  where:{
    creatorId:id,
    isPublic:true    
  }
});

export const getMyPosts = async (id:number,take:number)=>{
  return getPosts({...myPostsWhere(id),take});
}

const useMyPosts = (id:number) => {
  return usePosts(myPostsWhere(id),
    {enabled:!!id}
  )
};

export default useMyPosts;
