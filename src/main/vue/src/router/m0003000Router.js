const m0003000Router = [
  {
    path: '/m0003005',
    name: 'FRONT',
    component: () => import('../views/web/m0003000/M0003005.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003005",
      requiresAuth: true,
    }
  },
  {
    path: '/m0003001',
    name: 'Back#1',
    component: () => import('../views/web/m0003000/M0003001.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003001",
      requiresAuth: true,      
    }
  }, 
  {
    path: '/m0003002',
    name: 'Back#2 Cassette QC',
    component: () => import('../views/web/m0003000/M0003002.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003002",
      requiresAuth: true,
    }
  },
  {
    path: '/m0003003',
    name: 'Back#2 Cell QC',
    component: () => import('../views/web/m0003000/M0003003.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003003",
      requiresAuth: true,
    }
  },  
  {
    path: '/m0003007',
    name: 'Lot Run Card 발행',
    component: () => import('../views/web/m0003000/M0003007.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003007",
      requiresAuth: true,
    }
  },
  {
    path: '/m0003008',
    name: 'Rework',
    component: () => import('../views/web/m0003000/M0003008.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003008",
      requiresAuth: true,
    }
  },
  {
    path: '/m0003009',
    name: '포장/출하',
    component: () => import('../views/web/m0003000/M0003009.vue'),
    meta: {
      upperSysResourceId:'M0003000',
      sysResourceId:"M0003009",
      requiresAuth: true,
    }
  },  
];

export default m0003000Router;