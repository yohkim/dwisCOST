<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="(params.dialogTitle ? params.dialogTitle : '불량 입력')+' / 불량합계('+totalErrorCnt+')'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex      
    }"
    :content-class="!params.keyPadFlag ? 'custom-modal-content-errorInput' : 'custom-modal-content-errorInput-keyPad'"
    :dialog-class="!params.keyPadFlag ? 'custom-modal-dialog-errorInput' : 'custom-modal-dialog-errorInput-keyPad'"
    centered
  ><!--height:class mapping_wrap + 70px-->
    <div class="mapping_wrap"><!--looping-->
	    <div class="mapping_item" v-for="(item, index) in rows" :key="index">
       <div class="label">{{ item.불량명 }}</div> 
        <b-input-group>
          <b-input-group-prepend>
            <b-button variant="danger" @click="decrement(index)">-</b-button>
          </b-input-group-prepend>
          <b-form-input 
            type="number" 
            v-model="rows[index]['불량수량']"
            min="0"
            step="1"
            class="no-spinner"
            :readonly="true"
            @click="showKeyPadOpen(item.불량명, index)"
          ></b-form-input>
          <b-input-group-append>
            <b-button variant="success" @click="increment(index)">+</b-button>
          </b-input-group-append>
        </b-input-group>
        <b-button v-show="params.isMapping" :disabled="rows[index]['불량수량']==0" class="main" @click="actionMapping(item)">맵핑</b-button>
      </div>
    </div>
    <div class="bttn_wrap">
      <div v-show="this.params.isEditabled">
        <b-button  class="main" @click="actionClick">저장</b-button>
      </div>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
    <div id="keyPad" v-if="showKeyPadFlag" class="key_pad_modal fade show" 
      :style="{ bottom: showKeyPadFlag ? '0px' : '-400px' }"
    >
    <b-button  class="btn_close" @click="keyPadClose"/>
    <div class="key_pad_wrap">
      <div class="title px-3 py-3"><span style="color: #032dbe;">'{{errorNm}}'</span> 불량수량 입력</div>
        <div class="d-flex align-items-center px-3 ">
            <div class="input-group  input-group-sm ">
              <span class="input-group-text">불량수</span>
              <input type="text" class="form-control" v-model="qty">
              <button class="btn clear" @click="keyPadClear"></button>
            </div>
        </div>
        <table class="key_pad mt-2">
          <tr>
            <td @click="selectPad(1)">1</td>
            <td @click="selectPad(2)">2</td>
            <td @click="selectPad(3)">3</td>
            <td @click="selectPad(4)">4</td>
          </tr>
          <tr>
            <td @click="selectPad(5)">5</td>
            <td @click="selectPad(6)">6</td>
            <td @click="selectPad(7)">7</td>
            <td @click="selectPad(8)">8</td>
          </tr>
          <tr>
            <td @click="selectPad(9)">9</td>
            <td @click="selectPad(0)">0</td>
            <td @click="selectPadDel"><img src="@assets/images/btn_remove.png"></td>
            <td @click="selectPadApply">확인</td>
          </tr>          
        </table>    
      </div>
    </div> 
    <ProcessingMapping1 ref="processingMapping1" @save="saveCallback1"/> 
  </b-modal>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import ProcessingMapping1 from "@web/popup/ProcessingMapping1";
export default {
  name: "ErrorInput",
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
	},
  props: {},
  components: {
    ProcessingMapping1,
  },
  data() {
    return {
      rows: [],
      isOpen: false,
      params: {
        dialogTitle: "",
        isEditabled: false,
        type: null,
        callback: null,
        errorCnt: -1,
        '차수': 1,
        isMapping: false,
        keyPadFlag : false,
      },
      errorNm: "불량 미선택",
      showKeyPad: false,
      qty: "0",
      index: -1, 
      zIndex: 0,
    };
  },
  computed: {
    totalErrorCnt(){
      return this.rows.filter((item1) => item1.불량명 != this.errorNm).reduce((sum, item) => sum + (Number(item.불량수량) || 0), 0);
    },
    showKeyPadFlag() {
      return this.showKeyPad
    },
    remainingQty() {
      return Math.max(Number(this.params['투입수량']) - this.totalErrorCnt, 0);
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
      this.params.isMapping = false;
      this.loc = null;
      this.error = null;
      this.params.callback = null;
      this.params.errorCnt = -1;
      this.params['차수'] = 1;
      this.qty = "0";
      this.errorNm = "불량 미선택";
      this.index = -1;
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.rows=[]; 
        this.searchClick().then(()=>{
          this.showKeyPad = false;
          this.isOpen = true;
          setTimeout(()=>{
            try {
              let modalContent = !this.params.keyPadFlag ? document.querySelector('.custom-modal-content-errorInput') : document.querySelector('.custom-modal-content-errorInput-keyPad');
              if(modalContent){
                let modalBody = modalContent.querySelector('.modal-body');
                if(modalBody){
                  const originalHeight = modalBody.offsetHeight;
                  if(originalHeight > 0){
                    modalBody.style.height = (originalHeight + 50) + 'px';
                  }
                }
              }        
            } catch (error) {
              console.warn("버튼위치 조정중 오류", error)
            }
          }, 100);
        });
      });
    },
    showKeyPadOpen(val, idx){
      if(!this.params.isEditabled || this.params["type"] == 'block' || !this.params.keyPadFlag)return;
      this.index = idx;
      this.errorNm = val;
      this.qty = "0";
      this.showKeyPad = true;
    },
    keyPadClose() {      
      this.showKeyPad = false;
    },
    selectPad(num) {      
      if (this.qty === "0" && num !== 0) {
        this.qty = String(num);
      } else if (this.qty !== "0") {
        this.qty += String(num);
      }
      // 입력값이 남은 불량 수량 초과 시 경고 및 수정
      if (parseInt(this.qty) > this.remainingQty) {
        this.$toast("warning", `최대 입력 가능 수량은 ${this.remainingQty} 입니다.`);
        this.qty = String(this.remainingQty);
      }
    },
    selectPadDel() {
      if (this.qty.toString().length === 1) {
        this.qty = "0";
        return;
      }
      this.qty = this.qty.toString().slice(0, -1);
      if (this.qty === "" || this.qty === "-") {
        this.qty = "0";
      }      
    },
    keyPadClear() {
      this.qty = "0";
    },
    selectPadApply() {
      this.rows[this.index].불량수량 = this.qty;
      this.qty = "0";
      this.errorNm = "불량 미선택";
      this.keyPadClose();
    },
    async searchClick() {  
      let queryId = "selectErrorList";
      if(this.params["type"] == 'block'){
        queryId = "selectErrorBlock";
      }else if(this.params["type"] == 'cstno'){
        queryId = "selectErrorCstnoList";
      }else if(this.params["type"] == 'cstno1'){
        queryId = "selectErrorCstnoList1";
      }else if(this.params["type"] == 'etcno'){
        queryId = "selectErrorEtcnoList";
      }
      await this.$axios.api.search({menuId: "CMDIALOG", queryId, queryParams: this.params, target: this.rows});
    },
    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
      try {
        let modalContent = !this.params.keyPadFlag ? document.querySelector('.custom-modal-content-errorInput') : document.querySelector('.custom-modal-content-errorInput-keyPad');
        if(modalContent){
          let modalBody = modalContent.querySelector('.modal-body');
          if(modalBody){
            modalBody.style.height = "";          
          }
        }             
      } catch (error) {
        console.warn("버튼위치 초기화중 오류", error)
      }
    },
    confirm() {
      this.closeDialog();
    },
    increment(index) {
      if(!this.params.isEditabled)return;
      if (this.params.type === 'block') {
        // 'block' 타입일 경우
        this.rows.forEach((item, idx) => {
          if (idx === index) {
            // 선택한 항목만 1로 설정
            this.rows[idx].불량수량 = 1;
          } else {
            // 나머지는 0으로 설정
            this.rows[idx].불량수량 = 0;
          }
        });
      } else {
        // 투입수량 이상 불량수량 합계를 입력할수 없음
        if(this.params.errorCnt > 0){
          let total = this.rows.reduce((sum, row) => {
            return sum + (row.불량수량 || 0); // 불량수량이 없으면 0으로 처리
          }, 0);
          if(this.params.errorCnt == total){
            return;
          }
        }
        // 일반 타입일 경우 기존 로직 유지
        this.rows[index].불량수량 += 1;
      }
    },
    decrement(index) {
      if(!this.params.isEditabled)return;
      // 마이너스 버튼 클릭 시 (0 이하로 내려가지 않도록 설정)
      if (this.rows[index].불량수량 > 0) {
        this.rows[index].불량수량 -= 1;
      }
    },

    actionClick(){

      let dateTimeArray = this.$utils.getDateAndTimeArray1();
      let rows = this.rows.map(item => ({
        ...this.params,
        ...item,
        ...(this.params["type"] == null ? {} : (this.params["type"] == 'block' ? { blNo: this.params['blNo'] } : { fCstNo: this.params['fCstNo'],  tCstNo : this.params['tCstNo'] })),
        '검사시각': dateTimeArray[0] + " " + dateTimeArray[1],
      }));

      let param = {
        menuId:'CMDIALOG'
      };
      if(this.params["type"] == 'block'){
        param["update"] = [{queryId:'MergeErrorBlNo', data:rows}];
      }else if(this.params["type"] == 'cstno'){
        param["update"] = [{queryId:'MergeErrorCstNo', data:rows}];
      }else if(this.params["type"] == 'cstno1'){
        param["update"] = [{queryId:'MergeErrorCstNo1', data:rows}];
      }else if(this.params["type"] == 'etcno'){
        param["update"] = [{queryId:'MergeErrorEtcNo', data:rows}];
      }else{
        if(this.loc == null){
          param["update"] = [{queryId:'MergeError', data:rows}];
        }
      }
      if(this.params.callback != null){
        param["update"].push({...this.params.callback});
      }
      let saveFunc = async () => {
        const resp = await this.$axios.api.saveData(param);
        if (resp.status === 'success') {
          let badSum = this.rows.reduce((sum, row) => {
            //2025.7.29 back#1 - 강화 에서 비고 0 인 불량은 카세트 불량 에서 제외
            if(this.params["공정코드"] === '040' && row['비고'] === '0'){ 
              return sum;
            }
            return sum + (row.불량수량 || 0);
          }, 0);
          this.$toast('success', '저장되었습니다.');
          this.$emit("save",this.params,badSum);
          if(this.params["type"] == 'cstno' && this.params["공정코드"] === '043'){  //강화 후 환적
            param.update[0].data.forEach(el => {
              if(el['불량코드'] === '800' && el['불량수량'] === 1){ //측정시료 1개면 1회 강화 후 환적 단계에서 ‘강화특성’ 제조 공정모니터링 ~ 실시
                this.execQipFromPPB();
              }
            });
          }
          this.searchClick();
        } else {
          this.$toast('error', resp.message);
        }
      };

      this.$confirm("확인", '저장 하시겠습니까?', (confirm)=>{
        if(confirm){
          saveFunc();
        }
      });
    },

    async execQipFromPPB(){
      console.log("this.userAuthInfo.loginUserName:::",this.userAuthInfo.loginUserName);
      let qp = {};
      qp['userName'] = this.userAuthInfo.loginUserName;
      qp['runNo'] = this.params['runId'];
      qp['cellIds'] = this.params['runId'] + '-' + this.params['tCstNo'];
      let param = {menuId:'M0003001',queryId:'execQipFromPPB',queryParams:qp};
	    await this.$axios.api.search(param).then(() => {
        console.log("측정시료 1개면 1회 강화 후 환적 단계에서 ‘강화특성’ 제조 공정모니터링 ~ 실시");
      }).catch(err => {
        console.error('측정시료 저장 오류:', err);
      });
    },

    actionMapping(item){
      
      if(item["불량수량"] != item["errorCnt"]){
        this.$toast("info", "불량 수량이 변경되었습니다. 저장후 진행하세요.");        
        return;
      }
      this.$refs.processingMapping1.openDialog({
        ...this.params,
        ...item, 
        ...{             
          isEditabled: this.params.isEditabled,
          line: 'D1UT',
          "자동여부": 0,
          cstNo: this.params["cstNo"],
          fCstNo: this.params["cstNo"],
          runId: this.params["runNo"],
          '차수': this.params["차수"],
          machineCode: this.params["machineCode"],
        }
      });
    }
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

:deep.bttn_wrap{
  position: absolute;
  bottom: 10px;
  right: 10px;
  width:calc(100% - 20px);
  height: 40px;
}
:deep.mapping_item {
  flex: 0 0 calc(33.33% - 10px); /* 각 아이템의 크기 고정: 20% */
  max-width: calc(33.33% - 10px); /* 최대 너비도 동일하게 설정 */
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

.key_pad_modal{
      position: absolute;
      overflow: hidden;
      z-index: 100;
      width:100%;
      height: 430px;
      background: rgba(0, 0, 0, 0.8);
      top: 0;
      left: 0;
      height: 100%;
      box-shadow: 0 -5px 10px 5px rgba(0,0,0, 0.2);
      .key_pad_wrap{
          margin: 33px auto 0;
          background: #fff;
          border-radius: 10px 10px 0 0;
          width: 300px;
      .title{
        font-size: 16px;
        font-weight: 600;
      }
      .input-group{
        width: unset;
        .form-control{
          width:50px;
          text-align: right;
        }
      }
      .btn{
        width:28px;
      height: 28px;
        &.clear{
          background: #464646 url('@assets/images/ico_refresh.png') no-repeat center;
          background-size: 16px;
        }
      }
      .key_pad{
        border-collapse: separate;
        background: #bcc0c8;
        width: 100%;
        height: 300px;
        margin:auto;
        padding: 10px;
        border-spacing: 5px;
        td{
          width: calc(100% / 4);
          height: 40px;
          text-align: center;
          background: #fff;
          border-radius: 3px;
          padding: 10px 0;
          font-weight: 600;
          box-shadow: 1px 1px 5px 2px rgba(0,0,0, 0.2);
          cursor: pointer;
          user-select: none;
          &:hover{
            background: #e8fcff;
          }
        }
      }
    }
  .btn_close{
    position: relative;
    top:10px;
    left: calc(100% - 55px);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: url('@assets/images/download_02.png') no-repeat center;
    background-size: 12px;
  }
  }

</style>

<style lang="scss">
.custom-modal-dialog-errorInput {
  max-width: 1000px !important;
  width: 100%;
}
.custom-modal-content-errorInput {
  width: 100%;
}

.custom-modal-dialog-errorInput-keyPad {
  max-width: 1000px !important;
  width: 100%;
  min-height: 630px;
  max-height: none;
  height: auto !important;
}
.custom-modal-content-errorInput-keyPad {
  width: 100%;
  height: auto !important;
  max-height: none;
  min-height: 630px;
}
</style>