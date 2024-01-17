"use client"
import { createContext, useContext } from 'react';
import { t } from '../lib/utils';

export type ContextType = {
  dict: Record<string,string>
  t:  (dict:Record<string,string>,s:string,p?:Record<string,any>)=>string;
};


export const DictContext = createContext<ContextType>({
  dict: {},
  t: t
});

export const useDictContext = (): ContextType => useContext(DictContext);
