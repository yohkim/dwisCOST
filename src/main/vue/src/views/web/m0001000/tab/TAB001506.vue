/**
*	자재관리 > 부자재 - 약액 > 공정창고 반납 
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">        
                    <div class="label_title">반납 일자</div>                        
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
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="searchSubMatType" >
                            <option v-for="item in subMatTypeList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">품명</label>
                    </div>
                </b-col>									
            </b-row>
            <div class="btn_area">
                <b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>
            </div>
        </div>
         <div class="worker_wrap">
            <b-row class=" worker_info">
                <b-col cols="4" class="d-flex">
                    <div class="title" style="width:110px">반납 처리</div>
                    <div class="in_time"><span>{{ currentTime }}</span></div>
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="반납자" v-model="workerName">
                        <label for="floating">반납자</label>
                    </div>              
                </b-col>				
                <b-col cols="4">
                    <div class="form-floating">
                        <input type="text" ref="materialId" class="form-control label-60" id="floating" placeholder="바코드" v-model="materialId" :disabled="isDisabledBarcode" 
                        @input="this.$utils.convertToUpperEng($event, 'materialId', this)" 
                        @keyup.enter="processBarcode">
                        <label for="floating" >바코드</label>
                    </div>              
                </b-col>
                <b-col cols="2">
                    <div style="width:400px"><span style="font-size: 11px; color: blue;">* 반납처리전 반납자를 입력하십시요. </span></div>
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
import gridField from '@web/m0001000/js/TAB001506.js';

const URI_PREFIX = '/api/m0001000/m0001006/TAB001506';
const MAT_TYPE_CODE = 'CHEMICAL';

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
			subMatTypeList: [],
            curMode: 'R',			
            searchFromDate: this.$utils.getWorkDate("-"), 
            searchToDate: this.$utils.getTodayDate("-"), 
            searchSubMatType:'',
            returnDate:  this.$utils.getTodayDate(""),
            createUserId: this.userAuthInfo.userInfo.userId,
			workerName:'',
            materialId: '',
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
            return _.isEmpty(this.workerName);
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
        this.matGridView.editOptions.commitByCell = true;	
        this.matGridView.filteringOptions.automating.lookupDisplay = true;	

        this.setCurTime();
		this.getSelectOptions();
	},

	beforeUnmount() {},
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
            }, 1000);
        },

        async getSelectOptions(){

			let params = { majCode : "80"};

			let searchParam = 
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params,
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.subMatTypeList );
										}
				};

			let resp = await this.$axios.api.search(searchParam);				

            this.subMatTypeList.unshift({ itemValue:"", itemText:"전체" });			

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
				subMatTypeCode : this.searchSubMatType
			};

			let param = {menuId:'M0001006',queryId:'selectMatChemicalReturn', queryParams:params, target: this.gridRows};
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

            if ( fieldName === "workerName" || fieldName === "returnQty" || fieldName === "confirmYn" || fieldName === "comments" ) {

				let styleName = this.$utils.getAlignStyleGridField(fieldName);
				
                if ( jsonData.editable == "Y" || this.isBarcodeMode || fieldName === "comments") {
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

        onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
            let error = {};

            const materialId = grid.getValue(itemIndex, "materialId");
            const outQty = grid.getValue(itemIndex, "outQty");

            if (column.fieldName === "returnQty"  ) {
                const returnQty = grid.getValue(itemIndex, "returnQty") ;
                if ( returnQty > outQty ){
					error.level = "warning";
					error.message = "반납수량은 투입수량을 초과할 수 없습니다.";
                    this.materialId = "";
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
				returnNo: matInfo.outNo.replace('CO', 'CR'),
                matTypeCode: matInfo.matTypeCode,	
                subMatTypeCode: matInfo.subMatTypeCode,				
				workDate: matInfo.workDate,
				shiftCode: matInfo.shiftCode,
				shiftName: matInfo.shiftName,
				outNo: matInfo.outNo,
				outSeq: matInfo.outSeq,
				outDate : matInfo.outDate,
				outTime: matInfo.outTime,
                materialId: matInfo.materialId,				                
                chemicalName: matInfo.chemicalName,
				outWorkerName: matInfo.outWorkerName,				
				line: matInfo.line,
				equipNo: matInfo.equipNo,
				equipNm: matInfo.equipNm,
				stepCode: matInfo.stepCode,
				stepNm: matInfo.stepNm,
                unit : matInfo.unit,
                outQty: matInfo.outQty,
				orgReturnQty: matInfo.orgReturnQty,
				returnQty: matInfo.returnQty,
                returnDate:  this.$utils.getTodayDate(""),
                workerName: this.workerName,
				confirmYn: 'Y',
                createUser: this.createUserId,
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

                let param = {menuId:'M0001006',queryId:'selectBarcodeOutInfo', queryParams:params, target: matInfo};
                let resp = await this.$axios.api.search(param);

                if ( _.isEmpty(resp) ) {
                    this.$toast("info", "해당 바코드로 투입된 정보가 없습니다!");
                    this.materialId = "";
                    return false;
                } 
                else {
                    if ( !_.isEmpty(resp[0].returnNo)) {
                        this.$toast("info", "이미 반납처리 되었습니다.\n공정투입/반납내역을 확인하십시요!");
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
					menuId:'M0001006',
					delete: [{queryId:'deleteReturnData', data:saveData.delete}],
					insert: [{queryId:'insertReturnData', data:saveData.insert}],
					update: [{queryId:'updateReturnData', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveReturnData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode == 'C'){
                            this.searchFromDate = this.$utils.getTodayDate("-");
                            this.searchToDate = this.$utils.getTodayDate("-");
                        }
                        this.curMode = 'R';
						this.searchBtnClick();
					}                 
					else if ( response.data.resultCode === "CHECK_DUP") {

                        const msg = `[바코드(자재ID) 확인]\n[${response.data.resultData}] \n이미 반납처리 되었습니다. 확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}	
					else if ( response.data.resultCode === "DIFF_QTY") {

                        const msg = `[바코드(자재ID) 확인]\n[${response.data.resultData}] \n기존 반납수량이 변경되었습니다. 재조회 후 진행하십시요!` ;
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

        async saveBtnClick(){
			this.matGridView.commit();

            let msg = "";

            if ( this.curMode === "C" ) {
                msg = "반납처리 하시겠습니까?";
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

                this.$confirm("확인", "반납처리 작업을 취소하시겠습니까?", (confirm)=>{
                        if(confirm){
                            this.materialId = "";
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
			const fileName = `약액_반납_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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