export const i18n = {
    defaultLocale: 'pt',
    locales: ['en', 'es', 'fr','pt'],
  } as const
  
  export type Locale = (typeof i18n)['locales'][number]