/**
*	제조 실적 입력 > Back#2 Cell QC > ECI/VRS
*/
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select
              class="form-select label-60"
              id="floatingSelect"
              aria-label="Floating label select example"
              v-model="selectedProcess"
            >
              <option 
                v-for="(item, index) in processList" 
                :key="index" 
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating lot_run_num">
            <input
              autocomplete="off"
              type="text"
              class="form-control label-60"
              id="floating"
              v-model="runNo"
              disabled
              placeholder="RUN-NO"
            />
            <label for="floating">RUN-NO</label>
          </div>
        </b-col>
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchProcess">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="title">작업이력</div>
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="exportToExcel1">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
      <RealGrid
        ref="ProcLogGrid1"
        :uid="'ProcLogGrid1'"
        :rows="rows1"
        style="height: 100%"
      />
      </div>
      <div class="left_box">
        <div class="title">작업이력상세</div>
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="exportToExcel2">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
      <RealGrid
        ref="ProcLogGrid2"
        :uid="'ProcLogGrid2'"
        :rows="rows2"
        style="height: 100%"
      />
      </div>
    </div>
  </div>
</template>

<script>
const URI_PREFIX = "/api/m0003000/m0003007";
import gridOption1 from "@web/m0003000/js/TAB040000_1.js";
import gridOption2 from "@web/m0003000/js/TAB040000_2.js";
export default {
  name: "DW_TAB040000",
  props: {},
  data() {
    return {
    processList:[
      {text:'ECI',value:'ECI'},
      {text:'VRS',value:'VRS'},
	  ],
	  selectedProcess:'ECI',
      startDate: "", // Start date for 수주일자
      endDate: "", // End date for 수주일자
      ProcLogGrid1: null,
      ProcLogGrid2: null,
      rows1: [],
      rows2: [],
      searchFlag: false, //조회 했는지 체크
      searchParams: null,
      runNo:null,
    };
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.startDate = this.$utils.getCurMonthStartDate();
    this.endDate = this.$utils.getCurMonthEndDate();
    let layouts1 = [
      {
        name:"ECI",
        items:gridOption1.layoutECI
      },
      {
        name:"VRS",
        items:gridOption1.layoutVRS
      }
    ]
    let layouts2 = [
      {
        name:"ECI",
        items:gridOption2.layoutECI
      },
      {
        name:"VRS",
        items:gridOption2.layoutVRS
      }
    ]
    this.$refs.ProcLogGrid1.getGridView().registerColumnLayouts(layouts1);
    this.$refs.ProcLogGrid2.getGridView().registerColumnLayouts(layouts2);
    this.setLayout(this.selectedProcess);
    this.$refs.ProcLogGrid1.getGridView().setFixedOptions({colCount: 4});
    this.$refs.ProcLogGrid2.getGridView().setFixedOptions({colCount: 6});
  },
  beforeUnmount() {},
  methods: {
    async initializeGrid() {
      //registerColumnLayouts
      this.ProcLogGrid1 = _.cloneDeep(
        require(`@web/m0003000/js/TAB040000_1.js`)
      );
      this.ProcLogGrid2 = _.cloneDeep(
        require(`@web/m0003000/js/TAB040000_2.js`)
      );
    },
    setLayout(layoutName){
      this.$refs.ProcLogGrid1.getGridView().setColumnLayout(layoutName);
      this.$refs.ProcLogGrid2.getGridView().setColumnLayout(layoutName);
    },
    exportToExcel1() {
      // Logic to export the order list to Excel
      console.log("Exporting to Excel...");
    },
    exportToExcel2() {
      // Logic to export the order list to Excel
      console.log("Exporting to Excel...");
    },
    async searchProcess(){
      let param = {
          menuId: "M0003003",
          queryId: this.selectedProcess=="ECI"?"searchProcLogGrid1ECI":"searchProcLogGrid1VRS",
          queryParams: {startDate:this.startDate,endDate:this.endDate},
          target: this.rows1,
        };
      this.setLayout(this.selectedProcess);
      this.rows2=[];
      await this.$axios.api.search(param); 
    },
    //그리드 이벤트 설정
    //셀 클릭시
    async onCellClickedProcLogGrid1(grid, clickData) {
      if (clickData.cellType != "data"&&clickData.cellType != "check") return; 
      
      const prod = grid.getDataSource();
      let row = prod.getJsonRow(clickData.dataRow);
      this.runNo = row.runId;
      let param = {
          menuId: "M0003003",
          queryId: this.selectedProcess=="ECI"?"searchProcLogGrid2ECI":"searchProcLogGrid2VRS",
          queryParams: {runNo:this.runNo,startDate:this.startDate,endDate:this.endDate},
          target: this.rows2,
        };
      await this.$axios.api.search(param);
    },
  },
};
</script>
<style lang="css" scoped>
  ::v-deep .grid-border-none{
    height: calc(50% - 40px);
  }
</style>