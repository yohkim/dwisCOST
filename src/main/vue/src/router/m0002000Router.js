const m0002000Router = [

  {
    path: '/m0002001',
    name: 'SITE 모델링 관리',
    component: () => import('../views/web/m0002000/M0002001.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002001",
      requiresAuth: true,      
    }
  },
  {
    path: '/m0002001/:tab3Id?',
    name: '라인/AREA 마스터',
    component: () => import('../views/web/m0002000/M0002001.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002001",
      requiresAuth: true,      
    }
  },  
  {
    path: '/m0002001/:tab3Id?',
    name: '설비 마스터',
    component: () => import('../views/web/m0002000/M0002001.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002001",
      requiresAuth: true,      
    }
  },

  {
    path: '/m0002002',
    name: '제품 모델 관리',
    component: () => import('../views/web/m0002000/M0002002.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002002",
      requiresAuth: true,
    }
  },
  {
    path: '/m0002002',
    name: '모델 관리',
    component: () => import('../views/web/m0002000/M0002002.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002002",
      requiresAuth: true,
    }
  },
  {
    path: '/m0002002/:tab3Id?',
    name: '제품 관리',
    component: () => import('../views/web/m0002000/M0002002.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002002",
      requiresAuth: true,
    }
  }, 
  
  {
    path: '/m0002003',
    name: '생산공정 관리',
    component: () => import('../views/web/m0002000/M0002003.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002003",
      requiresAuth: true,
    }
  },
  {
    path: '/m0002003/:tab3Id?',
    name: '제품공정 마스터',
    component: () => import('../views/web/m0002000/M0002003.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002003",
      requiresAuth: true,
    }
  },
  {
    path: '/m0002003/:tab3Id?',
    name: '공정 마스터',
    component: () => import('../views/web/m0002000/M0002003.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002003",
      requiresAuth: true,
    }
  },
  {
    path: '/m0002003/:tab3Id?',
    name: '공정스텝 마스터',
    component: () => import('../views/web/m0002000/M0002003.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002003",
      requiresAuth: true,
    }
  },
  {
    path: '/m0002003/:tab3Id?',
    name: '스텝 마스터',
    component: () => import('../views/web/m0002000/M0002003.vue'),
    meta: {
      upperSysResourceId:'M0002000',
      sysResourceId:"M0002003",
      requiresAuth: true,
    }
  },  
  
];

export default m0002000Router;