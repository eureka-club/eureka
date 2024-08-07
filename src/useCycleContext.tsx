import { createContext, useContext } from 'react';
import { CycleDetail } from './types/cycle';
import toast from 'react-hot-toast';
import { UserDetail } from './types/user';

export type ContextType = {
  cycle: CycleDetail | null;
  showShare?: boolean;
  currentUserIsParticipant?: boolean;
  linkToCycle?: boolean;
  requestJoinCycle?: (cycle: CycleDetail,userName:string,participants:UserDetail[]) => Promise<string>;
};

const requestJoinCycle = async (cycle: CycleDetail,userName:string,participants:UserDetail[]) => {
  let notificationMessage = `userJoinedCycle!|!${JSON.stringify({
    userName,
    cycleTitle: cycle?.title,
  })}`;
  const notificationToUsers = (participants || []).map(p=>p.id);
  if(cycle?.creatorId) notificationToUsers.push(cycle?.creatorId);


  const res = await fetch(`/api/cycle/${cycle!.id}/join`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationMessage,
          notificationContextURL: `/cycle/${cycle!.id}`,
          notificationToUsers,
        })
  });
  if(res.ok){
    return 'OK';
  }
  return 'Internal Server Error';
};

export const CycleContext = createContext<ContextType>({
  cycle: null,
  currentUserIsParticipant: false,
  showShare: true,
  linkToCycle: true,
  requestJoinCycle,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
