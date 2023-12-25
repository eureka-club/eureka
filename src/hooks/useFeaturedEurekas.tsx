//import useTranslation from 'next-translate/useTranslation';
import usePosts, { getPosts } from '@/src/hooks/usePosts';
import useBackOffice from '@/src/hooks/useBackOffice';

const backOfficePosts = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 
 

export const getFeaturedEurekas = async (ids:number[],take:number=8,origin?:string)=>{
  return getPosts({...backOfficePosts(ids),take},origin);
}

const useFeaturedEurekas = () => {
  //const {lang} = useTranslation();
  const {data:bo} = useBackOffice();
  let postsId:number[] = [];
  if(bo && bo.PostExplorePage)
    bo.PostExplorePage.split(',').forEach((x:any)=> postsId.push(parseInt(x)));
      
  return usePosts(backOfficePosts(postsId),
    {enabled:!!postsId}
  )
};

export default useFeaturedEurekas;
