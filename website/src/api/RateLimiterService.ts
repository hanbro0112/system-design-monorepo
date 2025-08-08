import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

export async function getRateLimiterList(): Promise<rateLimiterList> {
    const url = `${process.env.NEXT_PUBLIC_DISTRIBUTED_RATE_LIMITER_URL}/rate-limiter`;
    try {
        const response = await fetch(url);
        const data: rateLimiterList = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching rate limiter list:', error);
        return {};
    }
}

getRateLimiterList();