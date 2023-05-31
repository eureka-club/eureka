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
  return getCycles(lang,{...myCyclesWhere(id),take},origin);
}

const useMyCycles = (id:number) => {
  return useCycles(myCyclesWhere(id),
    {enabled:!!id}
  )
};

export default useMyCycles;
