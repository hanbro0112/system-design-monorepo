export type rateLimiterListType = Array<
{ 
    key: string; 
    method: string; 
    config: Record<string, number>; 
    createTime: number 
}>;