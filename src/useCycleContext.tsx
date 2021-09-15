import { createContext, useContext } from 'react';
import { CycleMosaicItem } from './types/cycle';

export type ContextType = {
  cycle: CycleMosaicItem | null;
};

export const CycleContext = createContext<ContextType>({
  cycle: null,
});

export const useCycleContext = (): ContextType => useContext(CycleContext);
