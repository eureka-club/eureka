import { createContext, useContext } from 'react';

export type ContextType = {
  showShare: boolean;
};

export const MosaicContext = createContext<ContextType>({
  showShare: true,
});

export const useMosaicContext = (): ContextType => useContext(MosaicContext);
