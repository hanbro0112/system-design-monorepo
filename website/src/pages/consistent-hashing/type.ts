// 原始節點列表
export type nodeList = { 
    id: string; 
    color: string;
    virtualPoints: number[]; 
    circlePoints: point[];
}[];

// 節點類型定義
export type point = {
    value: number; // 0 to 2^32 - 1
    angle: number; // 角度 (0-360)
    x: number;
    y: number;
}