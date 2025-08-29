import { RateLimiter, fixedWindowCounterConfig, fixedWindowCounterResponse } from './typeModel';
import * as _ from '../constants';
import { redisClient } from '../redis';

/**
 * 固定窗口計數器限流器實現
 * timeWindows: number; // 時間窗口大小 (秒)
 * maxRequests: number; // 最大請求數
 * count: number; // 當前請求數
 * startTime: number; // 窗口開始時間
 */
export default class FixedWindowCounter implements  RateLimiter {
    async run(key: string): Promise<fixedWindowCounterResponse> {
        return Boolean(await (redisClient as any)[_.FIXED_WINDOW_COUNTER](1, key, ''));
    }

    async set(key: string, config: fixedWindowCounterConfig): Promise<boolean> {
        return Boolean(await redisClient.hset(key, 
            'timeWindows', config.timeWindows, 
            'maxRequests', config.maxRequests, 
            'count', 0, 
            'startTime', Math.floor(Date.now() / 1000)));
    }

    async delete(key: string): Promise<boolean> {
        return Boolean(await redisClient.del(key));
    }
}