import fs from 'fs';
import { subscriber } from '../redis';
import redisUtils from '../redis/utils';
import * as _ from '../constants';
import { RateLimiter, rateLimiterItems } from './baseModel';  

class Controller {
    private rList: Record<string, rateLimiterItems>  = {};
    private rClass: Record<string, RateLimiter> = {};

    constructor() {
        try {
            const files = fs.readdirSync(__dirname);
        
            files.forEach(file => {
                const title = file.replace('.ts', '');
                if (title.indexOf('-') === -1) return;
                this.rClass[title] = new (require(`./${title}`).default)();
            })
        } catch (err) {
            throw Error(`Error reading directory: ${err}`);
        }
    }

    async getRateLimiterList(): Promise<Record<string, rateLimiterItems>> {
        const newList = await redisUtils.getRateLimiterList();
        this.rList = {};
        Object.keys(newList).forEach(key => {
            this.rList[key] = JSON.parse(newList[key]);
        });        
        return this.rList; 
    }
    
    // 存在並發問題: 需加鎖
    async setRateLimiter(key: string, method: string, config: Record<string, number>): Promise<boolean> {
        if (!this.rClass[method]) {
            throw Error(`Rate limiter Method: ${method} not found`);
        }
        // 1. 已存在
        if (this.rList[key]) {
            const origin: rateLimiterItems = this.rList[key];
            const originConfig = origin.config;

            if (method !== origin.method) {
                // 刪除原本的限流器
                await this.deleteRateLimiter(key, origin.method);
            } else {
                // 檢查是否有更新
                if (Object.keys(originConfig).length === Object.keys(config).length &&
                    Object.keys(originConfig).every(k => originConfig[k] === config[k])) {
                    return true;
                }
            }
        }

        // 2. 更新
        const isSuccess = Boolean(await this.rClass[method].setRateLimiter(key, config));
        if (isSuccess) {
            this.rList[key] = { method, config };
            // 發佈更新
            redisUtils.publishMsg(_.RATE_LIMITER_LIST, JSON.stringify({ key, ...this.rList[key] }));
        }
        return isSuccess;
    }

    async deleteRateLimiter(key: string, method: string) {
        return this.rClass[method].deleteRateLimiter(key);
    }

    updateRateLimiterList(message: string) {
        try {
            const { key, method, config } = JSON.parse(message);
            this.rList[key] = {
                method,
                config
            };
        } catch (err) {
            throw Error(`Poison message: ${err}`);
        }
    }
}

const controller = new Controller();

// 初始化限流器列表
controller.getRateLimiterList();

// 訂閱限流器列表更新
subscriber.on('message', async (channel, message) => {
    console.log(`Received message from ${channel}:`, message);
    controller.updateRateLimiterList(message);
});

export default controller;
