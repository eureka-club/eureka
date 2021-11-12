import { createContext, useContext } from 'react';
import { CycleMosaicItem } from './types/cycle';

export type ContextType = {
  cycle: CycleMosaicItem | null;
  showShare?: boolean;
  currentUserIsParticipant?: boolean;
  linkToCycle?: boolean;
  requestJoinCycle?: (cycle: CycleMosaicItem) => Promise<string>;
};

const requestJoinCycle = async (cycle: CycleMosaicItem) => {
  const res = await fetch(`/api/cycle/${cycle!.id}/join`, { method: 'POST' });
  const json = await res.json();
  if ('status' in json) return json.status;
  return 'Failed';
};

export const CycleContext = createContext<ContextType>({
  cycle: null,
  currentUserIsParticipant: false,
  showShare: true,
  linkToCycle: true,
  requestJoinCycle,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
