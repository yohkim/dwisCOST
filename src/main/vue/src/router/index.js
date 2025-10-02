import { createRouter, createWebHistory } from 'vue-router'
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import axios from '@/plugins/axios';
import sampleRouter from './sampleRouter';
import m0001000Router from './m0001000Router';
import m0002000Router from './m0002000Router';
import m0003000Router from './m0003000Router';
import m0004000Router from './m0004000Router';
import m0005000Router from './m0005000Router';
import m0006000Router from './m0006000Router';
import m0007000Router from './m0007000Router';
import m0008000Router from './m0008000Router';
import m0009000Router from './m0009000Router';

const routes = [
  {
    path: '/',
    name: 'DwHome',
    component: () => import('../views/DwHome.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/main',
    name: 'DwMain',
    component: () => import('../views/DwMain.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/login',
    name: 'DwwLogin',
    component: () => import('../views/Login.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/WorkStatus',
    name: 'WorkStatus',
    component: () => import('@components/WorkStatus.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  ...m0001000Router,
  ...m0002000Router,
  ...m0003000Router,
  ...m0004000Router,
  ...m0005000Router,
  ...m0006000Router,
  ...sampleRouter, 
  ...m0007000Router,
  ...m0008000Router,
  ...m0009000Router,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userAuthStore = useUserAuthInfo();  
  console.log("userAuthStore.isAuthenticated):::",userAuthStore.isAuthenticated);
  if (to.meta.requiresAuth && !userAuthStore.isAuthenticated) {    
    //새로고침관련 이벤트 일 수 있으므로 로컬 스토리지에서 userAuthStore 정보 로드 후 한번 더 확인 한다.
    userAuthStore.loadAuthInfo();
    if (userAuthStore.isAuthenticated) {    
      console.debug("curToken::",userAuthStore.curToken);
      //토큰 유효성 체크       
      const rep = await axios.post('/api/auth/verify');
      if(rep.data === false){
        next({ name: 'DwwLogin', query: { redirect: to.fullPath } }); // 로그인 페이지로 리다이렉트, 리다이렉션 후 복귀 경로 전달  
      }
      next();  
    }
    next({ name: 'DwwLogin' });
  } else {  // 인증이 필요하지 않거나, 인증된 경우
    console.log("check to",to);
    console.log("check from",from);    
    next();
  }

	const registeredPaths = routes.map(route => route.path);
	const exactMatch = registeredPaths.find(path => path === to.path);
	// path의 대소문자
	// if (!exactMatch) {
	// 	next(false);
	// 	alert('잘못된 경로입니다: 대소문자를 확인하세요!');
	// } else {
	// 	next();
	// }
  
  //인증이 필요하지 않은것
	// next();
});

export default router