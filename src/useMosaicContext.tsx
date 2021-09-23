import { createContext, useContext } from 'react';

export type ContextType = {
  showShare: boolean;
};

export const MosaicContext = createContext<ContextType>({
  showShare: false,
});

export const useMosaicContext = (): ContextType => useContext(MosaicContext);
