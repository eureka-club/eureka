import { createContext, useContext } from 'react';
import { CycleDetail } from './types/cycle';

export type ContextType = {
  showShare?: boolean;
  currentUserIsParticipant?: boolean;
  linkToCycle?: boolean;
  requestJoinCycle?: (cycle: CycleDetail) => Promise<string>;
};

const requestJoinCycle = async (cycle: CycleDetail) => {
  const res = await fetch(`/api/cycle/${cycle!.id}/join`, { method: 'POST' });
  const json = await res.json();
  if ('status' in json) return json.status;
  return 'Failed';
};

export const CycleContext = createContext<ContextType>({
  currentUserIsParticipant: false,
  showShare: true,
  linkToCycle: true,
  requestJoinCycle,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
