import useCycles,{getCycles} from './useCycles';
import { Session } from './types';

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

const useMyCycles = (session:Session|null) => {
  return useCycles(myCyclesWhere((session) ? session.user.id : 0  ),
    {enabled:!!session?.user.id.toString()}
  )
};

export default useMyCycles;
