import { redisClient } from './index';
import * as _ from '../constants';

export default class RedisUtils {
    // 取得列表 考慮 hscan
    static async getRateLimiterList() {
        return redisClient.hgetall(_.RATE_LIMITER_LIST);
    }

    static async setRateLimiter(key: string, value: any) {
        return redisClient.hset(_.RATE_LIMITER_LIST, key, JSON.stringify(value));
    }

    static async deleteRateLimiter(key: string) {
        return redisClient.hdel(_.RATE_LIMITER_LIST, key);
    }

    static async publishMsg(channel: string, message: string) {
        return redisClient.publish(channel, message);
    } 
}