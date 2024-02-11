import useTranslation from 'next-translate/useTranslation';
import useCyclesSumary, { getCyclesSumary } from './useCyclesSumary';

export const myCyclesWhere = (id:number) => ({
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
export const getMyCycles = async (id:number,take:number)=>{
  const res = await getCyclesSumary('',{...myCyclesWhere(id),take});
  return res;
}

const useMyCycles = (id:number) => {
  return useCyclesSumary('',myCyclesWhere(id),
    {enabled:!!id,cacheKey:['MY-CYCLES',id.toString()]}
  )
};

export default useMyCycles;
