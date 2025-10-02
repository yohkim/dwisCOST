const m0006000Router = [
  {
    path: '/m0006001',
    name: '제품수주서 입력',
    component: () => import('../views/web/m0006000/M0006001.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006001",
      requiresAuth: false,
    }
  },
  {
    path: '/m0006002',
    name: '일반코드',
    component: () => import('../views/web/m0006000/M0006002.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006002",
      requiresAuth: false,
    }
  },
  {
    path: '/m0006003',
    name: '거래처 마스터',
    component: () => import('../views/web/m0006000/M0006003.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006003",
      requiresAuth: false,
    }
  },
  {
    path: '/m0006005',
    name: '불량사유 코드',
    component: () => import('../views/web/m0006000/M0006005.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006005",
      requiresAuth: false,
    }
  },
  {
    path: '/m0006007',
    name: '공정별 불량코드 등록',
    component: () => import('../views/web/m0006000/M0006007.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006007",
      requiresAuth: false,
    }
  },
  {
    path: '/m0006009',
    name: '사용자-메뉴 권한 관리',
    component: () => import('../views/web/m0006000/M0006009.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006009",
      requiresAuth: true,
    }
  },
  {
    path: '/m0006010',
    name: '제품개발이력 관리',
    component: () => import('../views/web/m0006000/M0006010.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006010",
      requiresAuth: true,
    }
  },
  {
    path: '/m0006011',
    name: '설비관리',
    component: () => import('../views/web/m0006000/M0006011.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006011",
      requiresAuth: true,
    }
  },
  {
    path: '/m0006012',
    name: '모델관리',
    component: () => import('../views/web/m0006000/M0006012.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006012",
      requiresAuth: true,
    }
  },
  {
    path: '/m0006013',
    name: 'QR정보 등록록',
    component: () => import('../views/web/m0006000/M0006013.vue'),
    meta: {
      upperSysResourceId:'M0006000',
      sysResourceId:"M0006013",
      requiresAuth: true,
    }
  },
];

export default m0006000Router;