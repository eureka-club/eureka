import { useQuery } from '@tanstack/react-query';
import { WEBAPP_URL } from '../constants';
import { PostMosaicItem } from '../types/post';

export const myPostsProps = (id: number)=> ({
  include:{works:true},
  where:{
    creatorId:id,
    //isPublic:true    
  }
});

export const getMyPosts = async (id:number):Promise<PostMosaicItem[]>=>{
  const url=`${WEBAPP_URL}/api/user/${id}/postsCreated`;
  const fr=await fetch(url)
  if(fr.ok){
    const{postsCreated}=await fr.json()
    return postsCreated.map((p:PostMosaicItem)=>({...p,type:'post'}));
  }
  return [];
}

const useMyPosts = (id:number) => {
  return useQuery({
    queryKey:['USER',id.toString(),'POSTS-CREATED'],
    queryFn:async()=>await getMyPosts(id)
  });
};

export default useMyPosts;
