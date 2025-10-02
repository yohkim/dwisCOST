<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <div class="search_box">
      <b-row class="row search_area">
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-60" id="floating" placeholder="작업자"
              v-model="params.worker">
            <label for="floating">작업자</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="params.selectedShift">
              <option v-for="(o, index) in params.shifts" :value="o.value" :key="index">{{ o.text }}</option>
            </select>
            <label for="floatingSelect" class="select">Shift</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <select class="form-select label-60 " id="floatingSelect"
              aria-label="Floating label select example" v-model="params.selectedMc">
              <option v-for="(o, index) in params.mcList" :value="o.value" :key="index">{{ o.text }}</option>
            </select>
            <label for="floatingSelect" class="select">M/C</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
				<b-button class="sub" @click="addRow">행추가</b-button>
			</div>
    </div>
    <div>
      <RealGrid ref="grid" :uid="'grid'" :rows="list" style="height: 570px" />
    </div>
    <div class="bttn_wrap">      
      <b-button class="main" block @click="confirmClick">확인</b-button>
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>

import moment from 'moment';

export default {
  name: "ManualCstAddPopup",
  setup() {
	},
  emits: ["confirm"],
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "수동 카세트 추가",
      },      
      zIndex: 0,      
      grid:null,
      gridRows:[],
      editCstFn:'fCstno', //박리:fCstno,전,후 환적: tCstno
      maxSeq:"01",
      validateEnable:false,
    };
  },
  computed: {},
  created() {    
  },
  mounted() {
    
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.initializeGrid();
      this.setAddCstFocus();

      params['csts'].forEach(el => {
        this.maxSeq = String(Math.max(Number(this.maxSeq),Number(el['seq']))).padStart(2, '0');        
      });
    },
    closeDialog() {  
      this.gv().cancel();
      this.$zIndexManager.release();
      this.isOpen = false;
    },
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    initializeGrid(){
      this.$refs.grid.destroy();

      if(this.params['process'] === '023'){ //박리
        this.editCstFn = 'fCstno';
        this.grid = _.cloneDeep(require(`@web/popup/js/ManualCstAdd.js`));
        this.$refs.grid.created();
        this.gv().onValidateColumn = this.onValidateColumn1;
      }else if(this.params['process'] === '022'){
        this.editCstFn = 'tCstno';
        this.grid = _.cloneDeep(require(`@web/popup/js/ManualCstAdd3.js`));
        this.$refs.grid.created();
        this.gv().onValidateColumn = this.onValidateColumn3;
      }else{  //전,후 환적
        this.editCstFn = 'tCstno';
        this.grid = _.cloneDeep(require(`@web/popup/js/ManualCstAdd2.js`));
        this.$refs.grid.created();
        this.gv().onValidateColumn = this.onValidateColumn2;
      }
    },
    
    async setAddCstFocus(){
      let list = this.dp().getJsonRows(0, -1);

      if(_.isEmpty(list)){
        return;
      }

      let firstAddCstRow = -1;
      for(let i = 0; i < list.length; i++){
        if(_.isEmpty(list[i]["lotNo"])){
          firstAddCstRow = i;
          break;
        }
      }
      setTimeout(() => {
        this.setCstFocus(firstAddCstRow,'lotNo');
      }, 500);      
      
    },
    setCstFocus(r,fn){
      if(r < 0){
        return;
      }
      this.gv().setCurrent({ dataRow: r, fieldName : fn });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);      
    },

    nextCstFocus(nrow){
      let list = this.dp().getJsonRows(0, -1);
      if(nrow < list.length){
        if(this.gv().getValue(nrow,this.editCstFn) === null){
          this.gv().setCurrent({ dataRow: nrow, fieldName : this.editCstFn });
          setTimeout(() => {
            this.gv().showEditor();
          }, 100);   
        }else{  //값이 있는거 패스
          this.nextCstFocus(nrow + 1);
        }
      }
    },

    onCellEditedGrid(grid, itemIndex, row, field){      
      //공백제거 추가
      let iv = grid.getValue(row, field);
      iv = iv.replace(/ /g,"");
      grid.setValue(row,field,iv);

      if(this.params['process'] === '023'){ //박리
        if(field === 4){
          this.setCstFocus(row,this.editCstFn);
        }else if(field === 7){
          let cstNo = grid.getValue(row,field);          
          this.checkCstNo(cstNo).then((b) => {
            if(!b){  //비정상
              this.setCstFocus(row,"fCstno");
            }else{
              this.nextCstFocus(row + 1);            
              this.$toast("info",cstNo + " 처리되었습니다.");
            }
          });
        }
      }else if(this.params['process'] === '022'){ //rework
        if([7,15].indexOf(field) > -1){
          let fnMap = {7:"fCstno",15:"tCstno"};
          let cstNo = grid.getValue(row,field);
          this.checkCstNo(cstNo).then((b) => {
            if(b){  //정상
              if(field === 7){
                grid.setValue(row, 'inCstno', grid.getValue(row, 'fCstno'));
                this.setCstFocus(row,"tCstno");
                this.nextCstFocus(row + 1);            
                this.$toast("info",cstNo + " 처리되었습니다.");
              }
            }else{
              this.setCstFocus(row,fnMap[field]);
            }
          });
        }
      }else{
        if([7,15,28].indexOf(field) > -1){
          let fnMap = {7:"fCstno",15:"tCstno",28:"inCstno"};
          let cstNo = grid.getValue(row,field);
          cstNo = cstNo.replace(/ /g,"");
          this.checkCstNo(cstNo).then((b) => {
            if(b){  //정상
              if(field === 7){
                grid.setValue(row, 'inCstno', grid.getValue(row, 'fCstno'));
                this.setCstFocus(row,"tCstno");
                this.nextCstFocus(row + 1);            
                this.$toast("info",cstNo + " 처리되었습니다.");
              }
            }else{
              this.setCstFocus(row,fnMap[field]);
            }
          });
        }
      }
    },

    async checkCstNo(cstNo){  
      let qp = {};
      let rtn = true;
      qp['runNo'] = this.params['runNo'];
      qp['cstNo'] = cstNo;
      let param = { menuId: 'M0003001', queryId: 'checkCstValidation', queryParams: qp};
      this.$axios.api.search(param).then(rslt=>{
        if(_.isEmpty(rslt)){
          this.$toast("warn","확인불가 CST로 진행 할 수 없습니다.");              
          rtn = false;
        }else{
          if(rslt[0]['message'] !== 'OK'){
            this.$toast("warn",rslt[0]['message']);
            rtn = false;
          }else{  //정상
            this.$toast("info",cstNo + " 처리되었습니다.");
            rtn = true;
          }
        }
        return rtn
      });
    },

    onValidateColumn1(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if(this.validateEnable === false){
        return error;
      }
      if (column.fieldName === this.editCstFn) {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "CST NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 CST NO 는 필수 입력입니다.");
        }
      }else if (column.fieldName === "lotNo") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "LOT NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 LOT NO 는 필수 입력입니다.");
        }
      }else if (column.fieldName === "cell") {
        if(value === undefined){					
          error.level = "warning";
          error.message = "CELL 은 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 CELL 는 필수 입력입니다.");
        }
      }else if (column.fieldName === "작업시작") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "작업시작은 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 작업시작은 필수 입력입니다.");
        }
      }
      
			return error;
		}, 

    onValidateColumn2(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if(this.validateEnable === false){
        return error;
      }
      if(column.fieldName === "fCstno") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "F-CST NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 F-CST NO 는 필수 입력입니다.");
        }
      }else if(column.fieldName === "inCstno") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "IN-CST NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 IN-CST NO 는 필수 입력입니다.");
        }
      }else if(column.fieldName === "tCstno") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "T-CST NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 T-CST NO 는 필수 입력입니다.");
        }
      }else if (column.fieldName === "작업시작") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "작업시작은 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 작업시작은 필수 입력입니다.");
        }
      }
      
			return error;
		}, 

    onValidateColumn3(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if(this.validateEnable === false){
        return error;
      }
      if(column.fieldName === "fCstno") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "F-CST NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 F-CST NO 는 필수 입력입니다.");
        }
      }else if(column.fieldName === "tCstno") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "T-CST NO 는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 T-CST NO 는 필수 입력입니다.");
        }
      }else if (column.fieldName === "작업시작") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "작업시작은 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 작업시작은 필수 입력입니다.");
        }
      }else if (column.fieldName === "mboxNo") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "M-BOX NO는 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 M-BOX NO는 필수 입력입니다.");
        }
      }else if (column.fieldName === "befRunno") {
        if(value === null || _.isEmpty(value)){					
          error.level = "warning";
          error.message = "Bef-RUN NO은 필수 입력입니다.";
          this.$toast("warn",itemIndex + "행 Bef-RUN NO은 필수 입력입니다.");
        }
      }
      
			return error;
		}, 
    duplicateCheck1(){
      let rtnValue = true;
      let checkList = [];
      this.params['csts'].forEach(el => {
        checkList.push(el['lotNo'] + "_" + el["tCstno"]);
      });
      let tempList = this.dp().getJsonRows(0, -1);

      for(let i = 0; i < tempList.length; i++){
        if(checkList.indexOf(tempList[i]['lotNo']+"_"+tempList[i]['fCstno']) > -1){
          this.$toast("warn",(i+1) + "행 LOT NO,CST NO 는 이미 추가되어 있습니다.");
          rtnValue = false;
          break;
        }
      }
      
      return rtnValue;
    },
    duplicateCheck2(){
      let rtnValue = true;
      let checkList = [];
      this.params['csts'].forEach(el => {
        checkList.push(el["fCstno"] +"_" + el["inCstno"] + "_" + el["tCstno"]);
      });
      let tempList = this.dp().getJsonRows(0, -1);

      for(let i = 0; i < tempList.length; i++){
        if(checkList.indexOf(tempList[i]["fCstno"] +"_" + tempList[i]["inCstno"] + "_" + tempList[i]["tCstno"]) > -1){
          this.$toast("warn",(i+1) + "행 CST NO 는 이미 추가되어 있습니다.");
          rtnValue = false;
          break;
        }
      }
      
      return rtnValue;
    },
    duplicateCheck3(){
      let rtnValue = true;
      let checkList = [];
      this.params['csts'].forEach(el => {
        checkList.push(el["mboxNo"] +"_" + el["befRunno"] +"_"+ el["fCstno"] +"_" + el["tCstno"]);
      });
      let tempList = this.dp().getJsonRows(0, -1);

      for(let i = 0; i < tempList.length; i++){
        if(checkList.indexOf(tempList[i]["mboxNo"] +"_" + tempList[i]["befRunno"] +"_" + tempList[i]["fCstno"] +"_" + tempList[i]["tCstno"]) > -1){
          this.$toast("warn",(i+1) + "행은 이미 추가되어 있습니다.");
          rtnValue = false;
          break;
        }
      }
      
      return rtnValue;
    },
    confirmClick(){
      this.validateEnable = true;
      this.gv().commit();

      if(this.params['process'] === '023'){ //박리
        let rslt = this.gv().validateCells(null, false);
        this.validateEnable = false;
        if(rslt === null && this.duplicateCheck1() === true){
          this.$confirmYesOrNo("선택", "입력 하시겠습니까?", (confirmed) => {
            if(confirmed){
              this.confirm();
            }
          });
        }
      }else if(this.params['process'] === '022'){ //rework
        let rslt = this.gv().validateCells(null, false);
        this.validateEnable = false;
        if(rslt === null && this.duplicateCheck3() === true){
          this.$confirmYesOrNo("선택", "입력 하시겠습니까?", (confirmed) => {
            if(confirmed){
              this.confirm();
            }
          });
        }
      }else{
        let rslt = this.gv().validateCells(null, false);
        this.validateEnable = false;
        if(rslt === null && this.duplicateCheck2() === true){
          this.$confirmYesOrNo("선택", "입력 하시겠습니까?", (confirmed) => {
            if(confirmed){
              this.confirm();
            }
          });
        }
      }
      
    },
    confirm(){
      this.gv().commit();
      let list = this.dp().getJsonRows(0, -1);
      
      if(this.params['process'] === '023'){ //박리
        list.forEach(el => {
          el['tCstno'] = el['fCstno'];
          el['f수량'] = el['t수량'];
          el['tOrg수량'] = el['t수량'];
          el['tCnt'] = 1;
          el['cellEqQty'] = el['설비cell수량'];
          el['작업시작'] = el['작업시작datetime'].substring(0, 10).replace(/-/g, '');
          el['시작시각'] = el['작업시작datetime'].substring(11).replace(/:/g, '');
          el['작업종료'] = el['작업종료datetime'].substring(0, 10).replace(/-/g, '');
          el['종료시각'] = el['작업종료datetime'].substring(11).replace(/:/g, '');
          el['pkey'] = el['lotNo']  + '|' + el['fCstno'] + '|' + el['tCstno'];
        });
      }else if(this.params['process'] === '022'){ //rework
        list.forEach(el => {
          el['tOrg수량'] = el['t수량'];
          el['tCnt'] = 1;
          el['lotNo'] = el['mboxNo'] + '/' + el['befRunno'];
          el['작업시작'] = el['작업시작datetime'].substring(0, 10).replace(/-/g, '');
          el['시작시각'] = el['작업시작datetime'].substring(11).replace(/:/g, '');
          el['작업종료'] = el['작업종료datetime'].substring(0, 10).replace(/-/g, '');
          el['종료시각'] = el['작업종료datetime'].substring(11).replace(/:/g, '');
          el['pkey'] =  el['mboxNo'] + '|' + el['fCstno'] + '|' + el['tCstno'];
        });
      }else{  //전,후 환적
        list.forEach(el => {
          el['cellEqQty'] = el['t수량'];
          el['tOrg수량'] = el['t수량'];
          el['tCnt'] = 1;
          el['작업시작'] = el['작업시작datetime'].substring(0, 10).replace(/-/g, '');
          el['시작시각'] = el['작업시작datetime'].substring(11).replace(/:/g, '');
          el['작업종료'] = el['작업종료datetime'].substring(0, 10).replace(/-/g, '');
          el['종료시각'] = el['작업종료datetime'].substring(11).replace(/:/g, '');
        });
      }
      
      this.params['mlist'] = list;
      this.$emit('confirm',this.params);
      this.closeDialog();
    },
    addRow(){
      this.gv().commit();
      if (!this.$utils.validateFields(this.params, ['T:작업자:worker','C:Shift:selectedShift','C:M/C:selectedMc'])) {
				return;
			}

      let befProcess = "";
      let nxtProcess = "";
      let seq = String(Number(this.maxSeq) + 1).padStart(2, '0');
      if(this.params.process === '023'){
        befProcess = '020';
        nxtProcess = "027";
      }else if(this.params.process === '037'){
        befProcess = '033';
        nxtProcess = "040";
      }else if(this.params.process === '043'){
        befProcess = '040';
        nxtProcess = "047";
      }else if(this.params.process === '022'){
        befProcess = "";
        nxtProcess = "";
      }

      let row = {};
      row['공장코드'] = "2";
      row['runNo'] = this.params['runNo'];
      row['process'] = this.params['process'];
      row['seq'] = seq;
      row['lotNo'] = null;
      row['cell'] = 120;
      row['adjCell'] = null;
      row['fCstno'] = null;
      row['fCstno'] = null;
      row['f수량'] = 30;
      row['작업시작'] = null;
      row['시작시각'] = null;
      row['작업종료'] = null;
      row['종료시각'] = null;
      row['tCstno'] = null;
      row['배출구'] = null;
      row['inCstno'] = null;
      row['설비cell수량'] = 0;
      row['t수량'] = 30;
      row['f불량수량'] = 0;
      row['투입수량'] = 0;
      row['특이사항'] = null;
      row['bef공정코드'] = befProcess;
      row['nxt공정코드'] = nxtProcess;
      row['박리작업구분'] = 0;
      row['불량합계'] = 0;      
      row['worker'] = this.params['worker'];
      row['작업자'] = this.params['worker'];
      row['shift'] = this.params['selectedShift'];
      row['machineCode'] = this.params['selectedMc'];
      row['작업시작datetime'] = moment().format('YYYY-MM-DD HH:mm:ss');
      row['작업종료datetime'] = moment().format('YYYY-MM-DD HH:mm:ss');

      this.dp().addRow(row);      
      this.setAddCstFocus();      
    },

    onCellItemClickedGrid(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      
      let ds = grid.getDataSource();
      if(clickData.fieldName === '삭제'){
        ds.removeRow(clickData.itemIndex);
      }
      return true;
    },

  },
};
</script>
