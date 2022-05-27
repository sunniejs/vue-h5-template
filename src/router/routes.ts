const routes = [
  {
    name: 'root',
    path: '/',
    redirect: '/home',
    component: () => import('/@/components/Basic/index.vue'),
    children: [
      {
        name: 'Home',
        path: 'home',
        component: () => import('/@/views/Home/index.vue'),
        meta: {
          title: '',
          keepAlive: true,
        },
      },
      {
        name: 'List',
        path: 'list',
        component: () => import('/@/views/List/index.vue'),
        meta: {
          title: '',
          keepAlive: true,
        },
      },
      {
        name: 'Member',
        path: 'member',
        component: () => import('/@/views/Member/index.vue'),
        meta: {
          title: '',
          keepAlive: true,
        },
      },
    ],
  },
  {
    name: 'Login',
    path: '/login',
    component: () => import('/@/views/Login/index.vue'),
    meta: {
      title: '',
      keepAlive: true,
    },
  },
];

export default routes;
