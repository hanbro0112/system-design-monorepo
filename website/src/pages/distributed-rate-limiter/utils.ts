import avatar1 from '@/assets/images/avatar-1.jpg';
import avatar2 from '@/assets/images/avatar-2.jpg';
import avatar3 from '@/assets/images/avatar-3.jpg';
import avatar4 from '@/assets/images/avatar-4.jpg';
import avatar5 from '@/assets/images/avatar-5.jpg';

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const getAvatar = (key: string) => {
    const index = parseInt(key, 16) % avatars.length;
    return avatars[index];
};

export const getTasksNumber = (weights: number[], burstRate: number) => {
    if (Math.random() * 100 <= burstRate) {
        return 2 * weights.length; 
    }
    const weight = Math.random() * weights[weights.length - 1];
    for (let i = 0; i < weights.length; i++) {
        if (weight <= weights[i]) {
            return i;
        }
    }
    return 0;
}