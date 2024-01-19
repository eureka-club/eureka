// import useCycles,{getCycles} from './useCycles';

import { useQuery } from "@tanstack/react-query";
import { WEBAPP_URL } from "../constants";
import { CycleDetail } from "../types/cycle";

// export const myCyclesWhere = (id:number) => ({
//   where:{
//     OR:[
//       {
//         participants:{some:{id}},
//       },
//       {
//         creatorId:id
//       }
//     ]
//   }
// });
export const getMyCycles = async (id:number):Promise<CycleDetail[]>=>{
  let res:CycleDetail[] = [];
  const url = `${WEBAPP_URL}/api/user/${id}`;
  
  const ccfr=await fetch(`${url}/cyclesCreated`);
  if(ccfr.ok){
    const {cyclesCreated}=await ccfr.json();
    res.push.apply(cyclesCreated);
  }
  const jcfr=await fetch(`${url}/joinedCycles`);
  if(jcfr.ok){
    const {joinedCycles}=await jcfr.json();
    res.push.apply(joinedCycles);
  }
  return res;
}

const useMyCycles = (id:number) => {
  return useQuery({
    queryKey:['USER',id.toString(),'MY-CYCLES'],
    queryFn:async()=>await getMyCycles(id)
  })
};

export default useMyCycles;
