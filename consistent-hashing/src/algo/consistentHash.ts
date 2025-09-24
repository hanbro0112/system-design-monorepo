import { Point } from './point';
import { HashUtils } from './utils';

type data = {
    key: number,
    value: Point,
};

export class ConsistentHashing {
    private hashRing: data[] = [];

    pointList: Point[] = [];
    pointIndex: Record<string, number> = {};

    /**
     * 增加節點 + 給定的虛擬節點
     * @param ip 
     * @param virtualPointsNumber
     */
    addPoint(ip: string, virtualPointsNumber: number): Point['virtualPoints'] {
        // 重複新增
        if (this.pointIndex[ip]) {
            return this.pointList[this.pointIndex[ip]].getVirtualPoints();
        }
        const point = new Point(ip, virtualPointsNumber);
        this.pointList.push(point);
        this.pointIndex[ip] = this.pointList.length - 1;
        for (let virtualPoints of point.getVirtualPoints()) {
            this.hashRing.push({ key: virtualPoints, value: point });
        }
        this.hashRing.sort((a, b) => a.key - b.key);
        return point.getVirtualPoints();
    }

    /**
     * 移除節點
     * @param ip
     */ 
    removePoint(ip: string) {
        const point = this.pointList.find(item => item.getIp() === ip);
        if (!point) return;
        
        const virtualPointsSet = new Set(point.getVirtualPoints());
        this.hashRing = this.hashRing.filter(item => !virtualPointsSet.has(item.key));
        this.pointList = this.pointList.filter(item => item.getIp() !== ip);
        this.pointIndex = {};
        for (let i = 0; i < this.pointList.length; i++) {
            this.pointIndex[this.pointList[i].getIp()] = i;
        }
    }

    /**
     * 獲得最近的順時針節點 (不包含)
     * @param key 
     */
    findMatchPoint(key: string): Point | null {
        if (this.hashRing.length === 0) return null;

        const hashKey = HashUtils.hashcode(key);
        let l = 0, r = this.hashRing.length;
        while (l < r) { 
            const mid = l + r >> 1;
            if (this.hashRing[mid].key <= hashKey) l = mid + 1;
            else r = mid;
        }
        return l === this.hashRing.length ? this.hashRing[0].value : this.hashRing[l].value;
    }
}