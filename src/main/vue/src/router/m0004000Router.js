const m0004000Router = [
  {
    path: '/m0004002',
    name: 'LotNo 변경 관리',
    component: () => import('../views/web/m0004000/M0004002.vue'),
    meta: {
      upperSysResourceId: 'M0004000',
      sysResourceId: 'M0004002',
      requiresAuth: true,
    },
  },
  {
    path: '/m0004003',
    name: 'Hold 관리',
    component: () => import('../views/web/m0004000/M0004003.vue'),
    meta: {
      upperSysResourceId: 'M0004000',
      sysResourceId: 'M0004003',
      requiresAuth: true,
    },
  },
];

export default m0004000Router;
