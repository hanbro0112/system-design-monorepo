import controller from './rate-limiter';
import * as _ from './constants';
import { randomUUID } from 'crypto';

const config = {
    [_.TOKEN_BUCKET]: {
        rate: 1, // 每秒補充1個令牌
        capacity: 10 // 桶容量為10
    },
    [_.LEAKY_BUCKET]: {
        leakRate: 1, // 每秒漏水1個
        capacity: 10 // 桶容量為10
    }
}
async function getList() {
    const list = await controller.getRateLimiterList();
    console.log('Rate Limiter List:', list);
}


async function main() {
    const method = _.TOKEN_BUCKET;
    const key = randomUUID().replace(/-/g, '');
    await controller.setRateLimiter(key, method, config[method]);

    getList();
    
    const result: any = [];
    const arr = new Array(20).fill(async () => {
        const res = await controller.runRateLimiter(key, method);
        result.push(res);
    })
    

    const startTime = Date.now();
    await Promise.all(arr.map(fn => fn()));
    console.log(result.filter((Boolean)).length, 'requests passed');

    await new Promise<void>((resolve) => setTimeout(() => resolve(), 2000));
    console.log('Time taken:', Date.now() - startTime, 'ms');
    console.log(await controller.runRateLimiter(key, method));

    // await controller.deleteRateLimiter(key, method);
    // getList();
}

main();
