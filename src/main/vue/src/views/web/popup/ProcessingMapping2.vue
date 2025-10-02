<template>
  <b-modal v-model="isOpen" hide-footer size="xl" :title="this.params.isFilm ? '제품 ' + params.model + ' 필름 확인' : (params.runNo+' / '+params.cstNo+' / ' +params.cellId+' / ' + '불량 맵핍 입력')"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex
    }"
    centered
  >
    <div class="mapping_wrap2">
      <div  class="left_top" :style="'background:'+m1()"></div>
      <div  class="right_top" :style="'background:'+m2()"></div>
        <table class="cassette_qc" ref="errorMapping">
          <tr v-for="row in rowArray" :key="row">
            <td v-for="col in colArray" :key="col" :loc="`${row}-${col}`" @click="selectLoc(`${row}-${col}`)">
              {{ row }}-{{ col }}
            </td>
          </tr>          
        </table>
        <div class="left_bttm" :style="'background:'+m4()"></div>
        <div class="right_bttm" :style="'background:'+m3()"></div>
    </div>
    <div class="bttn_wrap">
      <div v-show="this.params.isEditabled">
        <b-button  class="main" @click="actionClick">저장</b-button>
      </div>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>  
  </b-modal>
</template>

<script>

const { RowState } = require('realgrid');

export default {
  name: "ProcessingMapping2",
  props: {},
  data() {
    return {
      rows: [],
      rows1: [],
      isOpen: false,
      params: {
        dialogTitle: "",
        isEditabled: false,
        isFilm: false,        
      },
      loc: null,
      error: null,
      errorNm: "불량 미선택",
      zIndex: 0,
    };
  },
  computed: {
    rowArray() {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    },
    colArray() {
      return Array.from({ length: 9 }, (_, i) => i + 1);
    },
  },
  created() {},
  watch: {
    rows: {
      handler() {
        this.updateErrorMapping();
      },
      deep: true,
    },
  },
  methods: {
    m1(){
      return this.rows1.length > 0 && !_.isNil(this.rows1[0]?.e1) ? this.rows1[0].e1.toLowerCase() : 'white';
    },
    m2(){
      return this.rows1.length > 0 && !_.isNil(this.rows1[0]?.e2) ? this.rows1[0].e2.toLowerCase() : 'white';
    },
    m3(){
      return this.rows1.length > 0 && !_.isNil(this.rows1[0]?.e3) ? this.rows1[0].e3.toLowerCase() : 'white';
    },
    m4(){
      return this.rows1.length > 0 && !_.isNil(this.rows1[0]?.e4) ? this.rows1[0].e4.toLowerCase() : 'white';
    },
    openDialog(params) {
      this.showKeyPad = false;
      this.loc = null;
      this.error = null;
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.rows=[]; 
        this.rows1=[]; 
        this.searchClick().then(()=>{
          this.isOpen = true;
        });
      });
    },
    async searchClick() {  
      if(this.params.isFilm){
        await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch8", queryParams: this.params, target: this.rows1});
      }else{
        await this.$axios.api.searchAll([
          {menuId: "M0003003", queryId: "M0003003_Sch7", queryParams: this.params, target: this.rows},
          {menuId: "M0003003", queryId: "M0003003_Sch8", queryParams: this.params, target: this.rows1},
        ]);
      }
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
      if(this.params.isFilm || !this.params.isEditabled)return;
      this.initOn();
      this.rows = [];
      if(this.loc == loc){
        this.loc = null;
      }else{
        this.loc = loc;
        let dateTimeArray = this.$utils.getDateAndTimeArray1();
        this.rows.push({
          "runId": this.params["runId"], 
          "cstNo": this.params["cstNo"],
          "cellId": this.params["cellId"],
          "불량위치": loc,
          "불량코드": this.params["불량코드"],
          "공정코드": this.params["공정코드"],
          "검사시각": dateTimeArray[0] + " " + dateTimeArray[1],
          "불량수량": 1,
          "차수": this.params["차수"]
        });
      }
    },

    updateErrorMapping() {
      this.initOn();
      this.rows.forEach(row => {       
        const target = this.$refs.errorMapping.querySelector(`td[loc='${row['불량위치']}']`);
        if (target) target.classList.add("on");        
      });
    },

    actionClick(){

      let param = {
        menuId:'M0003003'
      };
      if(this.loc == null){
        param["delete"] = [{queryId:'M0003003_Delete1', data:this.rows}];
      }else{
        param["update"] = [{queryId:'M0003003_Update3', data:this.rows}];
      }
      let saveFunc = async () => {
        const resp = await this.$axios.api.saveData(param);
        if (resp.status === 'success') {
          this.$toast('success', '저장되었습니다.');
          this.$emit("save");
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
  },
};
</script>

<style lang="scss">
.modal-body{
   position: relative;
   overflow: hidden;
  .mapping_wrap2{
    position: relative;
    padding: 30px;
      .left_top{
          position: absolute;
          top: 0;
          left: 5px;
          width: 20px;
          height: 30px;
          transform: skew(45deg, 320deg);
          box-shadow: 0 0 3px 1px rgba(0,0,0, 0.1);
      }
      .right_top{
          position: absolute;
          top: 5px;
          right: 0px;
          width: 30px;
          height: 20px;
          transform: skew(45deg, 320deg);
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
      }
      .left_bttm{
          position: absolute;
          bottom: 5px;
          left: 0px;
          width: 30px;
          height: 20px;
          transform: skew(45deg, 320deg);
          box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
      }
      .right_bttm{
          position: absolute;
          bottom: 0;
          right: 5px;
          width: 20px;
          height: 30px;
          transform: skew(45deg, 320deg);
          box-shadow: 0 0 3px 1px rgba(0,0,0, 0.1);
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
  }
  .key_pad_modal{
      position: absolute;
      z-index: 100;
      width:100%;
      height: 530px;
      background: rgba(0, 0, 0, 0.8);
      left: 0;
      bottom: -260px;
      box-shadow: 0 -5px 10px 5px rgba(0,0,0, 0.2);
      .key_pad_wrap{
          margin: 105px auto 0;
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
          width: calc(100% / 6);
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