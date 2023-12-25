"use client"

import { createContext, useContext } from 'react';

// export type ContextType = {
//     NEXT_PUBLIC_AZURE_CDN_ENDPOINT:string;
//     NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME:string;
//     NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM:string;
// };

const initialContext = {
    NEXT_PUBLIC_AZURE_CDN_ENDPOINT:'',
    NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME:'',
    NEXT_PUBLIC_PUBLIC_ASSETS_STORAGE_MECHANISM:'',
    NEXT_PUBLIC_WEBAPP_URL:''
}

const EnvContext = createContext<Record<string,string>>(initialContext);

const useEnvContext = (): Record<string,string> => useContext(EnvContext);

export {useEnvContext,EnvContext};
