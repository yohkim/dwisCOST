/**
*	작업이력조회>Cell작업이력조회
*/
<template>
  <div >
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="6"> 
          <input type="text" class="form-control label-60" id="floating" placeholder="CELL ID" v-model="cellId" autocomplete="off"/>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button class="second" @click="cellIdButtonClick">Cell List</b-button>
         <div class="hr"></div>
        <b-button @click="searchClick"  ><span class="ico_search"></span>조회</b-button >
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="excelBtnClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid
          ref="grid"
          :uid="'grid'"
          :step="'1'"
          :rows="gridRows"
          style="height: 100%"
        />
      </div>
    </div>
    <CellIdPopup ref="cellIdPopup" @confirm="handleConfirm" />
  </div>
</template>

<script>
import { RowState } from "realgrid";
import gridField from "@web/m0005000/js/TAB054000New.js";
import CellIdPopup from "@web/m0005000/popup/CellIdSelect.vue";

export default {
  props: {},
  components: {CellIdPopup},
  watch: {},
  data() {
    return {
      cellId:'',
      grid: null,
      gridRows: [],
    };
  },
  computed: {
    gridView() {
      return this.$refs.grid.getGridView();
    },
    gridDataProvider() {
      return this.$refs.grid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.gridView.setFixedOptions({colCount: 3});
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.grid = _.cloneDeep(gridField);
    },

    async getDataList() {
      this.gridView.commit();

      let params = {
        cellId: this.cellId,
      };

      let param = {
        menuId: "m0005003",
        queryId: "getCellTrackingInfo",
        queryParams: params,
        //target: this.gridRows,
      };
      let resp = await this.$axios.api.search(param);
      console.log(resp);
      const packList = ['14074','14077','14080','14081']
      const palletList = ['14082','14087']
      let rows = [];
      for(let elem of resp){
        let row = rows.find(target=>target.cellId==elem.cellId)
        let seq = elem.seq;
        if(row==undefined){
          row={
            cellId:elem.cellId,
            runId:elem.runId
          };
          rows.push(row);
        }
        if(packList.includes(seq)){
          row[seq+'packNo']=elem['packNo'];
          row[seq+'시작']=elem['시작'];
          row[seq+'작업자']=elem['작업자'];
        }
        else if(palletList.includes(seq)){
          row[seq+'palletNo']=elem['palletNo'];
          row[seq+'시작']=elem['시작'];
          row[seq+'작업자']=elem['작업자'];
        }
        else{
          row[seq+'호기']=elem['호기'];
          row[seq+'시작']=elem['시작'];
          row[seq+'종료']=elem['종료'];
          row[seq+'작업자']=elem['작업자'];
        }
      }
      console.log(rows);
      this.gridDataProvider.setRows(rows);
    },

    searchClick() {
      if(_.isNil(this.cellId)||this.cellId.length==0){
        this.$toast('info', "CELL ID를 입력해주세요");
        return;
      }
        
      this.getDataList();
    },

    cellIdButtonClick(){
      const rows = this.cellId
      .split(";")
      .map(item => item.trim())
      .filter(item => item !== "")
      .map(cellId => ({ cellId }));
      let params = {
        cellIdArray:rows
      }
      this.$refs.cellIdPopup.openDialog(params);
    },

    handleConfirm(params){
      this.cellId=params.cellId;
    },

    async excelBtnClick() {
      const grid = this.gridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const fileName = `Cell작업이력조회_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: "excel",
        target: "local",
        fileName: fileName,
        progressMessage: "엑셀 Export중입니다.",
        done: function () {
          alert("엑셀 내보내기가 완료되었습니다!");
        },
      };

      grid.exportGrid(options);
    },
  },
};
</script>

<style lang="scss" scoped>
:deep.btn_area{
  width: 240px !important; 
  display:flex;
  align-items: center;
}
</style>