import { createContext, useContext } from 'react';
import { CycleMosaicItem } from './types/cycle';

export type ContextType = {
  cycle: CycleMosaicItem | null;
  showShare?: boolean;
  currentUserIsParticipant?: boolean;
  linkToCycle?: boolean;
};

export const CycleContext = createContext<ContextType>({
  cycle: null,
  currentUserIsParticipant: false,
  showShare: true,
  linkToCycle: true,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
