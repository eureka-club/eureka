import { createContext, FC, ReactElement, useContext } from "react";
import { GenericMosaicItemProps } from "./types";


const context = createContext<GenericMosaicItemProps|null>(null)
export const useProviderContext = ():GenericMosaicItemProps|null => useContext<GenericMosaicItemProps|null>(context)

export type Props = GenericMosaicItemProps & {children:ReactElement}

const Provider:FC<Props> = ({
    item,
    showSocialInteraction = true,
    cacheKey,
    customMosaicStyle,
    size,
    userMosaicDetailed,
    children
  })=>{
    return <context.Provider value={{
        item,
        showSocialInteraction,
        cacheKey,
        customMosaicStyle,
        size,
        userMosaicDetailed
      }}>
        {children}
    </context.Provider>
}

export default Provider