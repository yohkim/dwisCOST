const m0005000Router = [
  {
    path: '/m0005003',
    name: '작업 이력 조회',
    component: () => import('../views/web/m0005000/M0005003.vue'),
    meta: {
      upperSysResourceId:'M0005000',
      sysResourceId:"M0005003",
      requiresAuth: true,
    }
  },
];

export default m0005000Router;