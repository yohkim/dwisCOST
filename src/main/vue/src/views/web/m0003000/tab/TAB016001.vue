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
              v-model="localModel"
              @change="onModelChange"
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
              v-model="localWorkType"
              @change="onWorkTypeChange"
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
            <date-picker label="시작일" :value="startDate" @change="onStartDateChange" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" :value="endDate" @change="onEndDateChange" />
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
        <div class="title">Lot 정보</div>
      </div>
      <RealGrid
        ref="LotCardGrid"
        :uid="'LotCardGrid'"
        :rows="rows2"
        style="width: 100%;  height: calc(50% - 40px)"
          class="grid-border-none"
      />
      <div class="left_box top-border">
        <div class="title">Run Card</div>
        <div class="ms-auto">
          <b-button @click="cancelRunCard" class="sub">취소</b-button>
          <b-button @click="displayProcessPlan" class="second">공정확인</b-button>
          <!--<b-button @click="printRunCard2" class="second">공카드인쇄</b-button>-->
		      <b-button @click="printRunCard" class="main">Back#1 카드 인쇄</b-button>
          <b-button @click="popupRunCard2" class="second">Back#2 카드 인쇄</b-button>
        </div>
      </div>
      <RealGrid
        ref="RunCardGrid"
        :uid="'RunCardGrid'"
        :rows="rows1"
        style="width: 100%;"
         class="grid-border-none"
      />
    </div>
    <CmDialog1 ref="cmDialog1TAB016000"/>
    <RunCard ref="runCard"/>
    <RunCard2 ref="runCard2"/>
    <RunCard2Popup ref="runCard2Popup" @confirm="printRunCard2ByPopup"/>
  </div>
</template>

<script>
const URI_PREFIX = "/api/m0003000/m0003007";
import RunCard from "./RunCard.vue";
import RunCard2 from "./M_RunCard.vue";
import RunCard2Popup from "./RunCard2Popup.vue";
export default {
  name: "DW_TAB016001",
  props: {
    modelList: {
      type: Array, 
      required: true, 
    },
    workTypeList: {
      type: Array, 
      required: true, 
    },
    selectedModel: {
      type: Object, 
      required: true, 
    },
    selectedWorkType: {
      type: Object, 
      required: true, 
    },
    startDate: {
      type: String, 
      required: true, 
    },
    endDate: {
      type: String, 
      required: true, 
    },
  },
  components: {RunCard,RunCard2,RunCard2Popup},
  data() {
    return {
      //modelList: [], // Example product types
      //selectedModel: null, //'HD', // Currently selected product type
      //workTypeList: [], // Example work types
      //selectedWorkType: null, // Currently selected work type
      //startDate: "", // Start date for 수주일자
      //endDate: "", // End date for 수주일자
      localModel:null,
      localWorkType:null,
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
  watch: {
		'selectedModel': {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					if (newValue) {
						this.localModel=newValue;
					}
				});
			},
			immediate: false, // 컴포넌트가 생성될 때 초기 실행 (필요에 따라 삭제 가능)
			deep: true, // 중첩된 객체의 변화를 감지하려면 추가
		},
    'selectedWorkType': {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					if (newValue) {
						this.localWorkType=newValue;
					}
				});
			},
			immediate: false, // 컴포넌트가 생성될 때 초기 실행 (필요에 따라 삭제 가능)
			deep: true, // 중첩된 객체의 변화를 감지하려면 추가
		},
	},
  created() {
    this.initializeGrid();
  },
  async mounted() {
  },
  beforeUnmount() {},
  methods: {
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
      let param = [
	  {
        menuId: "M0003007",
        queryId: "getRunCards",
        queryParams: queryParams,
        target: this.rows1,
      },
  	  {
	    menuId: "M0003007",
	    queryId: "getLotInfoByRunAll",
	    queryParams: queryParams,
	    target: this.rows2,
	  },
	  ];
	  
      await this.$axios.api.searchAll(param);
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
      this.$refs.cmDialog1TAB016000.openDialog(params);
    },
    exportToExcel() {
      // Logic to export the order list to Excel
      console.log("Exporting to Excel...");
    },
    async popupRunCard2(){
      if(_.isNil(this.runNo)){
        this.$toast("error", "선택하신 Runcard가 없습니다.");
        return;
      }
      let qp = {};
      qp['runNo'] = this.runNo;
      let runInfo=[];
      let param = {menuId:'M0003007',queryId:'getPrintRunCard2Info',queryParams:qp, target: runInfo};
      await this.$axios.api.search(param);	      
      //this.$toast('warning',JSON.stringify(runInfo[0], null, 2));
      if(runInfo.length==0){
        this.$toast("error", "RunCard 데이터를 가져 올 수 없습니다.");
        return;
      }
      this.$refs.runCard2Popup.openDialog(runInfo[0]);
    },
    async printRunCard2ByPopup(params) {
      await this.$refs.runCard2.loadExcel();
      await this.$refs.runCard2.addDataToExcel(params);
      await this.$refs.runCard2.downloadExcel(this.runNo);
    },
    async printRunCard(){
      if(_.isNil(this.runNo)){
        this.$toast("error", "선택하신 Runcard가 없습니다.");
        return;
      }
      let qp = {};
      qp['runNo'] = this.runNo;
      let runInfo=[];
      let lotList=[];
      let param1 = {menuId:'M0003007',queryId:'getPrintRunCard1Info1',queryParams:qp, target: runInfo};
      let param2 = {menuId:'M0003007',queryId:'getPrintRunCard1Info2',queryParams:qp, target: lotList};
      await this.$axios.api.searchAll([param1,param2]);	
      if(runInfo.length==0){
        this.$toast("error", "RunCard 데이터를 가져 올 수 없습니다.");
        return;
      }
      await this.$refs.runCard.loadExcel();
      this.$refs.runCard.addDataToExcel({runInfo:runInfo[0],lotList});
      await this.$refs.runCard.downloadExcel(this.runNo);
    },
    async printRunCard2(){
      if(_.isNil(this.runNo)){
        this.$toast("error", "선택하신 Runcard가 없습니다.");
        return;
      }
      let qp = {};
      qp['runNo'] = this.runNo;
      let runInfo=[];
      let param = {menuId:'M0003007',queryId:'getPrintRunCard2Info',queryParams:qp, target: runInfo};
      await this.$axios.api.search(param);	      	      
      //this.$toast('warning',JSON.stringify(runInfo[0], null, 2));
      if(runInfo.length==0){
        this.$toast("error", "RunCard 데이터를 가져 올 수 없습니다.");
        return;
      }
      await this.$refs.runCard2.loadExcel();
      await this.$refs.runCard2.addDataToExcel(runInfo[0]);
      await this.$refs.runCard2.downloadExcel(this.runNo);
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
        // let resp = await this.$axios.api.search(param);
        // this.$toast("info", "선택하신 Runcard를 취소하였습니다.");
			  let resp = await this.$axios.api.search(param);
			  if (!_.isNil(resp[0].message))
			    this.$toast("info", resp[0].message);
			  else if (!_.isNil(resp[0].errormessage))
			    this.$toast("error", resp[0].errormessage);
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
    onModelChange(e){
      let params = {
        name:"selectedModel",
        value : this.localModel
      }
      this.$emit("update",params);
    },
    onWorkTypeChange(e){
      let params = {
        name:"selectedWorkType",
        value : this.localWorkType
      }
      this.$emit("update",params);
    },
    onStartDateChange(e){
      let params = {
        name:"startDate",
        value : e.target.value
      }
      this.$emit("update",params);
    },
    onEndDateChange(e){
      let params = {
        name:"endDate",
        value : e.target.value
      }
      this.$emit("update",params);
    }
  },
};
</script>
<style lang="css" scoped>
  ::v-deep .grid-border-none{
    height: calc(50% - 40px);
  }
</style>