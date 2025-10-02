<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="`${dialogTitle} [${params.cstNo}]`" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered
    content-class="custom-modal-content-change-cst-input-popup"
    dialog-class="custom-modal-dialog-change-cst-input-popup"
  >    
    <div>    
      <div class="worker_wrap">
        <div class="row worker_info">
          <div class="col-9">
            <div class="form-floating prc_name">
              <input
                type="text"
                class="form-control label-70"
                id="floating"
                placeholder="카세트번호"
                autocomplete="off"
                name="chgCstNo"
                data-group="params"
                @input="convertToUpperEnglish"
                v-model="params['chgCstNo']"                
                ref="chgCstNo"
                @mousedown="handleMouseDown"
              />
              <label for="floating">카세트번호</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
      <!--<b-button class="main" block :disabled="!params.isEditabled" @click="confirmClick">선택된 값 적용</b-button>-->
      <b-button class="main" block @click="confirmClick">선택된 값 적용</b-button>
    </div>
  </b-modal>
</template>

<script>

export default {
  name: 'ChangeCstInputPopup',
  setup() {},
  props: {},
  data() {
    return {
      isOpen: false,
      dialogTitle: '카세트번호',
      zIndex: 0,
      params: {
        chgCstNo: null, 
        cstNo: "",  
        cstNoList: [],    
        isEditabled: true,  
      },   
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    openDialog(params) {
      this.params.chgCstNo = null;
      Object.assign(this.params, params);
      this.zIndex = this.$zIndexManager.next();
      this.isOpen = true;
    },
    closeDialog() {
      this.$zIndexManager.release();
      this.isOpen = false;
    },
    search() {
    },
    async confirmClick() {   
      if(this.params['chgCstNo'] == "" || this.params['chgCstNo'] == null){
        this.$toast("warn", "카세트번호를 입력하세요.");
        return;
      }

      let qp = {
        runNo: this.params['runNo'],
        cstNo: this.params['chgCstNo'],
      };
      let param = { menuId: 'M0003001', queryId: 'checkCstValidation', queryParams: qp };

      try {
        let rslt = await this.$axios.api.search(param); // <-- await 사용
        if (_.isEmpty(rslt)) {
          this.$toast("warn", "확인불가 CST로 진행 할 수 없습니다.");
          return false;
        } else {
          if (rslt[0]['message'] !== 'OK') {
            this.$toast("warn", rslt[0]['message']);
          } else {
            console.log("this.cstNoList", this.params.cstNoList);
            let chkRows = this.params.cstNoList.filter((item)=> item == this.params['chgCstNo']);
            if(chkRows.length > 0){
              this.$toast("warn", "동일한 CST가 존재합니다.");
              return;
            }
            this.$emit('confirm', { cstNo: this.params['chgCstNo'] });
            this.closeDialog();
          }
        }
      } catch (error) {
        console.error(error);
        this.$toast("error", "서버 통신 오류");
        return false;
      }
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleMouseDown(event) {
      const input = this.$refs.chgCstNo;
      if (input && input.value) {
        event.preventDefault();
        input.select();
      }
    },
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-change-cst-input-popup {
  max-width: 500px !important;
  width: 100%;
}
.custom-modal-content-change-cst-input-popup {
  width: 100%;
}
</style>