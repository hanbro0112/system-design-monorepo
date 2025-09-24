// 圓環的半徑和中心
const centerX = 200;
const centerY = 200;
const ringRadius = 197.5;

// 將哈希值轉換為角度 (0-360度)
export const valueToAngle = (value: number): number => {
    return (value / Math.pow(2, 32)) * 360;
};

// 將角度轉換為圓環上的坐標
export const angleToPosition = (angle: number) => {
    const radian = (angle - 90) * Math.PI / 180; // -90度使0度指向頂部
    return {
        x: centerX + ringRadius * Math.cos(radian),
        y: centerY + ringRadius * Math.sin(radian)
    };
};

// 根據 id 產生固定顏色（hash to color），讓結果差距更大
export function idToColor(id: string): string {
    let hash = 5381;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 7) + hash) + id.charCodeAt(i); // 使用更大位移
    }
    const hue = Math.abs(hash * 13) % 360; // 乘以質數增加分散度
    const sat = 60 + (Math.abs(hash * 17) % 30); // 60~89%
    const light = 45 + (Math.abs(hash * 23) % 30); // 45~74%
    return `hsl(${hue}, ${sat}%, ${light}%)`;
}