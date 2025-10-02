<template>
  <b-modal v-model="isOpen" hide-footer size="xl" title="Block 선택"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex
    }"
    content-class="custom-modal-content-block-mapping"
    dialog-class="custom-modal-dialog-block-mapping"
    centered
  >
    <div class="mapping_wrap">
	    <div class="mapping_item" v-for="(item, index) in rows" :key="index" :class="{ on: item.불량수량 > 0 }"
        @click="blockClick(item)"  
      >
        <div :class="item['pre불량수량'] > 0 ? 'label1' : 'label'">{{ item.blNo }}</div> 
      </div>
    </div>
    <ProcessingMapping ref="processingMapping" @save="saveCallback1"/>
    <div class="bttn_wrap">
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>  
  </b-modal>
</template>

<script>

const { RowState } = require('realgrid');
import ProcessingMapping from "@web/popup/ProcessingMapping";

export default {
  name: "BlockMapping",
  props: {},
  components:{
    ProcessingMapping,
  },
  data() {
    return {
      rows: [],
      isOpen: false,
      params: {
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
        this.searchClick().then(()=>{
          this.isOpen = true;
        });
      });
    },
    async searchClick() { 
      let result = await this.$axios.api.search({ menuId: "M0003005", queryId: "M0003005_Sch8",
        queryParams: {
          ...this.params,
          line: 'D1UT',
          "자동여부": 0,
        }
      });
      this.rows = _.cloneDeep(result);
    },
    closeDialog() {
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    confirm() {
      this.closeDialog();
    },
    saveCallback1(){
      this.searchClick();
      this.$emit("save");
    },
    blockClick(item){
      let pre불량수량 = item['pre불량수량'];
      if(pre불량수량 > 0){
        this.$toast("info", "이전 공정에서 불량처리되어서 불량입력할수 없습니다.");        
        return;
      }
      this.$refs.processingMapping.openDialog({
        ...this.params, 
        ...{ 
          blNo: item.blNo, 
          line: 'D1UT',
          "자동여부": 0,
          dialogTitle: "불량 맵핑 입력",
          "불량구분": "불량",
          isEditabled: this.params.isEditabled,
          runId: item["lotNo"],
          callback: { queryId:'M0003005_Error', data:[{
            ...item,
            'code': item['공정코드'],
            line: 'D1UT',
            "자동여부": 0,
          }]}
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
:deep.mapping_item {
  flex: 0 0 calc(33.33% - 10px); /* 각 아이템의 크기 고정: 20% */
  max-width: calc(33.33% - 10px); /* 최대 너비도 동일하게 설정 */
  box-sizing: border-box; /* 패딩과 보더 포함 계산 */
  border: 1px dashed #dcdcdc;
  padding: 10px;
  text-align: center;
  &.on{
    background-color:#ffe4dd;
  }
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
    .label1{
      width: 150px;
      display: flex;
      align-items: center;
      &::before{
        content:'●';
        font-size:7px;
        margin-right: 5px;
        color: black;
      }
    }    
  }
}
</style>

<style lang="scss">
.custom-modal-dialog-block-mapping {
  max-width: 1000px !important;
  width: 100%;
}
.custom-modal-content-block-mapping {
  width: 100%;
}
</style>