
import { useParams } from 'next/navigation';
import usePosts,{getPosts} from './usePosts';
import useBackOffice from '@/src/useBackOffice';

const backOfficePosts = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 
 

export const getFeaturedEurekas = async (lang:string,ids:number[],take:number=8,origin?:string)=>{
  const posts = await getPosts(lang,{...backOfficePosts(ids),take},origin);debugger;
  return posts;
}

const useFeaturedEurekas = () => {
  const {lang} = useParams<{lang:string}>()!;
  const {data:bo} = useBackOffice(undefined,lang);
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach(x=> postsId.push(parseInt(x)));
      
  return usePosts(backOfficePosts(postsId),
    {enabled:!!postsId,cacheKey:[`eurekas-of-interest-${lang}`]},
  )
};

export default useFeaturedEurekas;
