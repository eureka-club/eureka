import Redis from 'ioredis';

const url =
  process.env.NODE_ENV === 'development'
    ? process.env.UPSTASH_REDIS_REST_URL_STAGING
    : process.env.UPSTASH_REDIS_REST_URL;
const client = new Redis(url);
export default client;
