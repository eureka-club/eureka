import useCycles,{getCycles} from './useCycles';

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
export const getMyCycles = async (lang:string,id:number,take:number,origin='')=>{
  const res = await getCycles(lang,{...myCyclesWhere(id),take});
  return res;
}

const useMyCycles = (lang:string,id:number) => {
  return useCycles(lang,myCyclesWhere(id),
    {enabled:!!id}
  )
};

export default useMyCycles;
