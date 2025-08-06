import redis from 'ioredis';
import config from '../config';
import * as _ from '../constants';

const redisConfig = {
    ...config.redis,
    port: typeof config.redis.port === 'string' ? parseInt(config.redis.port, 10) : config.redis.port,
}

const redisClient = new redis(redisConfig);

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

// Pub/Sub 只能使用單獨的連接
// 訂閱限流器列表更新
const subscriber = new redis(redisConfig);

subscriber.subscribe(_.RATE_LIMITER_LIST, (err) => {
    if (err) {
        console.error(`Failed to subscribe to ${_.RATE_LIMITER_LIST}`, err);
    } else {
        console.log(`Subscribed to ${_.RATE_LIMITER_LIST}`);
    }
});

export { redisClient, subscriber };