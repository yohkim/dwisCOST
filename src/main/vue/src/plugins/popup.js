import { createApp } from "vue";
import PopupComponent from "@components/PopupComponent.vue";

export default {
  install(app) {
    const modalComponent = createApp(PopupComponent);
    const modalDiv = document.createElement("div");
    modalDiv.id = "global-modal";
    document.body.appendChild(modalDiv);

    const modalInstance = modalComponent.mount(modalDiv);

    // $alert
    const $alert = function (title, message, callback) {
      modalInstance.show({
        title,
        message,
        mode: "alert",
        callback,
      });
    };

    // $confirm
    const $confirm = function (title, message, callback) {
      modalInstance.show({
        title,
        message,
        mode: "confirm",
        confirmText: "확인",
        cancelText: "취소",
        callback,
      });
    };

    // $confirmYesOrNo
    const $confirmYesOrNo = function (title, message, callback) {
      modalInstance.show({
        title,
        message,
        mode: "confirmYesOrNo",
        confirmText: "예",
        cancelText: "아니오",
        callback,
      });
    };

    // 각 전역 속성에 등록
    app.config.globalProperties.$alert = $alert;
    app.config.globalProperties.$confirm = $confirm;
    app.config.globalProperties.$confirmYesOrNo = $confirmYesOrNo;
  },
};
