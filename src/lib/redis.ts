import Redis from 'ioredis';

const url =
  process.env.NODE_ENV === 'development'
    ? process.env.UPSTASH_REDIS_REST_URL_STAGING
    : process.env.UPSTASH_REDIS_REST_URL;
const client = new Redis(url!);
// const client = process.env.NODE_ENV == 'development' 
//   ? new Redis()
//   : new Redis(6379, "20.119.144.9");
export default client;
