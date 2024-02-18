import useTranslation from 'next-translate/useTranslation';
import usePosts,{getPosts} from './usePosts';
import useBackOffice from '@/src/useBackOffice';

const backOfficePosts = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 
 

export const getFeaturedEurekas = async (lang:string,ids:number[],take:number=8)=>{
  return getPosts(lang,{...backOfficePosts(ids),take});
}

const useFeaturedEurekas = () => {
  const {lang} = useTranslation();
  const {data:bo} = useBackOffice(undefined,lang);
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach(x=> postsId.push(parseInt(x)));
      
  return usePosts(backOfficePosts(postsId),
    {enabled:!!postsId,cacheKey:[`eurekas-of-interest-${lang}`]},
    lang,
  )
};

export default useFeaturedEurekas;
