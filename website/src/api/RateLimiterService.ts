import { rateLimiterList } from '#/distributed-rate-limiter/src/rate-limiter/typeModel';

export async function getRateLimiterList(): Promise<rateLimiterList> {
    const url = `${process.env.NEXT_PUBLIC_DISTRIBUTED_RATE_LIMITER_URL}/rate-limiter`;
    try {

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data: rateLimiterList = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error fetching rate limiter list:', error);
        return {};
    }
}

export async function setRateLimiter(key: string, method: string, config: Record<string, number>): Promise<boolean> {
    const url = `${process.env.NEXT_PUBLIC_DISTRIBUTED_RATE_LIMITER_URL}/rate-limiter/${key}`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                method,
                config
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Error setting rate limiter:', error);
        return false;
    }
}

export async function deleteRateLimiter(key: string, method: string): Promise<boolean> {
    const url = `${process.env.NEXT_PUBLIC_DISTRIBUTED_RATE_LIMITER_URL}/rate-limiter/${key}/${method}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting rate limiter:', error);
        return false;
    }
}
