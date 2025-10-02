<template>
  <div v-show="isPreview">
    <b-modal v-model="isOpen" hide-footer size="xl" no-close-on-backdrop centered>
      <template #title>
        {{ params.dialogTitle }}
      </template>
      <div ref="preview" class="preview-container">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          :alt="`${params.model} preview`"
          :width="params.width"
          :height="params.height"
          style="object-fit: contain; max-width: 100%; max-height: 100%;"
        />
      </div>
      <div class="bttn_wrap">
        <b-button block @click="closeDialog">닫기</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import QrcodeVue from 'vue-qrcode-component';

export default {
  name: 'ModelFilmPreview',
  components: { QrcodeVue },
  data() {
    return {
      //팝업 관련정보
      isOpen: false,
      isPreview: false,
      imageUrl: null,
      params: {
        dialogTitle: '미리보기',
        step: 0,
        height: 720,
        width: 960,
        model: '',
      },
    };
  },
  computed: {
  },
  methods: {
    async openDialog(params) {
      this.isPreview = true;
      if (params != undefined) Object.assign(this.params, params);
      const arrayBuffer = await this.getFilmImage(params.model);

      const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
      this.imageUrl = URL.createObjectURL(blob);

      this.$nextTick(() => {
        this.isOpen = true;
      });
    },
    async getFilmImage(model){
      const res = await this.$axios.post('/api/m0003000/m0003007/getFilmImage',{ model: model},{ responseType: "arraybuffer" });
      if (res.status !== 200) {
        this.$toast("error", "Film Image를 불러오는데 실패했습니다.");
      }

      const arrayBuffer = res.data;

      return arrayBuffer;
    },
    closeDialog() {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
      this.isOpen = false;
    },
    confirm() {
      this.$emit('confirm', this.params);
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.preview-container {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 필요에 따라 크기 조정 */
  width: 100%;
  height: 100%;
}
</style>
