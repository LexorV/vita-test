import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'create-post', component: () => import('pages/CreatePost.vue') },
      { path: 'change-post/:id', component: () => import('pages/ChangePost.vue') },
      { path: 'create-user', component: () => import('pages/CreateUserPage.vue') },
      { path: 'user/:id', component: () => import('pages/UserPage.vue') },
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
