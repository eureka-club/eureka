import usePosts,{getPosts} from './usePosts';
import useBackOffice from '@/src/useBackOffice';

const backOfficePosts = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 
 

export const getFeaturedEurekas = async (ids:number[],take:number=8)=>{
  return getPosts({...backOfficePosts(ids),take});
}

const useFeaturedEurekas = () => {
  const {data:bo} = useBackOffice();
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach(x=> postsId.push(parseInt(x)));
      
  return usePosts(backOfficePosts(postsId),
    {enabled:!!postsId}
  )
};

export default useFeaturedEurekas;
