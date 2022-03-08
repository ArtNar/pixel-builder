import { lazy } from 'react';

export const routes = [
  {
    path: '/board/:boardId',
    exact: true,
    name: 'app',
    component: lazy(() => import('../components/BoardPage')),
    onlyPrivate: true,
  },
  {
    path: '/login',
    exact: true,
    name: 'login',
    component: lazy(() => import('../components/LoginPage')),
    onlyPublic: true,
  },
  {
    path: '/register',
    exact: true,
    name: 'register',
    component: lazy(() => import('../components/RegisterPage')),
    onlyPublic: true,
  },
  {
    path: '/',
    exact: true,
    name: 'app',
    component: lazy(() => import('../components/BoardsPage')),
    onlyPrivate: true,
  },
  {
    path: '/500',
    component: lazy(() => import('../components/Error/500')),
  },
  {
    path: '*',
    name: 'notfound',
    component: lazy(() => import('../components/Error/404')),
  },
];
