export const ASSETS_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_ASSETS_BASE_URL;
export const DISQUS_SHORTNAME = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
export const WEBAPP_URL = process.env.NEXT_PUBLIC_WEBAPP_URL;

const { DATABASE_URL } = process.env;
let databaseUrlTokens;

if (DATABASE_URL != null) {
  databaseUrlTokens = DATABASE_URL.match(/mssql:\/\/([\w-_]+):([^@]+)@([^/]+)\/([\w-_]+)/);
}

export const { DATABASE_ENGINE } = process.env;
export const DATABASE_USER = databaseUrlTokens != null ? databaseUrlTokens[1] : undefined;
export const DATABASE_PASSWORD = databaseUrlTokens != null ? databaseUrlTokens[2] : undefined;
export const DATABASE_HOST = databaseUrlTokens != null ? databaseUrlTokens[3] : undefined;
export const DATABASE_DB_NAME = databaseUrlTokens != null ? databaseUrlTokens[4] : undefined;
