/**
*	자재관리 > 부자재 - 약액 > 재고실사
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="2" class="period">
                    <div class=" form-floating me-1"> 
                        <date-picker label="재고일"  v-model="searchStockDate"  />
						<label for="floatingSelect" class="select">재고일</label>
                    </div> 
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchSubMatType" >
                            <option v-for="item in subMatTypeList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">품명</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchConfirmYn" >
                            <option v-for="item in confirmYnList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">재고확인</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchDiffYn" >
                            <option v-for="item in diffYnList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">차이수량</label>
                    </div>
                </b-col>	
            </b-row>
            <div class="btn_area">
                <b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>
            </div>
        </div>
            <div class="worker_wrap">
            <div class="title" >재고실사</div>
            <div class="row worker_info">				
                <b-col cols="2">
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="작업자" autocomplete="off" v-model="workerName">
                        <label for="floating">담당자</label>
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
                <b-col co ls="2">
                    <div ><span style="font-size: 13px; color: grey;" refs="stockStatusMsg" v-html="stockStatusMsg" ></span></div>
                </b-col>							
            </div>
        </div>
        <div class="grid_box material_box">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick"  v-show="curMode==='R'">엑셀</b-button>
					<b-button class="main" refs="btnSummary" @click="summaryBtnClick" v-show="curMode==='R'&&( stockStatus !== 'CLOSE' )">전산재고 집계</b-button>
                    <b-button refs="btnDelete" @click="delBtnClick" v-show="curMode==='C' && stockStatus !== 'CLOSE'">삭제</b-button>                    
					<b-button class="main" refs="btnSave" @click="saveBtnClick" v-show="stockStatus!=='CLOSE' && hasAuthMatClose">저장</b-button>  					
                    <b-button refs="btnCancel" @click="cancelBtnClick" v-show="curMode==='C'" >취소</b-button>  
					<b-button class="main"  refs="btnComplete" @click="completeBtnClick" v-show="curMode==='R' && stockStatus !== 'CLOSE' && hasAuthMatClose">재고실사 완료</b-button>  
					<b-button class="main"  refs="btnClose" @click="closeBtnClick" v-show="curMode==='R' && stockStatus=='COMPLETE' && hasAuthMatClose">재고마감</b-button>  
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
import gridField from '@web/m0001000/js/TAB001306.js';

const URI_PREFIX = '/api/m0001000/m0001006/TAB001306';
const MAT_CTG_CODE = '30';
const MAT_TYPE_CODE = 'CHEMICAL';

export default {
	props: {},  
	components: {},
	watch: {
		searchStockDate(newDate) {
			this.fetchStockStatus(newDate);
			this.getDataList();
		},		
		stockStatus(newStatus) {
			this.getStockStatusMsg(newStatus);
		}
		
	},
    setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },	
	data () {
		return {
			currentTime: this.$utils.getTodayDateTime(), // 초기 날짜와 시간
			matGrid:null,
            gridRows:[],
			subMatTypeList:[],
			confirmYnList:[],
			diffYnList:[],
			curMode: 'R',
			searchStockDate:'',
			searchSubMatType:'',
			searchConfirmYn:'',
			searchDiffYn:'',
			stockStatus:'',
			stockStatusMsg:'',
			createUserId: this.userAuthInfo.userInfo.userId,
            workerId: this.userAuthInfo.userInfo.userId,
            workerName: '',
            materialId: '',
			hasAuthMatClose: this.userAuthInfo.getRoleList.includes("R008")
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
            return _.isEmpty(this.searchStockDate) || _.isEmpty(this.stockStatus) ;
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
		
		this.getSelectOptions(); 

		this.$eventBus.on("TAB001306MenuMove", this.menuMove);		
	},
	beforeUnmount() {
		this.$eventBus.off("TAB001306MenuMove");
	},
    beforeDestroy() {

    },	
	methods: {
		initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        menuMove(data) {
            this.$nextTick(()=>{

                this.searchStockDate = this.$utils.formatDate(data.clickedField.slice(1),"-");
				this.searchSubMatType = ( data.subMatTypeCode ===  "Total" )? "" : data.subMatTypeCode;
				this.searchConfirmYn = "";
				this.searchDiffYn = "";

                this.getDataList();
            });
        },   			
		
        async getSelectOptions(){

			let params = [ { majCode : "80"} ];
			let stockDate = [];

			let searchParam = [
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params[0],
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.subMatTypeList );
										}
				},
				{ menuId:'M0001006', queryId:'selectMaxStockDate', target:stockDate }
            ];

			let resp = await this.$axios.api.searchAll(searchParam);

			this.subMatTypeList.unshift({itemValue:"", itemText:"전체"});
            this.confirmYnList.push({itemValue:"", itemText:"전체"},{itemValue:"Y", itemText:"Y"}, {itemValue:"N", itemText:"N"});
			this.diffYnList.push({itemValue:"", itemText:"전체"},{itemValue:"Y", itemText:"Y"}, {itemValue:"N", itemText:"N"});         
			
            this.searchStockDate = `${stockDate[0].slice(0, 4)}-${stockDate[0].slice(4, 6)}-${stockDate[0].slice(6, 8)}`;
            
            this.getDataList();	  
		},	

		async fetchStockStatus(stockDate) {

			let stockStatus = [];
			let params = {
							stockDate: stockDate.replaceAll('-',''),
							matCategoryCode : MAT_CTG_CODE,
							matTypeCode : MAT_TYPE_CODE
						} ;

			let searchParam = {menuId:'M0001001',queryId:'selectStockStatus', queryParams:params, target: stockStatus};
			let resp = await this.$axios.api.search(searchParam);			

			if ( stockStatus.length === 0 ){
				this.stockStatus = "";
			}
			else {
				this.stockStatus = stockStatus[0];
			}
			this.getStockStatusMsg(this.stockStatus);
		},

		getStockStatusMsg(stockStatus) {
			if ( stockStatus === 'SUMMARY') {
				this.stockStatusMsg = "[ <b style='color: blue;'>전산집계</b> -> 재고실사 -> 재고마감 ]";
			}
			else if ( stockStatus === 'CHECKING') {
				this.stockStatusMsg = "[ <b style='color: blue;'>전산집계 -> 재고실사 중</b> -> 재고마감 ]";
			}
			else if ( stockStatus === 'COMPLETE') {
				this.stockStatusMsg = "[ <b style='color: blue;'>전산집계 -> 재고실사 완료</b> -> 재고마감 ]";
			}
			else if ( stockStatus === 'CLOSE') {
				this.stockStatusMsg = "[ <b style='color: blue;'>전산집계 -> 재고실사 완료 -> 재고마감 </b> ]";
			}											
			else {
				this.stockStatusMsg = "[ <b style='color: blue;'> 전산집계 후 재고실사를 진행하십시요!</b> ]";
			}
		},
		
        async getDataList(){
			this.matGridView.commit();
            this.curMode = 'R';   
            
            this.matGridDataProvider.clearRows();        

			let params = {
				stockDate : this.searchStockDate.replaceAll('-',''),
                subMatType : this.searchSubMatType,
				confirmYn: this.searchConfirmYn,
				diffYn: this.searchDiffYn
			};

			let param = {menuId:'M0001006',queryId:'selectSubMatChemicalIdStock', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

        checkableCallback(dataSource, item){
            if ( this.isBarcodeMode) {
                return true;
            }
            return false;
        },

        setCellStyleCallbackMatGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "realStockQty" ||  fieldName === "confirmYn" ||  fieldName === "comments" ) {
                
                let styleName = this.$utils.getAlignStyleGridField(fieldName);
				
				if ( ( jsonData.editable == "Y" || this.isBarcodeMode ) && this.stockStatus !== "CLOSE") {
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
			const realStockQty = grid.getValue(itemIndex, "realStockQty");
			const stockQty = grid.getValue(itemIndex, "stockQty");
			let diffQty  = realStockQty - stockQty;

			grid.setValue(itemIndex, "diffQty", diffQty);

		},

		async saveSummaryData() {

			//if ( this.checkValidSummaryData(this.stockStatus) ) {

				let param = {
					matCategoryCode : MAT_CTG_CODE,
					matTypeCode:MAT_TYPE_CODE,
					stockDate: this.searchStockDate.replaceAll("-",""),
					workerId : this.workerId,
					workerName : this.workerName
				};

				await this.$axios.post(URI_PREFIX + "/saveSummaryData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "전산집계가 완료되었습니다!");
						if ( _.isEmpty(this.stockStatus)) {
							this.stockStatus='SUMMARY';
						}
						this.getStockStatusMsg(this.stockStatus);
                        this.curMode = 'R';
						this.searchBtnClick();
					} 	
					else if ( response.data.resultCode === "NOT_EXISTS_PRE") {

                        const msg = `이전일 전산집계가 되지 않았습니다.\n확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}									
				}).catch((error) => {
					this.$toast("error", error);
				});

			//}            
		}, 

		checkValidBarcodeData() {

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

        addRow(matInfo){
            this.matGridView.commit();

            this.matGridDataProvider.addRow({
                stockDate: matInfo.stockDate,
				materialId: matInfo.materialId,
				subMatTypeCode: matInfo.subMatTypeCode,		
				chemicalName: matInfo.chemicalName,	
				unit: matInfo.unit,	
				prevStockQty: matInfo.prevStockQty,		
				prevRealStockQty: matInfo.prevRealStockQty,			
				inQty: matInfo.inQty,				
				outQty: matInfo.outQty,	
				returnQty: matInfo.returnQty,				
				useQty: matInfo.useQty,					
				stockQty: matInfo.stockQty,					
				realStockQty: matInfo.realStockQty,				
				diffQty: matInfo.diffQty,					
				confirmYn: "Y",		
				chargerName: matInfo.chargerName
            });

            let itemIndex = this.matGridView.getItemCount() - 1;
			this.matGridView.setCurrent({ itemIndex: itemIndex, fieldName: 'realStockQty'  });

         	this.materialId = '';
            this.$refs.materialId.focus();
        },  
		
		confirmDialog(message, title = "확인") {
			return new Promise((resolve) => {
				this.$confirm(title, message, (confirm) => {
					resolve(confirm); // confirm 값(true/false)을 반환
				});
			});
		},		

        async processBarcode(){

			let saveData = this.$refs.matGrid.getSaveData();

			if ( saveData.update.length > 0 ){
				const confirm = await this.confirmDialog( "저장하지 않은 데이터가 있습니다. 계속 하시겠습니까?", "확인");
				if (!confirm) return;                
			}

			this.matGridView.commit();

            if(this.matGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.matGridDataProvider.clearRows();
            }
            this.curMode = 'C';

			if ( this.checkValidBarcodeData() ) {

                 let params = { stockDate: this.searchStockDate.replaceAll("-",""),
							    materialId: this.materialId,	
				 };
                let matInfo = [];

                let param = {menuId:'M0001006',queryId:'selectSubMatChemicalIdStock', queryParams:params, target: matInfo};
                let resp = await this.$axios.api.search(param);

                if ( _.isEmpty(resp) ) {
                    this.$toast("info", "해당 바코드로 집계된 전산재고가 없습니다!");
                    this.materialId = "";
                    return false;
                } 
                else {
                        this.addRow(resp[0]);
                } 
			}
        }, 		

		checkValidSaveData(status, checkData) {

			// 저장인 경우에만 체크
			if ( status == "CHECKING") {
				if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
					this.$toast('info', "변경 저장할 데이터가 없습니다!");
					return false;
				}
			}

            return true;

		},	
		
		async saveData(status) {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidSaveData(status,saveData) ) {

				let queryParams = {
					matCategoryCode : MAT_CTG_CODE,
					matTypeCode:MAT_TYPE_CODE,
					stockDate: this.searchStockDate.replaceAll("-",""),
					status: status,
					workerId:this.workerId,
					workerName:this.workerName
				};

				let param = {
					queryParams: queryParams,
					insert: [{queryId:'insertStockIdData', data:saveData.insert}],
					update: [{queryId:'updateStockIdData', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveStockIdData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						let msg = "";
						if ( status == 'CLOSE' ){
							msg = "재고마감이 완료되었습니다!";
						}
						else if ( status == 'COMPLETE' ){
							msg = "재고실사가 완료되었습니다!";
						}
						else {
							msg = "저장이 완료되었습니다!";
						}
						this.$toast("info", msg);
						this.stockStatus = status;
						this.searchConfirmYn = '';
                        this.curMode = 'R';
						this.searchBtnClick();
					}
					else if ( response.data.resultCode === "CHECK_N") {

                        const msg = "[재고확인 여부 확인]\n재고확인이 안된 자재가 있습니다!\n확인 후 진행하십시요!" ;
						this.$toast("info", msg);
						this.searchConfirmYn = 'N';
						this.getDataList();
					}						 				
				}).catch((error) => {
					this.$toast("error", error);
				});
			}            
		}, 		

        checkValidCond() {

            if(_.isEmpty(this.workerName)){
                this.$toast('info', "담당자를 입력하십시요!");
                return false;
            } 
            return true; 
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
		
		summaryBtnClick() {
			if ( this.checkValidCond() ) {
				this.saveSummaryData();
			}
		}, 	

        async saveBtnClick(){
			this.matGridView.commit();

			if ( this.checkValidCond() ) {

				let msg = "저장 하시겠습니까?";

				this.$confirm("확인", msg, (confirm)=>{
					if(confirm){
						this.saveData('CHECKING');
					}
				});  
			}          
    	},	
		
        completeBtnClick(){
			this.matGridView.commit();

			if ( this.checkValidCond() ) {

				let msg = "재고실사 완료하시겠습니까?";

				this.$confirm("확인", msg, (confirm)=>{
					if(confirm){
						this.saveData('COMPLETE');
					}
				});  
			}          
    	},

        closeBtnClick(){
			this.matGridView.commit();

			if ( this.checkValidCond() ) {

				let msg = "재고마감 하시겠습니까?";

				this.$confirm("확인", msg, (confirm)=>{
					if(confirm){
						this.saveData('CLOSE');
					}
				});  
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
		
        cancelBtnClick() {

        	if ( this.stockStatus == "CLOSE" ) {
				this.curMode = "R";
				this.materialId = "";
				this.getDataList();	
			}			
			else{
					this.$confirm("확인", "재고실사 작업을 취소하시겠습니까?", (confirm)=>{
							if(confirm){
								this.curMode = "R";
								this.materialId = "";
								this.getDataList();
							}
						});  
			}
        },		

        async excelBtnClick(){
			const grid = this.matGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `약액_${yyyymmdd}일_재고현황_${hours}${minutes}${seconds}.xlsx`;			

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