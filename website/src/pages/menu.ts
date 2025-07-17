const menu = {
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
                    id: 'function',
                    title: 'Function',
                    type: 'collapse',
                    icon: 'feather icon-server',
                    children: [
                        {
                            id: 'button 1',
                            title: 'button 1',
                            type: 'item',
                            url: '#',
                        },
                        {
                            id: 'button 2',
                            title: 'button 2',
                            type: 'item',
                            url: '#',
                        }
                    ]
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

export default menu;