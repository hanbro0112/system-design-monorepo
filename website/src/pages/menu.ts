// id 需唯一

export default {
    items: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    icon: 'feather icon-home',
                    url: '',
                }
            ]
        },
        {
            id: 'rate-limiting',
            title: 'Rate Limiting',
            type: 'group',
            icon: 'icon-ui',
            children: [
                {
                    id: 'algorithm',
                    title: 'Algorithm',
                    type: 'item',
                    icon: 'feather icon-server',
                    url: '/distributed-rate-limiter',
                }
            ]
        },
        // {
        //     id: 'rate-limiting',
        //     title: 'Rate Limiting',
        //     type: 'group',
        //     icon: 'icon-ui',
        //     children: [
        //         {
        //             id: 'algorithm',
        //             title: 'Algorithm',
        //             type: 'collapse',
        //             icon: 'feather icon-server',
        //             children: [
        //                 {
        //                     id: 'token-bucket',
        //                     title: 'token-bucket',
        //                     type: 'item',
        //                     url: '/distributed-rate-limiter/token-bucket',
        //                 },
        //                 {
        //                     id: 'button 2',
        //                     title: 'button 2',
        //                     type: 'item',
        //                     url: '#',
        //                 }
        //             ]
        //         }
        //     ]
        // }
        {
            id: 'consistent-hashing',
            title: 'Consistent Hashing',
            type: 'group',
            icon: 'icon-ui',
            children: [
                {
                    id: 'consistent-hashing',
                    title: 'Emulator',
                    type: 'item',
                    icon: 'feather icon-box',
                    url: '/consistent-hashing',
                }
            ]
        }
    ]
}

export type MenuItem = {
    id: string,
    title: string,
    type: string,
    icon?: string,
    url?: string,
    children?: MenuItem[],
}