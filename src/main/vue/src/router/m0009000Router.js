const m0009000Router = [
 {
    path: '/m0009001',
    name: '설비 기준정보',
    component: () => import('../views/web/m0009000/M0009001.vue'),
    meta: {
      upperSysResourceId:'M0009000',
      sysResourceId:"M0009001",
      requiresAuth: true,
    }
  },  
  {
    path: '/m0009002',
    name: '설비 비가동관리',
    component: () => import('../views/web/m0009000/M0009002.vue'),
    meta: {
      upperSysResourceId:'M0009000',
      sysResourceId:"M0009002",
      requiresAuth: true,
    }
  },
  {
    path: '/m0009003',
    name: '설비효율 Report',
    component: () => import('../views/web/m0009000/M0009003.vue'),
    meta: {
      upperSysResourceId:'M0009000',
      sysResourceId:"M0009003",
      requiresAuth: true,
    }
  },      
  
  
];

export default m0009000Router;