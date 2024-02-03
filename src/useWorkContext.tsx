import { createContext, useContext } from 'react';
import { WorkDetail } from './types/work';

export type ContextType = {
  work: WorkDetail | null;
  showShare?: boolean;
  linkToWork?: boolean;
};

export const WorkContext = createContext<ContextType>({
  work: null,
  showShare: true,
  linkToWork: true,
});

export const useWorkContext = (): ContextType => useContext(WorkContext);
