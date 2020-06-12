export class Nav {
    id: number;
    title: string;
    icon: string;
    status: boolean;
    type: string;
    Nav = [
        {
            id: 1,
            title: 'Home',
            path: '/admin/dash',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 1,
            type: 'admin',
        },
        {
            id: 2,
            title: 'Oc',
            path: '/admin/oc',
            icon: 'fas fa-cog',
            status: true,
            index: 2,
            type: 'admin',
        },
        {
            id: 3,
            title: 'User',
            path: '/admin/user',
            icon: 'fas fa-users',
            status: true,
            index: 3,
            type: 'admin',
        },
        {
            id: 4,
            title: 'OC User',
            path: '/admin/oc-user',
            icon: 'fas fa-user',
            status: true,
            index: 4,
            type: 'admin',
        },
        {
            id: 5,
            title: 'Role',
            path: '/admin/role',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 5,
            type: 'admin',
        },
        {
            id: 6,
            title: 'Project',
            path: '/project',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 1,
            type: 'client',
        },
        {
            id: 7,
            title: 'Routine',
            path: '/routine',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 2,
            type: 'client',
        },
        {
            id: 8,
            title: 'Abnormal',
            path: '/abnormal',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 3,
            type: 'client',
        },
        {
            id: 9,
            title: 'Todolist',
            path: '/todolist',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 4,
            type: 'client',
        },
        {
            id: 10,
            title: 'History',
            path: '/history',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 5,
            type: 'client',
        },
        {
            id: 11,
            title: 'Follow',
            path: '/follow',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 6,
            type: 'client',
        }
    ];
    Client = [
        {
            id: 1,
            title: 'Project',
            path: '/project',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 1,
            type: 'client',
            childs: []
        },
         {
            id: 2,
            title: 'Job Type',
            path: '/',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 2,
            type: 'client',
            childs: [
                {
                    id: 1,
                    title: 'Routine',
                    path: '/routine',
                    icon: 'fas fa-shopping-cart',
                    status: true,
                    index: 1,
                    type: 'client',
                },
                {
                    id: 2,
                    title: 'Abnormal',
                    path: '/abnormal',
                    icon: 'fas fa-shopping-cart',
                    status: true,
                    index: 2,
                    type: 'client',
                },
            ]
        },
        {
            id: 3,
            title: 'Todolist',
            path: '/todolist',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 3,
            type: 'client',
            childs: []
        },
        {
            id: 4,
            title: 'History',
            path: '/history',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 4,
            type: 'client',
            childs: []
        },
        {
            id: 5,
            title: 'Follow',
            path: '/follow',
            icon: 'fas fa-shopping-cart',
            status: true,
            index: 5,
            type: 'client',
            childs: []
        }
    ];
    constructor() {}
    // constructor(id, title, icon, status) {
    //     this.id = id;
    //     this.title = title;
    //     this.icon = icon;
    //     this.status = status;
    // }
    getNavAdmin(showDashboard = false) {
        if (showDashboard) {
            return this.Nav.filter(this.isAdmin);
        } else {
            return this.Nav.filter(this.isAdminShowDash);
        }
    }
    getNavClient() {
        return this.Nav.filter(this.isClient);
    }
    getNavClient2() {
        // console.log(this.Client)
        return this.Client;
    }
    private isAdminShowDash(element, index, array) {
        return (element.type === 'admin');
    }
    private isAdmin(element, index, array) {
        return (element.type === 'admin' && element.title !== 'Home');
    }
    private isClient(element, index, array) {
        return (element.type === 'client');
    }
}


