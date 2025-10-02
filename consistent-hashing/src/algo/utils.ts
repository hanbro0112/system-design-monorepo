export class HashUtils {
    
    static hashcode(str: string): number {
        const p = 16777619;
        let hash = 2166136261;
        for (let i = 0; i < str.length; i++) {
            hash = (hash ^ str.charCodeAt(i)) * p;
        }
        hash += hash << 13;
        hash ^= hash >> 7;
        hash += hash << 3;
        hash ^= hash >> 17;
        hash += hash << 5;

        if (hash < 0) {
            hash = Math.abs(hash);
        }
        return hash;
    }
}