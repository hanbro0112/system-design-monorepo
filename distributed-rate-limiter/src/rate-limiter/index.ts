import fs from 'fs';
import * as _ from '../constants';
import { redisClient } from '../redis';
import { RateLimiter, rateLimiterList, response } from './typeModel';  

class Controller {
    private rClass: Record<string, RateLimiter> = {};

    constructor() {
        try {
            const files = fs.readdirSync(__dirname);
        
            files.forEach(file => {
                const title = file.replace('.ts', '');
                if (title.indexOf('_') === -1) return;
                this.rClass[title] = new (require(`./${title}`).default)();
            })
        } catch (err) {
            throw Error(`Error reading rate-limiter directory: ${err}`);
        }
    }

    async getRateLimiterList(): Promise<rateLimiterList> {
        const result = await redisClient.hgetall(_.RATE_LIMITER_LIST);
        const newResult: rateLimiterList = {};
        for (const key in result) {
            newResult[key] = JSON.parse(result[key]);
        }
        return newResult;
    }

    async setRateLimiter(key: string, method: string, config: Record<string, number>): Promise<boolean> {
        const isSuccess = await this.rClass[method].set(key, config);
        if (isSuccess) {
            await redisClient.hset(_.RATE_LIMITER_LIST, key, JSON.stringify({
                method,
                config,
                createTime: Math.floor(Date.now() / 1000)
            }));
        }
        return isSuccess;
    }

    async runRateLimiter(key: string, method: string): Promise<response> {
        return this.rClass[method].run(key);
    }
    
    async deleteRateLimiter(key: string, method: string): Promise<boolean> {
        const isSuccess = await this.rClass[method].delete(key);
        if (isSuccess) {
            await redisClient.hdel(_.RATE_LIMITER_LIST, key);
        }
        return isSuccess;
    }
}

export default new Controller();
