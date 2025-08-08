import { RateLimiter } from './typeModel';
import * as _ from '../constants';

export default class SlidingWindowCounter implements  RateLimiter {
    async run(key: string): Promise<boolean> {
        return true
    }

    async set(key: string, config: Record<string, number>): Promise<boolean> {
        return true;
    }

    async delete(key: string): Promise<boolean> {
        return true;
    }

    
}