<template>
  <b-modal v-model="isOpen" hide-footer size="xl" :title="'불량 맵핍 현황'+' / '+params.runNo+' / '+ '불량합계('+totalErrorCnt+')'"
    no-close-on-backdrop    
    :style="{
      zIndex: zIndex
    }"
    centered
  >
    <div class="mapping_wrap">
        <div class="mapping_item" 
          v-for="(item, index) in rows" :key="index" 
          :class="{ on: selectedErrorIndex === index }"
          @click="selectError(index)"           
        >
          <div class="label">{{ item.불량명 }}</div>
          <b-input-group>
            <b-form-input 
              type="number" 
              v-model="rows[index]['불량수량']"
              min="0"
              step="1"
              class="no-spinner"
              :disabled="true"
            ></b-form-input>            
          </b-input-group>         
        </div>
    </div>
    <div class="cassette_qc_wrapper">
      <table class="cassette_qc" ref="errorMapping">
        <tr v-for="row in rowArray" :key="row">
          <td                             
            v-for="col in colArray" :key="col" :loc="getEdgeLabel(row, col)"
          >
            {{ getEdgeLabel(row, col) }}
          </td>
        </tr>          
      </table>
    </div>
    <div class="bttn_wrap">
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>

export default {
  name: "ProcessingMappingStatus1",
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
      selectedErrorIndex: null,
      rowCount: 0,  
      colCount: 0
    };
  },
  computed: {
    rowArray() {
    return Array.from({ length: this.rowCount }, (_, i) => i + 1);
  },
  colArray() {
    return Array.from({ length: this.colCount }, (_, i) => i + 1);
  },
    showKeyPadFlag() {
      return this.showKeyPad
    },
    totalErrorCnt(){
      return this.rows.reduce((sum, item) => sum + (item.불량수량 || 0), 0);
    },
    filteredRows1() {
      if (this.selectedErrorIndex === null) return [];
      const selectedError = this.rows[this.selectedErrorIndex]?.불량명;
      return this.rows1.filter(row => row.불량명 === selectedError);
    },
  },
  created() {},
  watch: {
    selectedErrorIndex() {
      this.$nextTick(() => {
        this.updateErrorMapping();
      });
    },
    rows1: {
      handler() {
        this.$nextTick(() => {
          this.updateErrorMapping();
        });
      },
      deep: true,
    },
  },
  methods: {
    openDialog(params) {
      this.params['차수'] = 1;
      Object.assign(this.params, params);
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.$utils.assignDynamicProperties(['rows=[]', 'rows1=[]'], this);        
        this.searchData().then(()=>{
          this.selectedErrorIndex = null;
          this.isOpen = true;
        });
      });
    },

    async searchData(){
      await this.$axios.api.searchAll([
        { menuId: "M0003002", queryId: "M0003002_Sch20", queryParams: {...this.params }, target: this.rows1 }, 
        { menuId: "M0003002", queryId: "M0003002_Sch21", queryParams: this.params, target: this.rows }
      ]);
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

    updateErrorMapping() {
      this.initOn();
      this.filteredRows1.forEach(row => {
        const target = this.$refs.errorMapping.querySelector(`td[loc='${row['불량위치']}']`);
        if (target) {
          target.classList.add("on");
        } else {
          console.warn("❌ 위치 찾기 실패:", row['불량위치']);
        }
      });
    },

    selectError(index) {
      // 이미 선택된 걸 다시 누르면 해제 가능
      this.selectedErrorIndex = this.selectedErrorIndex === index ? null : index;
    },

    getEdgeLabel(row, col) {
      const rowIdx = this.rowArray.indexOf(row);
      const colIdx = this.colArray.indexOf(col);
      const lastRowIdx = this.rowArray.length - 1;
      const lastColIdx = this.colArray.length - 1;

      const firstRow = this.rowArray[0];
      const lastRow = this.rowArray[lastRowIdx];
      const firstCol = this.colArray[0];
      const lastCol = this.colArray[lastColIdx];

      // 좌측 상단 고정
      if (rowIdx === 0 && colIdx === 0) return '1-0';

      // 상단 행 (row == firstRow), 오른쪽에서 왼쪽
      if (row === firstRow && col !== firstCol) {
        return `4-${lastColIdx - colIdx}`;
      }

      // 좌측 열 (col == firstCol), 아래쪽 증가
      if (col === firstCol && row !== firstRow && row !== lastRow) {
        return `1-${rowIdx}`;
      }

      // 하단 행 (row == lastRow), 왼쪽 → 오른쪽 증가
      if (row === lastRow && col !== lastCol) {
        return `2-${colIdx}`;
      }

      // 우측 열 (col == lastCol), 위 → 아래 증가 (맨 아래 포함!)
      if (col === lastCol && row !== firstRow) {
        return `3-${lastRowIdx - rowIdx}`;
      }

      return '';
    }
  },
};
</script>

<style lang="scss" scoped>
.modal-body{
   position: relative;
   overflow: hidden;
    .cassette_qc_wrapper {
      max-height: 500px;
      overflow-y: auto;
      overflow-x: auto;
      border: 2px solid #bcc0c8;
      margin-top: 10px;
    }
    .cassette_qc{
      td{
        text-align: center;
        width: 36px;
        min-width: 36px;
        max-width: 36px;
        border: 1px solid #bcc0c8; // 좌우, 상하 동일한 테두리
        box-sizing: border-box;    // 🔧 테두리 포함 크기 계산
        height: 40px;
        user-select: none;
        cursor: pointer;
       &:hover, &.on{
          background-color:#ffe4dd;
        }
      }
    }
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
</style>