import { RateLimiter, slidingWindowCounterConfig, slidingWindowCounterResponse } from './typeModel';
import * as _ from '../constants';
import { redisClient } from '../redis'

/**
 * 滑動窗口視窗限流器
 * timeWindows: number // 時間窗口大小 (秒)
 * maxRequests: number // 最大請求數
 * startTime: number // 開始時間 (秒) --錨定時間點
 * prevCount: number // 前一個窗口的計數
 * currentCount: number // 當前窗口的計數
 * lastRequestWindow: number // 最後請求窗口
 */
export default class SlidingWindowCounter implements  RateLimiter {
    async run(key: string): Promise<slidingWindowCounterResponse> {
        return Boolean(await (redisClient as any)[_.SLIDING_WINDOW_COUNTER](1, key, ''));
    }

    async set(key: string, config: slidingWindowCounterConfig): Promise<boolean> {
        const startTime = Math.floor(Date.now() / 1000);
        return Boolean(await redisClient.hset(key,
            'timeWindows', config.timeWindows,
            'maxRequests', config.maxRequests,
            'startTime', startTime,
            'prevCount', 0,
            'currentCount', 0,
            'lastRequestWindow', 0
        ));
    }

    async delete(key: string): Promise<boolean> {
        return Boolean(await redisClient.del(key));
    }
}