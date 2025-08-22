export type rateLimiterListType = Array<
{ 
    key: string; 
    method: string; 
    config: Record<string, number>; 
    createTime: number; 
}>;

export type testerType = Array<{
    key: string;
    method: string;
    frequency: number;
    repeat: number;
    // 每秒數據
    data?: Array<{
        TotalRequest: number;
        SuccessRequest: number;
        FailRequest: number;
        ExecutedRequest: number;
        AverageExecutedTime: number;
    }>;
}>;