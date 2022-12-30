import usePosts,{getPosts} from './usePosts';
import useBackOffice from '@/src/useBackOffice';

const backOfficePosts = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 
 

export const getFeaturedEurekas = async (ids:number[],take:number=8,origin?:string)=>{
  return getPosts({...backOfficePosts(ids),take},origin);
}

const useFeaturedEurekas = () => {
  const {data:bo} = useBackOffice();
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach(x=> postsId.push(parseInt(x)));
      
  return usePosts(backOfficePosts(postsId),
    {enabled:!!postsId,cacheKey:'eurekas-of-interest'}
  )
};

export default useFeaturedEurekas;
