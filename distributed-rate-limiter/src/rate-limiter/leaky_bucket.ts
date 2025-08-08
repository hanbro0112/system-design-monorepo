import { RateLimiter, leakyBucketConfig, leakyBucketResponse } from './typeModel';
import * as _ from '../constants';
import { redisClient } from '../redis';

/**
 * 漏桶限流器實現
 * leakRate: number; // 每秒漏水速率
 * capacity: number; // 桶容量
 * water: number; // 當前水位
 * lastDrip: number; // 上次滴水的時間戳 毫秒
 */
export default class LeakyBucket implements  RateLimiter {
    // -1 表示桶滿 0 直接通過 0 < 表示排隊位置
    async run(key: string): Promise<leakyBucketResponse> {
        const result = await (redisClient as any)[_.LEAKY_BUCKET](1, key, '');
        // retry-after
        return result !== -1;
    }

    async set(key: string, config: leakyBucketConfig): Promise<boolean> {
        return Boolean(await redisClient.hset(key, 'leakRate', config.leakRate, 'capacity', config.capacity, 'water', 0, 'lastDrip', Date.now()));
    }

    async delete(key: string): Promise<boolean> {
        return Boolean(await redisClient.del(key));
    }
}