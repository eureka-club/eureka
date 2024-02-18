import useTranslation from 'next-translate/useTranslation';
import useBackOffice from '@/src/useBackOffice';
import useCyclesSumary, { getCyclesSumary } from './useCyclesSumary';

export const interestedCyclesWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getInterestedCycles = async (lang:string,ids:number[],take:number=8)=>{
  return getCyclesSumary(lang,{...interestedCyclesWhere(ids),take});
}

const useInterestedCycles = () => {
  const {lang}=useTranslation();
  const {data:bo} = useBackOffice();
  let cyclesIds:number[] = [];
  if(bo && bo.CyclesExplorePage)
    bo.CyclesExplorePage.split(',').forEach(x=> cyclesIds.push(parseInt(x)));
      
  return useCyclesSumary(lang,interestedCyclesWhere(cyclesIds),
    {enabled:!!cyclesIds.length,cacheKey:[`cycles-of-interest-${lang}`]}
  )
};

export default useInterestedCycles;
