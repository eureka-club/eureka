import { createContext, useContext } from 'react';
import { WorkMosaicItem } from './types/work';

export type ContextType = {
  work: WorkMosaicItem | null;
  showShare?: boolean;
  linkToWork?: boolean;
};

export const WorkContext = createContext<ContextType>({
  work: null,
  showShare: true,
  linkToWork: true,
});

export const useWorkContext = (): ContextType => useContext(WorkContext);
