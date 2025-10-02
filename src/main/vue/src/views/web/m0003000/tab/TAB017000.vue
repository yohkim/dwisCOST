/**
*	제조 실적 입력 > Lot Run Card 발행 > Run Card 발행 > 생성분
*/
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="1">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="selectedModel"
            >
              <option
                v-for="model in modelList"
                :key="model.value"
                :value="model"
              >
                {{ model.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <select
              class="form-select label-60"
              id="floatingSelect"
              v-model="selectedWorkType"
            >
              <option
                v-for="type in workTypeList"
                :key="type.value"
                :value="type"
              >
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">작업구분</label>
          </div>
        </b-col>
        <b-col cols="1">
          <div class="form-floating lot_run_num">
            <input
              autocomplete="off"
              type="text"
              class="form-control label-60"
              id="floating"
              v-model="runNoBase"
              disabled
              placeholder="RUN-NO"
            />
            <label for="floating">RUN-NO</label>
          </div>
        </b-col>
         <b-col cols="1">
          <div class="form-floating">
            <input
                autocomplete="off"
                type="text"
                class="form-control"
                id="floating"
                v-model="runNo"
                disabled
              />
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
        <b-button @click="searchRunInfo">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="title">Run Card</div>
        <div class="ms-auto">
          <b-button @click="cancelRunCard" class="main">취소</b-button>
          <b-button @click="displayProcessPlan" class="second">공정확인</b-button>
          <b-button @click="printEmptyRunCard" class="second">Back#2 카드 인쇄</b-button>
          <b-button @click="printRunCard" class="main">Back#1 카드 인쇄</b-button>
        </div>
      </div>
      <RealGrid
        ref="RunCardGrid"
        :uid="'RunCardGrid'"
        :rows="rows1"
        style="width: 100%;"
         class="grid-border-none"
      />
      <div class="left_box">
        <div class="title">Lot 정보</div>
      </div>
      <RealGrid
        ref="LotCardGrid"
        :uid="'LotCardGrid'"
        :rows="rows2"
        style="width: 100%; "
          class="grid-border-none"
      />
    </div>
    <CmDialog1 ref="cmDialog1TAB017000" @confirm="handleConfirm" />
    <MRunCard ref="runCard"/>
  </div>
</template>

<script>
const URI_PREFIX = "/api/m0003000/m0003007";
import MRunCard from "./M_RunCard.vue";

export default {
  name: "DW_TAB017000",
  props: {},
  components: {MRunCard},
  data() {
    return {
      modelList: [], // Example product types
      selectedModel: { value: "JW", text: "8091" }, //'HD', // Currently selected product type
      workTypeList: [], // Example work types
      selectedWorkType: { value: "01", text: "(P) Production Run_정규" }, // Currently selected work type
      startDate: "2024-12-01", // Start date for 수주일자
      endDate: "2024-12-30", // End date for 수주일자
      RunCardGrid: null,
      LotCardGrid: null,
      rows1: [],
      rows2: [],
      searchFlag: false, //조회 했는지 체크
      searchParams: null,
      runNo:null,
    };
  },
  computed: {
    runNoBase() {
      if (_.isNil(this.selectedModel)) return "-";
      return `${this.selectedModel.text}B`;
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    async getSelectOptions() {
      let param = [
        {
          menuId: "M0003007",
          queryId: "getModels",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "제품유형"],
              this.modelList
            );
          },
        },
        {
          menuId: "M0003007",
          queryId: "getWorkTypes",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["코드", "작업구분"],
              this.workTypeList
            );
          },
        },
      ];
      await this.$axios.api.searchAll(param);
    },
    async initializeGrid() {
      this.RunCardGrid = _.cloneDeep(
        require(`@web/m0003000/js/TAB016001_1.js`)
      );
      this.LotCardGrid = _.cloneDeep(
        require(`@web/m0003000/js/TAB016001_2.js`)
      );
    },
    async searchRunInfo() {
      if (_.isNil(this.selectedModel) || _.isNil(this.selectedWorkType)) {
        this.$toast("error", "조회조건을 모두 입력해주세요.");
        return;
      }
      let queryParams = {
        modelCode: this.selectedModel.value,
        workCode: this.selectedWorkType.value,
        startDate: this.startDate.replaceAll("-", ""),
        endDate: this.endDate.replaceAll("-", ""),
      };

      this.searchParams = queryParams;
      let param = {
        menuId: "M0003007",
        queryId: "getRunCards",
        queryParams: queryParams,
        target: this.rows1,
      };
      await this.$axios.api.search(param);
      this.searchFlag = true;
      this.runNo=null;
    },
    async displayProcessPlan(){
      let prod = this.$refs.LotCardGrid.getGridDataProvider();
      let lotNo=null;
      if(prod.getRowCount()>0){
        let standardRow = prod.getJsonRow(0);
        lotNo = standardRow.lotNo;
      }
      if(lotNo==null) return;
      let params = {
        dialogTitle: "공정확인",
        step: 7,
        height: 300,
        width: 700,
        gridJs: `CP0000000013.js`,
        search: { menuId: "M0003007", queryId: "getProcessPlan",queryParams:{lotNo} },
      };
      this.$refs.cmDialog1TAB017000.openDialog(params);
    },
    exportToExcel() {
      // Logic to export the order list to Excel
      console.log("Exporting to Excel...");
    },
    async handleConfirm(params) {
      console.log(params);
    },
    async printRunCard(){
      if(_.isNil(this.runNo)){
        this.$toast("error", "선택하신 Runcard가 없습니다.");
        return;
      }
      let qp = {};
      qp['runNo'] = this.runNo;
      let runInfo=[];
      let param = {menuId:'M0003007',queryId:'getPrintMRunCardInfo',queryParams:qp, target: runInfo};
      await this.$axios.api.search(param);	
      if(runInfo.length==0){
        this.$toast("error", "RunCard 데이터를 가져 올 수 없습니다.");
        return;
      }
      await this.$refs.runCard.loadExcel();
      await this.$refs.runCard.addDataToExcel(runInfo[0]);
      await this.$refs.runCard.downloadExcel(this.runNo);
    },
    async printEmptyRunCard(){
      await this.$refs.runCard.loadExcel();
      await this.$refs.runCard.downloadExcel(this.runNo);
    },
    async cancelRunCard(){
      if(_.isNil(this.runNo)){
        this.$toast("error", "선택하신 Runcard가 없습니다.");
        return;
      }
      this.$confirm(
        "확인",
        "선택하신 Runcard를 취소 하시겠습니까?",
        async (confirm) => {
          if (confirm) {
            let param = {
              menuId: "M0003007",
              queryId: "cancelRunCard",
              queryParams: {runNo:this.runNo},
            };
            try {
              let resp = await this.$axios.api.search(param);
              this.$toast("info", "선택하신 Runcard를 취소하였습니다.");
            } catch {
              this.$toast("error", "에러발생. 다시 작업해주세요.");
            } finally {
              this.searchRunInfo();
            }
          }
        }
      );
    },
    //그리드 이벤트 설정
    //셀 클릭시
    async onCellClickedRunCardGrid(grid, clickData) {
      if (clickData.cellType != "data"&&clickData.cellType != "check") return; 
      
      const prod = grid.getDataSource();
      let row = prod.getJsonRow(clickData.dataRow);
      this.runNo = row.runNo;
      grid.checkItem(clickData.itemIndex,true,true);
      let param = {
          menuId: "M0003007",
          queryId: "getLotInfoByRun",
          queryParams: {runNo:this.runNo},
          target: this.rows2,
        };
      await this.$axios.api.search(param);
    },
    setAllValuesToNull(obj) {
      Object.keys(obj).forEach((key) => {
        obj[key] = null;
      });
    },
    isObjectEmptyExcept(obj, ignoreKey = "remarks") {
      return Object.entries(obj).some(([key, value]) => {
        if (key === ignoreKey) return false; // 무시할 키는 체크하지 않음
        return value === null || value === undefined || value === ""; // 값이 비어있는지 확인
      });
    },
    getCurrentDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    },
    getCurrentDateTime() {
      const now = new Date();
      const yyyy = now.getFullYear();
      const MM = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
      const dd = String(now.getDate()).padStart(2, "0");
      const HH = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");

      return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
    },
    positiveNumberInput(event) {
      return event.target.value.replace(/[^0-9]/g, "");
    },
  },
};
</script>
<style lang="css" scoped>
  ::v-deep .grid-border-none{
    height: calc(50% - 40px);
  }
</style>