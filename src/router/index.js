import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Index',
        component: () => import('../views/Index.vue'),
        redirect: { name: 'Introduce' },
        children: [
            {
                path: 'home',
                name: 'Home',
                // meta: {
                //     title: ''
                // },
                //icon: 'el-icon-s-data',
                //redirect: {name: 'generalData'},
                component: () => import('../views/home/home.vue'),

            },
           
            {
                path: '/manage',
                name: 'Manage',
                // meta: {
                //     title: ''
                // },
                //icon: 'el-icon-s-data',
                //redirect: {name: 'generalData'},
                component: () => import('../views/manage/manage.vue'),

            },
            {
                path: '/authentication',
                name: 'Authentication',
                // meta: {
                //     title: ''
                // },
                //icon: 'el-icon-s-data',
                //redirect: {name: 'generalData'},
                component: () => import('../views/authentication/authentication.vue'),

            },
            {
                path: '/step1',
                name: 'Step1',
                component: () => import('../views/contract/step1.vue'),

            },
            {
                path: '/step2',
                name: 'Step2',
                component: () => import('../views/contract/step2.vue'),

            },
            {
                path: '/step3',
                name: 'Step3',
                component: () => import('../views/contract/step3.vue'),

            },
            {
                path: '/step4',
                name: 'Step4',
                component: () => import('../views/contract/step4.vue'),

            }, {
                path: '/sign',
                name: 'Sign',
                component: () => import('../views/sign/sign.vue'),

            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/index',
        name: 'Introduce',
        component: () => import('../views/introduce.vue'),
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

// router.beforeEach((to, from, next) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//         next()
//     } else if (to.name === 'Login') {
//         next()
//     } else {
//         next('/login')
//     }
// })

export default router
