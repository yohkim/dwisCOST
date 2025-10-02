<template>
  <div
    class="modal fade"
    id="globalModal"
    tabindex="-1"
    aria-labelledby="globalModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="globalModalLabel">{{ title }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-html="message"></div>
        <div class="modal-footer">
          <button
            v-if="mode === 'confirmYesOrNo' || mode === 'confirm'"
            type="button"
            class="btn btn-secondary"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from "bootstrap";
import zIndexManager from "@/utils/zIndexManager";

export default {
  data() {
    return {
      title: "",
      message: "",
      mode: "alert", // alert, confirm, confirmYesOrNo
      confirmText: "확인",
      cancelText: "취소",
      callback: null,
      modalElement: null, // 초기값 명시
    };
  },
  mounted() {
    this.modalElement = document.getElementById("globalModal");
    this.modalInstance = new Modal(this.modalElement, {
      backdrop: "static", // 외부 클릭으로 닫히지 않도록 설정
      keyboard: false,    // ESC 키로도 닫히지 않도록 설정
    });
  },
  methods: {
    show({ title, message, mode = "alert", confirmText = "확인", cancelText = "취소", callback = null }) {
      this.title = title;
      this.message = message;
      this.mode = mode;
      this.confirmText = confirmText;
      this.cancelText = cancelText;
      this.callback = callback;
      this.modalInstance.show();
      this.$nextTick(() => {
        this.modalElement.style.zIndex = zIndexManager.next();
      });
    },
    handleConfirm() {
      if (this.callback) this.callback(true);

      //this.modalElement.style.zIndex = 0;      
      zIndexManager.release();
      this.modalInstance.hide();
    },
    handleCancel() {
      if (this.callback) this.callback(false);
      zIndexManager.release();
      //this.modalElement.style.zIndex = 0;
      this.modalInstance.hide();
    },
  },
};
</script>
