<template>
  <b-modal v-model="isOpen" hide-footer :title="params.lotNo+' / '+params.blNo+' / '+params.dialogTitle+' / '+errorNm"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex
    }"
    content-class="custom-modal-content-proc-mapping"
    dialog-class="custom-modal-dialog-proc-mapping"
    centered
  >
    <div  style="display:flex">
      <div class="me-4">
      <div class="mapping_wrap">
        <div class="mapping_item" 
          v-for="(item, index) in rows1" :key="index" 
          :class="{ on: item.불량코드 === errorCode || (item.불량수량 > 0 && errorCode === null) }"
          @click="searchData(item.불량코드, item.불량명)"
        >
        <div class="label">{{ item.불량명 }}</div>         
        </div>
      </div>
      </div>
      <ul ref="errorMapping" class="error_mapping ms-auto me-auto">
        <li>
          <a role="button" class="up_r_left" loc="상R좌" @click="add('상R좌')"></a>
          <a role="button" class="up_left" loc="상좌" @click="add('상좌')"></a>
          <a role="button" class="up_m_left" loc="상중" @click="add('상중')"></a>
          <a role="button" class="up_right" loc="상우" @click="add('상우')"></a>
          <a role="button" class="up_r_right" loc="상R우"  @click="add('상R우')"></a>
        </li>
        <li>
          <a role="button" class="left_up" loc="좌상" @click="add('좌상')"></a>
          <a role="button" class="blank1"></a>
          <a role="button" class="right_up" loc="우상" @click="add('우상')"></a>
        </li>
        <li>
          <a role="button" class="left_mdl" loc="좌중" @click="add('좌중')"></a>
          <a role="button" class="blank2"></a>
          <a role="button" class="right_mdl" loc="우중" @click="add('우중')"></a>
        </li>
        <li>
          <a role="button" class="left_dw" loc="좌하" @click="add('좌하')"></a>
          <a role="button" class="blank3"></a>
          <a role="button" class="right_dw" loc="우하" @click="add('우하')"></a>
        </li>
        <li>
          <a role="button" class="dw_r_left" loc="하R좌" @click="add('하R좌')"></a>
          <a role="button" class="dw_left" loc="하좌" @click="add('하좌')"></a>
          <a role="button" class="dw_m_left" loc="하중" @click="add('하중')"></a>
          <a role="button" class="dw_right" loc="하우" @click="add('하우')"></a>
          <a role="button" class="dw_r_right" loc="하R우" @click="add('하R우')"></a>
        </li>
      </ul>      
    </div>
  <div class="bttn_wrap">
    <b-button  block @click="closeDialog">닫기</b-button>
    <b-button  class="main" block v-show="this.params.isEditabled" @click="actionClick">저장</b-button>
  </div>
  </b-modal>
</template>

<script>

export default {
  name: "ProcessingMapping",
  props: {},
  data() {
    return {
      processingMappingGrid: null,
      rows: [],
      rows1: [],
      isOpen: false,
      params: {
        dialogTitle: "",
        isEditabled: false,
        callback: null,
      },
      zIndex: 0,
      errorCode: null,
      errorNm: "불량 미선택",
    };
  },
  computed: {},
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
    openDialog(params) {
      this.rows = [];
      this.rows1 = [];
      this.errorNm = "불량 미선택";
      this.errorCode = null;
      this.params.callback = null;
      this.initOn();
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.searchError().then(()=>{
          this.isOpen = true;
        });
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
    initOn(){
      let targetAll = this.$refs.errorMapping.querySelectorAll("a");
      targetAll.forEach(item => item.classList.remove("on"));
    },
    add(loc) {
      if(!this.params.isEditabled)return;
      const existingIndex = this.rows.findIndex(
        row => row["불량위치"] === loc && row["불량코드"] === this.errorCode
      );

      if (existingIndex !== -1) {
        this.rows.splice(existingIndex, 1);        
      } else {
        // 선택되지 않은 경우 추가
        const dateTimeArray = this.$utils.getDateAndTimeArray1();

        this.rows.unshift({
          lotrunId: this.params["lotNo"],
          blNo: this.params["blNo"],
          machineCode: this.params["machineCode"],
          불량위치: loc,
          불량구분: this.params["불량구분"],
          불량코드: this.errorCode,
          공정코드: this.params["공정코드"],
          검사시각: dateTimeArray[0] + " " + dateTimeArray[1],
          state: "created"
        });
      }

      this.updateErrorMapping();
    },

    async searchError(){
      await this.$axios.api.search({menuId: "CMDIALOG", queryId: "selectErrorBlockList", queryParams: this.params, target: this.rows1});
      const result = this.rows1.find(item => item.불량수량 > 0);
      if(!_.isEmpty(result)){
        this.searchData(result.불량코드, result.불량명);
      }
    },

    async searchData(errorCode, errorNm){
      
      if (this.errorCode !== errorCode) {
        this.rows = this.rows.filter(row => row["불량코드"] === errorCode);
        this.updateErrorMapping();
      }
      this.errorCode = errorCode;
      this.errorNm = errorNm;

      await this.$axios.api.search(
        {menuId: "M0003005", queryId: "M0003005_Sch13", queryParams: 
          {
            ...this.params, 
            '불량코드': errorCode
          }, 
          target: this.rows
        }
      );
    },

    actionClick(){

      if (this.errorCode == null) {
        this.$toast('info', '불량을 선택하지 않았습니다.');
        return;
      }

      let saveFunc = async () => {

        let param = {
          menuId:'M0003005',
          delete: [{queryId:'M0003005_Delete1', data:[{...this.params}]}],
          insert: [{queryId:'M0003005_Insert1', data:this.rows},],
          update: [
            {queryId: 'M0003005_Update9', data:[this.params]}
          ]
        };
        if(this.params.callback != null){
          param["update"].push({...this.params.callback});
        }

        const resp = await this.$axios.api.saveData(param);
        if (resp.status === 'success') {
          this.$toast('success', '저장되었습니다.');
          this.$emit("save");
          this.searchError();
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

    updateErrorMapping() {
      this.initOn();
      /*this.rows.forEach(row => {
        if (row.state === 'created' || row.state === 'none') {
          const target = this.$refs.errorMapping.querySelector(`a[loc='${row['불량위치']}']`);
          if (target) target.classList.add("on");
        }
      });*/

      this.rows.forEach(row => {
        if ((row.state === "created" || row.state === "none") && row["불량코드"] === this.errorCode) {
          const target = this.$refs.errorMapping.querySelector(`a[loc='${row["불량위치"]}']`);
          if (target) target.classList.add("on");
        }
      });
    },
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-proc-mapping {
  max-width: 1000px !important;
  width: 100%;
}
.custom-modal-content-proc-mapping {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.mapping_item {
  flex: 0 0 calc(33.33% - 10px); /* 각 아이템의 크기 고정: 20% */
  max-width: calc(33.33% - 10px); /* 최대 너비도 동일하게 설정 */
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
.mapping_wrap{
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
.error_mapping {
  width: 410px;
  height: 552px;
  margin: 0;
  padding: 0;
  li {
    display: flex;
    a {
      &.up_r_left {
        background: url("@assets/images/error_check/error_checked_off_01.png");
        width: 99px;
        height: 88px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_01.png");
        }
      }
      &.up_left {
        background: url("@assets/images/error_check/error_checked_off_02.png");
        width: 55px;
        height: 88px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_02.png");
        }
      }
      &.up_m_left {
        background: url("@assets/images/error_check/error_checked_off_03.png");
        width: 100px;
        height: 88px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_03.png");
        }
      }
      &.up_right {
        background: url("@assets/images/error_check/error_checked_off_04.png");
        width: 55px;
        height: 88px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_04.png");
        }
      }
      &.up_r_right {
        background: url("@assets/images/error_check/error_checked_off_05.png");
        width: 101px;
        height: 88px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_05.png");
        }
      }
      &.left_up {
        background: url("@assets/images/error_check/error_checked_off_06.png");
        width: 99px;
        height: 110px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_06.png");
        }
      }
      &.blank1 {
        background: url("@assets/images/error_check/error_checked_on_07.png");
        width: 210px;
        height: 110px;
      }
      &.right_up {
        background: url("@assets/images/error_check/error_checked_off_08.png");
        width: 101px;
        height: 110px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_08.png");
        }
      }
      &.left_mdl {
        background: url("@assets/images/error_check/error_checked_off_09.png");
        width: 99px;
        height: 160px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_09.png");
        }
      }
      &.blank2 {
        background: url("@assets/images/error_check/error_checked_on_10.png");
        width: 210px;
        height: 160px;
      }
      &.right_mdl {
        background: url("@assets/images/error_check/error_checked_off_11.png");
        width: 101px;
        height: 160px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_11.png");
        }
      }
      &.left_dw {
        background: url("@assets/images/error_check/error_checked_off_12.png");
        width: 99px;
        height: 110px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_12.png");
        }
      }
      &.blank3 {
        background: url("@assets/images/error_check/error_checked_on_13.png");
        width: 210px;
        height: 110px;
      }
      &.right_dw {
        background: url("@assets/images/error_check/error_checked_off_14.png");
        width: 101px;
        height: 110px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_14.png");
        }
      }
      &.dw_r_left {
        background: url("@assets/images/error_check/error_checked_off_15.png");
        width: 99px;
        height: 84px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_15.png");
        }
      }
      &.dw_left {
        background: url("@assets/images/error_check/error_checked_off_16.png");
        width: 55px;
        height: 84px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_16.png");
        }
      }
      &.dw_m_left {
        background: url("@assets/images/error_check/error_checked_off_17.png");
        width: 100px;
        height: 84px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_17.png");
        }
      }
      &.dw_right {
        background: url("@assets/images/error_check/error_checked_off_18.png");
        width: 55px;
        height: 84px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_18.png");
        }
      }
      &.dw_r_right {
        background: url("@assets/images/error_check/error_checked_off_19.png");
        width: 101px;
        height: 84px;
        &:hover,
        &.on {
          background: url("@assets/images/error_check/error_checked_on_19.png");
        }
      }
    }
  }
}
</style>