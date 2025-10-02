<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'전체 작업 현황'"
    no-close-on-backdrop    
    :style="{
    zIndex: zIndex
    }"
    content-class="custom-modal-content-overall-work-status1"
    dialog-class="custom-modal-dialog-overall-work-status1"
    centered
  >   
    <div class="row mb-1">
      <RealGrid ref="overallWorkStatusPopup1Grid" :uid="'overallWorkStatusPopup1Grid'" :rows="rows"/>
    </div>
    <template v-if="['072','069'].includes(params['공정코드'])">              
      <div class="etc mt-1"> 
        <div class="title">불량사항</div>
        <RealGrid ref="overallWorkStatusPopup1Grid1" :uid="'overallWorkStatusPopup1Grid1'" :rows="rows2"/>
      </div>
      <SampleInfoStatus ref="sampleInfoStatus" v-show="['072','070','073'].includes(params['공정코드'])"/>      
      <b-row class="mt-2">
        <b-col>
          <div class="col-4">
            <div class="d-flex mb-1">
              <b-button class="none">미진행 : {{notProgCnt}}</b-button>                        
            </div>
          </div>
          <RealGrid ref="overallWorkStatusPopup1Grid2" :uid="'overallWorkStatusPopup1Grid2'" :rows="rows4" :style="`height: 460px`"/>      
        </b-col>
        <b-col>
          <div class="d-flex  mb-1">                    
            <b-button class="good">양품 : {{successCnt}}</b-button>                        
          </div>
          <RealGrid ref="overallWorkStatusPopup1Grid3" :uid="'overallWorkStatusPopup1Grid3'" :rows="rows5" :style="`height: 460px`"/>      
        </b-col>
        <b-col>
          <div class="d-flex  mb-1">
            <b-button class="error">불량 : {{errorCnt}}</b-button>
          </div>                
          <RealGrid ref="overallWorkStatusPopup1Grid4" :uid="'overallWorkStatusPopup1Grid4'" :rows="rows6" :style="`height: 460px`"/>      
        </b-col>
      </b-row>            
    </template>
    <template v-else>
      <div class="etc mt-1" v-if="['073','070','068'].includes(params['공정코드'])">
        <div class="title">불량사항</div>
        <RealGrid ref="overallWorkStatusPopup1Grid1" :uid="'overallWorkStatusPopup1Grid1'" :rows="rows2"/>
      </div>
      <SampleInfoStatus ref="sampleInfoStatus" v-show="['072','070','073'].includes(params['공정코드'])"/>      
      <RealGrid ref="overallWorkStatusPopup1Grid2" :uid="'overallWorkStatusPopup1Grid2'" :rows="rows4" :style="`height: 460px`"/> 
    </template>
    <div class="bttn_wrap">
      <b-button  block @click="closeDialog">닫기</b-button>
      <b-button  class="main" block v-show="this.params.isEditabled" @click="actionClick">저장</b-button>
    </div>
    <ProcessingMapping2 ref="processingMapping2"/>
  </b-modal>
</template>

<script>

const { ValueType, RowState } = require('realgrid');
import SampleInfoStatus from '@components/SampleInfoStatus.vue';
import ProcessingMapping2 from "@web/popup/ProcessingMapping2";

export default {
  name: "OverallWorkStatusPopup",
  props: {},
  components: {
    SampleInfoStatus,
    ProcessingMapping2
  },
  data() {
    return {
      overallWorkStatusPopup1Grid: null,
      overallWorkStatusPopup1Grid1: null,
      overallWorkStatusPopup1Grid2: null,
      overallWorkStatusPopup1Grid3: null,
      overallWorkStatusPopup1Grid4: null,
      isOpen: false,
      rows: [],
      rows1: [],
      rows2: [],
      rows4: [],
      rows5: [],
      rows6: [],
      params: {
      },
      zIndex: 0,
      dynamic: {
        layout1: [],
      },
      notProgCnt: 0,
      successCnt: 0,
      errorCnt: 0,
    };
  },
  computed: {},
  created() {
    },
  watch: {},
  methods: {
    GV1() {
      return this.$refs.overallWorkStatusPopup1Grid?.getGridView();
    },
    DP1() {
      return this.$refs.overallWorkStatusPopup1Grid?.getGridDataProvider();
    },
    GV2() {
      return this.$refs.overallWorkStatusPopup1Grid1?.getGridView();
    },
    DP2() {
      return this.$refs.overallWorkStatusPopup1Grid1?.getGridDataProvider();
    },
    GV3() {
      return this.$refs.overallWorkStatusPopup1Grid2?.getGridView();
    },
    DP3() {
      return this.$refs.overallWorkStatusPopup1Grid2?.getGridDataProvider();
    },
    GV4() {
      return this.$refs.overallWorkStatusPopup1Grid3?.getGridView();
    },
    DP4() {
      return this.$refs.overallWorkStatusPopup1Grid3?.getGridDataProvider();
    },
    GV5() {
      return this.$refs.overallWorkStatusPopup1Grid4?.getGridView();
    },
    DP5() {
      return this.$refs.overallWorkStatusPopup1Grid4?.getGridDataProvider();
    },
    getGrid1(code) {
      switch (code) {
        case '072':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
        case '068':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_2.js`));
        case '070':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_3.js`));        
        case '073':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_3.js`));        
        case '069':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
      }
    },
    getGrid2(code) {
      switch (code) {
        case '072':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
        case '068':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_2.js`));
        case '070':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_3.js`));
        case '073':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_3.js`));
        case '069':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
      }
    },
    openDialog(params) {
      Object.assign(this.params, params);
      this.$nextTick(() => {
        //if(this.type == 'back#2CassetteQc'){
          this.overallWorkStatusPopup1Grid = this.getGrid1(this.params['공정코드']);
          this.overallWorkStatusPopup1Grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_3.js`));
          this.overallWorkStatusPopup1Grid2 = this.getGrid2(this.params['공정코드']);
          this.overallWorkStatusPopup1Grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_5.js`));
          this.overallWorkStatusPopup1Grid4 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_6.js`));

          this.$refs.overallWorkStatusPopup1Grid.created();
          this.$refs.overallWorkStatusPopup1Grid1.created();
          this.$refs.overallWorkStatusPopup1Grid2.created();

          if(['072','069'].includes(params['공정코드'])){
            this.$refs.overallWorkStatusPopup1Grid3.created();
            this.$refs.overallWorkStatusPopup1Grid4.created();
          }

          this.searchGridFields();
        //}
        this.zIndex = this.$zIndexManager.next();
        this.searchData().then(()=>{
          this.isOpen = true;
          this.GV1().setCurrent({ dataRow: 0, fieldName: "차수" });  
          if(['072','070','073'].includes(params['공정코드'])){
            let loadParams = { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] };
            this.$refs.sampleInfoStatus.loadData(loadParams);        
          }
        });            
      });
    },
    async searchGridFields(){

      let result = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch5", 
        queryParams: { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] }
      });

      if(['072','069','070','068','073'].includes(this.params['공정코드'])){
        this.overallWorkStatusPopup1Grid1.fields = [];
        this.overallWorkStatusPopup1Grid1.columns = [];
        let gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.INT, "c", { styleName: "tr" });
        
        this.overallWorkStatusPopup1Grid1.fields = [
          this.overallWorkStatusPopup1Grid1.orgFields[0],
          ...gsfc1.fields,
        ];
  
        this.overallWorkStatusPopup1Grid1.columns = [
          this.overallWorkStatusPopup1Grid1.orgColumns[0],
          ...gsfc1.columns,
        ];
        
        this.overallWorkStatusPopup1Grid1.layout[1].items = result.map((defect) => ("c"+defect["불량코드"]));
        this.dynamic.layout1 = result.map(defect => ({
          value: defect["불량코드"],
          text: `c${defect["불량코드"]}`
        }));

        if(['070','068','073'].includes(this.params['공정코드'])){
          this.overallWorkStatusPopup1Grid1.options.display.rowHeight = 28;
        }else if(['072'].includes(this.params['공정코드'])){
          this.overallWorkStatusPopup1Grid1.options.display.rowHeight = 45;
        }
      }

      this.$nextTick(() => {
        this.$refs.overallWorkStatusPopup1Grid1.created();
      });
		},
    closeDialog() {
      if(this.DP1())this.$refs.overallWorkStatusPopup1Grid.destroy();
      if(this.DP2())this.$refs.overallWorkStatusPopup1Grid1.destroy();
      if(this.DP3())this.$refs.overallWorkStatusPopup1Grid2.destroy();
      if(this.DP4())this.$refs.overallWorkStatusPopup1Grid3.destroy();
      if(this.DP5())this.$refs.overallWorkStatusPopup1Grid4.destroy();
      this.$zIndexManager.release();
      this.isOpen = false;
    },

    async searchData(){

      let params = {
        runNo: this.params.runNo,
        line: 'D1UT',
        "자동여부": 0,
        '공정코드': this.params['공정코드'],
        'code': this.params['공정코드'],
      };	

      let searchParam = [
        {menuId: "M0003003", queryId: "M0003003_Sch10", queryParams: params, target: this.rows},
      ];

      let result = await this.$axios.api.searchAll(searchParam);

      let searchParam1 = [];
        params["차수"] = result[0][0]["차수"];
        params["pre공정코드"] = result[0][0]["pre공정코드"];
        if (['072','069'].includes(this.params['공정코드'])) {
          searchParam1.push(
            {menuId: "M0003003", queryId: "M0003003_Sch3", queryParams: params, target: this.rows4}, 
            {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '양품' }, target: this.rows5},
            {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '불량' }, target: this.rows6},
            {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2}
          );
        }else if (['068','070','073'].includes(this.params['공정코드'])) {
          searchParam1.push(
            {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2},            
            {menuId: "M0003003", queryId: "M0003003_Sch9", queryParams: params, target: this.rows4} 
          );
        }
        await this.$axios.api.searchAll(searchParam1);
    },

    async searchVersionData(version = 1){
      console.log("this.params['공정코드']", this.params['공정코드']);
      let params = {
        runNo: this.params.runNo,
        line: 'D1UT',
        "자동여부": 0,
        '공정코드': this.params['공정코드'],
        'code': this.params['공정코드'],
        '차수': version
      };

      let searchParam = [
        {menuId: "M0003003", queryId: "M0003003_Sch10", queryParams: params, target: this.rows},
      ];

      let result = await this.$axios.api.searchAll(searchParam);
      params["pre공정코드"] = result[0][0]["pre공정코드"];
      let searchParam1 = [];
      if (['072','069'].includes(this.params['공정코드'])) {
        searchParam1.push(
          {menuId: "M0003003", queryId: "M0003003_Sch3", queryParams: params, target: this.rows4}, 
          {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '양품' }, target: this.rows5},
          {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '불량' }, target: this.rows6},
          {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2}
        );
      }else if (['068','070','073'].includes(this.params['공정코드'])) {
        searchParam1.push(
          {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2},            
          {menuId: "M0003003", queryId: "M0003003_Sch9", queryParams: params, target: this.rows4} 
        );
      }

      await this.$axios.api.searchAll(searchParam1);
      if(['072','070','073'].includes(params['공정코드'])){
        this.$refs.sampleInfoStatus.loadVersionData(version);
      }
    },

    callSaveData(){
      return {update: []};
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/

    setCellStyleCallbackOverallWorkStatusPopup1Grid(grid, cell){
      let rtn = {};
      let current = grid.getCurrent();
      const fieldName = cell.index.fieldName;
      if(cell.index.dataRow == current.dataRow){
        rtn.styleName = "selected " + (["투입수량","양품수량","불량수량","시료수량","수율","검사수량","중복","bin1","bin2","out"].includes(fieldName) ? 'tr' : 'tl');        
      }else{
        rtn.styleName = (["투입수량","양품수량","불량수량","시료수량","수율","검사수량","중복","bin1","bin2","out"].includes(fieldName) ? 'tr' : 'tl');        
      }
      return rtn;
    },

    onCellClickedOverallWorkStatusPopup1Grid(grid, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(this.GV1())this.GV1().refresh(true);
      this.searchVersionData(jsonData["차수"])
    },

    onDataLoadComplatedOverallWorkStatusPopup1Grid2(grid) {
      this.notProgCnt = this.DP3().getRowCount();
    },

    onDataLoadComplatedOverallWorkStatusPopup1Grid3(grid) {
      this.successCnt = this.DP4().getRowCount();
    },

    onDataLoadComplatedOverallWorkStatusPopup1Grid4(grid) {
      this.errorCnt = this.DP5().getRowCount();
    },

    onCellClickedOverallWorkStatusPopup1Grid4(grid, clickData) {
      if(clickData.cellType !== "data") return;
      if(clickData.fieldName == '맵핑유무'){
        let ds = grid.getDataSource();
        let current = grid.getCurrent();
        let jsonData = ds.getJsonRow(current.dataRow);
        this.$refs.processingMapping2.openDialog({
          ...this.params, 
          ...jsonData,
          model: this.rows[0]["제품모델"],
          isEditabled: false,
          isFilm: false,
        });
      }
      return true;
    },   
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-overall-work-status1 {
  max-width: 1600px !important;
  width: 100%;
}
.custom-modal-content-overall-work-status1 {
  width: 100%;
}
</style>

<style lang="scss" scoped>
::v-deep .d-flex{
  .btn-md{
    height:40px!important;
    width:120px !important;
    font-size: 16px!important;
    &.none{
      background: #fff959;      
    }
    &.good{
      background: #2f46c7;
      color: #fff;
    }
    &.error{
      background: #cc4827;
      color: #fff;
    }
  }
}
</style>
