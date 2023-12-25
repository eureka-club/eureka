import useCycles,{getCycles} from './useCycles';
import useBackOffice from '@/src/hooks/useBackOffice';

export const interestedCyclesWhere = (ids:number[]) => ({
  where:{
    id: { in: ids },
  }
}) 

export const getInterestedCycles = async (lang:string,ids:number[],take:number=8,origin?:string)=>{
  return getCycles(lang,{...interestedCyclesWhere(ids),take},origin);
}

const useInterestedCycles = (lang: string) => {
  const {data:bo} = useBackOffice();
  let cyclesIds:number[] = [];
  if(bo && bo.CyclesExplorePage)
    bo.CyclesExplorePage.split(',').forEach(x=> cyclesIds.push(parseInt(x)));
      
  return useCycles(lang,interestedCyclesWhere(cyclesIds),
    {enabled:!!cyclesIds.length}
  )
};

export default useInterestedCycles;
