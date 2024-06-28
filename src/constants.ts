export const DATE_FORMAT_HUMANIC_ADVANCED = 'MMMM Do YYYY';
export const DATE_FORMAT_PROPS = 'YYYY-MM-DD';
export const DATE_FORMAT_ONLY_YEAR = 'YYYY';
export const DATE_FORMAT_SHORT = 'DD·MM·YY';
export const DATE_FORMAT_LARGE = 'DD/MM/YYYY'; //'ddd DD, MMMM YYYY';
export const DATE_FORMAT_SHORT_MONTH_YEAR = 'MM/YYYY';

export const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL;
export const CLARITY_TRACKING_ID = process.env.NEXT_PUBLIC_CLARITY_TRACKING_ID;
export const HYVOR_SSO_KEY = process.env.NEXT_PUBLIC_HYVOR_SSO_KEY;
export const HYVOR_WEBSITE_ID = process.env.NEXT_PUBLIC_HYVOR_WEBSITE_ID;
export const STORAGE_MECHANISM_AZURE = 'azure';
export const STORAGE_MECHANISM_LOCAL_FILES = 'local';
export const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL;
export const AZURE_CDN_ENDPOINT = process.env.NEXT_PUBLIC_AZURE_CDN_ENDPOINT;
export const AZURE_STORAGE_ACCOUNT_CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_STORAGE_ACCOUNT_CONTAINER_NAME;
export const AZURE_STORAGE_URL=`https://${AZURE_CDN_ENDPOINT}.azureedge.net/${AZURE_STORAGE_ACCOUNT_CONTAINER_NAME}`
// const cronTime = '15 * * * * *';
export const CRON_TIME="0 0 20 * * *"
export const ITEMS_PER_CAROUSEL=6;
export const ITEMS_IN_LIST_PAGES=100;
export const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';
export const LOCALE_COOKIE_TTL = 60 * 60 * 24 * 90;
export const LANGUAGES : Record<string, string> = {
    es: "spanish",
    en: 'english',
    fr: 'french',
    pt: 'portuguese'
}

export const LOCALES : Record<string, string> = {
    "spanish":'es' ,
    'english':'en' ,
    'french':'fr' ,
    'portuguese':'pt' 
}