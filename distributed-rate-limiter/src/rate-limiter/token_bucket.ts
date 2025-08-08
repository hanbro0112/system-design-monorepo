import { RateLimiter, tokenBucketConfig, tokenBucketResponse } from './typeModel';
import { redisClient } from '../redis/index';
import * as _ from '../constants';

/**
 * 令牌桶限流器實現
 * rate: number; // 補充令牌速率每秒
 * capacity: number; // 桶容量
 * tokens: number; // 當前令牌數量
 * lastRefill: number; // 上次補充令牌的時間戳 秒
 */
export default class TockenBucket implements RateLimiter {
    async run(key: string): Promise<tokenBucketResponse> {
        const result = await (redisClient as any)[_.TOKEN_BUCKET](1, key, '');
        return Boolean(result);
    }

    async set(key: string, config: tokenBucketConfig): Promise<boolean> {
        const result = redisClient.hset(key, 'rate', config.rate, 'capacity', config.capacity, 'tokens', config.capacity, 'lastRefill', Math.floor(Date.now() / 1000));
        return Boolean(result);
    }

    async delete(key: string): Promise<boolean> {
        const result = await redisClient.del(key);
        return Boolean(result);
    }
}