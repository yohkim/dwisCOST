<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'전체 작업 현황'"
    no-close-on-backdrop    
    :style="{
    zIndex: zIndex
    }"
    content-class="custom-modal-content-overall-work-status"
    dialog-class="custom-modal-dialog-overall-work-status"
    centered
  >   
    <div class="row mb-1">
      <RealGrid ref="overallWorkStatusPopupGrid" :uid="'overallWorkStatusPopupGrid'" :rows="rows"/>
      <ErrorInfoStatus ref="errorInfoStatus"/>
      <SampleInfoStatus ref="sampleInfoStatus" v-show="['061','067'].includes(params['공정코드'])"/>   
    </div>
    <b-row>
      <b-col cols="4">
        <lot-and-pre-cst-info ref="lapci" :runNo="params['runNo']" :process="params['공정코드']" :isEditabled="false" :callSaveData="callSaveData"/>
      </b-col>
      <b-col>
        <RealGrid ref="overallWorkStatusPopupGrid1" :uid="'overallWorkStatusPopupGrid1'" :rows="rows1" :fitLayoutWidthEnable="false"/>
      </b-col>
    </b-row>
    <div class="bttn_wrap">
      <b-button  block @click="closeDialog">닫기</b-button>
      <b-button  class="main" block v-show="this.params.isEditabled" @click="actionClick">저장</b-button>
    </div>
    <CmDialog1 ref="cmDialog1"/>
    <CstTCntInput ref="cstTCntInput"/>
    <ErrorInput ref="errorInput"/>
    <ReliabilitySampleConfirmPopup ref="reliabilitySampleConfirmPopup"/>
  </b-modal>
</template>

<script>

import ErrorInfoStatus from '@components/ErrorInfoStatus.vue';
import LotAndPreCstInfo from '@components/LotAndPreCstInfo.vue';
import CstTCntInput from "@web/popup/CstTCntInput";
import ErrorInput from "@web/popup/ErrorInput";
import ReliabilitySampleConfirmPopup from "@web/popup/ReliabilitySampleConfirmPopup";
import SampleInfoStatus from '@components/SampleInfoStatus.vue';

export default {
  name: "OverallWorkStatusPopup",
  props: {},
  components: {
    ErrorInfoStatus,
    LotAndPreCstInfo,
    CstTCntInput,
    ErrorInput,
    ReliabilitySampleConfirmPopup,
    SampleInfoStatus
  },
  data() {
    return {
      overallWorkStatusPopupGrid: null,
      overallWorkStatusPopupGrid1: null,
      isOpen: false,
      rows: [],
      rows1: [],
      params: {
      },
      zIndex: 0,
    };
  },
  computed: {},
  created() {
    },
  watch: {},
  methods: {
    GV1() {
      return this.$refs.overallWorkStatusPopupGrid?.getGridView();
    },
    DP1() {
      return this.$refs.overallWorkStatusPopupGrid?.getGridDataProvider();
    },
    GV2() {
      return this.$refs.overallWorkStatusPopupGrid1?.getGridView();
    },
    DP2() {
      return this.$refs.overallWorkStatusPopupGrid1?.getGridDataProvider();
    },
    getGrid1(code) {
      switch (code) {
        case '054':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_1.js`));
        case '055':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_2.js`));
        case '056':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_3.js`));
        case '058':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_4.js`));
        case '059':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_4.js`));
        case '061':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_5.js`));
        case '067':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_5.js`));  
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_1.js`));
      }
    },
    getGrid2(code) {
      switch (code) {
        case '054':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_1.js`));
        case '055':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_2.js`));
        case '056':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_3.js`));
        case '058':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_4.js`));
        case '059':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_4.js`));
        case '061':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_5.js`));    
        case '067':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_5.js`));    
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_1.js`));
      }
    },
    openDialog(params) {
      Object.assign(this.params, params);
      this.$nextTick(() => {
        //if(this.type == 'back#2CassetteQc'){
          this.overallWorkStatusPopupGrid = this.getGrid1(this.params['공정코드']);
          this.overallWorkStatusPopupGrid1 = this.getGrid2(this.params['공정코드']);
          this.$refs.overallWorkStatusPopupGrid.created();
          this.$refs.overallWorkStatusPopupGrid1.created();
        //}
        this.zIndex = this.$zIndexManager.next();
        this.rows = [];    
        this.rows1 = [];
        this.searchData().then(()=>{
          this.isOpen = true;
          this.GV1().setCurrent({ dataRow: 0, fieldName: "차수" });
          let loadParams = { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] };
          this.$refs.errorInfoStatus.loadData(loadParams);
          this.$refs.sampleInfoStatus.loadData(loadParams);
        });            
      });
    },
    closeDialog() {
      this.$refs.overallWorkStatusPopupGrid.destroy();
      this.$refs.overallWorkStatusPopupGrid1.destroy();
      this.$zIndexManager.release();
      this.isOpen = false;
    },

    async searchData(){

      let params = {
        runNo: this.params.runNo,
        '공정코드': this.params['공정코드'],
        'code': this.params['공정코드']
      };

      let searchParam = [
        {menuId: "M0003002", queryId: "M0003002_Sch13", queryParams: params, target: this.rows},
      ];

      this.$refs.lapci.loadData();

      if (["054", "055"].includes(this.params['공정코드'])) {
        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch4", queryParams: params, target: this.rows1});
      }else if(["056", "058", "059"].includes(this.params['공정코드'])){
        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch10", queryParams: params, target: this.rows1});
      }else if(["061", "067"].includes(this.params['공정코드'])){
        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch15", queryParams: params, target: this.rows1});
      }

      let result = await this.$axios.api.searchAll(searchParam);
    },

    async searchVersionData(version = 1){

      let params = {
        runNo: this.params.runNo,
        '공정코드': this.params['공정코드'],
        'code': this.params['공정코드'],
        '차수': version
      };

      this.$refs.lapci.loadVersionData(version);

      let searchParam = [];

      if (["054", "055"].includes(this.params['공정코드'])) {
        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch22", queryParams: params, target: this.rows1});
      }else if(["056", "058", "059"].includes(this.params['공정코드'])){
        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch23", queryParams: params, target: this.rows1});
      }else if(["061", "067"].includes(this.params['공정코드'])){
        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch24", queryParams: params, target: this.rows1});
      }

      let result = await this.$axios.api.searchAll(searchParam);

      this.$refs.errorInfoStatus.loadVersionData(version);
      this.$refs.sampleInfoStatus.loadVersionData(version);
    },

    callSaveData(){
      return {update: []};
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/

    setCellStyleCallbackOverallWorkStatusPopupGrid(grid, cell){
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

    onCellClickedOverallWorkStatusPopupGrid(grid, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(this.GV1())this.GV1().refresh(true);
      this.searchVersionData(jsonData["차수"])
    },

    onCellClickedOverallWorkStatusPopupGrid1(grid, clickData) {
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(["061", "067"].includes(jsonData['공정코드']) && (clickData.fieldName == 'fCstno' || clickData.fieldName == 'tCstno')){
				let params = {
					dialogTitle: "Cell_ID 리스트",					
					height: 300,
					width: 1800,
					gridJs: `CP0000000015.js`,
          btnConfirm: false,
					search: { menuId: "M0003002", queryId: "M0003002_Sch11", queryParams: { runId: jsonData["runNo"], cstno: jsonData[clickData.fieldName], code: jsonData['공정코드'] } }
				};	
				this.$refs.cmDialog1.openDialog(params);
      }else if(["055", "056", "061"].includes(jsonData['공정코드']) && clickData.fieldName == 't수량'){
        if(jsonData["tCnt"] > 1){
          let rows = this.DP2().getJsonRows(0, -1)
          .map((item, index) => ({ ...item, idx: index }))
          .filter(item => item.tCstno === jsonData["tCstno"]);
          this.$refs.cstTCntInput.openDialog({ tCstno: jsonData["tCstno"], rows: rows, isEditabled: this.isEditabled, errorCnt: this.params["적재수량"] });
        }
      }
    }, 

    onCellItemClickedOverallWorkStatusPopupGrid1(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '불량입력'){
        if(jsonData["공정코드"] == "054"){          
          this.$refs.errorInput.openDialog(
            {
              ...this.params,
              type: 'cstno1',
              line: 'D1UT',
              "자동여부": 0,
              dialogTitle: ""+ jsonData["fCstno"]+" / 불량입력",
              cstNo: jsonData["fCstno"],
              fCstNo: jsonData["fCstno"],
              runId: jsonData["runNo"],
              '차수': jsonData["차수"],
              isEditabled: false,
              isMapping: true,
              callback: { queryId:'M0003002Error', data:[{
                ...this.params,
                '차수': jsonData["차수"],
                'code': this.params['공정코드'],
                line: 'D1UT',
                "자동여부": 0,
                fCstNo: jsonData["fCstno"],
              }]}
            }
          );
        }else{
          this.$refs.errorInput.openDialog(
            {
              ...this.params,
              type: 'cstno1',
              line: 'D1UT',
              "자동여부": 0,
              errorCnt: jsonData["t수량"],
              dialogTitle: ""+ jsonData["fCstno"]+" / 불량입력",
              cstNo: jsonData["fCstno"],
              fCstNo: jsonData["fCstno"],
              //tCstNo: jsonData["tCstno"],
              runId: this.params["runNo"],
              '차수': jsonData["차수"],
              isEditabled: false,
              callback: { queryId:'M0003002Error', data:[{
                ...this.params,
                '차수': jsonData["차수"],
                'code': this.params['공정코드'],
                line: 'D1UT',
                "자동여부": 0,
                fCstNo: jsonData["fCstno"],
                //tCstNo: jsonData["tCstno"],
              }]}
            }
          );
        }
      }else if(clickData.fieldName == '시료확인'){
        this.$refs.reliabilitySampleConfirmPopup.openDialog({
            ...this.params, 
            ...{                           
              cstNo: jsonData["fCstno"],
              fCstNo: jsonData["fCstno"],
              tCstNo: jsonData["tCstno"],
              runId: jsonData["runNo"],
            }
          });
      }
      return true;
    },
  },
};
</script>

<style lang="scss">
.custom-modal-dialog-overall-work-status {
  max-width: 1600px !important;
  width: 100%;
}
.custom-modal-content-overall-work-status {
  width: 100%;
}
</style>