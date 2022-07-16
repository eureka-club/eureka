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

export const getMyCycles = async (id:number,take:number)=>{
  return getCycles({...myCyclesWhere(id),take});
}

const useMyCycles = (id:number) => {
  return useCycles(myCyclesWhere(id),
    {enabled:!!id}
  )
};

export default useMyCycles;
