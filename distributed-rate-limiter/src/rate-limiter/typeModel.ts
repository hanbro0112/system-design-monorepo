export type rateLimiterList = Record<string, {
    method: string,
    config: Record<string, number>,
    createTime: number
}>

export interface RateLimiter {
    // 執行
    run(key: string): Promise<response>;
    
    // 設定
    set(key: string, config: Record<string, number>): Promise<boolean>;

    // 刪除
    delete(key: string): Promise<boolean>;

}

export type response = 
    tokenBucketResponse |
    leakyBucketResponse |
    fixedWindowCounterResponse |
    slidingWindowLogResponse |
    slidingWindowCounterResponse;

export type tokenBucketResponse = boolean;
export type leakyBucketResponse = boolean;
export type fixedWindowCounterResponse = boolean;
export type slidingWindowLogResponse = boolean;
export type slidingWindowCounterResponse = boolean;

export type tokenBucketConfig = {
    rate: number; // 每秒補充令牌數量
    capacity: number; // 桶容量
}

export type leakyBucketConfig = {
    leakRate: number; // 每秒漏水速率
    capacity: number; // 桶容量
}

export type fixedWindowCounterConfig  = {
    timeWindows: number; // 時間窗口大小 (秒)
    maxRequests: number; // 最大請求數
}

export type slidingWindowLogConfig = {
    timeWindows: number; // 時間窗口大小 (秒)
    maxRequests: number; // 最大請求數
}

export type slidingWindowCounterConfig = {
    timeWindows: number; // 時間窗口大小 (秒)
    maxRequests: number; // 最大請求數
}