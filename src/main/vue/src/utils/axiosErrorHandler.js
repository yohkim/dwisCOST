import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import showToast from '@/utils/toast';
  function handleError(error) {
    const userAuthStore = useUserAuthInfo();
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          handle401Error(userAuthStore);
          break;
        case 403:
          handle403Error();
          break;
        case 500:
          handle500Error();
          break;
        default:
          handleUnknownError(error);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      showToast('error','서버에 문제가 발생했습니다. 잠시 후 다시 시도하세요.');      
    } else {
      console.error('Error setting up request:', error.message);
    }
    //vue 에러페이지 출력 방지 주석
    // return Promise.reject(error);
  }
  
  function handle401Error(userAuthStore) {
    showToast('info','세션이 만료되었습니다. 다시 로그인하세요.');
    userAuthStore.clearUserAuthInfo();    
    window.location.href = '/';
  }
  
  function handle403Error() {
    showToast('info','권한이 없습니다. 관리자에게 문의하세요.');
  }
  
  function handle500Error() {
    showToast('error','서버에 문제가 발생했습니다. 잠시 후 다시 시도하세요.');
  }
  
  function handleUnknownError(error) {
    showToast('error',`알 수 없는 오류: ${error.message}`);
  }
  
  export default handleError;
  