<template>
  <b-modal v-model="isOpen" hide-footer size="xl" :title="'불량 맵핍 입력'+' / '+params.runNo+' / '+params.fCstNo+' / '+errorNm+' / 맵핑합계('+totalErrorCnt+')'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex
    }"
    centered
  >
    <div class="mapping_wrap">        
        <table class="cassette_qc mt-2" ref="errorMapping">
          <tr v-for="row in rowArray" :key="row">
            <td 
              @mouseover="enableTooltip($event, `${row}-${col}`)"
              v-b-tooltip.hover
              :title="error ? getTooltip(`${row}-${col}`) : ''"
              v-for="col in colArray" :key="col" :loc="`${row}-${col}`" @click="selectLoc(`${row}-${col}`)"
            >
              {{ row }}-{{ col }}
            </td>
          </tr>          
        </table>
    </div>
    <div class="bttn_wrap">
      <div v-show="this.params.isEditabled">
        <b-button  class="main" @click="actionClick">저장</b-button>
      </div>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
   <!--숫자 키패드 모달-->
  <div id="keyPad" v-if="showKeyPadFlag" class="key_pad_modal fade show" 
    :style="{ bottom: showKeyPadFlag ? '0px' : '-400px' }"
  >
   <b-button  class="btn_close" @click="keyPadClose"/>
    <div class="key_pad_wrap">
      <div class="title px-3 py-3"><span style="color: #032dbe;">'{{errorNm}}'</span> 불량수량 입력</div>
        <div class="d-flex align-items-center px-3 ">
        <div class="me-auto">선택된 위치 : {{loc}}</div>
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
  </b-modal>
</template>

<script>

export default {
  name: "ProcessingMapping1",
  props: {},
  data() {
    return {
      rows: [],
      rows1: [],
      isOpen: false,
      params: {
        dialogTitle: "",
        isEditabled: false,
        '차수': 1,
      },
      loc: null,
      error: null,
      errorNm: "불량 미선택",
      zIndex: 0,
      showKeyPad: false,
      qty: "0",    
    };
  },
  computed: {
    rowArray() {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    },
    colArray() {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    },
    showKeyPadFlag() {
      return this.showKeyPad
    },
    totalErrorCnt(){
      return this.rows1.reduce((sum, item) => sum + Number(item["불량수량"] || 0), 0);
    },
    remainingQty() {
      return Math.max(this.params.불량수량 - this.totalErrorCnt, 0);
    }
  },
  created() {},
  watch: {
    rows1: {
      handler() {
        this.updateErrorMapping();
      },
      deep: true,
    },
  },
  methods: {
    openDialog(params) {
      this.showKeyPad = false;
      this.loc = null;
      this.qty = "0";
      this.error = null;
      this.errorNm = "불량 미선택";
      this.params['차수'] = 1;
      Object.assign(this.params, params);
      this.error = this.params["불량코드"]
      this.errorNm = this.params["불량명"]
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$utils.assignDynamicProperties(['rows=[]', 'rows1=[]'], this);        
        this.searchData().then(()=>{
          this.isOpen = true;
        });
      });
    },

    async searchData(){
      await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_Sch8", queryParams: {...this.params, "불량코드": this.error }, target: this.rows1});
    },

    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    confirm() {
      this.closeDialog();
    },

    initOn(){
      let targetAll = this.$refs.errorMapping.querySelectorAll("td");
      targetAll.forEach(item => item.classList.remove("on"));
    },

    selectLoc(loc) {
      if(!this.params.isEditabled)return;
      if(_.isNil(this.error)){
        this.$toast("info", "불량을 선택하세요.");
        return;
      }
      this.loc = loc;

      const existingIndex = this.rows1.findIndex(row => row['불량위치'] === loc);

      if (existingIndex !== -1) {
        this.qty = this.rows1[existingIndex]["불량수량"];        
      } else {
        if (this.remainingQty <= 0) {
          this.$toast("info", "남은 불량수량이 없습니다.");
          return;
        }
        let dateTimeArray = this.$utils.getDateAndTimeArray1();
        this.rows1.unshift({
          lotrunId: this.params["runNo"], 
          "cstNo": this.params["cstNo"],
          "tCstNo": this.params["cstNo"],
          "불량위치": loc,
          "불량코드": this.error,
          "공정코드": this.params["공정코드"],
          "검사시각": dateTimeArray[0] + " " + dateTimeArray[1],
          "불량수량": 0,
          "차수": this.params["차수"],
          state: 'created'    
        });
        this.qty = "0";
      }
      
      this.showKeyPad = true;
    },

    keyPadClose() {
      const existingIndex = this.rows1.findIndex(row => row['불량위치'] === this.loc);

      if (existingIndex !== -1) {
        if(this.qty == '0'){
          const currentState = this.rows1[existingIndex].state;
          if (currentState === 'created') {
            this.rows1.splice(existingIndex, 1);
          } else if (currentState === 'none') {
            this.rows1[existingIndex].state = 'deleted';
          }
        }
      }
      this.loc = null;
      this.showKeyPad = false;
    },

    selectPad(num) {
      /*if (this.qty === "0" && num !== 0) {
        // 현재 값이 0일 때는 숫자를 대체
        this.qty = String(num);
      } else if (this.qty !== "0") {
        this.qty += String(num);
      }*/
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

    selectPadApply() {

      const existingIndex = this.rows1.findIndex(row => row['불량위치'] === this.loc);
      let existingQty = existingIndex !== -1 ? this.rows1[existingIndex]["불량수량"] : 0;

      // 현재 입력된 전체 불량수량 + 입력한 수량이 최대치를 초과하는지 체크
      let newTotal = this.totalErrorCnt - existingQty + parseInt(this.qty);

      if (newTotal > this.params.불량수량) {
        this.$toast("warning", `최대 입력 가능 수량은 ${this.params.불량수량} 입니다. 현재 가능 수량: ${this.params.불량수량 - (this.totalErrorCnt - existingQty)}`);
        this.qty = String(this.params.불량수량 - (this.totalErrorCnt - existingQty)); // 초과되지 않도록 수정
        return;
      }

      if (existingIndex !== -1) {
        const currentState = this.rows1[existingIndex].state;
        if (this.qty == '0') {
          if (currentState === 'created') {
            this.rows1.splice(existingIndex, 1);
          } else if (currentState === 'none' || currentState === 'updated') {
            this.rows1[existingIndex].state = 'deleted';
            this.rows1[existingIndex]["불량수량"] = String(this.qty);
          }
        } else {
          if (currentState === 'deleted' || currentState === 'none') {
            this.rows1[existingIndex].state = 'updated';
          }
          this.rows1[existingIndex]["불량수량"] = String(this.qty);
        }
      } else {
        this.rows1.unshift({
          lotrunId: this.params["runNo"], 
          "cstNo": this.params["cstNo"],
          "tCstNo": this.params["cstNo"],
          "불량위치": this.loc,
          "불량코드": this.error,
          "공정코드": this.params["공정코드"],
          "검사시각": new Date().toISOString(),
          "불량수량": String(this.qty),
          "차수": this.params["차수"],
          state: 'created'    
        });
      }
      this.keyPadClose();
    },

    keyPadClear() {
      this.qty = "0";
    },

    updateErrorMapping() {
      this.initOn();
      this.rows1.forEach(row => {
        if (row.state === 'created' || row.state === 'none' || row.state === 'updated') {
          const target = this.$refs.errorMapping.querySelector(`td[loc='${row['불량위치']}']`);
          if (target) target.classList.add("on");
        }
      });
    },

    enableTooltip(event, loc) {
      if (!this.error) return;
    },
    getTooltip(loc) {
      const row = this.rows1.find((row) => row["불량위치"] === loc);
      return row ? `불량수량: ${row["불량수량"]}` : "불량수량 없음";
    },

    actionClick(){

      const toSave = this.rows1.filter(row => row.state === 'created');
      const toDelete = this.rows1.filter(row => row.state === 'deleted');
      const toUpdate = this.rows1.filter(row => row.state === 'updated');

      if (!toSave.length && !toDelete.length && !toUpdate.length) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return;
      }

      let saveFunc = async () => {

        let param = {
          menuId:'M0003002',
          delete: [{queryId:'M0003002_Delete1', data:toDelete}],
          insert: [{queryId:'M0003002_Insert1', data:toSave}],
          update: [
            {queryId:'M0003002_Update3', data:toUpdate},
            //{queryId: (this.params["공정코드"] == '054' ? 'M0003002_Update4' : 'M0003002_Update11'), data:[this.params]},
            //{queryId: 'M0003002_Update20', data:[this.params]}
          ]
        };

        const resp = await this.$axios.api.saveData(param);
        if (resp.status === 'success') {
          this.$toast('success', '저장되었습니다.');
          this.$emit("save");
          this.searchData();
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
  },
};
</script>

<style lang="scss" scoped>
.modal-body{
   position: relative;
   overflow: hidden;
  .mapping_wrap{
    display:flex;
    flex-wrap: wrap;
    .mapping_item {
      flex: 0 0 calc(20% - 10px); /* 각 아이템의 크기 고정: 20% */
      max-width: calc(20% - 10px); /* 최대 너비도 동일하게 설정 */
      box-sizing: border-box; /* 패딩과 보더 포함 계산 */
      border: 1px dashed #dcdcdc;
      padding: 10px;
      text-align: center;
      cursor: pointer;
      height: 40px;
      &:hover, &.on{
        background-color:#ffe4dd;
      }
    }
    .cassette_qc{
      border:2px solid #bcc0c8;
      td{
        text-align: center;
        border-right:1px solid #bcc0c8 ;
        border-bottom:1px solid #bcc0c8 ;
        height: 40px;
        user-select: none;
        cursor: pointer;
       &:hover, &.on{
          background-color:#ffe4dd;
        }
      }
    }
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
    left: calc(100% - 40px);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: url('@assets/images/download_02.png') no-repeat center;
    background-size: 12px;
  }
  }
}
</style>