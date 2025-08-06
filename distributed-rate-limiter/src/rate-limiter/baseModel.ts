export interface RateLimiter {
    // 設定
    setRateLimiter(key: string, config: object): Promise<boolean>;

    // 刪除
    deleteRateLimiter(key: string): Promise<boolean>;

}

export type rateLimiterItems = {
    method: string; // 限流方法
    config: Record<string, number>; // 限流配置
};
