import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import "@assets/style/toast.css";

// 기본 옵션 정의
const defaultToastOptions = {
  position: "top-center",  // 기본 위치
  autoClose: 3000,         // 자동 닫힘
  hideProgressBar: false,   // 진행 막대 숨기기
  theme: "light",          // 기본 테마  
};

// Toast 호출 함수
const showToast = (type, message, options = {}) => {
  //toastId 로 중복 출력 막기
  toast[type](message, {toastId:message, ...defaultToastOptions, ...options});
};

export default showToast;
