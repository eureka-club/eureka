import { createContext, useContext } from 'react';
import { CycleMosaicItem } from './types/cycle';

export type ContextType = {
  cycle: CycleMosaicItem | null;
  showShare?: boolean;
};

export const CycleContext = createContext<ContextType>({
  cycle: null,
  showShare: true,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
