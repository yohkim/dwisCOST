/**
*	자재관리 > 부자재 - 약액 > 공정전 입고
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">
                    <div class="label_title">입고 일자</div>
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
                    <div class="form-floating" >
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchSubMatType" >
                            <option v-for="item in subMatTypeList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">품명</label>
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
                    <div class="title">입고 작업</div>
                    <div class="in_time"><span>{{ currentTime }}</span></div>
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="작업자" autocomplete="off" v-model="workerName">
                        <label for="floating">담당자</label>
                    </div>
                </b-col>
                <b-col cols="4">
                    <div class="form-floating">
                        <input type="text" ref="materialId" class="form-control label-60" id="floating" placeholder="바코드" autocomplete="off" v-model="materialId" :disabled="this.workerName===''" 
                        @input="this.$utils.convertToUpperEng($event, 'materialId', this)" 
                        @keyup.enter="processBarcode">
                        <label for="floating">바코드</label>
                    </div>              
                </b-col>  
                <b-col cols="2">
                    <div style="width:300px"><span style="font-size: 11px; color: blue;">* 입고작업전 담당자를 입력하십시요. </span></div>
                </b-col >                             
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
            </div>
        </div>
    </div>
</template>
<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001106.js';

const URI_PREFIX = '/api/m0001000/m0001006/TAB001106';
const MAT_CTG_CODE = '30';
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
            inDate:  this.$utils.getTodayDate(""),
            workerId: this.userAuthInfo.userInfo.userId,
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
        isBarcodeMode(){
            return ( this.curMode === 'C' )
        },        
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

        this.matGridView.checkBar.checkableCallback = this.checkableCallback;
        this.matGridView.onCellEdited = this.onCellEdited;
        this.matGridView.editOptions.commitByCell = true;	
        this.matGridView.filteringOptions.automating.lookupDisplay = true;

        this.setCurTime();
		this.getSelectOptions();
        this.getDataList();	  

		this.$eventBus.on("TAB001106MenuMove", this.menuMove);		
	},
	beforeUnmount() {
		this.$eventBus.off("TAB001106MenuMove");
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
            }, 1000);
        },

        menuMove(data) {
            this.$nextTick(()=>{

                this.searchFromDate = this.$utils.formatDate(data.clickedField.slice(1),"-");
                this.searchToDate = this.searchFromDate;
                this.searchSubMatType = data.subMatTypeCode;      

                this.getDataList();
            });
        },    
        
        checkableCallback(dataSource, item){
            if ( this.matGridDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }
            return false;
        },              

        async getSelectOptions(){

			let params = [ { majCode : "80"}, {matCategoryCode : MAT_CTG_CODE, matTypeCode : MAT_TYPE_CODE} ];
            let matInfo = [];

			let searchParam = [
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params[0],
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.subMatTypeList	);
										}
				},        
				{ menuId:'M0001003', queryId:'selectMatUnit', queryParams:params[1], target:matInfo }
            ];

			let resp = await this.$axios.api.searchAll(searchParam);

            this.unit = matInfo[0].unit;
            this.subMatTypeList.unshift({ itemValue:"", itemText:"전체" });
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
				subMatTypeCode : this.searchSubMatType,
                searchMaterialId: this.searchMaterialId
			};

			let param = {menuId:'M0001006',queryId:'selectMatChemicalIn', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);

		},

        setCellStyleCallbackMatGrid(grid, cell){
            let rtn = {};
            let editable = false;
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "inQty" || fieldName === "workerName" || fieldName === "comments" ) {

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

		onCellEdited(grid, itemIndex, row, field) {
			const inQty = grid.getValue(itemIndex, "inQty");
			grid.setValue(itemIndex, "remainQty",inQty );
		},        

		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

			return !invalid;
		},    
        
        addRow(matInfo){
            this.matGridView.commit();					

            this.matGridDataProvider.addRow({
                inDate: this.$utils.getTodayDate(""),
                materialId: this.materialId,
                matTypeCode: MAT_TYPE_CODE,
                subMatTypeCode: matInfo.subMatTypeCode,
                chemicalName: matInfo.chemicalName,
                unit : this.unit,
                inQty: 20,
                useQty: 0,
                remainQty:20,
                useYn: 'N',
                workerId: this.workerId,
                workerName: this.workerName,
            });

            let itemIndex = this.matGridView.getItemCount() - 1;
            this.matGridView.setCurrent({ itemIndex: itemIndex });

            this.materialId = '';
            this.$refs.materialId.focus();
        },      
        
		checkValidBarcodeData(checkData) {

            if(_.isEmpty(this.materialId)){
                this.$toast('info', "바코드를 입력하십시요!");
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
        
        async processBarcode(){

            if(this.matGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.matGridDataProvider.clearRows();
            }
            this.curMode = 'C';

            if ( this.checkValidBarcodeData() ) {
				const subMatTypeCode = this.materialId.match(/-(.)/);
                let params = { materialId: this.materialId, subMatTypeCode: subMatTypeCode?subMatTypeCode[1]:""};
                let info = [];

                let param = {menuId:'M0001006',queryId:'selectBarcodeChemicalInfo', queryParams:params, target:info};
                let resp = await this.$axios.api.search(param);

                if ( _.isEmpty(info[0].chemicalName)) {
                    this.$toast("info", "품명을 찾을수 없습니다!");
                    this.materialId = "";
                    return false;
                }
                else if ( info[0].dupYn === "Y" ) {
                    this.$toast("info", "이미 입고 처리된 바코드입니다!");
                    this.materialId = "";
                    return false;
                }
                else {
                    this.addRow(info[0]);
                }                

            }
        },

		async saveData() {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0001006',
					delete: [{queryId:'deleteInData', data:saveData.delete}],
					insert: [{queryId:'insertInData', data:saveData.insert}],
					update: [{queryId:'updateInData', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveInData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode == 'C'){
                            this.searchFromDate = this.$utils.getTodayDate("-");
                            this.searchToDate = this.$utils.getTodayDate("-");                            
                        }
                        this.curMode = 'R';
						this.searchBtnClick();
					}
					else if ( response.data.resultCode === "CHECK_USED") {
						const msg = `[바코드(자재ID) 확인]\n[${response.data.resultData}]\n이미 출고처리된 자재는 수정/삭제할 수 없습니다. 확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}                    
					else if ( response.data.resultCode === "CHECK_DUP") {

                        const msg = `[바코드(자재ID) 확인]\n[${response.data.resultData}]\n이미 입고처리된 바코드 입니다. 확인 후 진행하십시요!` ;
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
                msg = "입고처리 하시겠습니까?";
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

            this.$confirm("확인", "입고작업을 취소하시겠습니까?", (confirm)=>{
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
			const fileName = `약액_공정전입고_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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