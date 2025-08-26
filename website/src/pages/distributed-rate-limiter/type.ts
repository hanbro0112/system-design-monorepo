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
    frequency: number;
    repeat: number;
    // 數據
    data: Array<testData>;
    intervalId?: ReturnType<typeof setInterval>;
    toastId: string;
};

export type testData = {
    TotalRequest: number;
    FailRequest: number;
    SuccessRequest: number;
    ExecutedRequest?: number;
    AverageExecutedTime?: number;
    timestamp: number;
};