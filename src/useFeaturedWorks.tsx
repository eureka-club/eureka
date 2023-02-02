import useWorks, { getWorks } from './useWorks';
import useBackOffice from '@/src/useBackOffice';

const featuredWorksWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getFeaturedWorks = async (ids:number[],take:number=8)=>{
  return getWorks({ ...featuredWorksWhere(ids), take });
}

const useFeaturedUsers = () => {
  const {data:bo} = useBackOffice();
  let worksIds:number[] = [];
  if(bo && bo.FeaturedWorks)
    bo.FeaturedWorks.split(',').forEach((x) => worksIds.push(parseInt(x)));
      
  return useWorks(featuredWorksWhere(worksIds), { enabled: !!worksIds });

  
};

export default useFeaturedUsers;
