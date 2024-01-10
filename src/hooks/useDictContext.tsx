"use client"
import { createContext, useContext } from 'react';

export type ContextType = {
  dict: Record<string,string>
  langs:string
};

export const DictContext = createContext<ContextType>({
  dict: {},
  langs: 'pt'
});

export const useDictContext = (): ContextType => useContext(DictContext);
