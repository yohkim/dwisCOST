/**
*	자재관리 > 부자재 - 더미글라스 > 공정투입
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">        
                    <div class="label_title">작업 일자</div>                        
                    <div class=" form-floating me-1"> 
                        <date-picker label="시작일"  v-model="searchFromDate" />
                        <label for="floatingPicker">시작일</label>
                    </div>
                    ~
                  <div class=" form-floating ms-1 "> 
                        <date-picker label="종료일"  v-model="searchToDate" />
                        <label for="floatingPicker">종료일</label>
                    </div>  
                </b-col>
                <b-col cols="1">
                    <div class="form-floating">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="searchShift" >
                            <option v-for="item in shiftList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">근무조</label>
                    </div>
                </b-col>
                <b-col cols="1">
                    <div class="form-floating">
                        <select class="form-select label-65 " id="floatingSelect" aria-label="Floating label select example" v-model="searchUseCategory" >
                            <option v-for="item in useCategoryList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">투입구분</label>
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="form-floating">
                        <input type="text" ref="searchMaterialId" class="form-control label-80" id="floating" placeholder="바코드 검색" autocomplete="off" 
                         v-model="searchMaterialId"
                         @input="this.$utils.convertToUpperEng($event, 'searchMaterialId', this)" 
                         @keyup.enter="searchBtnClick"                         
                        >
                        <label for="floating">바코드 검색</label>
                    </div> 
                </b-col>                
            </b-row>
            <div class="btn_area">
                <b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>
            </div>
        </div>
         <div class="worker_wrap">
            <b-row class="worker_info">
                 <b-col cols="4" class="d-flex">
                    <div class="title" style="width:110px">공정투입 작업</div>
                    <div class="in_time"><span>{{ currentTime }}</span></div>
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="작업자" autocomplete="off" v-model="workerName">
                        <label for="floating">작업자</label>
                    </div>              
                </b-col>				
                <b-col cols="4">
                    <div class="form-floating">
                        <input type="text" ref="materialId" class="form-control label-60" id="floating" placeholder="바코드" autocomplete="off" v-model="materialId" :disabled="isDisabledBarcode" 
                        @input="this.$utils.convertToUpperEng($event, 'materialId', this)" 
                        @keyup.enter="processBarcode">
                        <label for="floating">바코드</label>
                    </div>              
                </b-col>
                <b-col cols="2">
                    <div style="width:400px"><span style="font-size: 11px; color: blue;">* 공정투입 작업전 투입구분 선택, 작업자를 입력하십시요. </span></div>
                </b-col>
            </b-row>
        </div>
        <div class="grid_box material_box">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick">엑셀</b-button>					
                    <b-button refs="btnDelete" @click="delBtnClick">삭제</b-button>
                    <b-button class="main" refs="btnSave" @click="saveBtnClick">저장</b-button>  
                    <b-button refs="btnCancel" @click="cancelBtnClick" v-show="curMode==='C'" >취소</b-button>  
                </div>            
            </div> 
            <div class="grid-border-none">
                <RealGrid ref="matGrid" :uid="'matGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
                <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
            </div>
        </div>
    </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001208.js';

const URI_PREFIX = '/api/m0001000/m0001008/TAB001208';
const MAT_CTG_CODE = '20';
const MAT_TYPE_CODE = 'DUMMY';

export default {
	props: {},  
	components: {},
	watch: {},
    setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },
	data () {
		return {
            currentTime: this.$utils.getTodayDateTime(), // 초기 날짜와 시간
			matGrid:null,
            gridRows:[],
            shiftList: [],
            useCategoryList: [],
			equipList: [],		
            etcUseList: [],	
            curMode: 'R',			
            searchFromDate: this.$utils.getWorkDate("-"), 
            searchToDate: this.$utils.getTodayDate("-"), 
            searchShift:'',
            searchUseCategory:'',
			searchEquip:'',
            workDate:'',
            outDate:  this.$utils.getTodayDate(""),
            createUserId: this.userAuthInfo.userInfo.userId,
			workerName:'',
            materialId: '',
            searchMaterialId:'',
            unit:'',
			timeInterval:'',
		}
	},
	computed: {
		matGridView(){
			return this.$refs.matGrid.getGridView();
		},
		matGridDataProvider(){
			return this.$refs.matGrid.getGridDataProvider();
		},
        isDisabledBarcode(){
            return  _.isEmpty(this.workerName) || _.isEmpty(this.searchUseCategory);
        },
        isBarcodeMode(){
            return ( this.curMode === 'C' )
        },        
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

        this.matGridView.checkBar.checkableCallback = this.checkableCallback;
        this.matGridView.onValidateColumn = this.onValidateColumn;
        this.matGridView.onCellClicked = this.onCellClicked;
        this.matGridView.onCellEdited = this.onCellEdited;
        this.matGridView.editOptions.commitByCell = true;	
        this.matGridView.filteringOptions.automating.lookupDisplay = true;	

        this.setCurTime();
		this.getSelectOptions();

        this.matGridView.setColumnProperty("equipNm", "displayCallback", (grid, index, value) => {
                let ds = grid.getDataSource();
                let rowData = ds.getJsonRow(index.dataRow);

                if (rowData.useCategory === "E") {
                    let selectedOption = this.etcUseList.find(item => item.itemValue === value);
                    return selectedOption ? selectedOption.itemText : value;
                }
                return value;
            });  
            
        this.$eventBus.on("TAB001208MenuMove", this.menuMove);            
	},
	beforeUnmount() {
        this.$eventBus.off("TAB001208MenuMove");
    },
    beforeDestroy() {
        // 컴포넌트가 파괴될 때 setInterval을 정리
        clearInterval(this.timeInterval);
    },
    methods: {
        initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        setCurTime(){
            // 1초마다 currentTime을 갱신
            this.timeInterval = setInterval(() => {
                this.currentTime = this.$utils.getTodayDateTime();

                const hour = parseInt(this.currentTime.substring(11, 13));
                if (hour >= 8 && hour < 20) {
                    this.currentTime = this.currentTime + ' 주간';
                } else {
                    this.currentTime = this.currentTime + ' 야간';
                } 

            }, 1000);
        },

        menuMove(data) {
            this.$nextTick(()=>{

                this.searchFromDate = this.$utils.formatDate(data.clickedField.slice(1),"-");
                this.searchToDate = this.searchFromDate;
                this.searchShift = '';
                this.searchUseCategory = '';

                this.getDataList();
            });
        },              

        async getSelectOptions(){

			const step = ['010'];

			let params = [ { majCode : "75"},  { majCode : "74"}, { majCode : "90"}, {matCategoryCode : MAT_CTG_CODE, matTypeCode : MAT_TYPE_CODE} ];
            let matInfo = [];			
            let shiftInfo = [];

			let searchParam = [
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params[0],
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.shiftList );
										}
				},
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params[1],
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.useCategoryList );
										}
				},	                
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params[2],
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.etcUseList	);
										}
				},  				
				{ menuId:'M0001003', queryId:'selectMatUnit', queryParams:params[3], target:matInfo },
                { menuId:'COMCODE', queryId:'selectShiftInfo', target:shiftInfo }
            ];

			let resp = await this.$axios.api.searchAll(searchParam);

            this.searchShift = shiftInfo[0].shiftCode;

            this.unit = matInfo[0].unit;

            this.useCategoryList.push({ itemValue:"E", itemText:"기타" });

			this.matGridView.setColumnProperty("shiftCode", "values", 
				this.shiftList.map(item=>item.itemValue)
			);
			this.matGridView.setColumnProperty("shiftCode", "labels", 
				this.shiftList.map(item=>item.itemText)
			);

			this.matGridView.setColumnProperty("useCategory", "values", 
				this.useCategoryList.map(item=>item.itemValue)
			);
			this.matGridView.setColumnProperty("useCategory", "labels", 
				this.useCategoryList.map(item=>item.itemText)
			);

            this.shiftList.unshift({ itemValue:"", itemText:"전체" }); 
            this.useCategoryList.unshift({ itemValue:"", itemText:"전체" });

            this.getDataList();	  
		},

        async getDataList(){
			this.matGridView.commit();
            if ( this.curMode == "C") {
                this.matGridDataProvider.clearRows();
            }                
            this.curMode = 'R';    

			let params = {
				fromDate : this.searchFromDate.replaceAll('-',''),
                toDate : this.searchToDate.replaceAll('-',''),
				shiftCode : this.searchShift,
                useCategory : this.searchUseCategory,
                searchMaterialId: this.searchMaterialId
			};

			let param = {menuId:'M0001008',queryId:'selectMatDummyOut', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

        checkableCallback(dataSource, item){
            if ( this.matGridDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }

            return false;

        },

        setCellStyleCallbackMatGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "workerName" ||  fieldName === "equipNm" || fieldName === "outQty" || fieldName === "errorWorkQty" || fieldName === "errorMatQty" || fieldName === "comments" ) {

				let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y" || this.isBarcodeMode || fieldName === "comments" ) {
                    rtn.editable = true;
                    rtn.styleName = "edit " + styleName;

                    if ( jsonData.useCategory === "E" &&  fieldName === "equipNm" ) {                        
                        rtn.editor = {
                            type: "dropdown",
                            domainOnly: true,
                            textReadOnly: true,
                            dropDownWhenClick: true,
                            labels : this.etcUseList.map(item=>item.itemText),
                            values : this.etcUseList.map(item=>item.itemValue)
                        };
                        rtn.lookupDisplay = true; 
                    }
                    else {
                        rtn.editor = {};
                    }
                }
                else {
                    rtn.editable = false;
                    rtn.styleName = styleName;   
                }    
            }

            return rtn;
        },

        // onCellEdited(grid, itemIndex, dataRow, field) {
            
        //     if (field === "equipNm") {
        //         let equipValue = grid.getValue(itemIndex, "equipNm"); // 선택된 값
        //         let selectedOption = this.etcUseList.find(item => item.itemValue === equipValue);
                
        //         if (selectedOption) {
        //             grid.setValue(itemIndex, "equipNo", selectedOption.itemValue); // 선택한 값(value)을 equipNo에 저장
        //             grid.setValue(itemIndex, "equipNm", selectedOption.itemText);  // 선택한 텍스트(text)를 equipNm에 저장
        //         }
        //     }
        // },

        onCellClicked( grid, clickData ){

			if (clickData.cellType != "data") return;

            if ( clickData.editable ) { 				

				//let step = ['010'];				

				//let searchParams = { line : 'DFB1', stepCode : step};

                 const useCategory = grid.getValue(clickData.itemIndex, "useCategory");

                if (useCategory === "E") {
                    return;
                }                

                if (clickData.fieldName === "equipNm" || clickData.fieldName === "stepNm"){
                    let params = {
                        dialogTitle: "설비정보",
                        step: 9,
                        height: 300,
                        width: 1500,
                        dataRow: clickData.dataRow,
                        gridJs: `CP0000000017.js`,
                        search: { menuId: "M0001001", queryId: "selectEquipListPop" }
                    };	
                    this.$refs.cmDialog1.openDialog(params);					
                }
            }
        },

        handleConfirm(params){
			let data = {};
			let itemIndex = '';

			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {

                let equipCode = [];
                let equipName = [];

                checkRow.forEach(rowIndex =>{
                    let rowData = params.dataProvider.getJsonRow(rowIndex);
                    equipCode.push(rowData["설비번호"]);
                    equipName.push(rowData["설비약명"]);
                });

				let joinedEquipCode = equipCode.join(',');
				let joinedEquipName = equipName.join(',');

				data = params.dataProvider.getJsonRow(checkRow[0]);
				itemIndex = params.dataRow;
				this.matGridView.setValue(itemIndex, "line", data["line"]);
				this.matGridView.setValue(itemIndex, "stepCode", data["공정코드"]);
				this.matGridView.setValue(itemIndex, "stepNm", data["공정명"]);
				this.matGridView.setValue(itemIndex, "equipNo", joinedEquipCode);
				this.matGridView.setValue(itemIndex, "equipNm", joinedEquipName);
			}	
		},    

        onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
            let error = {};
            
            const stockQty = grid.getValue(itemIndex, "stockQty");
            const outQty = grid.getValue(itemIndex, "outQty");

            if (column.fieldName === "outQty"  ) {
                if ( outQty > stockQty ){
					error.level = "warning";
					error.message = "사용수량은 재고수량을 초과할 수 없습니다.";
                }
            }

            if (column.fieldName === "errorWorkQty" || column.fieldName === "errorMatQty" ) {
                const errorQty = grid.getValue(itemIndex, "errorWorkQty") + grid.getValue(itemIndex, "errorMatQty");                
                if ( errorQty > outQty ){
					error.level = "warning";
					error.message = "Loss수량은 투입수량을 초과할 수 없습니다.";					                   
                }
            }            

            return error;
        },

		checkValidBarcodeData(checkData) {

            if(_.isEmpty(this.materialId)){
                this.$toast('info', "바코드를 입력하십시요!");
				this.materialId = "";
                return false;
            }   
            
            if(_.isEmpty(this.searchUseCategory)){
                this.$toast('info', "투입구분을을 선택하십시요!");
				this.materialId = "";
                return false;
            }            
			
            if(_.isEmpty(this.workerName)){
                this.$toast('info', "작업자를 입력하십시요!");
                return false;
            }	

            let rows = this.matGridDataProvider.getJsonRows(0,-1);
            let dupRow = rows.find(ele => ele.materialId == this.materialId);
            if(!_.isUndefined(dupRow)){
                this.$toast('info', "이미 추가된 바코드입니다.");
                this.materialId = "";
                return false;
            }            

			return true;
		},    		

		checkValidSaveData(checkData) {

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

            return true;

		},  

        addRow(matInfo){
            this.matGridView.commit();

			const today = new Date();
			const hours = today.getHours();
			const hhmm = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0');
			this.workDate = ( hours < 8 ) ? this.$utils.getSomedayDate(-1,"") : this.$utils.getTodayDate("");

            this.matGridDataProvider.addRow({
                workDate: this.workDate,
				shiftCode: this.$utils.getShiftCode(),
				outDate : this.$utils.getTodayDate(""),
				//outTime: hhmm,		
                materialId: this.materialId,		
                matTypeCode: MAT_TYPE_CODE,
                subMatTypeCode: matInfo.subMatTypeCode,
				size: matInfo.size,		
                workerName: this.workerName,
                useCategory: this.searchUseCategory,	
                unit : this.unit,
                remainQty: matInfo.remainQty,
                stockQty: matInfo.remainQty,
                outQty:0,
                errorWorkQty: 0,
                errorMatQty: 0,                
                createUser: this.createUserId,
                line: "DFB1",
                stepCode: "010",
                stepNm: "적층",
                inComments: matInfo.inComments,
            });

            let itemIndex = this.matGridView.getItemCount() - 1;
            this.matGridView.setCurrent({ itemIndex: itemIndex });

            this.materialId = '';
            this.$refs.materialId.focus();  
        },   
        
        async processBarcode(){

            if(this.matGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.matGridDataProvider.clearRows();
            }
            this.curMode = 'C';            
         

			if ( this.checkValidBarcodeData() ) {

                let params = { materialId: this.materialId };
                let matInfo = [];

                let param = {menuId:'M0001008',queryId:'selectBarcodeInfo', queryParams:params, target: matInfo};
                let resp = await this.$axios.api.search(param);

                if ( _.isEmpty(resp) ) {
                    this.$toast("info", "해당 바코드로 입고된 정보가 없습니다!");
                    this.materialId = "";
                    return false;
                } 
                else {
                    if ( resp[0].remainQty <= 0) {
                        this.$toast("info", "재고수량이 없습니다!");
                        this.materialId = "";
                        return false;                    
                     }
                    else {
                        this.addRow(resp[0]);
                    }
                }
			}
        },             

		async saveData() {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001008',
					delete: [{queryId:'deleteOutData', data:saveData.delete}],
					insert: [{queryId:'insertOutData', data:saveData.insert}],
					update: [{queryId:'updateOutData', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveOutData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode == 'C'){
                            this.searchFromDate = `${this.workDate.slice(0, 4)}-${this.workDate.slice(4, 6)}-${this.workDate.slice(6, 8)}`;
                            this.searchToDate = `${this.workDate.slice(0, 4)}-${this.workDate.slice(4, 6)}-${this.workDate.slice(6, 8)}`;
                        }
                        this.curMode = 'R';
						this.searchBtnClick();
					}                 
					else if ( response.data.resultCode === "LACK_QTY") {

                        const msg = `[재고 확인]\n[${response.data.resultData}] \n재고수량이 부족합니다. 재확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}											
				}).catch((error) => {
					this.$toast("error", error);
				});

			}            
		}, 

		searchBtnClick() {
            if(this.curMode == 'C' && this.matGridDataProvider.getRowCount() > 0){
                this.$confirm("확인", '저장하지 않은 데이터가 있습니다. 조회를 하시겠습니까?', (confirm)=>{
                    if(confirm){
                        this.getDataList();
                    }
                });
            }else{
                this.getDataList();
            }
		}, 

        delBtnClick() {
			this.matGridView.commit();
			const checkedRows = this.matGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.matGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.matGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.matGridDataProvider.removeRows(delItems);
			}            
		},

        saveBtnClick(){
			this.matGridView.commitEditor();
			this.matGridView.commit();

            let msg = "";

            if ( this.curMode === "C" ) {
                msg = "공정투입 하시겠습니까?";
            }
            else {
                msg = "저장 하시겠습니까?";
            }

            this.$confirm("확인", msg, (confirm)=>{
                if(confirm){
                    this.saveData();
                }
            });   
    	},

        cancelBtnClick() {

                this.$confirm("확인", "공정투입 작업을 취소하시겠습니까?", (confirm)=>{
                        if(confirm){
                            this.getDataList();
                        }
                    });  
        },

        async excelBtnClick(){
			const grid = this.matGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `더미글라스_공정투입_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

			const options = {
				type: "excel",
				target: "local",
				fileName: fileName,
				progressMessage: "엑셀 Export중입니다.",
				done: function() {
					alert("엑셀 내보내기가 완료되었습니다!");
				}
			};

			grid.exportGrid(options);            
		},

        onDataLoadComplatedMatGrid(grid){}
    },

}
</script>
<style scoped>
.disabled {
  pointer-events: none; /* 클릭 방지 */
  opacity: 0.2;         /* 투명도 조정 */
  background-color: #f5f5f5; /* 회색 배경 */
}
</style>