import { createContext, useContext } from 'react';
import { CycleMosaicItem } from './types/cycle';

export type ContextType = {
  cycle: CycleMosaicItem | null;
  showShare?: boolean;
  currentUserIsParticipant?: boolean;
};

export const CycleContext = createContext<ContextType>({
  cycle: null,
  currentUserIsParticipant: false,
  showShare: true,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
