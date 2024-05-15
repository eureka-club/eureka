import { ITEMS_PER_CAROUSEL } from './constants';
import useCyclesSumary, { getCyclesSumary } from './useCyclesSumary';

export const myCyclesWhere = (id:number,take=6) => ({
  take,
  where:{
    OR:[
      {
        participants:{some:{id}},
      },
      {
        creatorId:id
      }
    ]
  }
});
export const getMyCycles = async (id:number,take=ITEMS_PER_CAROUSEL)=>{
  const res = await getCyclesSumary('',{...myCyclesWhere(id),take});
  return res;
}

const useMyCycles = (id:number,take=6) => {
  return useCyclesSumary('',myCyclesWhere(id,take),
    {enabled:!!id,cacheKey:[`MY-CYCLES-${take}`,id.toString()]}
  )
};

export default useMyCycles;
