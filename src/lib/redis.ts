import Redis from 'ioredis';

const client = new Redis(process.env.UPSTASH_REDIS_REST_URL);
export default client;
