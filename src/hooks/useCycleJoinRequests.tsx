import { useQuery } from '@tanstack/react-query';

interface Options {
  staleTime?: number;
  enabled?: boolean;
}
interface UserCycleJoinRequests{
  userId:number;
  cycleId:number;
  createdAt?:Date;
}

export const removeCycleJoinRequest = async (userId:number,cycleId:number):Promise<void> =>{
  const str = localStorage.getItem('UserCycleJoinRequests');
  if(str){
    const data = JSON.parse(str) as UserCycleJoinRequests[];
    if(data){
      const idx = data.findIndex(d=>d.userId==userId && d.cycleId==cycleId)
      if(idx>-1){
        data.splice(idx,1)
        localStorage.setItem('UserCycleJoinRequests',JSON.stringify(data))      
      }
    }
  }
  else{
      localStorage.setItem('UserCycleJoinRequests',JSON.stringify([]))      
  }  
} 
export const setCycleJoinRequests = async (payload:UserCycleJoinRequests):Promise<boolean> =>{
  const {userId,cycleId,createdAt} = payload;
  const str = localStorage.getItem('UserCycleJoinRequests');
  if(str){
    const data = JSON.parse(str) as UserCycleJoinRequests[];
    const idx = data.findIndex(d=>d.userId==userId&&d.cycleId==cycleId)
    if(idx==-1){
      data.push({userId,cycleId,createdAt:createdAt||new Date()})
      localStorage.setItem('UserCycleJoinRequests',JSON.stringify(data))
      return true;
    }
  }
  else{
      localStorage.setItem('UserCycleJoinRequests',JSON.stringify([{userId,cycleId,createdAt:new Date()}]))
      return true;
  }
  return false;
}

export const getCycleJoinRequests = async (userId:number):Promise<UserCycleJoinRequests[]> => {
  const str = localStorage.getItem('UserCycleJoinRequests');
  let res:UserCycleJoinRequests[] = [];
  if(str){
    const data = JSON.parse(str) as UserCycleJoinRequests[];
    res = data.reduce((p,c)=>{
      if(c.userId==userId)
        res.push(c);
      return res;
    },res);
  }
  return res;
};

const useCycleJoinRequests = (userId:number,options:Options) => {
  
  const { staleTime, enabled } = options || {
    staleTime: 1000 * 60 * 60,
    enabled: true,
  };
  return useQuery<UserCycleJoinRequests[]>({
    queryKey:['USER', userId, 'cycles-join-requests'],
    queryFn: () => getCycleJoinRequests(userId), 
    staleTime,
    enabled
  });
};

export default useCycleJoinRequests;
