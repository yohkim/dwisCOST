const m0008000Router = [
  {
    path: '/m0008001',
    name: '공정모니터링',
    component: () => import('../views/web/m0008000/M0008001.vue'),
    meta: {
      upperSysResourceId: 'M0008000',
      sysResourceId: 'M0008001',
      requiresAuth: true,
    },
  },
  {
    path: '/m0008002',
    name: 'Job Change',
    component: () => import('../views/web/m0008000/M0008002.vue'),
    meta: {
      upperSysResourceId: 'M0008000',
      sysResourceId: 'M0008002',
      requiresAuth: true,
    },
  },
  {
    path: '/m0008003',
    name: '출하검사',
    component: () => import('../views/web/m0008000/M0008003.vue'),
    meta: {
      upperSysResourceId: 'M0008000',
      sysResourceId: 'M0008003',
      requiresAuth: true,
    },
  },
];

export default m0008000Router;
