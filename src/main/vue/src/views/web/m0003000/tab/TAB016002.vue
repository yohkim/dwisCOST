/**
*	제조 실적 입력 > Lot Run Card 발행 > Run Card 발행 > 미생성분
*/
<template>
  <div>
    <div border class="search_box">
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
            <date-picker label="종료일" :value="endDate" @change="onEndDateChange"/>
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
             <select
              class="form-select label-80"
              id="floatingSelect"
              v-model="selectedStackEquip"
            >
              <option
                v-for="equip in stackEquipList"
                :key="equip.value"
                :value="equip"
              >
                {{ equip.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">적층설비</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <select
              class="form-select label-80"
              id="floatingSelect"
              v-model="selectedProcEquip"
            >
              <option
                v-for="equip in procEquipList"
                :key="equip.value"
                :value="equip"
              >
                {{ equip.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">형상가공설비</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchLotInfo">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="title">Lot 정보</div>
        <div class="ms-auto d-flex">
        <div class="form-floating">
          <input
              autocomplete="off"
              type="text"
              class="form-control form-control-sm label-80 "
              id="floating"
              ref="runSizeField"
              v-model="runSize"
              @input="checkNumber"
              @keydown.enter="handleEnter"
              style="width:120px; font-size: 14px; font-weight: bold;"
          /> 
          <label for="floating" style="top: 3px; padding: 0 5px; font-size: 16px; color:  #0000FF; font-weight: bold;">Run Size:</label>
        </div>    
          <b-button @click="displayProcessPlan" class="second ms-2 me-2">공정확인</b-button>
          <b-button @click="createRunCard" class="second">생성처리</b-button>
          <b-button @click="saveRunCard" class="main">저장</b-button>
        </div>
      </div>
      <RealGrid
        ref="lotInfoGrid"
        :uid="'lotInfoGrid'"
        :rows="rows1"
        style="width: 100%; height: calc(50% - 40px)"
      class="grid-border-none"
      />
      <div class="left_box top-border">
        <div class="title">Run Card</div>
      </div>
      <RealGrid
        ref="createdRunInfoGrid"
        :uid="'createdRunInfoGrid'"
        :rows="rows2"
        style="width: 100%;"
        class="grid-border-none"
      />
    </div>
    <CmDialog1 ref="cmDialog1TAB016000" @confirm="handleConfirm" />
  </div>
</template>

<script>
const URI_PREFIX = "/api/m0003000/m0003007";
import html2pdf from "html2pdf.js";
import gridOption1 from "../js/TAB016002_1";
import { useUserAuthInfo } from "@store/auth/userAuthInfo";

export default {
  name: "DW_TAB016002",
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
  components: {},
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
  },	
  data() {
    return {
      localModel:null,
      localWorkType:null,
      stackEquipList:[],
      selectedStackEquip:{ value: null, text: null},
      procEquipList: [],
      selectedProcEquip:{ value:null, text: null},
      createdRunInfoGrid: null,
      lotInfoGrid: null,
      rows1: [],
      rows2: [],
      searchFlag: false, //조회 했는지 체크
      searchParams: null,
      status:"init",
      runNo:'',
      runSize:100,
    };
  },
  computed: {
    runNoBase() {
      if (_.isNil(this.selectedModel)) return "-";
      return `${this.selectedModel.text}B`;
    },
    lotInfoGV() {
      return this.$refs.lotInfoGrid.getGridView();
    },
    lotInfoDP() {
      return this.$refs.lotInfoGrid.getGridDataProvider();
    },
    RunInfoGV() {
      return this.$refs.createdRunInfoGrid.getGridView();
    },
    RunInfoDP() {
      return this.$refs.createdRunInfoGrid.getGridDataProvider();
    },
  },
  watch: {
		'selectedModel': {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					if (newValue) {
						this.localModel=newValue;
            this.getRunSize();
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
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    async getSelectOptions() {
      let param = [
        {
          menuId: "M0003007",
          queryId: "getStackEquip",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["설비번호", "설비약명"],
              this.stackEquipList
            );
          },
        },
        {
          menuId: "M0003007",
          queryId: "getProcEquip",
          callback: (data) => {
            this.$utils.transformData(
              data,
              ["value", "text"],
              ["설비번호", "설비약명"],
              this.procEquipList
            );
          },
        },
      ];
      await this.$axios.api.searchAll(param);
      this.stackEquipList.unshift({ value: null, text: ''});
      this.procEquipList.unshift({ value: null, text: ''});
    },
    async initializeGrid() {
      this.lotInfoGrid = _.cloneDeep(
        require(`@web/m0003000/js/TAB016002_1.js`)
      );
      this.createdRunInfoGrid = _.cloneDeep(
        require(`@web/m0003000/js/TAB016002_2.js`)
      );
    },
    async getRunSize(){
      let param = {
        menuId: "M0003007",
        queryId: "getRunSize",
        queryParams: {modelLabel:this.selectedModel.text},
      };

      let resp=await this.$axios.api.search(param);
      this.runSize = resp[0].runSize;
    },
    async searchLotInfo() {
      if (_.isNil(this.selectedModel) || _.isNil(this.selectedWorkType)) {
        this.$toast("error", "조회조건을 모두 입력해주세요.");
        return;
      }
      let queryParams = {
        modelCode: this.selectedModel.value,
        workCode: this.selectedWorkType.value,
        stackCode: this.selectedStackEquip.value,
        procCode: this.selectedProcEquip.value,
        startDate: this.startDate.replaceAll("-", ""),
        endDate: this.endDate.replaceAll("-", ""),
      };

      this.searchParams = queryParams;
      let param = {
        menuId: "M0003007",
        queryId: "getLotInfoForRunCreate",
        queryParams: queryParams,
        target: this.rows1,
      };

      await this.$axios.api.search(param);
      if(this.rows1.length==0) return;

      const workTypeChar = this.selectedWorkType.text.substring(1, 2);
      let targetArray=[];
      let getRunNoParam = {
        menuId: "M0003007",
        queryId: "getRunNo",
        queryParams: {
          modelLabel: this.selectedModel.text,
          workTypeChar,
          lastLotNo:this.rows1[this.rows1.length-1].lotNo
        },
        target: targetArray,
      };
      await this.$axios.api.search(getRunNoParam);
      
      if(targetArray.length>0)
        this.runNo = targetArray[0].runNo;

      this.searchFlag = true;
      this.RunInfoDP.setRows([]);
      this.setStatus("edit");
    },
    async displayProcessPlan(){
      let lotNo=null;
      let rows = this.lotInfoDP.getJsonRows(0,-1);
      let checkedRows = rows.filter((elem)=>{return elem["선택"] == true});
      if(this.status=="edit"&&checkedRows.length>0){
        let standardRow = checkedRows[0];
        lotNo = standardRow.lotNo;
      }
      else if(this.status=="created"&&this.lotInfoDP.getRowCount()>0){
        let standardRow = this.lotInfoDP.getJsonRow(0);
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
    async createRunCard(){
      // this.$confirm(
      //   "확인",
      //   "생성처리 후 저장버튼 클릭시 RUN이 생성 됩니다.",
      //   async (confirm) => {
          this.lotInfoGV.commit();
         // if (confirm) {
          let rows = this.lotInfoDP.getJsonRows(0,-1);
          let checkedRows = rows.filter((elem)=>{return elem["선택"] == true});
          if(checkedRows.length==0){
            this.$toast("info", "생성처리할 Lot을 선택해주세요.");
            return;
          }
          if(_.isNil(this.runSize)||this.runSize===''){
            this.$toast("info", "Run Size를 입력해주세요");
            return;
          }
          if( this.runSize < checkedRows[0].cell  && checkedRows.length > 1) {
            this.$toast('warning', `Run Size(${this.runSize})가 LOT Cell수(${checkedRows[0].cell})보다 작을때는 \n1개 LOT만 선택해서 진행 해야 합니다. (체크 수: ${checkedRows.length})`);
            return;
          }

          let lotList = '';
          for(let i =0; i<checkedRows.length;i++){
            if(i==checkedRows.length-1)
              lotList+=checkedRows[i].lotNo;
            else 
              lotList+=checkedRows[i].lotNo+',';
          }
          
          
          let queryParams = {
            lotList,
            runSize:parseInt(this.runSize),
            publisher: this.userAuthInfo.userInfo.userName,
            fabInDate: checkedRows[0]["입고일자"],
          };

          let createParam = {
            menuId: "M0003007",
            queryId: "runLotGenerate",
            queryParams: {lotList,runSize:this.runSize},
          }	
          let resp = await this.$axios.api.search(createParam);
         // this.$toast('info',JSON.stringify(resp1,null,2));
          if (!_.isNil(resp[0].errormessage)){
            this.$toast("error", resp[0].errormessage);
            return;
          }

          let param = [
            {
              menuId: "M0003007",
              queryId: "getRunCreatePreview",
              queryParams: queryParams,
              target: this.rows1,
            },
            {
              menuId: "M0003007",
              queryId: "getRunCreateList",
              queryParams: queryParams,
              target: this.rows2,
            },
          ];
                  
          //await this.$axios.api.search(createParam);
          await this.$axios.api.searchAll(param);
          let runList = '';
          let runRows = this.RunInfoDP.getJsonRows(0,-1);
          for(let i =0; i<runRows.length;i++){
            if(i==runRows.length-1)
              runList+=runRows[i].runNo;
            else
              runList+=runRows[i].runNo+',';
          }

          let updateParam = {
            menuId: "M0003007",
            queryId: "runLotUpdate",
            queryParams: {runList},
          };	
          //this.$toast("error",runList);	 
          //await this.$axios.api.search(updateParam);
          this.setStatus("created");
          this.$toast("warning", "특이사항 입력(옵션) 후 저장버튼을 눌러야 RUN이 생성 됩니다.");
          this.RunInfoGV.setCurrent({ dataRow: 0, fieldName: '특이사항' });
          setTimeout(() => {
            this.RunInfoGV.showEditor();
          }, 100);
    },
    async saveRunCard(){
      if(_.isNil(this.runSize)||this.runSize===''){
        this.$toast("info", "Run Size를 입력해주세요");
        return;
      }
      let rows = this.lotInfoDP.getJsonRows(0,-1);
      if(rows.length==0) return;
      this.RunInfoGV.commit();
      let standardRow = rows[0];
      this.$confirm(
          "확인",
          "생성하신 Run No를 저장 하시겠습니까?",
          async (confirm) => {
            if (confirm) {
              let lotList = '';
              for(let i =0; i<rows.length;i++){
                if(i==rows.length-1)
                  lotList+=rows[i].lotNo;
                else
                  lotList+=rows[i].lotNo+',';
              }
              let insertValue = {
                lotList,
                runSize: parseInt(this.runSize),
                publisher: standardRow["발행자"],
                fabInDate: standardRow["입고일자"].substring(0,10).replaceAll("-", ""),
                fabInTime: standardRow["입고일자"].substring(11,19).replaceAll(":", ""),
              };
              //console.log(insertValue);
              if (this.isObjectEmptyExcept(insertValue)) {
                this.$toast("error", "run 추가 정보를 모두 입력해주세요.");
                return;
              }
              let param = {
                menuId: "M0003007",
                queryId: "saveRunCard",
                queryParams: insertValue,
              };
              try {
                let resp = await this.$axios.api.search(param);
                let updateValue = this.RunInfoDP.getJsonRows(0,-1);
                //console.log(updateValue);
                let param2 = {
                    menuId: "M0003007",
                    update: [{ queryId: "saveRunRemarks", data: updateValue }],
                };

                let resp2 = await this.$axios.api.saveData(param2);
                if (!_.isNil(resp[0].message))
                  this.$toast("info", resp[0].message);
                else if (!_.isNil(resp[0].errormessage))
                  this.$toast("error", resp[0].errormessage+'111');
              } catch {
                this.$toast("error", "에러발생. 다시 작업해주세요.");
              } finally {
              }
            }
          }
        );
    },

    onCellEditedLotInfoGrid(grid, itemIndex, row, field) {
      grid.commit();
      
      const prod = grid.getDataSource();
      //field ==9 선택
      if(field == 9){
        const checkValue = grid.getValue(itemIndex,'선택');
        if(checkValue){
            grid.setValue(itemIndex,"입고일자",this.getCurrentDateTime());
            grid.setValue(itemIndex,"발행자",this.userAuthInfo.userInfo.userName);
        }
        else{
          grid.setValue(itemIndex,"입고일자",null);
          grid.setValue(itemIndex,"발행자",null);
        }   
      }
      grid.commit();
    },
    async searchWorkerInfo(target,itemIndex) {
      let params = {};
      params = {
        dialogTitle: "작업자 찾기",
	      popUpSize : 'sm',
        step: 7,
        height: 580,
        width: 700,
        target,
        itemIndex,
        gridJs: `CP0000000004.js`,
        search: { menuId: "CMDIALOG", queryId: "selectDwWorkerInfoMast" },
        showButton: false,
        confirmOnEnter: true,
      };
      this.$refs.cmDialog1TAB016000.openDialog(params);
    },
    
    exportToExcel() {
      // Logic to export the order list to Excel
      console.log("Exporting to Excel...");
    },
    async handleConfirm(params) {
      //console.log(params);
      let checkRow = params.gridView.getCheckedRows(true);
      //console.log(checkRow);
      if (checkRow.length > 0) {
        let row = params.dataProvider.getJsonRow(checkRow[0]);
        //console.log(row);
        if (params.gridJs == "CP0000000004.js") {
          this.lotInfoGV.setValue(params.itemIndex,params.target,row["작업자명"])
          this.lotInfoGV.commit();
        }
      }
    },
    //상태별 UI세팅
    setStatus(status){
      if(status=="edit"){
        this.lotInfoGV.setEditOptions({editable: true});
        this.lotInfoGV.setColumnLayout(gridOption1.layout);
      }
      else if(status=="created"){
        this.lotInfoGV.setEditOptions({editable: false});
        this.lotInfoGV.setColumnLayout(gridOption1.layoutCreated);
      }
      this.status = status;
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
    },
    handleEnter(event) {
      event.preventDefault(); // 기본 이벤트 방지
      this.$refs.runSizeField.focus();
      this.$refs.runSizeField.select();
    },
    checkNumber(el) {
      // 1) 숫자가 아닌 문자는 모두 제거
      el.target.value = el.target.value.replace(/[^0-9]/g, '');
    },
  },
};
</script>
<style lang="css" scoped>
::v-deep .period{
width: 20%!important;
}
::v-deep .grid-border-none{
  height: calc(50% - 40px);
}
::v-deep .top-border{
  border-top:1px solid #bcc0c8;
}

</style>
  
