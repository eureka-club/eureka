import useTranslation from 'next-translate/useTranslation';
import usePosts,{getPosts} from './usePosts';
import useBackOffice from '@/src/useBackOffice';
import usePostsSumary, { getPostsSumary } from './usePostsSumary';

const backOfficePosts = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 
 

export const getFeaturedEurekas = async (sessionId:number,lang:string,ids:number[],take:number=8)=>{
  return getPostsSumary(sessionId,lang,{...backOfficePosts(ids),take});
}

const useFeaturedEurekas = () => {
  const {lang} = useTranslation();
  const {data:bo} = useBackOffice(undefined,lang);
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach(x=> postsId.push(parseInt(x)));
      
  return usePostsSumary(backOfficePosts(postsId),
    {enabled:!!postsId,cacheKey:[`eurekas-of-interest-${lang}`]},
  )
};

export default useFeaturedEurekas;
