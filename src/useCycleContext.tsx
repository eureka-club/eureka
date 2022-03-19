import { createContext, useContext } from 'react';
import { CycleMosaicItem } from './types/cycle';
import { useToasts } from 'react-toast-notifications';
import { UserMosaicItem } from './types/user';

export type ContextType = {
  cycle: CycleMosaicItem | null;
  showShare?: boolean;
  currentUserIsParticipant?: boolean;
  linkToCycle?: boolean;
  requestJoinCycle?: (cycle: CycleMosaicItem,userName:string) => Promise<string>;
};

const requestJoinCycle = async (cycle: CycleMosaicItem,userName:string) => {
  let notificationMessage = `userJoinedCycle!|!${JSON.stringify({
    userName,
    cycleTitle: cycle?.title,
  })}`;
  const notificationToUsers = (cycle?.participants || []).map(p=>p.id);
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
