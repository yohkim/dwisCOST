<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="title" no-close-on-backdrop :style="{  zIndex: zIndex }" 
    content-class="custom-modal-content-vlr-remark-input-popup"
    dialog-class="custom-modal-dialog-vlr-remark-input-popup"
    centered>
    <div>
        <b-form-textarea rows="2" no-resize 
            v-model="params['특이사항']"
          />
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <b-button class="main" block @click="save">저장</b-button>
    </div>
  </b-modal>  
</template>

<script>

export default {
  name: "VlrRemarkInputPopup",
  props: {},
  data() {
    return {
      title: '특이사항',
      isOpen: false,
      params: {
        '특이사항' : "",
        isEditabled: false,
      },
      zIndex: 0,
    };
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();

        this.$axios.api.search({ menuId: "M0003003", queryId: "M0003003_Sch28", queryParams: this.params}).then((resp)=>{
          //console.log("resp", resp);
          if(!_.isEmpty(resp) && resp[0] != null && resp[0]['특이사항']){
            this.params['특이사항'] = resp[0]['특이사항'];
          }
          this.isOpen = true;
        });
      });
    },
    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },

    save(){
      let saveFunc = async () => {
        const resp = await this.$axios.api.saveData({
          "menuId": 'M0003003',
          "update": [{queryId: "M0003003_Update7", data: [this.params]}]
        });
        if (resp.status === 'success') {
          this.$toast('success', '저장 되었습니다.');
          this.$emit("save");
          this.closeDialog();
        } else {
          this.$toast('error', resp.message);
        }
      };
      
      this.$confirmYesOrNo("선택", '저장 하시겠습니까?', (confirmed)=>{
        if(confirmed){
          saveFunc();
        }
      });
    }
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-vlr-remark-input-popup {
  max-width: 800px !important;
  width: 100%;
  max-height: 80vh;
  height: 250px;
}
.custom-modal-content-vlr-remark-input-popup {
  width: 100%;
  height: 190px;
  max-height: 80vh;
}
</style>