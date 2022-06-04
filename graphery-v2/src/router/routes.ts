import { NavigationGuardWithThis, RouteRecordRaw } from 'vue-router';
import { MetaOptions } from 'quasar/dist/types/meta';

import 'vue-router';

declare module 'vue-router' {
    interface RouteMeta {
        pageMetaData?: MetaOptions;
    }
}

const langRouteBeforeEnter = {
    beforeEnter(to, from, next) {
        if (
            to.query.lang &&
            typeof to.query.lang === 'string' &&
            to.params.lang !== to.query.lang
        ) {
            next({
                ...to,
                params: {
                    ...to.params,
                    lang: to.query.lang,
                },
            });
        }
        next();
    },
} as {
    beforeEnter?:
        | NavigationGuardWithThis<undefined>
        | NavigationGuardWithThis<undefined>[];
};

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '/://^(\\/tutorial\\/|\\/graph\\/|\\/control-panel)//)',
                component: () => import('layouts/TutorialLayout.vue'),
                children: [
                    {
                        path: '/tutorial/:lang/:url',
                        props: true,
                        name: 'Tutorial',
                        component: () => import('pages/TutorialPage.vue'),
                        ...langRouteBeforeEnter,
                        // component: () =>
                        //     import(
                        //         /* webpackChunkName: "tutorial" */ '@/views/Tutorial.vue'
                        //     ),
                    },
                    {
                        path: '/tutorial/:url',
                        redirect: (to) => ({
                            name: 'Tutorial',
                            params: {
                                lang:
                                    (typeof to.query.lang === 'string' &&
                                        to.query.lang) ||
                                    'en-us',
                                url: to.params.url,
                            },
                        }),
                    },
                    {
                        path: '/graph/:lang/:url',
                        name: 'Graph',
                        props: true,
                        component: () => import('pages/IndexPage.vue'),
                        ...langRouteBeforeEnter,
                        // component: () =>
                        //     import(/* webpackChunkName: "graph" */ '@/views/Graph.vue'),
                    },
                    {
                        path: '/graph/:url',
                        redirect: (to) => ({
                            name: 'Graph',
                            params: { lang: 'en-us', url: to.params.url },
                        }),
                    },
                ],
            },
            {
                path: '',
                component: () => import('layouts/MaterialLayout.vue'),
                children: [
                    {
                        path: '',
                        name: 'Home',
                        component: () => import('pages/HomePage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'Home',
                            },
                        },
                    },
                    {
                        path: '/tutorials',
                        name: 'Tutorials',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'Tutorials',
                            },
                        },

                        // component: () =>
                        //     import(
                        //         /* webpackChunkName: "tutorials" */ '@/views/Tutorials.vue'
                        //     ),
                    },

                    {
                        path: '/graphs',
                        name: 'Graphs',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'Graphs',
                            },
                        },
                        // component: () =>
                        //     import(
                        //         /* webpackChunkName: "graphs" */ '@/views/Graphs.vue'
                        //     ),
                    },

                    {
                        path: '/about',
                        name: 'About',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'About',
                            },
                        },

                        // component: () =>
                        //     import(/* webpackChunkName: "about" */ '@/views/About.vue'),
                    },
                    {
                        path: '/faq',
                        name: 'FAQ',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'FAQ',
                            },
                        },

                        // component: () =>
                        //     import(/* webpackChunkName: "faq" */ '@/views/FAQ.vue'),
                    },
                    {
                        path: '/tos',
                        name: 'TOS',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'TOS',
                            },
                        },
                        // component: () =>
                        //     import(/* webpackChunkName: "tos" */ '@/views/TOS.vue'),
                    },
                    {
                        path: '/account',
                        name: 'Account',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'Account',
                            },
                        },
                        // component: () =>
                        //     import(
                        //         /* webpackChunkName: "account" */ '@/views/Account.vue'
                        //     ),

                        // async beforeEnter(to, from, next) {
                        //     if (store.getters.noUser) {
                        //         await pullUser().catch(() => null);
                        //         if (store.getters.noUser) {
                        //             next('/login');
                        //             return;
                        //         }
                        //     }
                        //     next();
                        // },
                    },
                    {
                        path: '/login',
                        name: 'Login',
                        component: () => import('pages/IndexPage.vue'),
                        meta: {
                            pageMetaData: {
                                title: 'Login',
                            },
                        },
                        // component: () =>
                        //     import(/* webpackChunkName: "Login" */ '@/views/Login.vue'),

                        // async beforeEnter(to, from, next) {
                        //     if (store.getters.noUser) {
                        //         await pullUser().catch(() => null);
                        //         if (store.getters.noUser) {
                        //             next();
                        //             return;
                        //         }
                        //     }
                        //     next('/account');
                        // },
                    },
                ],
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
