import { RateLimiter } from './baseModel';
import redisUtils from '../redis/utils';
import * as _ from '../constants';

export default class SlidingWindowLog implements  RateLimiter {
    async setRateLimiter(key: string, config: object): Promise<boolean> {
        return Boolean(await redisUtils.setRateLimiter(key, config));
    }

    async deleteRateLimiter(key: string): Promise<boolean> {
        return Boolean(await redisUtils.deleteRateLimiter(key));
    }


    
}