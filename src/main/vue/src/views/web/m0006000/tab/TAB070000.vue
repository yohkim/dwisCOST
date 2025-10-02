/**
*	기준정보 > QR정보 등록 > 작업종료 QR
*/
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2"> </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick"
          ><span class="ico_search"></span>조회</b-button
        >
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="excelBtnClick">엑셀</b-button>
          <b-button class="sub" @click="addBtnClick">추가</b-button>
          <b-button @click="delBtnClick">삭제</b-button>
          <b-button class="main" @click="saveBtnClick">저장</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="tab070000Grid" :uid="'tab070000Grid'" :rows="rows" :fitLayoutWidthEnable="false"/>
      </div>
    </div>
    <CmDialog1 ref="tab070000Dialog1" @confirm="handleConfirm"/>
  </div>  
</template>

<script>

import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { RowState } from 'realgrid';

export default {
  props: {},
  components: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      rows: [],
      tab070000Grid: null,
      target: "",
      searchFlag: false,
      isValidateCellsTab070000Grid: false,
      duplicateKey: ["공정명","설비약명","modelCode","shift"],
      duplicateIndices: [],
    };
  },
  computed: {},
  created() {
    this.initializeGrid();
  },
  mounted() {},
  beforeUnmount() {},
  methods: {
    GV() {
      return this.$refs.tab070000Grid?.getGridView();
    },
    DP() {
      return this.$refs.tab070000Grid?.getGridDataProvider();
    },
    initializeGrid() {
      this.tab070000Grid = _.cloneDeep(require(`@web/m0006000/js/TAB070000.js`));
    },
    excelBtnClick(){

    },
    searchClick() {
			this.getDataList();
		},
    async getDataList(){
			this.GV().commit();

			let param = {menuId:'M0006013',queryId:'M0006013_Sch4', target: this.rows};
			await this.$axios.api.search(param);
		},
    addBtnClick(){
      this.GV().commit();
      this.DP().insertRow(0, { line: "DFB1", processId: "D1UT", shift: "-", initUser: this.userAuthInfo.userInfo.userId, initUserNm: this.userAuthInfo.userInfo.userName });
      let itemIndex = this.GV().getItemCount() - 1;
      this.GV().setCurrent({ itemIndex: itemIndex });
    },
    delBtnClick(){
      this.GV().commit();
			const checkedRows = this.GV().getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하세요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.DP().getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.DP().setRowState(itemIndex, RowState.DELETED);
					}
				});
        if(delItems.length > 0){
          this.DP().removeRows(delItems);
        }
			}
    },
    saveBtnClick(){
      this.GV().commit();
      
      this.duplicateIndices = this.$utils.findDuplicateIndices(this.duplicateKey, this.DP().getJsonRows(0,-1));

      if(!_.isEmpty(this.validateCellsTab070000Grid())){
        this.$toast('info', '입력하세요.');
        return;
      }  

      this.$confirm("확인", "저장 하시겠습니까?", (confirm)=>{
        if(confirm){
          this.saveData();
        }
      });   
		},

    async saveData() {

			let saveData = this.$refs.tab070000Grid.getSaveData();
      console.log("saveData", saveData);
  		let param = {
        menuId:'M0006013',
        delete: [{queryId:'M0006013_Delete1', data:saveData.delete}],
        insert: [{queryId:'M0006013_Insert1', data:saveData.insert}],
        update: [{queryId:'M0006013_Update1', data:saveData.update}],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', "저장 되었습니다.");
        this.searchClick();
      } else {
        this.$toast('error', resp.message);
      }
		},    

    handleConfirm(params){
      let data = {};
			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {
				data = params.dataProvider.getJsonRow(checkRow[0]);
        let current = this.GV().getCurrent();
        let jsonData = this.DP().getJsonRow(current.dataRow);
        if(this.target == "공정명"){
          this.GV().setValue(current.dataRow, "공정코드", data["공정코드"]);
          this.GV().setValue(current.dataRow, "공정명", data["공정명"]);
          this.GV().setValue(current.dataRow, "설비번호", null);
          this.GV().setValue(current.dataRow, "설비약명", null);
          this.GV().setValue(current.dataRow, "qr", null);
        }else if(this.target == "설비약명"){
          this.GV().setValue(current.dataRow, "설비번호", data["설비번호"]);
          this.GV().setValue(current.dataRow, "설비약명", data["설비약명"]);
          this.GV().setValue(current.dataRow, "qr", null);
        }else if(this.target == "modelCode"){
          this.GV().setValue(current.dataRow, "modelCode", data["model"]);
        }
        if(this.target == "설비약명"){
          let code = _.isNil(jsonData["code"]) ? "" : jsonData["code"];
          if(code != ""){
            this.GV().setValue(current.dataRow, "qr", data["설비약명"]+" "+code);
          }else{
            this.GV().setValue(current.dataRow, "qr", data["설비약명"]);
          }
        }
			}	
    },

    validateCellsTab070000Grid(){
      this.isValidateCellsTab070000Grid = true;
      let error = this.GV().validateCells(null, false);
      this.isValidateCellsTab070000Grid = false;
      return error;
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackTab070000Grid(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(cell.index.dataRow);
      if(fieldName == 'code'){
        if(!_.isNil(jsonData["설비약명"])){
          rtn.editable = true;
          rtn.styleName = "tl edit";
        }else{          
          rtn.editable = false;
          rtn.styleName = "tl";
        }        
      }else if(fieldName == "shift"){
        if(this.DP().getRowState(cell.index.dataRow) !== RowState.CREATED){
          rtn.readOnly = true;
        }else{
          rtn.editable = true;
        }
      }
      return rtn
    },

    onCellClickedTab070000Grid(grid, clickData) {
      if(clickData.cellType !== "data") return;

      if(clickData.fieldName == '공정명' || clickData.fieldName == '설비약명' || clickData.fieldName == 'modelCode'){
        
        let current = this.GV().getCurrent();
        if(this.DP().getRowState(current.dataRow) !== RowState.CREATED){
          return;
        }
        let jsonData = this.DP().getJsonRow(current.dataRow);
        if(clickData.fieldName == '설비약명'){
          if(_.isNil(jsonData["공정명"])){
            this.$toast("info", "공정이 빈값입니다.");        
            return;
          }
        }
        this.searchFlag = clickData.fieldName == 'modelCode' ? true : false;
        this.target = clickData.fieldName;
				let params = {
					dialogTitle: this.$utils.findMappedValue(["공정명","설비약명","modelCode"],["공정","설비","modelCode"], clickData.fieldName),					
					height: 300,
					width: 1800,
					gridJs: this.$utils.findMappedValue(["공정명","설비약명","modelCode"],["CP0000000020.js","CP0000000021.js","CP0000000022.js"], clickData.fieldName),
          btnConfirm: false,
					search: { menuId: "M0006013", queryId: this.$utils.findMappedValue(["공정명","설비약명","modelCode"],["M0006013_Sch1","M0006013_Sch2","M0006013_Sch3"], clickData.fieldName), queryParams: jsonData}
				};	
				this.$refs.tab070000Dialog1.openDialog(params);
      }
    }, 

    onCellEditedTab070000Grid(grid, itemIndex, row, field) {
      grid.commit();
      const ds = grid.getDataSource();
      let fieldName = ds.getOrgFieldName(field);
      let jsonData = ds.getJsonRow(itemIndex);
      if(fieldName === "code") {
        const equip = jsonData["설비약명"];
        const code = jsonData["code"];
        grid.setValue(itemIndex, "qr", equip+" ("+code+")");
      }
      let current = this.GV().getCurrent();
      if(this.DP().getRowState(current.dataRow) == RowState.UPDATED){
        grid.setValue(itemIndex, "modiUser", this.userAuthInfo.userInfo.userId);
        grid.setValue(itemIndex, "modiUserNm", this.userAuthInfo.userInfo.userName);
      }
		},
    
    onValidateColumnTab070000Grid(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if(!this.isValidateCellsTab070000Grid) return error;
      if(this.$utils.containsValue(["공정명","설비약명","modelCode","code","qr"], column.fieldName)){
        if(_.isNil(value) || value == ""){
          error.level = "error";
          error.message = "필수 입력입니다.";
        }        
      }

      if(this.duplicateIndices.includes(itemIndex) && this.$utils.containsValue(["공정명","설비약명","modelCode","shift"], column.fieldName)){
        error.level = "warning";
        error.message = "중복 입력입니다.";
      }
      return error;
    },
    onValidationFailTab070000Grid(grid, itemIndex, column, err) {
      return false;
    },
  },
};
</script>