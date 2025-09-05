export type rateLimiterListType = Array<
{ 
    key: string; 
    method: string; 
    config: Record<string, number>; 
    createTime: number; 
}>;


export type testerType = Array<testConfig>;

export type testConfig = {
    key: string;
    method: string;
    frequencyRange: number;
    averageFreq: number;
    burstRate: number;
    weights: Array<number>;
    // 數據每秒
    data: Array<testData>;
    startTime: number;
    intervalId?: ReturnType<typeof setInterval>;
    toastId: string;
};

export type testData = {
    TotalRequest: number;
    FailRequest: number;
    SuccessRequest: number;
    ExecutedRequest?: number;
    AverageExecutedTime?: number;
};