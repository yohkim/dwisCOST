const sampleRouter = [
  {
    path: '/sample',
    name: 'Sample',
    component: () => import('../views/sample/SampleType1.vue'),
  },
  {
    path: '/sample1',
    name: 'Sample1',
    component: () => import('../views/sample/SampleType1.vue'),
  },
  {
    path: '/sample2',
    name: 'Sample2',
    component: () => import('../views/sample/SampleType2.vue'),
  },
  {
    path: '/sample3',
    name: 'Sample3',
    component: () => import('../views/sample/SampleType3.vue'),
  },
  {
    path: '/sample4',
    name: 'Sample4',
    component: () => import('../views/sample/SampleType4.vue'),
  }
  ,
  {
    path: '/sample5',
    name: 'Sample5',
    component: () => import('../views/sample/SampleType5.vue'),
  }
  ,
  {
    path: '/sample6',
    name: 'Sample6',
    component: () => import('../views/sample/SampleType6.vue'),
  }
  ,
  {
    path: '/sample7',
    name: 'Sample7',
    component: () => import('../views/sample/SampleType7.vue'),
  }
  ,
  {
    path: '/sample8',
    name: 'Sample8',
    component: () => import('../views/sample/SampleType8.vue'),
  }
];

export default sampleRouter;