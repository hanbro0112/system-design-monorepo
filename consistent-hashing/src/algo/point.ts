import { HashUtils } from './utils';

export class Point {
    private ip: string;
    private virtualPoints: number[];

    constructor(ip: string, virtualPointsNumber: number = 100) {
        this.ip = ip;
        this.virtualPoints = new Array(virtualPointsNumber).fill(0);
        this.initVirtualPoints();
    }

    private initVirtualPoints(): void {
        for (let i = 0; i < this.virtualPoints.length; i++) {
            this.virtualPoints[i] = HashUtils.hashcode(`${this.ip}#${i}`);
        }
    }

    getVirtualPoints(): number[] {
        return this.virtualPoints;
    }

    getIp(): string {
        return this.ip;
    }
}