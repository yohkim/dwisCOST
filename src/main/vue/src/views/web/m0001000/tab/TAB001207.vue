/**
*	자재관리 > 부자재 - 필터 > 공정투입
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
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchEquip" >
                            <option v-for="item in equipList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">투입설비</label>
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
                    <div class="title" style="width:110px">공정사용 작업</div>
                    <div class="in_time"><span>{{ currentTime }}</span></div>
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="작업자" autocomplete="off" v-model="workerName">
                        <label for="floating">작업자</label>
                    </div>              
                </b-col>				
                <b-col cols="3">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="subMatTypeCode" >
                            <option v-for="item in subMatTypeList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">필터품명</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div style="width:400px"><span style="font-size: 11px; color: blue;">* 공정투입 작업전 투입설비/필터품명 선택, 작업자를 입력하십시요. </span></div>
                </b-col>
            </b-row>
        </div>
        <div class="grid_box material_box">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick">엑셀</b-button>
					<b-button refs="btnAdd" @click="addBtnClick">추가</b-button>
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
import gridField from '@web/m0001000/js/TAB001207.js';

const URI_PREFIX = '/api/m0001000/m0001007/TAB001207';
const MAT_CTG_CODE = '40';
const MAT_TYPE_CODE = 'FILTER';
const D_STEP = ['023'];
const W_STEP = ['027', '035', '047', '058', '059'];
const E_STEP = ['017', '033', '050'];

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
			equipList: [],
			subMatTypeList: [],
            curMode: 'R',			
            searchFromDate: this.$utils.getWorkDate("-"), 
            searchToDate: this.$utils.getTodayDate("-"), 
            searchShift:'',
			searchEquip:'',
            workDate:'',
            outDate:  this.$utils.getTodayDate(""),
            createUserId: this.userAuthInfo.userInfo.userId,
			subMatTypeCode:'',
			workerName:'',            
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
            return  _.isEmpty(this.searchEquip) || _.isEmpty(this.workerName);
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
        this.matGridView.editOptions.commitByCell = true;
        this.matGridView.filteringOptions.automating.lookupDisplay = true;		

        this.setCurTime();
		this.getSelectOptions();

        this.$eventBus.on("TAB001207MenuMove", this.menuMove);            
	},
	beforeUnmount() {
        this.$eventBus.off("TAB001207MenuMove");
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
                this.searchEquip = '';

                this.getDataList();
            });
        },            

        async getSelectOptions(){

			const step = [...D_STEP, ...W_STEP, ...E_STEP];

			let params = [ { majCode : "75"},  { majCode : "77"}, { line : 'DFB1', stepCode : step}, {matCategoryCode : MAT_CTG_CODE, matTypeCode : MAT_TYPE_CODE} ];
            let matInfo = [];
			let equipList = [];
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
											this.subMatTypeList	);
										}
				},  				
				{ menuId:'M0001006', queryId:'selectUseEquipList', queryParams:params[2], target:equipList },
				{ menuId:'M0001003', queryId:'selectMatUnit', queryParams:params[3], target:matInfo },
                { menuId:'COMCODE', queryId:'selectShiftInfo', target:shiftInfo }
            ];

			let resp = await this.$axios.api.searchAll(searchParam);

            this.searchShift = shiftInfo[0].shiftCode;

			equipList.forEach((elem) => {
				this.equipList.push({
					itemValue: `${elem["line"]}^*^${elem["설비약명"]}^*^*`,
					itemText: `${elem["설비약명"]}`
				})
			});

            this.unit = matInfo[0].unit;

			this.matGridView.setColumnProperty("shiftCode", "values", 
				this.shiftList.map(item=>item.itemValue)
			);
			this.matGridView.setColumnProperty("shiftCode", "labels", 
				this.shiftList.map(item=>item.itemText)
			);

			this.matGridView.setColumnProperty("subMatTypeCode", "values", 
				this.subMatTypeList.map(item=>item.itemValue)
			);
			this.matGridView.setColumnProperty("subMatTypeCode", "labels", 
				this.subMatTypeList.map(item=>item.itemText)
			);

            this.shiftList.unshift({ itemValue:"", itemText:"전체" });
			this.equipList.unshift({ itemValue:"", itemText:"전체" });

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
				line : this.searchEquip.split("^")[0],
				equip : this.searchEquip.split("^")[1]
			};

			let param = {menuId:'M0001007',queryId:'selectMatFilterOut', queryParams:params, target: this.gridRows};
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

            if ( fieldName === "workerName" ||  fieldName === "equipNm" || fieldName === "outQty" ||  fieldName === "comments" ) {

				let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y" || this.isBarcodeMode || fieldName === "comments"  ) {
                    rtn.editable = true;
                    rtn.styleName = "edit " + styleName;
                }
                else {
                    rtn.editable = false;
                    rtn.styleName = styleName;   
                }    
            }

            return rtn;
        },

        onCellClicked( grid, clickData ){

			if (clickData.cellType != "data") return;

            if ( clickData.editable ) { 				

				let step = [];
				step = [...E_STEP, ...D_STEP, ...W_STEP];

				let searchParams = { line : 'DFB1', stepCode : step};

                if (clickData.fieldName === "equipNm" || clickData.fieldName === "stepNm"){
                    let params = {
                        dialogTitle: "설비정보",
                        step: 9,
                        height: 300,
                        width: 1500,
                        dataRow: clickData.dataRow,
                        gridJs: `CP0000000019.js`,
                        search: { menuId: "M0001006", queryId: "selectUseEquipList", queryParams: searchParams }
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
				data = params.dataProvider.getJsonRow(checkRow[0]);
				itemIndex = params.dataRow;
				this.matGridView.setValue(itemIndex, "line", data["line"]);
				this.matGridView.setValue(itemIndex, "stepCode", "*");
				this.matGridView.setValue(itemIndex, "stepNm", "*");
				this.matGridView.setValue(itemIndex, "equipNo", "*");
				this.matGridView.setValue(itemIndex, "equipNm", data["설비약명"]);
			}	
		},    

        onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
            let error = {};
            
            const stockQty = grid.getValue(itemIndex, "stockQty");

            if (column.fieldName === "outQty"  ) {
                const outQty = grid.getValue(itemIndex, "outQty") ;
                if ( outQty > stockQty ){
					error.level = "warning";
					error.message = "사용수량은 재고수량을 초과할 수 없습니다.";
                }
            }

            return error;
        },

		checkValidAddData(checkData) {
			
            if(_.isEmpty(this.workerName)){
                this.$toast('info', "작업자를 입력하십시요!");
                return false;
            }			

            if(_.isEmpty(this.subMatTypeCode)){
                this.$toast('info', "필터품명을 선택하십시요!");
                return false;
            }			

            let rows = this.matGridDataProvider.getJsonRows(0,-1);
            let dupRow = rows.find(ele => ele.subMatTypeCode == this.subMatTypeCode);
            if(!_.isUndefined(dupRow)){
                this.$toast('info', "이미 추가된 필터입입니다.");
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
                matTypeCode: MAT_TYPE_CODE,
                subMatTypeCode: this.subMatTypeCode,
                filterName: matInfo.filterName,
				workerName: this.workerName,				
				line: this.searchEquip.split("^")[0],
				equipNo: this.searchEquip.split("^")[1],
				equipNm: this.searchEquip.split("^")[2],
				stepCode: this.searchEquip.split("^")[3],
				stepNm: this.searchEquip.split("^")[4],
                unit : this.unit,
                remainQty: matInfo.remainQty,
                stockQty: matInfo.remainQty,
                outQty:0,
                createUser: this.createUserId,
                
            });

            let itemIndex = this.matGridView.getItemCount() - 1;
            this.matGridView.setCurrent({ itemIndex: itemIndex });

        },                

		async saveData() {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001007',
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

		async addBtnClick() {

            if(_.isEmpty(this.searchShift)){
                this.$toast('info', "근무조를 선택하십시요!");
                return false;
            }	
			
            if(_.isEmpty(this.searchEquip)){
                this.$toast('info', "투입설비를 선택하십시요!");
                return false;
            }				

			if(this.matGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
				this.matGridDataProvider.clearRows();
			}
			this.curMode = 'C';	

			if ( this.checkValidAddData() ) {			

                let params = { subMatTypeCode: this.subMatTypeCode };
                let matInfo = [];

                let param = {menuId:'M0001007',queryId:'selectFilterInfo', queryParams:params, target: matInfo};
                let resp = await this.$axios.api.search(param);

                if ( _.isEmpty(resp) ) {
                    this.$toast("info", "현재 재고가 없습니다!");                    
                    return false;
                } 
                else {
                    if ( resp[0].remainQty <= 0) {
                        this.$toast("info", "재고수량이 없습니다!");
                        return false;                    
                     }
                    else {
                        this.addRow(resp[0]);
                    }
                }
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
                msg = "사용 하시겠습니까?";
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

                this.$confirm("확인", "필터사용을 취소하시겠습니까?", (confirm)=>{
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
			const fileName = `필터_사용_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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