require('dotenv').config();

const config = {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        username: 'distributed-rate-limiter',
        password: process.env.REDIS_PASSWORD,
    }
}
console.log('Redis config:', config.redis);
export default config;
