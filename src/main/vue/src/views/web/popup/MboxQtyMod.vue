<template>
  <b-modal v-model="isOpen" hide-footer size="lg" :title="params.dialogTitle"  no-close-on-backdrop :style="{zIndex: zIndex }" centered>
    <b-row class="row search_area">
      <b-col cols="2">
        <div class="form-floating">
						<input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.manager">
						<label for="floating">담당자</label>
				</div>
      </b-col>
      <b-col cols="2">
        <div class="form-floating">
						<input type="text" class="form-control label-60 lot_run_num" id="floating" placeholder="" v-model="params.approver">
						<label for="floating">승인자</label>
				</div>
      </b-col>
      <b-col cols="2">
        <b-form-group label-for="radio-options">
						<b-form-radio-group id="radio-options" v-model="modDiv" name="radioGroup1" :options="modDivs"></b-form-radio-group>
					</b-form-group>
      </b-col>
    </b-row>
    <div class="left_box">
      <div class="btn_wrap ms-auto">      
        <input
          type="number"
          class="form-control mx-2 text-center"
          style="width: 80px;"
          v-model.number="newRowCnt"
          :min="1"
        />
        <b-button class="sub" @click="addRowClick">행추가</b-button>
        <b-button @click="delRowClick">삭제</b-button>
        <b-button class="main" @click="saveClick">저장</b-button>
      </div>            
    </div>
    <b-row>
      <b-col>
        <RealGrid ref="grid1" :uid="'grid1'" :rows="grid1Rows" style="height: 72px" />
        <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 428px" />
      </b-col>
      <b-col>
        <RealGrid ref="grid3" :uid="'grid3'" :rows="grid3Rows" style="height: 500px" />
      </b-col>
    </b-row>
    
    <div class="bttn_wrap">      
      <b-button  block @click="closeDialog">닫기</b-button>
    </div>
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
  emits: ["confirm"],
  data() {
    return {
      isOpen: false,
      params: {        
        selectedRw:"", 
        mboxNo:"",
        manager:"",
        approver:"",      
      },
      zIndex: 0,
      
      grid1:null,
      grid1Rows:[],
      grid2:null,
      grid2Rows:[],
      grid3:null,
      grid3Rows:[],
      newRowCnt:1,
      modDiv:"add",
      modDivs: [
				{ text: '추가', value: 'add' },
				{ text: '삭제', value: 'del' },
			],
    };
  },
  computed: {},
  created() {
    this.initializeGrid();		
  },
  mounted() {
    // this.gv().columnByName('cellNo').styleCallback = this.cellStyleCallback;
    // this.gv().onValidateColumn = this.onValidateColumn;
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      // this.dp().setRows([]);
      this.searchCdt();            
    },
    closeDialog() {
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv(grid){
			return this.$refs[grid].getGridView();	
		},
		dp(grid){
			return this.$refs[grid].getGridDataProvider();
		},
    initializeGrid(){
      this.grid1 = _.cloneDeep(require(`@web/popup/js/MboxQtyModGrid1.js`));
      this.grid2 = _.cloneDeep(require(`@web/popup/js/MboxQtyModGrid2.js`));
      this.grid3 = _.cloneDeep(require(`@web/popup/js/MboxQtyModGrid3.js`));
    },
    cellStyleCallback(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
    async searchCdt(){            
			// this.gv().commit();
      // let param = {menuId:'M0003008',queryId:'selectMboxInfo',queryParams:this.params, target: null};
			// let rslt = await this.$axios.api.search(param);	   
      // if(!_.isEmpty(rslt)){
      //   this.params.manager = rslt[0]['담당자'];
      //   this.params.approver = rslt[0]['승인자'];
      //   this.params.mboxNo = rslt[0]['m-boxNo'];
      //   this.searchList();
      // }
    },
    async searchList(){
      // this.isNewMode = false;
      // let param = {menuId:'M0003008',queryId:'selectMboxCellList',queryParams:this.params, target: this.mboxCellRows};
			// await this.$axios.api.search(param);	   
    },
    incrementCodeFlexible(v) {
      let parts = this.params.mboxNo.split('-');
      let lastPart = parts[parts.length - 1];
      let numberPart = lastPart.match(/\d+$/)[0]; // 숫자 부분 추출
      if(numberPart === '000' && v < 0){ //0 이하 검색하지 않음
        return;
      }

      let incrementedNumber = String(parseInt(numberPart, 10) + v).padStart(numberPart.length, '0'); // 숫자 증가 및 패딩 처리
      let updatedLastPart = lastPart.replace(numberPart, incrementedNumber);
      console.log("updatedLastPart::",updatedLastPart);
      parts[parts.length - 1] = updatedLastPart;
     
      this.params.mboxNo = parts.join('-');
      this.searchList();
    },
    
    setCellIdFocus(r){
      // this.gv().setCurrent({ dataRow: r, fieldName : 'cellId' });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);      
    },
    addRowClick(){  
      // this.gv().commit();
      // this.dp().setRows([]);
      for(let i = 0; i < this.newRowCnt; i++){
        // this.dp().addRow({});
      }
      this.setCellIdFocus(0);
    },
    delRowClick(){
      // let sr = this.gv().getSelectedItems(true);
      // if(_.isEmpty(sr)){
      //   this.$toast("info",'선택된 정보가 없습니다.');
      //   return;
      // }
      // this.dp().removeRow(sr[0]);
    },
    async saveClick(){
      // this.$confirmYesOrNo("선택", "저장 하시겠습니까?", (confirmed) => {
      //   if (confirmed) {
      //     this.save();
      //   } 
      // });
    },
    async save(){
      // this.gv().commit();

      // let rslt = this.gv().validateCells(null, false);
      // if(rslt === null){
      //   let cellIds = this.dp().getDistinctValues('cellId').join(',');
      //   this.params['cellIds'] = cellIds;
      //   this.params['userName'] = this.userAuthInfo.loginUserName

      //   let param = {menuId:'M0003008',queryId:'execSaveMboxCell',queryParams:this.params, target: this.waitCellRows};
			//   this.$axios.api.search(param);	   

      //   this.searchList();
      // }
    },    
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
			let error = {};
			// if (column.fieldName === "cellId") {
			// 	if(value === null || _.isEmpty(value)){					
			// 		error.level = "warning";
			// 		error.message = "CELL NO 는 필수 입력입니다.";
			// 		this.$toast("warn",itemIndex + "행 CELL NO 는 필수 입력입니다.");
			// 	}
			// } 
			return error;
		},
    onCellEditedGrid(grid, itemIndex, row, field){
      // console.log("info:",itemIndex,row,field);  
      // this.checkCellNo(row,grid.getValue(row,'cellNo'));
    },
    async checkCellNo(row,cellNo){
      // this.params['cellId'] = cellNo;
      // // console.log("this.params:::",this.params);
      // let param = {menuId:'M0003008',queryId:'execCheckMboxWaitCell',queryParams:this.params, target: null};
			// let rslt = await this.$axios.api.search(param);	   
      // let info = rslt[0]; 
      // if('errmsg' in info){
      //   this.$toast("warning",info['errmsg']);        
      //   this.setCellIdFocus(row);
      // }else{
      //   this.dp().setValue(row, "cellNo", info['cellNo']);
      //   this.dp().setValue(row, "runNo", info['runNo']);
      //   this.dp().setValue(row, "agb호기명", info['agb']);
      //   this.dp().setValue(row, "pfl설비명", info['호기']);
      //   this.dp().setValue(row, "stage", info['stage']);
      //   this.dp().setValue(row, "pflScrap", "");
      //   this.dp().setValue(row, "이물line", info['이물제거']);
      //   this.dp().setValue(row, "특이사항", info['특이사항']);

      //   if(row + 1 < this.dp().getRowCount()){  //다음 로우가 있다면
      //     let ci = this.dp().getValue(row + 1,'cellNo');
      //     if(ci === undefined){
      //       this.setCellIdFocus(row + 1 );
      //     }
      //   }  
      // }
    }
  },
};
</script>
