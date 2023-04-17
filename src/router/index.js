import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Index',
        //component: () => import('../views/Index.vue'),
        //redirect: {name: 'Spu'},
        // children: [
        //     {
        //         path: 'dataStatistics',
        //         name: 'DataStatistics',
        //         meta: {
        //             title: '数据统计'
        //         },
        //         icon: 'el-icon-s-data',
        //         redirect: {name: 'generalData'},
        //         component: () => import('../views/dataStatistics/Index.vue'),
               
        //     },     
        // ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/:catchAll(.*)',
        name: 'Drop',
        component: () => import('../views/404.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (token) {
        next()
    } else if (to.name === 'Login') {
        next()
    } else {
        next('/login')
    }
})

export default router
