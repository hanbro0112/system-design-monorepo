const menu = {
    items: [
        {
            id: 'navigation',
            title: 'Navigition',
            type: 'group',
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