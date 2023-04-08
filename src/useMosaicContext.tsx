import { createContext, useContext } from 'react';

export type ContextType = {
  showShare: boolean;
  cacheKey?: string[] | string;
};

export const MosaicContext = createContext<ContextType>({
  showShare: false,
  cacheKey: '',
});

export const useMosaicContext = (): ContextType => useContext(MosaicContext);
