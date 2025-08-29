import { RateLimiter, slidingWindowLogConfig, slidingWindowLogResponse } from './typeModel';
import * as _ from '../constants';
import { redisClient } from '../redis';

/**
 * 滑動窗口日誌限流器實現
 * timeWindows: number // 時間窗口大小 (秒)
 * maxRequests: number // 最大請求數
 */
export default class SlidingWindowLog implements  RateLimiter {
    async run(key: string): Promise<slidingWindowLogResponse> {
        return Boolean(await (redisClient as any)[_.SLIDING_WINDOW_LOG](1, key, `${key}_list`));
    }

    async set(key: string, config: slidingWindowLogConfig): Promise<boolean> {
        await redisClient.del(`${key}_list`);
        return Boolean(await redisClient.hset(key,
            'timeWindows', config.timeWindows,
            'maxRequests', config.maxRequests
        ));
    }

    async delete(key: string): Promise<boolean> {
        return Boolean(await redisClient.del(key) && await redisClient.del(`${key}_list`));
    }

}