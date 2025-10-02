const m0007000Router = [

  {
    path: '/m0007001',
    name: '카세트 불출',
    component: () => import('../views/web/m0007000/M0007001.vue'),
    meta: {
      upperSysResourceId:'M0007000',
      sysResourceId:"M0007001",
      requiresAuth: true,      
    }
  }, 
  {
    path: '/m0007002',
    name: '카세트 점검',
    component: () => import('../views/web/m0007000/M0007002.vue'),
    meta: {
      upperSysResourceId:'M0007000',
      sysResourceId:"M0007002",
      requiresAuth: true,      
    }
  }, 
  {
    path: '/m0007003',
    name: '카세트 세척',
    component: () => import('../views/web/m0007000/M0007003.vue'),
    meta: {
      upperSysResourceId:'M0007000',
      sysResourceId:"M0007003",
      requiresAuth: true,      
    }
  }, 
  {
    path: '/m0007004',
    name: '카세트 반출',
    component: () => import('../views/web/m0007000/M0007004.vue'),
    meta: {
      upperSysResourceId:'M0007000',
      sysResourceId:"M0007004",
      requiresAuth: true,      
    }
  }, 
  {
    path: '/m0007005',
    name: '카세트 마스터',
    component: () => import('../views/web/m0007000/M0007005.vue'),
    meta: {
      upperSysResourceId:'M0007000',
      sysResourceId:"M0007005",
      requiresAuth: true,      
    }
  }, 
];

export default m0007000Router;