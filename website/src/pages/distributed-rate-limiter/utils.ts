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