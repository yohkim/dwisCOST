<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3" class="period">
          <div class="form-floating me-1">
            <date-picker label="From" v-model="params.startDate" />
            <label for="floatingPicker">From</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="To" v-model="params.endDate" />
            <label for="floatingPicker">To</label>
          </div>
        </b-col>
        <b-col cols="1">
          <b-form-checkbox v-model="allChk" :disabled="(allChk && params['curProcess'] == null)">
            전체조회
          </b-form-checkbox>
        </b-col>
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.curProcess" @change="onProcessChange">
              <option v-for="(item, index) in processList" :key="index" :value="item.sysResourceId">
                {{ item.sysResourceName }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>
        <b-col cols="2" v-if="params['curProcess'] != null && Number(params['curProcess']) < 18">
          <div class="form-floating lot_run_num">
            <input type="text" class="form-control label-80" id="floating" placeholder="Lot No" v-model="params.lotNo" 
              data-group="params"
              name="lotNo"
              ref="lotNoField"
              @input="convertToUpperEnglish"
              @mousedown="handleMouseDown($event, 'lotNoField')"
              autocomplete="off"/>
            <label for="floating">Lot No</label>
          </div>
        </b-col>
        <b-col cols="2" v-if="params['curProcess'] != null && Number(params['curProcess']) > 18">
          <div class="form-floating lot_run_num">
            <input type="text" class="form-control label-80" id="floating" placeholder="Run No" v-model="params.RunNo" 
              data-group="params"
              ref="runNoField"
              name="runNo"
              @input="convertToUpperEnglish"
              @mousedown="handleMouseDown($event, 'runNoField')"
              autocomplete="off"/>
            <label for="floating">Run No</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area refresh">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>

    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="detailPopup" v-if='["022","023","027","033","035","037","040","043","047","050","055","056","054","058","059","061","067"].includes(params.curProcess)'>카세트 상세 조회</b-button>
          <b-button class="second" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="manufacturingWorkStatusGrid" :uid="'manufacturingWorkStatusGrid'" :rows="rows" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
    </div>
    <ManufacturingWorkStatusDetailPopup ref="manufacturingWorkStatusDetailPopup"/>
  </div>
</template>

<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';
const { ValueType } = require('realgrid');
import ManufacturingWorkStatusDetailPopup from '@components/ManufacturingWorkStatusDetailPopup.vue';

export default {
  props: {},
  components: {
    ManufacturingWorkStatusDetailPopup
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {
    'params.curProcess'(newVal, oldVal) {
      if(oldVal == '' || newVal != oldVal){
        this.reCreated(newVal);
        if(newVal != null){
          this.$nextTick(()=>{
            this.allChk = false;
          });
        }
      }else if(newVal == '' || newVal == null){
        this.initializeGridCreated();
      }
		},
    "allChk"(newVal) {
      if(newVal){
        if(this.params.curProcess !== null){
          this.params.curProcess = null;
        }else{
          this.reCreated(this.params.curProcess);
        }
      }
    }
  },
  data() {
    return {
      manufacturingWorkStatusGrid: null,
      rows: [],
      params: {
        startDate: null,
        endDate: null,
        curProcess: null,
        lotNo: null,
        runNo: null,
        status: null,
      },
      dynamic: {
        layout: null,
      },
      isDisabled: true,
      allChk: false,
      schCurProcess: null,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    prodCtg() {
      return this.userAuthInfo.selectedProdCtg;
    },
    isCurProcess(){
      return _.isNil(this.params.curProcess);
    }
  },
  created() {
    this.initializeMenu();
    this.initializeGrid();
  },
  mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    async reCreated(newVal){

      let result = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch10", 
        queryParams: { ...this.params, line: 'D1UT', "자동여부": (newVal == '023' ? 1 : 0), '공정코드': newVal }
      });

      let result1 = await this.$axios.api.search({menuId: "M0003005", queryId: "M0003005_Sch21", 
        queryParams: { ...this.params, line: 'D1UT', "자동여부": (newVal == '023' ? 1 : 0), '공정코드': newVal }
      });

      this.manufacturingWorkStatusGrid.fields = [];
      this.manufacturingWorkStatusGrid.columns = [];

      let gsfc1 = null;
      let gsfc2 = null;

      let pValueCallback = (grid, column, footerIndex, columnFooter, value)=>{
        var sum = 0;
        var prod = grid.getDataSource();
        let rows = grid.getFilteredRows();
        for(let row of rows){            
          if(prod.getValue(row, 'rn') == 1){
            sum += prod.getValue(row, column.fieldName);
          }
        }
        return sum;  
      };
      if((newVal && newVal >= 23)){
        gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.NUMBER, "c", {width: 80, numberFormat: "#,##0", styleName: "tr", autoFilter: true,
          footer: {
            numberFormat: "#,##0",
            valueCallback: pValueCallback
          }
        }, {styleName: 'multiline-header1'});
        gsfc2 = this.$utils.generateSeparatedFieldsAndColumns(result1, "불량코드", "불량명", ValueType.NUMBER, "c", {width: 80, numberFormat: "#,##0", styleName: "tr", autoFilter: true,
          footer: {
            numberFormat: "#,##0",
            valueCallback: pValueCallback
          }
        }, {styleName: 'multiline-header1'});
      }else{
        gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.NUMBER, "c", { width: 80, numberFormat: "#,##0", styleName: "tr", autoFilter: true, footer: { expression: "sum", numberFormat: "#,##0", styleName: "tr"} }, {styleName: 'multiline-header1'});
        gsfc2 = this.$utils.generateSeparatedFieldsAndColumns(result1, "불량코드", "불량명", ValueType.NUMBER, "c", { width: 80, numberFormat: "#,##0", styleName: "tr", autoFilter: true, footer: { expression: "sum", numberFormat: "#,##0", styleName: "tr"} }, {styleName: 'multiline-header1'});
      }
      
        
      this.manufacturingWorkStatusGrid.fields = [
        ...this.manufacturingWorkStatusGrid.orgFields,
        ...gsfc1.fields,
        ...gsfc2.fields,
      ];
  
      this.manufacturingWorkStatusGrid.columns = [
        ...((newVal && newVal >= 23) ? this.manufacturingWorkStatusGrid.orgColumns2 : this.manufacturingWorkStatusGrid.orgColumns1),
        ...gsfc1.columns,
        ...gsfc2.columns,
      ];

      this.manufacturingWorkStatusGrid.layout = [
        ...((newVal && newVal >= 23) ? this.manufacturingWorkStatusGrid.orgLayout2 : this.manufacturingWorkStatusGrid.orgLayout1),
        ...[{
          name: "불량현황",
          direction: "horizontal",
          items: [],
          header:{ text: "불량현황" }
        }],
        ...[{
          name: "시료현황",
          direction: "horizontal",
          items: [],
          header:{ text: "시료현황" }
        }],
      ];
      try {
        this.manufacturingWorkStatusGrid.layout[this.manufacturingWorkStatusGrid.layout.length-2].items = result.map((defect) => ("c"+defect["불량코드"]));        
        this.manufacturingWorkStatusGrid.layout[this.manufacturingWorkStatusGrid.layout.length-1].items = result1.map((defect) => ("c"+defect["불량코드"]));
      } catch (error) {
        console.error('불량현황 생성중 오류', error);
      }
      let result2 = [...result, ...result1];
      this.dynamic.layout = result2.map(defect => ({
        value: defect["불량코드"],
        text: `c${defect["불량코드"]}`
      }));

      this.$nextTick(() => {
        this.manufacturingWorkStatusGrid.options.footers = { visible: !this.allChk, items:[ { height: 50 } ] };
        this.$refs.manufacturingWorkStatusGrid.created();
      });

      this.searchClick();
    },
    getGridView() {
      return this.$refs.manufacturingWorkStatusGrid?.getGridView();
    },
    getDataProvider() {
      return this.$refs.manufacturingWorkStatusGrid?.getGridDataProvider();
    },
    initializeGridCreated(){
      this.manufacturingWorkStatusGrid.fields = [];
      this.manufacturingWorkStatusGrid.columns = [];
        
      this.manufacturingWorkStatusGrid.fields = [
        ...this.manufacturingWorkStatusGrid.orgFields
      ];
  
      this.manufacturingWorkStatusGrid.columns = [
        ...this.manufacturingWorkStatusGrid.orgColumns1
      ];

      this.manufacturingWorkStatusGrid.layout = [
        ...this.manufacturingWorkStatusGrid.orgLayout1
      ];

      this.$nextTick(() => {
        this.manufacturingWorkStatusGrid.options.footers = { visible: false };
        this.$refs.manufacturingWorkStatusGrid.created();
      });
    },
    initializeGrid() {
      this.manufacturingWorkStatusGrid = _.cloneDeep(require(`./js/ManufacturingWorkStatus.js`));
      this.manufacturingWorkStatusGrid.options.filtering.automating.textCategoryCallback = this.textCategoryCallback;

      this.initializeGridCreated();
    },
    textCategoryCallback(column, values){
      return this.$utils.textCategoryCallback(column, this.getGridView());
    },

    initializeMenu() {
      this.processList = this.userAuthInfo.getRoleProcessList();
    },
    async getSelectOptions() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneDayAgo = new Date();
      oneDayAgo.setDate(current.getDate());
      this.params.startDate = `${oneDayAgo.getFullYear()}-${(oneDayAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneDayAgo.getDate().toString().padStart(2, '0')}`;
    },
    onProcessChange() {
      this.params.facility = null;
      this.getSelectFacilityOptions();
    },
    async getSelectFacilityOptions() {
      let queryParams = { code: this.params.curProcess };
      this.facilityList = [{ value: null, text: "선택없음" }];
      let param = [
        {
          menuId: 'R0003005',
          queryId: 'getFacility',
          queryParams: queryParams,
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['설비번호', '설비약명'], this.facilityList);
            this.facilityList.unshift({ value: null, text: "선택없음" });
          },
        },
      ];
      await this.$axios.api.searchAll(param);
    },
    clearClick() {
      this.params = this.$utils.createObjectWithNullValues(this.params);
      this.getSelectOptions();
    },
    async searchClick() {
      if (!this.$utils.validateStartDateEndDate(this.params.startDate, this.params.endDate)) {
        return;
      }
      this.schCurProcess = this.params['curProcess'];
      await this.$axios.api.search({
        menuId: "R0000000",
        queryId: _.isNil(this.params["curProcess"]) ? "R0000000_Sch1" : (!_.isNil(this.params["lotNo"]) && (this.params["curProcess"] == '017' || this.params["curProcess"] == '020') ? "R0000000_Sch3" 
          : (["072","068","070","073"].includes(this.params["curProcess"]) ? "R0000000_Sch12" : "R0000000_Sch2")
        ),
        queryParams: {...this.params, columns: this.dynamic.layout },
        target: this.rows,
      });
    },
    async excelClick() {
      const grid = this.getGridView();

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      let fileName = "";
      if(this.schCurProcess == null){
        fileName = `전체조회_공정별_작업이력${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      }else{
        let process = this.processList.filter(item => item.sysResourceId == this.schCurProcess);
        fileName = `${process[0].sysResourceName} (${this.schCurProcess})_공정별_작업이력${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
      }
      let that = this;
      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        separateRows: true,
        done: function () {
          that.$toast("info", "엑셀 내보내기가 완료되었습니다.");        
        },
      };

      grid.exportGrid(options);
    },

    detailPopup(){
      this.$refs.manufacturingWorkStatusDetailPopup.openDialog(this.params);
    },

    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },

    handleMouseDown(event, target) {
      const input = this.$refs[target];
      if (input && input.value) {
        event.preventDefault();
        input.select();
      }
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackManufacturingWorkStatusGrid(grid, cell){
      let rtn = {};
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(cell.index.dataRow);
      const fieldName = cell.index.fieldName;
      if(fieldName == 'poNo' || (jsonData["area"] == 'Front' && fieldName == 'lotNo') || ((jsonData["area"] == 'Back#1' || jsonData["area"] == 'Back#2 Cassette QC' || jsonData["area"] == 'Back#2 Cell QC'  || jsonData["area"] == 'Rework') && fieldName == 'runNo')
        || fieldName == 'machineCode' || fieldName == '설비명' || fieldName == '설비약명' || fieldName == 'chamber' || fieldName == 'panelId'
      ){
        rtn['renderer'] = {
          type: "link",
          urlCallback: function (grid, cell) {

          },
          titleField: "fieldName"
        }    
      }      
      return rtn
    },
    
    onCellItemClickedManufacturingWorkStatusGrid(grid, index, clickData) {
      if (clickData.type == "link" && clickData.url) {
        let ds = grid.getDataSource();
        let current = grid.getCurrent();
        let jsonData = ds.getJsonRow(current.dataRow);
        // 권한은 나중에 추가.
        if(clickData.fieldName == "poNo" || (jsonData["area"] == 'Front' && clickData.fieldName == "lotNo") || ((jsonData["area"] == 'Back#1' || jsonData["area"] == 'Back#2 Cassette QC' || jsonData["area"] == 'Back#2 Cell QC' || jsonData["area"] == 'Rework') && clickData.fieldName == "runNo")
          || clickData.fieldName == 'machineCode' || clickData.fieldName == '설비명' || clickData.fieldName == '설비약명' || clickData.fieldName == 'chamber' || clickData.fieldName == "panelId"
        ){
          try {
            let machineFlag = clickData.fieldName == 'machineCode' || clickData.fieldName == '설비명' || clickData.fieldName == '설비약명' || clickData.fieldName == 'chamber';
            const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, clickData.fieldName == "poNo" ? '기준정보' : (machineFlag ? '프로세스 플래닝' : '제조 실적 입력'));
            const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, clickData.fieldName == "poNo" ? '제품수주서 입력' : (machineFlag ? '설비 마스터' : (clickData.fieldName == "panelId" ? 'FRONT' : jsonData["area"].toUpperCase())));
            let idx = menu2.childSysResc.findIndex((item)=>{ 
              if(jsonData["area"].toUpperCase() == 'REWORK'){
                return item.sysResourceName == '생산 실적 입력';
              }else{
                return item.sysResourceName == '제조 실적 입력';
              }
            });
            this.$eventBus.emit('menuMoveClick', { menu: clickData.fieldName == "poNo" ? this.$utils.createMenuData(menu1, menu2) : this.$utils.createMenuData(menu1, menu2, (clickData.fieldName == "panelId" ? menu2.childSysResc[2] : menu2.childSysResc[idx])), 
            callback: () => { 
              this.$eventBus.emit( clickData.fieldName == "poNo" ? 'M0006001MenuMove' : (machineFlag ? 'TAB008000MenuMove' : (clickData.fieldName == "panelId" ? "TAB020000MenuMove" : (jsonData["area"].toUpperCase() == 'REWORK' ? 'Back1MenuMove' : jsonData["area"].replace('#', '').replace(/\s+/g, '')+'MenuMove'))), jsonData);
            }});            
          } catch (error) {
            console.error('제조 작업 현황 메뉴 이동중', error)
            return false; 
          }        
        }
        return false;
      }
    },

    onCellClickedManufacturingWorkStatusGrid(grid, clickData) {
      if (clickData.cellType === "head" && clickData.subType === "indicator") {
        let itemCount = grid.getItemCount();
        let col = grid.getDisplayColumns();
        let sel = {
          style: "block",
          startItem: 0,
          startColumn: col[0].name,
          endItem: itemCount,
          endColumn: col[col.length - 1].name,
        };
        grid.setSelection(sel);
      }
    },

    onLayoutCollapsedManufacturingWorkStatusGrid(grid, layout) {
      if(layout == 'group1'){
        let group = grid.layoutByName("group1");
        group.header.text = "요약";
        /*let column = grid.columnByName("runNo");
        column.mergeRule = null;
        grid.refresh();*/
      }
    },

    onLayoutExpandedManufacturingWorkStatusGrid(grid, layout){
      if(layout == 'group1'){
        let group = grid.layoutByName("group1");
        group.header.text = "상세";
        /*let column = grid.columnByName("runNo");
        column.mergeRule = {
          criteria: "values['차수'] + value"
        };
        grid.refresh();*/
      }
    }
  }    
}
</script>
<style lang="scss" scoped>
::v-deep .period{
	width: 20%!important;
	}
  ::v-deep .status{
	width: 12.5%!important;
	}
:deep .rg-fixed-footer{
 border-top: 2px solid  #E56615; 
} 
:deep .rg-footer{
 border-top: 2px solid #E56615; 
 font-weight: bold;
}
</style>