import Redis from 'ioredis';

const client = new Redis('rediss://:54d739d220204ea0a28bf5df9ff88e1c@usw1-engaged-bobcat-31462.upstash.io:31462');
export default client;
