<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="params.tCstno+' / 수량입력'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex      
    }"
    content-class="custom-modal-content-cstTCntInput"
    dialog-class="custom-modal-dialog-cstTCntInput"
    centered
  >
    <div class="mapping_wrap"><!--looping-->
	    <div class="mapping_item" v-for="(item, index) in rows" :key="index">
       <div v-if="params.isLot === false" class="label">{{ item.fCstno }}</div> 
       <div v-else class="label">{{ item.lotNo +'/'+ item.fCstno }}</div> 
        <b-input-group>
          <b-input-group-prepend>
            <b-button variant="danger" @click="decrement(index)">-</b-button>
          </b-input-group-prepend>
          <b-form-input 
            type="number" 
            v-model="rows[index]['tOrg수량']"
            min="0"
            step="1"
            class="no-spinner"
            :disabled="true"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="success" @click="increment(index)">+</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>
    <div class="bttn_wrap">
      <div v-show="this.params.isEditabled">
        <b-button  class="main" @click="actionClick">확인</b-button>
      </div>
      <b-button  block @click="closeDialog">취소</b-button>
    </div>  
  </b-modal>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
export default {
  name: "ErrorInput",
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
	},
  props: {},
  data() {
    return {
      rows: [],
      isOpen: false,
      params: {
        isEditabled: false,
        type: null,
        tCstno: '',
        callback: null,
        errorCnt: -1,
        isLot:false,
      },
      zIndex: 0,
    };
  },
  computed: {
    totalErrorCnt(){
      return this.rows.reduce((sum, item) => sum + (item.tOrg수량 || 0), 0);
    }
  },
  created() {},
  watch: {
    rows: {
      handler() {
      },
      deep: true,
    },
  },
  methods: {
    openDialog(params) {
      this.params.callback = null;
      this.params.errorCnt = -1;
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.rows = _.cloneDeep(this.params.rows); 
        this.isOpen = true;
      });
    },
    
    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    confirm() {
      this.closeDialog();
    },
    increment(index) {
      if(!this.params.isEditabled)return;
      
      // 투입수량 이상 불량수량 합계를 입력할수 없음
      if(this.params.errorCnt > 0){
        let total = this.rows.reduce((sum, row) => {
          return sum + (row.tOrg수량 || 0); // 불량수량이 없으면 0으로 처리
        }, 0);
        if(this.params.errorCnt == total){
          return;
        }
      }
      // 일반 타입일 경우 기존 로직 유지
      this.rows[index].tOrg수량 += 1;
    },
    decrement(index) {
      if(!this.params.isEditabled)return;
      // 마이너스 버튼 클릭 시 (0 이하로 내려가지 않도록 설정)
      if (this.rows[index].tOrg수량 > 0) {
        this.rows[index].tOrg수량 -= 1;
      }
    },

    actionClick(){
      console.log("this.rows", this.rows);
      let rows = this.rows.map((item, index) => ({ ...item, sumCnt: (this.rows.reduce((sum, item) => sum + (item.tOrg수량 || 0), 0)) }));
      this.$emit("confirm", rows);
    },
  },
};
</script>

<style lang="scss" scoped>
/* 위아래 화살표 숨기기 */
:deep.no-spinner{
    height: 32px;
    text-align: center;
    &::-webkit-inner-spin-button,&::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
:deep.mapping_item {
  flex: 0 0 calc(50% - 10px); /* 각 아이템의 크기 고정: 20% */
  max-width: calc(50% - 10px); /* 최대 너비도 동일하게 설정 */
  box-sizing: border-box; /* 패딩과 보더 포함 계산 */
  border: 1px dashed #dcdcdc;
  padding: 10px;
  text-align: center;
}
:deep.mapping_wrap{
    display:flex;
    flex-wrap: wrap;
    >div{
      display:flex;
      align-items: center;
      margin: 5px;
      padding:5px;
      border: 1px dashed #dcdcdc;
      width: 270px;
      .label{
        width: 150px;
        display: flex;
        align-items: center;
        &::before{
          content:'●';
          font-size:7px;
          margin-right: 5px;
          color: orangered;
        }
      }
      .input-group{
        width: 120px;
        .btn {
          width: 32px;
          min-width: 32px;
          height: 32px;
          margin: 0!important;
          padding: 0;
        }
      }
    }
}

</style>

<style lang="scss">
.custom-modal-dialog-cstTCntInput {
  max-width: 600px !important;
  width: 100%;
}
.custom-modal-content-cstTCntInput {
  width: 100%;
}
</style>