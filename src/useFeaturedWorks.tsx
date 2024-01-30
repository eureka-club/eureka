import useTranslation from 'next-translate/useTranslation';
import useWorks, { getWorks } from './useWorks';
import useBackOffice from '@/src/useBackOffice';

export const featuredWorksWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getFeaturedWorks = async (lang:string,ids:number[],take:number=8,origin?:string)=>{
  return getWorks(lang,{ ...featuredWorksWhere(ids), take },origin||'');
}

const useFeaturedWorks = () => {
  const{lang}=useTranslation();
  const {data:bo} = useBackOffice(undefined,lang);
  let worksIds:number[] = [];
  if(bo && bo.FeaturedWorks)
    bo.FeaturedWorks.split(',').forEach((x) => worksIds.push(parseInt(x)));
      
  return useWorks(featuredWorksWhere(worksIds), { enabled: !!worksIds });

  
};

export default useFeaturedWorks;
