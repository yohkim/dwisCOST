<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle" modal-class="mboxWaitCellMng" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
		<div class="search_box mb-1">
      <b-row class="search_area">
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.manager">
              <label for="floating">담당자</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
              <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="params.cause" @change="rwChange">
                <option v-for="(rw,index) in rwList" :value="rw.value" :key="index">{{rw.text}}</option>
              </select>
              <label for="floatingSelect" class="select">사유</label>
            </div>
        </b-col>
        <b-col cols="2">
		<div class="form-floating">
		    <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="params.process" @change="stepChange">
		      <option v-for="(step,index) in stepList" :value="step.value" :key="index">{{step.text}}</option>
		    </select>
		    <label for="floatingSelect" class="select">공정</label>
		  </div>
          <!--code-select :code="'93'" :label="'공정'" v-model="params.process" -->
        </b-col>
      </b-row>
    </div>
    <div class="grid_box">
    <div class="left_box">
      <div class="btn_wrap ms-auto">  
        <span style="margin-right: 680px; font-weight: bold;">제품유형: {{ this.params.selectedModel }}</span> 
        <input
          type="number"
          class="form-control mx-2 text-center"
          style="width: 60px;height:28px"
          v-model.number="newRowCnt"
          :min="1"
        />
        <b-button class="sub" @click="addRowClick">행추가</b-button>
        <b-button @click="delRowClick" class="ms-2">삭제</b-button>
        <b-button v-if="saveButtonVisible"  class="main" @click="saveClick">저장</b-button>
      </div>            
    </div>
      <RealGrid ref="grid" :uid="'grid'" class="grid-border-none" :rows="waitCellRows" style="height: 380px" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import { RowState } from 'realgrid';
// import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: "MboxWaitCellMngPopup",
  setup() {
		// const userAuthInfo = useUserAuthInfo();
		// return { userAuthInfo};
	},
  props: {},  
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: "M-BOX 대기Cell 관리",
        cause:"", 
        manager:"",
        process:"",
		step:"",
      },
      zIndex: 0,
      rwList:[],
	  stepList:[],
      waitCellRows:[],     
      grid:null,
      newRowCnt:1,
	  saveButtonVisible : false,
	  param:[],
    };
  },
  computed: {},
  created() {
  	this.getCodes();	
	this.getSteps();	
    this.initializeGrid();		
  },
  mounted() {
    this.gv().columnByName('cellId').styleCallback = this.cellStyleCallback;
    this.gv().onValidateColumn = this.onValidateColumn;
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.dp().setRows([]);
      this.search();      
    },
    closeDialog() {  
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv(){
			return this.$refs['grid'].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    async getCodes(){ //안녕하세요
		// 제외하고 싶은 값들을 배열로 정의합니다.
		const excludedValues = ['0', '1','3']; // '0'-미처리,'1'-M-BOX, '2'- M-RUN 
		await this.$utils.getCommonCodeValueText(['73'],[this.rwList]);	//사유
		const filteredRwList  = this.rwList.filter(item => !excludedValues.includes(item.value));
		this.rwList = filteredRwList;
		},
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/popup/js/MboxWaitCellMng.js`));
    },
	async getSteps(){
		// 제외하고 싶은 값들을 배열로 정의합니다.
		const excludedSteps = ['BC','00']; //FQC & ISM 공정은 Bare 처리이기 때문에 QR CELL 처리에서 제외 함 
		await this.$utils.getCommonCodeValueText(['93'],[this.stepList]);	//사유
		const filteredStepList  = this.stepList.filter(item => !excludedSteps.includes(item.value));
		this.stepList = filteredStepList;
		},
	initializeGrid(){
	  this.grid = _.cloneDeep(require(`@web/popup/js/MboxWaitCellMng.js`));
	},
    cellStyleCallback(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
    rwChange(){
		  //this.saveButtonVisible = false;   //저장버튼 안보이게 하기
      this.search();
	}, 
	stepChange(){
	  //this.$toast('info',this.params.process);
	  this.search();
	},
    search(){      
      // console.log("this.params:::",this.params);
		this.gv().commit();
    this.dp().setRows([]);
    	//let param = {menuId:'M0003008',queryId:'selectMboxWaitCellList',queryParams:this.params, target: this.waitCellRows};
		if(this.params.process === "BC"){	//M-FQC & ISM	
			this.param = {menuId:'M0003008',queryId:'selectMboxWaitCellList',queryParams:this.params, target: this.waitCellRows}
		}else if(this.params.process === "QC1"){ //필름 포장 검사	
			this.param = {menuId:'M0003008',queryId:'selectMboxWaitCellList',queryParams:this.params, target: this.waitCellRows}
		}else if(this.params.process === "QC2"){ //ECI & VRS
			this.param = {menuId:'M0003008',queryId:'selectEciWaitCellList',queryParams:this.params, target: this.waitCellRows}
		}else if(this.params.process === "QC3"){ //이물제거
			this.param = {menuId:'M0003008',queryId:'selectFmrWaitCellList',queryParams:this.params, target: this.waitCellRows}
		}
		this.$axios.api.search(this.param);
		this.saveButtonVisible = false;   //검색 후에 저장버튼 안보이게 하기     	   
    },
    setCellIdFocus(r){
      this.gv().setCurrent({ dataRow: r, fieldName : 'cellId' });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);      
    },
    addRowClick(){    
      this.gv().commit();
      this.dp().setRows([]);
      for(let i = 0; i < this.newRowCnt; i++){
        this.dp().addRow({});
      }
	  this.saveButtonVisible = true; //저장버튼 보이게 하기
      // this.setCellIdFocus(0);
    },
    delRowClick(){
      let sr = this.gv().getSelectedItems(true);
      if(_.isEmpty(sr)){
        this.$toast("info",'선택된 정보가 없습니다.');
        return;
      }
      //this.$toast("info",this.dp().getValue(sr[0],'cellId')+this.params.process);
      let param = {
                  menuId: 'M0003008',
                  queryId: 'deleteMrunWaitCell',
                  queryParams: {
                      cellId: this.dp().getValue(sr[0], 'cellId'),
                      process: this.dp().getValue(sr[0], '공정코드') //this.params.process
                  }};
      this.$axios.api.search(param);            
      this.dp().removeRow(sr[0]);
      //db 삭제여부 확인 필요
    },
    async saveClick(){
      console.log(this.params);
      this.gv().commit();
      if(!this.$utils.validateFields(this.params, ['T:담당자:manager','S:사유:cause','S:공정:process'])){
				return;
			}
      let rslt = this.gv().validateCells(null, false);
	  //this.$toast("warning",step);
	  
      if(rslt === null){
        this.$confirmYesOrNo("선택", "저장 하시겠습니까?", (confirmed) => {
          if (confirmed) {
            this.save(); 
          } 
        });
      }
    },
    async save() {
      try {
        // 1. cellIds 저장
        let cellIds = this.dp().getDistinctValues('cellId').join(',');
        this.params['cellIds'] = cellIds;
        
        let param = {
          menuId: 'M0003008',
          queryId: 'execSaveMboxWaitCell',
          queryParams: this.params,
          target: null //this.waitCellRows
        };

        let resp = await this.$axios.api.search(param);
        
        if (!_.isNil(resp[0]?.errormessage)) {
          throw new Error(resp[0].errormessage);
        }

        // 2. 특이사항이 있는 행들만 저장
        const rowCount = this.dp().getRowCount();
        const rowsWithRemark = [];

        for (let i = 0; i < rowCount; i++) {
          const remarkValue = this.dp().getValue(i, "특이사항");
          if (remarkValue?.trim()) {
            rowsWithRemark.push({
              cellId: this.dp().getValue(i, "cellId"),
              remarks: remarkValue
            });
          }
        }
        if (rowsWithRemark.length > 0) {
          let param2 = {
            menuId: "M0003008",
            insert: [{ queryId: "saveRemarks", data: rowsWithRemark }]
          };
          //this.$toast('info',JSON.stringify(param2,null,2)); return;
          let resp2 = await this.$axios.api.saveData(param2);
          
          if (!_.isNil(resp2[0]?.errormessage)) {
            throw new Error(resp2[0].errormessage);
          }
        }

        if (resp[0]?.message) {
          this.$toast("info", resp[0].message);
        }
        
      } catch (error) {
        console.error("저장 실패:", error);
        this.$toast("error", error.message || "에러발생. 다시 작업해주세요.");
        throw error;
      } finally {
        this.search();
      }
    },
    checkDuplicateValues(row, gridView, columnName) {
      const dataSource = gridView.getDataSource();
      //const rowCount = dataSource.getRowCount();
      const valueMap = new Map(); // 값과 첫 번째 발견된 행 인덱스 저장
      const duplicates = []; // 중복 정보 수집

      for (let i = 0; i < row; i++) {
        const value = dataSource.getValue(i, columnName);

        // null/undefined/빈 문자열은 무시 (조건에 따라 선택적 적용)
        if (value == null || value === "") continue;

        // 문자열인 경우 대소문자 무시 및 공백 제거
        const normalizedValue = typeof value === 'string' 
          ? value.toString().trim().toLowerCase() 
          : value;

        if (valueMap.has(normalizedValue)) {
          duplicates.push({
            duplicateRow: i, // 현재 중복된 행
            originalRow: valueMap.get(normalizedValue), // 원본 행
            value: value // 실제 값
          });
        } else {
          valueMap.set(normalizedValue, i);
        }
      }

      return duplicates;
    },
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
			let error = {};
			if (column.fieldName === "cellId") {
				if(value === null || _.isEmpty(value)){					
					error.level = "warning";
					error.message = "CELL NO 는 필수 입력입니다.";
					this.$toast("warn",itemIndex + "행 CELL NO 는 필수 입력입니다.");
				}
			} 
			return error;
		},    
    onRowsPastedGrid(grid, items){
      items.forEach(el => {
        let notes = grid.getValue(el,'특이사항');
        //this.$toast('info',notes);  
        if(!_.isEmpty(notes))
           return;
        this.checkCellIdByPasted(el,grid.getValue(el,'cellId'));
      });
    },
    async checkCellIdByPasted(row,cellId){
      this.params['cellId'] = cellId;
      // const duplicateCells = this.checkDuplicateValues(row,this.gv(), 'cellId');
      // if (duplicateCells.length > 0) {
      //   console.log('중복된 셀 발견:', duplicateCells);
      //   this.$toast('warning', cellId + ' 는 중복 입니다');
      //   this.dp().setValue(row, "cellId", null);
      //   this.gv().cancel(); 
      // } 
      let param = {menuId:'M0003008',queryId:'execCheckMboxWaitCell',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
      let info = rslt[0]; 
      //this.$toast('info',JSON.stringify(info, null, 2));
      if (!info || 'errmsg' in info) {
        this.$toast("warning", (row+1) + '행 ' + (info?.errmsg || "Invalid data"));
        this.dp().setValue(row, "cellId", null);
        this.gv().cancel();          
      }else{
        this.dp().setValue(row, "cellId", info['cellNo']);
        this.dp().setValue(row, "runNo", info['runNo']);
        this.dp().setValue(row, "agb호기명", info['agb']);
        this.dp().setValue(row, "pfl설비명", info['호기']);
        this.dp().setValue(row, "pflStage", info['stage']);
        this.dp().setValue(row, "pflScrap", info['scrap']);
        this.dp().setValue(row, "이물Line", info['이물제거']);
        this.dp().setValue(row, "특이사항", info['특이사항']);
      }
    },
    onCellEditedGrid(grid, itemIndex, row, field){      
      this.gv().commit(); 
      let notes = grid.getValue(row,'특이사항');
      //this.$toast('info',notes);  
      if(!_.isEmpty(notes))
           return;
      let nv = this.$utils.korToEng(grid.getValue(row,'cellId'));
      grid.setValue(row,"cellId",nv);
      this.checkCellId(row,nv);
    },
    async checkCellId(row,cellId){
      //const duplicateCells = this.checkDuplicateValues(row, this.gv(), 'cellId');
      // if (duplicateCells.length > 0) {
      //   console.log('중복된 셀 발견:', duplicateCells);
      //   this.$toast('warning', cellId + ' 는 중복 입니다');
      //   this.dp().setValue(row, "cellId", null);
      //   this.gv().cancel();
      //   return; 
      // } 
      this.params['cellId'] = cellId;
      // console.log("this.params:::",this.params);
      let param = {menuId:'M0003008',queryId:'execCheckMboxWaitCell',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
      let info = rslt[0]; 
      //this.$toast('info',JSON.stringify(info, null, 2)); return;
      if('errmsg' in info){
        //this.$toast("warning",info['errmsg']);        
       //this.setCellIdFocus(row);
        this.$toast("warning",(row+1) + '행 ' + info['errmsg']);
		    this.dp().setValue(row, "cellId",null); //  기존에 처리된 CELL ID이면 cell_id 컬럼 NULL처리
        this.gv().cancel();    
      }else{
        this.dp().setValue(row, "cellId", info['cellNo']);
        this.dp().setValue(row, "runNo", info['runNo']);
        this.dp().setValue(row, "agb호기명", info['agb']);
        this.dp().setValue(row, "pfl설비명", info['호기']);
        this.dp().setValue(row, "pflStage", info['stage']);
        this.dp().setValue(row, "pflScrap", info['scrap']);
        this.dp().setValue(row, "이물Line", info['이물제거']);
        this.dp().setValue(row, "특이사항", info['특이사항']);

        if(row + 1 < this.dp().getRowCount()){  //다음 로우가 있다면
          let ci = this.dp().getValue(row + 1,'cellId');
          if(ci === undefined){
            this.setCellIdFocus(row + 1 );
          }
        }  
      }
    }
  },
};
</script>
<style>
.mboxWaitCellMng {
  top: 120px !important; 
}
</style>
