//import 'server-only'
import type { Locale } from '@/i18n-config'

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en()

  export const t = (dict:Record<string,string>,s:string,p?:Record<string,any>)=>{
    if(!p)
      return dict[s];
    let res = dict[s];
    Object.entries(p).forEach(([k,v])=>{
        res = res.replace(`{{${k}}}`,v);
    }) 
    return res; 
  }