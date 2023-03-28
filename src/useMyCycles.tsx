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

export const getMyCycles = async (id:number,take:number,origin='')=>{
  return getCycles({...myCyclesWhere(id),take},origin);
}

const useMyCycles = (id:number) => {
  return useCycles(myCyclesWhere(id),
    {enabled:!!id}
  )
};

export default useMyCycles;
