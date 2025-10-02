<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer :title="'작업진행'" no-close-on-backdrop :style="{  zIndex: zIndex }" 
    content-class="custom-modal-content-film-box-job-popup"
    dialog-class="custom-modal-dialog-film-box-job-popup"
    @hidden="closeDialog"
    centered>
    <div class="worker_wrap">
      <div class="title mr-4">작업자 정보</div>
          <div class="row worker_info">                         
            <div class="col-2">
              <div class="form-floating prc_name">
                <select
                  class="form-select label-60"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  v-model="params.shift"
                >
                  <option 
                    v-for="(item, index) in shifts" 
                    :key="index" 
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
                <label for="floatingSelect" class="select">근무조</label>
              </div>
            </div>
            <div class="col-2">
              <div class="form-floating prc_name">
                <input
                  type="text"
                  class="form-control label-60"
                  id="floating"
                  placeholder="작업자"
                  autocomplete="off"
                  v-model="params['작업자']"
                  @click="workerClick"
                />
                <label for="floating">작업자</label>
              </div>
            </div>
            <div class="col-2">
              <div class="form-floating prc_name">
                <select
                  class="form-select label-60"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  v-model="params['작업조']"
                  :disabled="true"
                >
                  <option 
                    v-for="(item, index) in shiftTypes" 
                    :key="index" 
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
                <label for="floatingSelect" class="select">근무시간</label>
              </div>
          </div>
          <!--<div class="col-2">
            <DateTimeSpinner ref="dateTime1" @input="dateTimeInput1" label="작업시작"/>  
          </div>
          <div class="col-2">
            <DateTimeSpinner ref="dateTime2" @input="dateTimeInput2" label="작업종료"/>  
          </div>        -->
        </div>
    </div>
    <div class="btn_wrap mb-1 mt-1">
      <b-button class="second me-1" @click="actionClick('detailView')">상세 보기</b-button>
      <b-button :class="{main : params.isEditabled }" @click="actionClick('temp')">임시저장</b-button>
      <b-button class="main" @click="actionClick('close')">닫기</b-button>
    </div>
        <div class="etc mt-1"> 
        <div class="title">불량현황</div>
          <RealGrid ref="filmBoxJobPopupGrid3" :uid="'filmBoxJobPopupGrid3'" :rows="rows2" class="mb-1" :fitLayoutWidthEnable="false"/>
        </div>
        <div class="hold_wrap" v-if="holdChk1 || holdChk2">
        <div class="hold">HOLD {{(holdChk1 ? '깨짐('+ holdVal1+')' : '') +''+ (holdChk2 ? '유리이물('+ holdVal2+')' : '')}}</div>
        </div>
        <b-row class="mt-2">
        <b-col>                
            <div class="d-flex mb-1">
            <div class="col-8">
                <div class="form-floating cell-no">
                <input
                    type="text"
                    class="form-control label-80"
                    id="floating"
                    placeholder="CELL No."
                    name="cellNo"
                    data-group="params1"
                    @input="convertToUpperEnglish"
                    @keydown.enter="handleEnter"
                    ref="cellNoField"
                    autocomplete="off"
                    v-model="params1.cellNo"
                    :disabled="!isStartDisabled1"
                    :style="{ backgroundColor: isStartDisabled1 ? '#fff959' : '' }"
                />
                <label for="floating">CELL No.</label>
                </div>                    
            </div>
            <div class="col-4">
                <b-button class="none">미진행 : {{notProgCnt}}</b-button>                        
            </div>
            </div>
            <RealGrid ref="filmBoxJobPopupGrid4" :uid="'filmBoxJobPopupGrid4'" v-show="detailView" :rows="rows4" :style="`height: 320px`" :fitLayoutWidthEnable="false"/>      
        </b-col>
        <b-col>
            <div class="d-flex  mb-1">                    
                    <b-button :class="{ good: type == '양품' } "  @click="actionType('양품')">양품 : {{successCnt}}</b-button>                        
            </div>
            <RealGrid ref="filmBoxJobPopupGrid5" :uid="'filmBoxJobPopupGrid5'" v-show="detailView" :rows="rows5" :style="`height: 320px`" :fitLayoutWidthEnable="false"/>   
        </b-col>
        <b-col>
            <div class="d-flex  mb-1">
                    <b-button :class="{ error : type == '불량' } " @click="actionType('불량')">불량 : {{errorCnt}}</b-button>
                
                <div class="d-flex ms-1" @click="errorPopupOpen" style="cursor: pointer;">
                <b-form-input 
                    v-model="defective['불량사유']"
                    :disabled="true"
                    style="height:40px; pointer-events: none"
                />
                </div>
            </div> 
            <RealGrid ref="filmBoxJobPopupGrid6" :uid="'filmBoxJobPopupGrid6'" v-show="detailView" :rows="rows6" :style="`height: 320px`" :fitLayoutWidthEnable="false"/>                  
        </b-col>
        </b-row>            
        <ErrorSchPopup ref="errorSchPopup" @confirm="ErrorInput" /> 
        <WorkerPopup ref="workerPopup" @confirm="workerConfirm" />
        <ProcessingMapping2 ref="processingMapping2" @save="saveCallback1"/>   
        <VlrRemarkInputPopup ref="vlrRemarkInputPopup" @save="saveCallback1"/>
        <CellQcRemarkInputPopup ref="cellQcRemarkInputPopup" @save="saveCallback1"/>
  </b-modal>  
</template>

<script>

import moment from 'moment';
import ErrorSchPopup from "@web/popup/ErrorSchPopup";
import ProcessingMapping2 from "@web/popup/ProcessingMapping2";
import WorkerPopup from "@web/popup/WorkerPopup";
import VlrRemarkInputPopup from "@web/popup/VlrRemarkInputPopup";
import CellQcRemarkInputPopup from "@web/popup/CellQcRemarkInputPopup";
const { ValueType, RowState } = require('realgrid');

export default {
  name: "FilmBoxJobPopup",
  components:{
    ErrorSchPopup,
    WorkerPopup,
    ProcessingMapping2,
    VlrRemarkInputPopup,
    CellQcRemarkInputPopup
  },
  props: {},
  data() {
    return {
      filmBoxJobPopupGrid3: null,
      filmBoxJobPopupGrid4: null,
      filmBoxJobPopupGrid5: null,
      filmBoxJobPopupGrid6: null,
      rows2: [],
      rows4: [],
      rows5: [],
      rows6: [],
      isOpen: false,
      params: {
        '공정코드': null,				
        'nxt공정코드': null,
        runNo: null,
        shift: null,
        '작업조': null,
        '책임자': null,
        '선임자': null,
        '작업자': null,
        machineCode: null,
        '설비명': null,
        '설비약명': null,
        chamber: null,
        'next작업시작': null,
        '차수': null,
        'pre공정코드': null,
        '투입수량': null,
        '작업시작': null, 
        '시작시각': null,
        '작업종료': null, 
        '종료시각': null,
        '제품모델': null,
        isEditabled: false
      },
      params1: {
        cellNo: null,
      },
      type: "양품",
      defective: {
        "불량사유": null,
        "불량코드": null       
      },
      dynamic: {
        layout1: [],
      },
      shifts: [],
      shiftTypes: [],
      notProgCnt: 0,
      errorCnt: 0,
      successCnt: 0,
      startDay: null,
      startTime: null,
      endDay: null,
      endTime: null,
      holdChk1: false,
      holdChk2: false,
      holdVal1: null,
      holdVal2: null,
      zIndex: 0,      
      detailView: false,
    };
  },
  computed: {
    isStartDisabled1(){
      return this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작');      
		},
  },
  created() {
    
  },
  watch: {},
  methods: {
    filmBoxJobPopupGrid3GV() {
      return this.$refs.filmBoxJobPopupGrid3?.getGridView();
    },
    filmBoxJobPopupGrid3DP() {
      return this.$refs.filmBoxJobPopupGrid3?.getGridDataProvider();
    },
    filmBoxJobPopupGrid4GV() {
      return this.$refs.filmBoxJobPopupGrid4?.getGridView();
    },
    filmBoxJobPopupGrid4DP() {
      return this.$refs.filmBoxJobPopupGrid4?.getGridDataProvider();
    },
    filmBoxJobPopupGrid5GV() {
      return this.$refs.filmBoxJobPopupGrid5?.getGridView();
    },
    filmBoxJobPopupGrid5DP() {
      return this.$refs.filmBoxJobPopupGrid5?.getGridDataProvider();
    },
    filmBoxJobPopupGrid6GV() {
      return this.$refs.filmBoxJobPopupGrid6?.getGridView();
    },
    filmBoxJobPopupGrid6DP() {
      return this.$refs.filmBoxJobPopupGrid6?.getGridDataProvider();
    },
    async openDialog(params) {
      this.$utils.initializeParamsInPlace(this.params);
      Object.assign(this.params, params);
      this.detailView = false;
      this.startDay = null,
      this.startTime = null,
      this.endDay = null,
      this.endTime = null,
      this.searchComCode();
      //this.$refs.dateTime1.clearClick();
      //this.$refs.dateTime2.clearClick();

      this.filmBoxJobPopupGrid3 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_3.js`));
      this.filmBoxJobPopupGrid4 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
      this.filmBoxJobPopupGrid5 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_5.js`));
      this.filmBoxJobPopupGrid6 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_6.js`));

      let result = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch5", 
        queryParams: { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] }
      });

      
      this.filmBoxJobPopupGrid3.fields = [];
      this.filmBoxJobPopupGrid3.columns = [];
      let gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.INT, "c", { styleName: "tr",
        footer: { valueCallback: this.footerValueCallback }
      });
      this.filmBoxJobPopupGrid3.orgColumns[0].footer = {valueCallback : this.footerValueCallback};
      this.filmBoxJobPopupGrid3.fields = [
        this.filmBoxJobPopupGrid3.orgFields[0],
        ...gsfc1.fields,
      ];
  
      this.filmBoxJobPopupGrid3.columns = [
        this.filmBoxJobPopupGrid3.orgColumns[0],
        ...gsfc1.columns,
      ];
        
      this.filmBoxJobPopupGrid3.layout[1].items = result.map((defect) => ("c"+defect["불량코드"]));
      this.dynamic.layout1 = result.map(defect => ({
        value: defect["불량코드"],
        text: `c${defect["불량코드"]}`
      }));
      this.filmBoxJobPopupGrid3.options.display.rowHeight = 45;
      this.$nextTick(() => {
        this.$refs.filmBoxJobPopupGrid3.created();
        this.$refs.filmBoxJobPopupGrid4.created();
        this.$refs.filmBoxJobPopupGrid5.created();
        this.$refs.filmBoxJobPopupGrid6.created();
        
        setTimeout(()=>{
          this.filmBoxJobPopupGrid4DP().restoreMode = "auto";
          this.filmBoxJobPopupGrid5DP().restoreMode = "auto";
          this.filmBoxJobPopupGrid6DP().restoreMode = "auto";
        }, 100)
      });

      
      this.$nextTick(() => {     
        this.zIndex = this.$zIndexManager.next();
        this.rows2 = [];
        this.rows4 = [];
        this.rows5 = [];
        this.rows6 = [];
        this.searchClick();
        this.isOpen = true;     
      });
    },
    async searchComCode(){
			this.$utils.getCommonContentValueText(['75', '06'], [this.shiftTypes, this.shifts]);
		},
    closeDialog() {      
      this.$refs.filmBoxJobPopupGrid3.destroy();
      this.$refs.filmBoxJobPopupGrid4.destroy();
      this.$refs.filmBoxJobPopupGrid5.destroy();
      this.$refs.filmBoxJobPopupGrid6.destroy();
      this.$zIndexManager.release();
      this.$emit("closeDialog");
      setTimeout(()=>{
        this.isOpen = false;
      }, 100);
    },

    workerClick(){
      if(!_.isNil(this.params["shift"])){
        let params = {
            dialogTitle: "작업자 정보",
            height: 750,
            popUpSize: "lg",          
            gridJs: `WorkerPopup1.js`,
            search: { menuId: "M0003003", queryId: "M0003003_Sch17", queryParams: { majCode: '47', code: this.params["shift"].substring(0, 1) } }
        };	
        this.$refs.workerPopup.openDialog(params);			
      }
    },

    workerConfirm(val){
      this.params["작업자"] = val;
      this.$refs.workerPopup.closeDialog();		
    },

    handleEnter(event) {
      event.preventDefault();
      this.cellNoInput();
    },

    footerValueCallback(grid, column, footerIndex, columnFooter, value){
      let t투입수량 = this.$utils.numberValueOrDefault(this.params['투입수량']);
	    let t불량수량 = this.$utils.numberValueOrDefault(grid.getValue(0, column.name));
      return t투입수량 == 0 ? 0 : this.$utils.formatNumber(((t불량수량*100)/t투입수량), 2);
    },

    errorPopupOpen(){
      if(this.type != '불량') return;
      if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])){
        return;
      }
      this.$refs.errorSchPopup.openDialog({ ...this.params, line: 'D1UT', "자동여부": 0});
    },

    async confirmAndMove(rows, message, update1, update2) {
      this.$confirm("확인", message, async (confirm) => {
        if (confirm) {
          let params = { menuId: 'M0003003', update: [{ queryId: update1, data: rows }] };
          if (update2) params.update.push({ queryId: update2, data: rows });
          
          await this.$axios.api.saveData(params);
          this.searchClick(false);
          //this.focusCellNoField();
        }
      });
    },

    dateTimeInput1(fullDateTime) {
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        this.startDay = fullDateTime.split(" ")[0];
        this.startTime = fullDateTime.split(" ")[1];
      }else{
        this.startDay = null;
        this.startTime = null;
      }
    },

    dateTimeInput2(fullDateTime) {
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        this.endDay = fullDateTime.split(" ")[0];
        this.endTime = fullDateTime.split(" ")[1];
      }else{
        this.endDay = null;
        this.endTime = null;
      }
    },

    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },

    async cellNoInput() {
      if (!this.$utils.validateFields(this.params, ['T:작업자:작업자', 'C:Shift:shift', 'C:작업조:작업조'])) {
        return;
      }

      if (this.type === '불량' && !this.defective["불량사유"]) {
        return this.$toast('info', "불량사항을 선택하세요.");
      }

      const dateTime = this.$utils.getDateAndTimeArray1().join(" ");
      const baseData = {
        ...this.params,
        result: this.type,
        불량코드: this.type === '양품' ? null : this.defective["불량코드"],
        scrap: this.type === '양품' ? null : this.defective["불량사유"],
        작업자: this.params["작업자"],
        작업조: this.params["작업조"],
        근무조: this.params["shift"],
        작업시간: dateTime,
        step: this.params["차수"]
      };

      const filterByCellNo = (grid) => grid.getJsonRows(0, -1).filter(item => item.cellId === this.params1.cellNo);

      let rows = filterByCellNo(this.filmBoxJobPopupGrid4DP()).map(item => ({ ...item, ...baseData }));

      if (rows.length === 0) {
        let rows1 = filterByCellNo(this.filmBoxJobPopupGrid5DP()).map(item => ({ ...item, ...baseData }));
        let rows2 = filterByCellNo(this.filmBoxJobPopupGrid6DP()).map(item => ({ ...item, ...baseData }));

        if (this.type === '불량' && rows1.length > 0) {
          return this.confirmAndMove(rows1, "양품에 등록된 CELL입니다.<br>불량으로 이동하시겠습니까?", "M0003003_Update10", "M0003003_Update9");
        } 
        
        if (this.type === '양품' && rows2.length > 0) {
          return this.confirmAndMove(rows2, "불량에 등록된 CELL입니다.<br>양품으로 이동하시겠습니까?", "M0003003_Update10", "M0003003_Update9");
        }
        this.focusCellNoField();
        return this.$toast('info', rows1.length > 0 || rows2.length > 0 ? `${this.type}에 등록된 CELL 입니다.` : "등록할 수 없는 CELL 입니다.");
      }
      await this.saveData("M0003003_Update1", rows, this.type === '불량' ? "M0003003_Update2" : null);
      this.isHoldSch = true;
    },

    actionType(val){
      this.type = val;
      if(val == "양품"){
        this.defective["불량사유"] = null;
      }else{
        const current = this.filmBoxJobPopupGrid3GV().getCurrent();
        const column = current.column;
        const text = this.filmBoxJobPopupGrid3GV().layoutByColumn(column)?.displayText;
        let tValue = this.dynamic.layout1.filter(item => item.text == current.fieldName);
        this.defective["불량코드"] = tValue.length > 0 ? tValue[0].value : "";
        this.defective["불량사유"] = text;
      }
      if(this.isStartDisabled1){
        this.$refs.cellNoField?.focus();
      }
    },

    saveCallback1(){
      this.searchClick();
    },

    searchClick(init = true){
      this.$nextTick(async()=>{        
        let params = {
          runNo: this.params.runNo,
          line: 'D1UT',
          "자동여부": 0,
          '공정코드': this.params['공정코드'],
          'code': this.params['공정코드'],
        };	

        let searchParam1 = [];
        let searchParam2 = [];
        params["차수"] = this.params["차수"];
        params["pre공정코드"] = this.params["pre공정코드"];
        searchParam1.push(
          {menuId: "M0003003", queryId: "M0003003_Sch3", queryParams: params, target: this.rows4}, 
          {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2}
        );
        searchParam2.push(
          {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '양품' }, target: this.rows5},
          {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '불량' }, target: this.rows6},
        );
        await this.$axios.api.searchAll(searchParam1);
        await this.$axios.api.searchAll(searchParam2);

        if(!init && ["072","069"].includes(this.params['공정코드'])){
          this.focusCellNoField();
          this.params1.cellNo = null;
        }        
      
        this.holdChk1 = false;
        this.holdChk2 = false;

        let result4 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_PFLRunHold", queryParams: this.params});
        if(!_.isNil(result4) && !_.isEmpty(result4)){
          if(result4[0]['불량률1'] > result4[0]['rate1']){
            this.holdChk1 = true;
            this.holdVal1 = ('기준: '+(Math.floor(result4[0]['rate1']*100 * 100) / 100)+'% 불량률: '+ Math.floor(result4[0]['불량률1']*100 * 100) / 100)+'%';
          }
          if(result4[0]['불량률2'] > result4[0]['rate2']){
            this.holdChk2 = true;
            this.holdVal2 = ('기준: '+(Math.floor(result4[0]['rate2']*100 * 100) / 100)+'% 불량률: '+ Math.floor(result4[0]['불량률2']*100 * 100) / 100)+'%';
          }
        }          
        const el = this.$refs.filmBoxJobPopupGrid3?.$el || this.$refs.filmBoxJobPopupGrid3;
        if (el) {
          el.classList.toggle('error', this.holdChk1 || this.holdChk2);
        }        
        if(this.filmBoxJobPopupGrid3GV())this.filmBoxJobPopupGrid3GV().refresh(true);
      });
    },

    focusCellNoField() {
      this.$refs.cellNoField.focus();
      this.$refs.cellNoField.select();
    },

    async actionClick(action) {
      if(this.filmBoxJobPopupGrid5GV())this.filmBoxJobPopupGrid5GV().commit();
      if(this.filmBoxJobPopupGrid6GV())this.filmBoxJobPopupGrid6GV().commit();

      if(action === 'detailView'){
        this.detailView = !this.detailView;
        return;
      }else if(action === 'close'){
        this.closeDialog();
      }else if(action === 'temp'){
        
        if(!this.params.isEditabled)return;

        const updatedCells1 = this.filmBoxJobPopupGrid5DP().getUpdatedCells();
        let tRows1 = [];
        if(!_.isEmpty(updatedCells1)){
          tRows1 = this.filmBoxJobPopupGrid5DP().getJsonRows(0, -1)
          .filter((_, index) => updatedCells1.some((item) => { return ( item.__rowId === index && item.updatedCells.some(updatedCell => updatedCell.fieldName === '특이사항'));
          }))
          .map(item => ({
            ...item,
            ...this.params,
          }));
        }
        const updatedCells2 = this.filmBoxJobPopupGrid6DP().getUpdatedCells();
        let tRows2 = [];
        if(!_.isEmpty(updatedCells1)){
          tRows2 = this.filmBoxJobPopupGrid6DP().getJsonRows(0, -1)
          .filter((_, index) => updatedCells2.some((item) => { return ( item.__rowId === index && item.updatedCells.some(updatedCell => updatedCell.fieldName === '특이사항'));
          }))
          .map(item => ({
            ...item,
            ...this.params,
          }));
        }
        let params = {
          "menuId": 'M0003003',
          "update": [],
        };
        let rows1 = [...tRows1, ...tRows2];
        if(rows1.length > 0){
          params["update"].push(
            { queryId: "M0003003_Update6", data: rows1 }
          );

          let saveFunc = async () => {
            const resp = await this.$axios.api.saveData(params);
            if (resp.status === 'success') {
              this.$toast('success', '임시저장 되었습니다.');
              this.searchClick();
            } else {
              this.$toast('error', resp.message);
            }
          };

          this.$confirm("확인", '임시저장 하시겠습니까?', (confirm)=>{
            if(confirm){
              saveFunc();
            }
          });
        }else{
          this.$toast("info", "임시저장 대상이 없습니다.");          
        }
      }
    },

    ErrorInput(item){
      this.defective["불량코드"] = item['불량코드'];
      this.defective["불량사유"] = item['불량명'];
      this.$refs.errorSchPopup.closeDialog();
      if(this.isStartDisabled1){
        this.$refs.cellNoField?.focus();
      }
    },
    /********************************************************************************************************************************
    * 아래로 그리드 설정
    ********************************************************************************************************************************/

    setCellStyleCallbackFilmBoxJobPopupGrid3(grid, cell){
      let rtn = {};
      if (this.holdChk1 || this.holdChk2) {
        rtn.styleName = "tr red";
      }else{
        rtn.style = { background: '#FFFFFF' };          
      }
      return rtn
    },

    setCellStyleCallbackFilmBoxJobPopupGrid5(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == '특이사항'){
        /*rtn.editable = true;*/
        rtn.styleName = "tl edit";        
      }
      return rtn
    },

    setCellStyleCallbackFilmBoxJobPopupGrid6(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(cell.index.itemIndex);
      if (this.holdChk1 && ["깨짐"].includes(jsonData["scrap"])) {
        if(fieldName == '맵핑유무'){
          rtn.styleName = "red";       
        }else{
          rtn.styleName = "tl red";       
        }
      }

      if (this.holdChk2 && ["유리이물"].includes(jsonData["scrap"])) {
        if(fieldName == '맵핑유무'){
          rtn.styleName = "red";       
        }else{
          rtn.styleName = "tl red";       
        }
      }
      
      if(fieldName == '특이사항'){
        /*rtn.editable = true;*/
        rtn.styleName = "tl edit";                
      }
      if (!rtn.styleName || rtn.styleName.indexOf("red") == -1) {
        rtn.style = { background: '#FFFFFF' };
      }
      return rtn
    },

    onCellClickedFilmBoxJobPopupGrid5(grid, clickData) {
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '특이사항'){
        if(!this.params.isEditabled)return;

        this.$refs.cellQcRemarkInputPopup.openDialog({
          ...this.params, 
          ...jsonData,
        });
      }
      return true;
    },  

    onCellClickedFilmBoxJobPopupGrid6(grid, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '맵핑유무'){
        this.$refs.processingMapping2.openDialog({
          ...this.params, 
          ...jsonData,
          model: this.params["제품모델"],
          isEditabled: this.params.isEditabled,
          isFilm: false,
        });
      }else if(clickData.fieldName == '특이사항'){
        if(!this.params.isEditabled)return;

        this.$refs.cellQcRemarkInputPopup.openDialog({
          ...this.params, 
          ...jsonData,
        });
      }
      return true;
    }, 
    
    onDataLoadComplatedFilmBoxJobPopupGrid4(grid) {
      this.notProgCnt = this.filmBoxJobPopupGrid4DP().getRowCount();
    },

    onDataLoadComplatedFilmBoxJobPopupGrid5(grid) {
      this.successCnt = this.filmBoxJobPopupGrid5DP().getRowCount();
    },

    onDataLoadComplatedFilmBoxJobPopupGrid6(grid) {
      this.errorCnt = this.filmBoxJobPopupGrid6DP().getRowCount();
    },
  }
};
</script>

<style lang="scss">
.custom-modal-dialog-film-box-job-popup {
  max-width: 1550px !important;  
  width: 100%;
  //max-height: 80vh;
  height: 800px;
}
.custom-modal-content-film-box-job-popup {
  width: 100%;
  height: 800px;
  //max-height: 80vh;
}

</style>
<style scoped>
:deep.worker_info {
    display: flex;
    align-items: center;
    width: calc(50% - 50px);
}
</style>
<style lang="scss">
.rg-renderer{
	button{
		&.btn_error{
			border: 1px solid  #ff7f58;
      color:  #df4802;
		}
    &.btn_sucess{
			border: 1px solid  #2f46c7;
      color:   #2f46c7;
		}
	}
}
.cell-no{
  .form-control{
  background:#fff959 ;
  }
    label{
    padding: 15px!important;
  }
  label{top:-3px!important;}
  .form-control:not(:placeholder-shown) ~ label {
    top: 3px!important;
  }
}
.hold_wrap{
  border-radius:8px;
  background:#f5f5f5;
  padding:10px;
  text-align:center;
   .hold{
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 80px;
    background: #ff0000;
    font-size: 24px;
    font-weight:bold;
    border-radius: 7px;
    justify-content: center;
    color: #fff;
   }

}
.error{
  .rg-header, .rg-footer{
    background: #ffcccc;
  }
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