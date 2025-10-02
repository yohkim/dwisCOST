<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle" dialog-class="custom-dialog" modal-class="mboxMng" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
		<div class="search_box mb-1">
			<b-row class="row search_area">
				<b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.srchMboxNo">
              <label for="floating">M-BOX NO</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.srchCellNo">
              <label for="floating">CELL NO</label>
          </div>
        </b-col>			
      </b-row>
			<div class="btn_area">
				<b-button @click="searchClick">
					<span class="ico_search"></span>
					조회
				</b-button>
			</div>
		</div>
    <div class="search_box mb-1">
      <b-row class="row search_area">
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.manager">
              <label for="floating">담당자</label>
          </div>
        </b-col>
        <!-- <b-col cols="2">
          <div class="form-floating">
              <input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.approver">
              <label for="floating">승인자</label>
          </div>
        </b-col> -->
        <b-col cols="3">
          <div class="form-floating">
              <input type="text" class="form-control label-80" id="floating" placeholder="" v-model="params.mboxNo" readonly>
              <label for="floating">M-BOX NO</label>
          </div>
        </b-col>
        <b-col cols="3">
         <b-button-group>
            <b-button class="second" @click="incrementCodeFlexible(-1)">이전</b-button>
            <b-button class="second" @click="incrementCodeFlexible(1)">다음</b-button>
            <b-button class="second" @click="newClick">신규</b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </div>
      <div class="grid_box">
        <div class="left_box">
          <div class="btn_wrap ms-auto">  
             <label for="infoText">MRUN_NO:</label>
              <input 
                type="text" 
                id="infoText" 
                style="width: 360px; margin-right: 680px;font-weight: bold;"
                v-model="infoValue"
                readonly 
                placeholder=""
              />    
            <input
              type="number"
              class="form-control mx-2 text-center"
              style="width: 60px;height:28px"
              v-model.number="newRowCnt"
              :min="1"
            />
            
            <b-button v-if="addButtonVisible" class="sub" @click="addRowClick">행추가</b-button>
            <!-- <b-button class="sub" @click="qtyModifyClick">수량수정</b-button> -->
            <b-button v-if="delButtonVisible" @click="delRowClick" class="ms-2">삭제</b-button>
            <b-button v-if="insButtonVisible" class="main" @click="saveClick">저장</b-button>
          </div>            
        </div>
      <RealGrid ref="grid" :uid="'grid'" :rows="mboxCellRows" style="height: 380px" :fitLayoutWidthEnable="false" />
    </div>
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
    <!-- <MboxQtyMod ref="mqmPopup" /> -->
  </b-modal>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  name: "ToolPopup",
  setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo};
	},
  props: {},
  components: {
		// MboxQtyMod
	},
  data() {
    return {
      infoValue: '', // 초기 값 설정
      isOpen: false,
      dialogParams: null,
      dialogPromise: null,
      dialogResolve: null,
      dialogReject: null,
      params: {
        dialogTitle: "M-BOX 관리",
        selectedRw:"", 
        mboxNo:"",
        manager:"",
        // approver:"",      
        srchMboxNo:"",
        srchCellNo:"",
      },
      zIndex: 0,
      rwList:[],
      mboxCellRows:[],     
      grid:null,
      newRowCnt:1,
      isNewMode:false,
      maxMboxNo:'',
      addButtonVisible: true, 
      delButtonVisible: true, 
      insButtonVisible: true, 
    };
  },
  computed: {},
  created() {
    this.getCodes();	
    this.initializeGrid();		
  },
  mounted() {
    this.gv().columnByName('cellNo').styleCallback = this.cellStyleCallback;
    this.gv().onValidateColumn = this.onValidateColumn;
  },
  methods: {  
    openDialog(params) {
      // Object.assign(this.params, params);
      // this.isOpen = true;
      // this.dp().setRows([]);
      // this.searchCdt(); 
      return new Promise((resolve) => {
        Object.assign(this.params, params);
        //this.dialogParams = params;
        this.isOpen = true;
        this.dp().setRows([]);
        this.searchCdt(); 
        this.resolveCallback = resolve; // resolve 함수 저장
      });      
    },
    closeDialog(result) {
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
      if (this.resolveCallback) {
            this.resolveCallback(result); // 팝업 닫힐 때 resolve 호출
            this.resolveCallback = null; // 참조 제거
          }
    },
    gv(){
			return this.$refs[['grid']].getGridView();	
		},
		dp(){
			return this.$refs['grid'].getGridDataProvider();
		},
    async getCodes(){
			await this.$utils.getCommonCodeValueText(['73'],[this.rwList]);	//사유
			
		},
    initializeGrid(){
      this.grid = _.cloneDeep(require(`@web/popup/js/MboxMng.js`));
    },
    cellStyleCallback(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
    buttonControl(onOff){
      addButtonVisible = onOff; 
      delButtonVisible = onOff;
      insButtonVisible = onOff; 
    } ,
    async searchCdt(){            
			this.gv().commit();
      let param = {menuId:'M0003008',queryId:'selectMboxInfo',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
      if(!_.isEmpty(rslt)){
        this.params.manager = rslt[0]['담당자'];
        // this.params.approver = rslt[0]['승인자'];
        this.params.mboxNo = rslt[0]['m-boxNo'];
        // this.params.mboxNo = '2411-7011P-A007';
        this.maxMboxNo = _.cloneDeep(this.params.mboxNo);        
        this.searchList();
      }
    },
    async searchList(){
      const firstRowIndex = 0; // 첫 번째 행 인덱스
      this.isNewMode = false;
      let param = {menuId:'M0003008',queryId:'selectMboxCellList',queryParams:this.params, target: this.mboxCellRows};
			await this.$axios.api.search(param);
      let rowCnt = this.dp().getRowCount();
      if(rowCnt > 0){
        this.infoValue = this.dp().getValue(firstRowIndex, 'mrunNo');  
      }else{
        //buttonControl(true);
        this.infoValue = '';
        //this.$toast("info","존재하지 않는 M-BOX입니다다.");
      }
    },
    async searchCellList(){
      this.isNewMode = false;
      let param = {menuId:'M0003008',queryId:'selectMboxCellList1',queryParams:this.params, target: this.mboxCellRows};
			await this.$axios.api.search(param);	   
    },
    incrementCodeFlexible(v) {
      let parts = this.params.mboxNo.split('-');
      let lastPart = parts[parts.length - 1];
      let numberPart = lastPart.match(/\d+$/)[0]; // 숫자 부분 추출
      
      if(Number(numberPart) <= 1 && v == -1){
        return;
      }
      
      let incrementedNumber = String(parseInt(numberPart, 10) + v).padStart(numberPart.length, '0'); // 숫자 증가 및 패딩 처리
      let updatedLastPart = lastPart.replace(numberPart, incrementedNumber);
      parts[parts.length - 1] = updatedLastPart;
      let tempMboxNo = parts.join('-');
      
      if(this.getMboxNo(tempMboxNo) - 1 === this.getMboxNo(this.maxMboxNo) && v === 1){
        return;
      }
      this.params.mboxNo = tempMboxNo;
      this.searchList();
    },
    getMboxNo(v){
      let parts = v.split('-');
      let lastPart = parts[parts.length - 1];
      let numberPart = lastPart.match(/\d+$/)[0]; // 숫자 부분 추출
      
      return Number(numberPart);
    },
    async newClick(){
      this.isNewMode = true;
      let param = {menuId:'M0003008',queryId:'selecNewMboxNo',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
      this.params.mboxNo = rslt[0];
      
      this.gv().commit();
      this.dp().setRows([]);
      this.dp().addRow({});

      this.infoValue='';
      // this.setCellIdFocus(0);
    },
    setCellIdFocus(r){
      this.gv().setCurrent({ dataRow: r, fieldName : 'cellId' });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);      
    },
    addRowClick(){  
      if(!this.isNewMode && _.isEmpty(this.mboxCellRows)){
        this.$toast("info","신규 처리 후 가능합니다.");
        return;
      }
      if(!_.isNil(this.infoValue) && this.infoValue.length> 0){
         this.$toast("info","이미 M-RUN이 발행된 M-BOX입니다다.");
         return;
      };
      this.gv().commit();

      let sl = this.gv().getSelectedRows();
      let insertIdx = _.isEmpty(sl)?0:sl.at(-1) + 1;

      for(let i = 0; i < this.newRowCnt; i++){
        this.dp().insertRows(insertIdx,[{}]);
      }
      // this.setCellIdFocus(0);
    },
    async delRowClick(){
      let sis = this.gv().getSelectedItems(true);
      if(_.isEmpty(sis)){
        this.$toast("info",'선택된 정보가 없습니다.');
        return;
      }
      if(!_.isNil(this.infoValue) && this.infoValue.length> 0){
         this.$toast("info","이미 M-RUN이 발행된 M-BOX입니다다.");
         return;
      };

      this.$confirmYesOrNo("선택", "삭제 하시겠습니까?", (confirmed) => {
        if (confirmed) {
          this.delete(sis);
        } 
      });
    },
    async delete(sis){
      let cellNoList = [];
      //this.$toast('info',JSON.stringify(sis,null,2)); return;
      sis.forEach(el => {
        let err_cell = this.dp().getValue(el,'runNo');
        if(!_.isNil(err_cell)){
          cellNoList.push(this.dp().getValue(el,'cellNo'));
        } 
      });
      // this.$toast('info',JSON.stringify(cellNoList,null,2)); return;
      this.params['cellNos'] = cellNoList.join(',');
      let param = {menuId:'M0003008',queryId:'execCancelMboxBoxCell',queryParams:this.params, target: null};
      await this.$axios.api.search(param).then(() => {
        this.$toast('info',"삭제 되었습니다.");
        this.dp().removeRows(sis);
      });	   
    },
    async saveClick(){
      this.gv().commit();
      
      let insertRows = this.$refs.grid.getSaveData().insert;
      if(_.isEmpty(insertRows)){
        this.$toast("info","신규 추가된 데이타가 없습니다.");
        return;
      }

      // if(!this.$utils.validateFields(this.params, ['T:담당자자:manager','T:승인자:approver'])){
      if(!this.$utils.validateFields(this.params, ['T:담당자자:manager'])){
				return;
			}

      let rslt = this.gv().validateCells(null, false);
      if(rslt === null){
        this.$confirmYesOrNo("선택", "저장 하시겠습니까?", (confirmed) => {
          if (confirmed) {
            this.save(insertRows);
          } 
        });
      }

    },
    async save(insertRows){    
      let cellNoList = [];
      // insertRows.forEach(el => {
      //   if(el['이물line']==='NG'){
      //     this.$toast('info','NG인 Cell을 모두 삭제후 저장 해야 합니다')
      //     return 0;
      //   }else { 
      //     cellNoList.push(el['cellNo']);
      //   } 
      // });

      // 1. NG 셀 검증
      const ngCells = insertRows.filter(el => el['이물line'] === 'NG');
      if(ngCells.length > 0){
        this.$toast('info', `${ngCells.length}개의 NG Cell이 존재합니다. 모두 삭제 후 저장해주세요.`);
        return;
      }

      const RwCnt = insertRows.map(el => el['rework판정']);
      // Set을 사용하여 중복 제거 후 비교
      const hasDifferentRwCnt = new Set(RwCnt).size > 1;
      if (hasDifferentRwCnt) {
       this.$toast('warning','Rework횟수가 같은 Cell_id로 M-BOX를 구성 하세요');
       return;
      }
      else
         {this.params['rwCnt'] = RwCnt[0]; }  

      const RunType = insertRows.map(el => el['org투입구분']);
      // Set을 사용하여 중복 제거 후 비교
      const hasDifferentTypeCnt = new Set(RunType).size > 1;
      if (hasDifferentTypeCnt) {
       this.$toast('warning','투입구분이 틀리니 확인 바랍니다');
       return;
      }
      else
         {this.params['runType'] = RunType[0]; }  


      // 2. 유효한 셀 추출
      cellNoList = insertRows.map(el => el['cellNo']);

      // 3. 저장 로직 수행
      this.params['cellNos'] = cellNoList.join(',');
      this.params['userName'] = this.userAuthInfo.loginUserName

      let param = {menuId:'M0003008',queryId:'execSaveMboxCell',queryParams:this.params, target: null};
      
      await this.$axios.api.search(param).then(() => {
        this.$toast('info',"저장되었습니다.");
      });	   
      this.searchList();
    },
    // qtyModifyClick(){
    //   let p = _.cloneDeep(this.params);
    //   p.dialogTitle = "수량 수정",
    //   this.$refs.mqmPopup.openDialog(p);
    // },
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
			let error = {};
			if (column.fieldName === "cellNo") {
				if(value === null || _.isEmpty(value)){					
					error.level = "warning";
					error.message = "CELL NO 는 필수 입력입니다.";
					this.$toast("warn",itemIndex+1 + "행 CELL NO 는 필수 입력입니다.");
				}
			} 
			return error;
		},
    onRowsPastedGrid(grid, items){
      items.forEach(el => {
        this.checkCellNoByPated(el,grid.getValue(el,'cellNo'));
      });
    },
    async checkCellNoByPated(row,cellNo){ 
      this.params['cellId'] = cellNo;
      let param = {menuId:'M0003008',queryId:'execCheckMboxWaitCell',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
      let info = rslt[0]; 
      //this.$toast('info',JSON.stringify(info, null, 2));
      if('errmsg' in info){
        this.$toast("warning",(row+1) + '행 ' + info['errmsg']);
        this.dp().setValue(row, "특이사항", info['errmsg']);                 
      }else{
        this.dp().setValue(row, "cellNo", info['cellNo']);
        this.dp().setValue(row, "투입구분", info['투입구분']);
        this.dp().setValue(row, "runNo", info['runNo']);
        this.dp().setValue(row, "runNo2", info['runNo2']);
        this.dp().setValue(row, "runNo3", info['runNo3']);
        this.dp().setValue(row, "runNo4", info['runNo4']);
        this.dp().setValue(row, "rework판정", info['rework판정']);
        this.dp().setValue(row, "agb호기명", info['agb']);
        this.dp().setValue(row, "pfl설비명", info['호기']);
        this.dp().setValue(row, "stage", info['stage']);
        this.dp().setValue(row, "pflScrap", info['scrap']);
        this.dp().setValue(row, "이물line", info['이물제거']);
        this.dp().setValue(row, "특이사항", info['특이사항']);
        this.dp().setValue(row, "org투입구분", info['org투입구분']);
      }
      
    },
    onCellEditedGrid(grid, itemIndex, row, field){
      this.gv().commit();
       let nv = this.$utils.korToEng(grid.getValue(row,'cellNo'));
       grid.setValue(row,"cellNo",nv);
      // this.checkCellNo(row,nv);
      if (!_.isEmpty(nv)) {
        let gridFindCnt = this.findRowInGrid(nv);
        if (gridFindCnt > 1) {
          //this.$toast('info', `해당 Cell No는 중복되었습니다.`);
          grid.setValue(row, "이물line", 'NG');       
          grid.setValue(row, "특이사항", 'Cell ID중복');      
          //grid.setValue(row, 'cellNo', '');
          this.setCellNoFocus(row);
        } else {
          this.checkCellNo(row,nv);
        }
      } else {
        //grid.setValues(row, this.emptyRow);
      }
    },
    onRowsPastedGrid(grid, items) {
      items.forEach((row) => {
        let nv = this.$utils.korToEng(grid.getValue(row, 'cellNo'));
        grid.setValue(row, 'cellNo', nv);
        if (!_.isEmpty(nv)) {
          let gridFindCnt = this.findRowInGrid(nv);
          if (gridFindCnt > 1) {
            //this.$toast('info', `${row + 1}행 cell No는 중복되었습니다.`);
            grid.setValue(row, "이물line", 'NG');       
            grid.setValue(row, "특이사항", 'Cell ID중복');      
           //grid.setValue(row, 'cellNo', '');
          } else {
            this.checkCellNo(row,nv);
          }
        } else {
          //grid.setValues(row, this.emptyRow);
        }
      });
    },
    findRowInGrid(cellNo) {
      if (_.isEmpty(cellNo)) return 0;

      let fields = ['cellNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: cellNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.gv().searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    }, 
		setRowStyleCallbackGrid(grid, item, fixed) {
			var ret = {};
			var state = grid.getValue(item.index, '이물line');
			//var reason = grid.getValue(item.index, 'NG사유');
			//var status2 = grid.getValue(item.index, 'boxno검증');
			//this.$toast("info",new_mrun);
			if (state == 'NG') {
				ret.style = { background: '#FF6666' }; //#FAFAD2
			 } //else if (status == 'NG' || status2 == 'NG') {
			// 	ret = 'red';
			// }

			return ret;
		},   
    async checkCellNo(row,cellNo){
      this.params['cellId'] = cellNo;
      // console.log("this.params:::",this.params);
      let param = {menuId:'M0003008',queryId:'execCheckMboxWaitCell',queryParams:this.params, target: null};
			let rslt = await this.$axios.api.search(param);	   
      let info = rslt[0]; 
      //this.$toast('info',JSON.stringify(info, null, 2));
      if('errmsg' in info){
        this.$toast("warning",info['errmsg']); 
        this.dp().setValue(row, "이물line", 'NG');       
        this.dp().setValue(row, "특이사항", info['errmsg']);            
        this.setCellIdFocus(row);
      }else{
        this.dp().setValue(row, "cellNo", info['cellNo']);
        this.dp().setValue(row, "투입구분", info['투입구분']);
        this.dp().setValue(row, "runNo", info['runNo']);
        this.dp().setValue(row, "runNo2", info['runNo2']);
        this.dp().setValue(row, "runNo3", info['runNo3']);
        this.dp().setValue(row, "runNo4", info['runNo4']);
        this.dp().setValue(row, "rework판정", info['rework판정']);
        this.dp().setValue(row, "agb호기명", info['agb']);
        this.dp().setValue(row, "pfl설비명", info['호기']);
        this.dp().setValue(row, "stage", info['stage']);
        this.dp().setValue(row, "pflScrap", info['scrap']);
        this.dp().setValue(row, "이물line", info['이물제거']);
        this.dp().setValue(row, "특이사항", info['특이사항']);
        this.dp().setValue(row, "org투입구분", info['org투입구분']);

        if(row + 1 < this.dp().getRowCount()){  //다음 로우가 있다면
          let ci = this.dp().getValue(row + 1,'cellNo');
          if(ci === undefined){
            this.setCellIdFocus(row + 1 );
          }
        }  
      }
      let rwCnt_1 = this.dp().getValue(0,'rework판정');
      let rwCnt_n = this.dp().getValue(row,'rework판정');
      if(rwCnt_1 != rwCnt_n ){
        this.dp().setValue(row, "이물line", 'NG');       
        this.dp().setValue(row, "특이사항", 'R/W횟수 틀림');      
      }
      let type_1 = this.dp().getValue(0,'투입구분');
      let type_n = this.dp().getValue(row,'투입구분');
      if(type_1 != type_n ){
        this.dp().setValue(row, "이물line", 'NG');       
        this.dp().setValue(row, "특이사항", '투입구분 틀림');      
      }
    },
    searchClick(){
      //if(!_.isEmpty(this.params.srchMboxNo) && _.isEmpty(this.params.srchCellNo)){
      if(!_.isEmpty(this.params.srchMboxNo)){  
        this.params.mboxNo = this.params.srchMboxNo;
        this.searchList();
      }else if(!_.isEmpty(this.params.srchCellNo)){ 
        this.searchCellList();
      }else{
        this.$toast("info","M-BOX NO 또는 CELL NO를 입력해 주세요");
        return;
      }
      
    },
    setCellNoFocus(r) {
      this.gv().setCurrent({ dataRow: r, fieldName: 'cellNo' });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);
    },
  },
};
</script>
<style>
.mboxMng {
  top: 150px !important; 
}
.custom-dialog {
  max-width: 1500px;
}
</style>
