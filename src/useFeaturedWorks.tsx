import useTranslation from 'next-translate/useTranslation';
import useBackOffice from '@/src/useBackOffice';
import useWorksDetail, { getWorksDetail } from './useWorksDetail';

export const featuredWorksWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getFeaturedWorks = async (lang:string,ids:number[],take:number=8)=>{
  return getWorksDetail(lang,{ ...featuredWorksWhere(ids), take });
}

const useFeaturedWorks = () => {
  const{lang}=useTranslation();
  const {data:bo} = useBackOffice(undefined,lang);
  let worksIds:number[] = [];
  if(bo && bo.FeaturedWorks)
    bo.FeaturedWorks.split(',').forEach((x) => worksIds.push(parseInt(x)));
      
  return useWorksDetail(featuredWorksWhere(worksIds), { enabled: !!worksIds });

  
};

export default useFeaturedWorks;
