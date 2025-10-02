/**
*	자재관리 > 부자재-레진 > 공정투입
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">
                    <div class="label_title">작업 일자</div>
                    <div class=" form-floating me-1"> 
                        <date-picker label="시작일"  v-model="stWorkDate" />
                        <label for="floatingPicker">날짜</label>
                    </div>
                    ~
                    <div class=" form-floating  ms-1 "> 
                        <date-picker label="종료일"  v-model="edWorkDate" />
                        <label for="floatingPicker">종료일</label>
                    </div>
                </b-col>
                <b-col cols="1">
                    <div class="form-floating">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="sShiftCd" >
                            <option v-for="item in sShiftCdList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">근무조</label>
                    </div>
                </b-col>
				<b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="sSubMatTypeCode" >
                            <option v-for="item in sSubMatTypeList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">레진종류</label>
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
                    <div class="title">투입 작업</div>
                    <div class="in_time"><span>{{ currentTime }}</span></div>
                    <div class="form-floating">
                        <input type="text" class="form-control label-60" id="floating" placeholder="작업자" autocomplete="off" v-model="workerNm">
                        <label for="floating">작업자</label>
                    </div>              
                </b-col>
                <b-col cols="4">
                    <div class="form-floating">
                        <input type="text" ref="inpBarcode" class="form-control label-60" id="floating" placeholder="바코드" autocomplete="off" v-model="materialId" :disabled="isDisabledBarcode" 
                        @input="this.$utils.convertToUpperEng($event, 'materialId', this)" 
                        @keyup.enter="processBarcode">
                        <label for="floating">바코드</label>
                    </div>              
                </b-col>
                <b-col cols="2">
                    <div style="width:400px"><span style="font-size: 11px; color: blue;">* 공정투입 작업전 작업자를 입력하십시요. </span></div>
                </b-col>                
            </b-row>
        </div>
        <div class="grid_box material_box">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" @click="excelBtnClick">엑셀</b-button>
                    <b-button @click="delBtnClick">삭제</b-button>
                    <b-button class="main" @click="saveBtnClick">저장</b-button>
                    <b-button refs="btnCancel" @click="cancelBtnClick" v-show="curMode==='C'" >취소</b-button>  
                </div>            
            </div> 
            <div class="grid-border-none">
                <RealGrid ref="resinOutGrid" :uid="'resinOutGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
                <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
            </div>
        </div>
    </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001202.js';

const URI_PREFIX = '/api/m0001000/m0001002/TAB001202';
const MAT_TYPE_CODE = 'RESIN';

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
			resinOutGrid:null,
            curMode: 'R',
			gridRows:[],
            shiftCdList: [],
            stWorkDate: this.$utils.getWorkDate("-"), 
            edWorkDate: this.$utils.getTodayDate("-"), 
            sShiftCd: '',
            sShiftCdList: [],            
			subMatTypeList: [],
			sSubMatTypeCode: '',
            sSubMatTypeList: [],
            workerNm: '',
            materialId: '',
            searchMaterialId:'',
            barcodeLen: '',
            outDate:  this.$utils.getTodayDate(""),
            validDays: '',            
            baseInfo: {},
            tankList: [],
            marcoList: [],
		}
	},
	computed: {
		resinOutGridView(){
			return this.$refs.resinOutGrid.getGridView();
		},
		resinOutGridDataProvider(){
			return this.$refs.resinOutGrid.getGridDataProvider();
		},
        isDisabledBarcode(){
            return _.isEmpty(this.workerNm);
        },        
        isBarcodeMode(){
            return ( this.curMode === 'C' )
        },            
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
        this.resinOutGridView.checkBar.checkableCallback = this.checkableCallback;
        this.resinOutGridView.onCellClicked = this.onCellClicked;
        this.resinOutGridView.editOptions.commitByCell = true;	
        this.resinOutGridView.filteringOptions.automating.lookupDisplay = true;

        this.setCurTime();
		this.getSelectOptions();

        this.$eventBus.on("TAB001204MenuMove", this.menuMove);
	},

	beforeUnmount() {
        this.$eventBus.off("TAB001204MenuMove");
    },
    beforeDestroy() {
        // 컴포넌트가 파괴될 때 setInterval을 정리
        clearInterval(this.timeInterval);
    },
    methods: {
        initializeGrid() {
			this.resinOutGrid = _.cloneDeep(gridField);
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

                this.stWorkDate = this.$utils.formatDate(data.clickedField.slice(1),"-");
                this.edWorkDate = this.stWorkDate;
                this.sSubMatTypeCode = data.subMatTypeCode;      

                this.getDataList();
            });
        },            
        
        checkableCallback(dataSource, item){
            if ( this.resinOutGridDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }
            return false;
        },

/*         CellColorStyleCallBack(grid, model) {
			let rtn = {};
            let storeValidDays = grid.getValue(model.index.itemIndex, "storeValidDays");

            rtn.styleName = model.value > storeValidDays ? "tr red" : "tr";//색상속성 지정

			return rtn;
		}, */
/* 
        tankCellStyleCallBack(grid, model){
            let ret = {};

            let subMatTypeCode = grid.getValue(model.index.itemIndex, "subMatTypeCode");
            // let equipNo = grid.getValue(model.index.itemIndex, "equipNo");
            if(subMatTypeCode == 'DJ'){
                ret.editor = {
                    type: "dropdown",
                    textReadOnly: false,
                    values: this.tankList.map(item=>item.itemValue),
                    labels: this.tankList.map(item=>item.itemText),
                }
            }else{
                ret.editor = {
                    type: "dropdown",
                    textReadOnly: false,
                    values: this.marcoList.map(item=>item.itemValue),
                    labels: this.marcoList.map(item=>item.itemText),
                }
            }

            return ret;
        }, */

        setCellStyleCallbackResinOutGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "storeDays" ) {
                rtn.styleName = "tr";
                if ( jsonData.storeDays > jsonData.storeValidDays ) {
                    rtn.styleName = "tr red";
                }
            }

            if ( fieldName === "tank" ) {
                if(jsonData.subMatTypeCode == 'DJ'){
                    rtn.editor = {
                        type: "dropdown",
                        textReadOnly: false,
                        values: this.tankList.map(item=>item.itemValue),
                        labels: this.tankList.map(item=>item.itemText),
                    }
                }else{
                    rtn.editor = {
                        type: "dropdown",
                        textReadOnly: false,
                        values: this.marcoList.map(item=>item.itemValue),
                        labels: this.marcoList.map(item=>item.itemText),
                    }
                }
            }

            if ( fieldName === "comments"  || fieldName === "workerName" || fieldName === "equipNm" || fieldName === "stepNm" || fieldName === "tank"  ) {

                let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y" || this.isBarcodeMode ||  fieldName === "comments"  ) {
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

        async getSelectOptions(){

            let param1 = { menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{ majCode : "75"},
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.shiftCdList	);
										}
				};
            let param2 = { menuId:'M0001002', queryId:'getResinInfo', queryParams:{ majCode : "74"},
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["code", "codeName"],
											this.subMatTypeList	);

                                            this.resinList = data;
										}
				};
            let param3 = { menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{ majCode : "83"},
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.tankList	);
										}
				};
            let param4 = { menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{ majCode : "84"},
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.marcoList	);
										}
				};

            let shiftInfo = []; 
            let param5 = { menuId:'COMCODE', queryId:'selectShiftInfo', target:shiftInfo };

            await this.$axios.api.searchAll([param1,param2,param3,param4, param5]);

			this.sShiftCd = shiftInfo[0].shiftCode;

			this.sShiftCdList.push({ itemValue:"", itemText:"전체" });
			this.sShiftCdList.push(...this.shiftCdList	);		
			
			this.resinOutGridView.setColumnProperty("shiftCode", "values", 
				this.shiftCdList.map(item=>item.itemValue)
			);
			this.resinOutGridView.setColumnProperty("shiftCode", "labels", 
				this.shiftCdList.map(item=>item.itemText)
			);

			this.sSubMatTypeList.push({ itemValue:"", itemText:"전체" });
			this.sSubMatTypeList.push(...this.subMatTypeList	);		
			
			this.resinOutGridView.setColumnProperty("subMatTypeCode", "values", 
				this.subMatTypeList.map(item=>item.itemValue)
			);
			this.resinOutGridView.setColumnProperty("subMatTypeCode", "labels", 
				this.subMatTypeList.map(item=>item.itemText)
			);	

            this.getDataList();	  

		},

        async getDataList(){
			this.resinOutGridView.commit();
            if ( this.curMode == "C") {
                this.resinOutGridDataProvider.clearRows();
            }              
            this.curMode = 'R';

            if(_.isEmpty(this.stWorkDate) || _.isEmpty(this.edWorkDate)){
                this.$toast('info', "작업일자를 입력하세요.");
                return;
            }

			let params = {
				stWorkDate : this.stWorkDate.replaceAll('-',''),
				edWorkDate : this.edWorkDate.replaceAll('-',''),
				shiftCode : this.sShiftCd,
				subMatTypeCode : this.sSubMatTypeCode,
                searchMaterialId: this.searchMaterialId
			};

			let param = {menuId:'M0001002',queryId:'getSubMatResinOutList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);

		},

        onCellClicked( grid, clickData ){

			let searchParams = {
            };

			if (clickData.cellType != "data" ) return;

            if ( clickData.editable ) {

                if (clickData.fieldName === "equipNm" || clickData.fieldName === "stepNm"){
                    let params = {
                        dialogTitle: "설비정보",
                        step: 9,
                        height: 300,
                        width: 1600,
                        dataRow: clickData.dataRow,
                        gridJs: `CP0000000014.js`,
                        search: { menuId: "M0001001", queryId: "selectEquipListPop", queryParams: searchParams }
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
				this.resinOutGridView.setValue(itemIndex, "line", data["line"]);
				this.resinOutGridView.setValue(itemIndex, "stepCode", data["공정코드"]);
				this.resinOutGridView.setValue(itemIndex, "stepNm", data["공정명"]);
				this.resinOutGridView.setValue(itemIndex, "equipNo", data["설비번호"]);
				this.resinOutGridView.setValue(itemIndex, "equipNm", data["설비약명"]);
			}	
		},        

		checkValidBarcodeData(checkData) {

            if(_.isEmpty(this.materialId)){
                this.$toast('info', "바코드를 입력하십시요!");
				this.materialId = "";
                return false;
            }

            // if(_.isEmpty(this.sShiftCd)){
            //     this.$toast('info', "근무조를 선택하세요.");
            //     return false;
            // }

            if(_.isEmpty(this.workerNm)){
                this.$toast('info', "작업자를 입력하세요.");
                return false;
            }

            if(this.materialId.length < this.barcodeLen){
                this.$toast('info', "바코드 길이가 너무 짧습니다.");
                this.$refs.inpBarcode.focus();
                return false;
            }

            let rows = this.resinOutGridDataProvider.getJsonRows(0,-1);
            let dupRow = rows.find(ele => ele.materialId == this.materialId);
            if(!_.isUndefined(dupRow)){
                this.$toast('info', "이미 추가된 바코드입니다.");
                return false;
            }            

			return true;
		}, 
        
        setAddRowBarcode(){
            this.resinOutGridView.commit();

            this.resinOutGridDataProvider.addRow({
                'workDate': this.$utils.getWorkDate(""),
                'matTypeCode': MAT_TYPE_CODE,
                'subMatTypeCode': this.baseInfo.subMatTypeCode,
                'shiftCode': this.$utils.getShiftCode(),
                'outDate': this.$utils.getTodayDate(""),
                'materialId': this.materialId,
                'equipNm': '',
                'stepNm': '',
                'unit': this.baseInfo.unit,
                //'remainQty': this.baseInfo.remainQty,
                'outQty': 1,
                'workerName': this.workerNm,
                'storeTime': this.baseInfo.storeTime,
                'storeDays': this.baseInfo.storeDays,
                'storeValidDays': this.baseInfo.storeValidDays,
                'comments': '',
                'inComments': this.baseInfo.inComments,
            });
            let itemIndex = this.resinOutGridView.getItemCount() - 1;
            this.resinOutGridView.setCurrent({ itemIndex: itemIndex });

            this.setOutSeq();
            this.materialId = '';
            this.$refs.inpBarcode.focus();
        },

        setOutSeq(){
            for (var i = 0; i < this.resinOutGridDataProvider.getRowCount(); i++) {
                this.resinOutGridDataProvider.setValue(i, "outSeq", i + 1);  // 각 행에 번호 부여
            }
        },   

        async processBarcode(){
            if(this.resinOutGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.resinOutGridDataProvider.clearRows();
            }
            this.curMode = 'C';

            if ( this.checkValidBarcodeData() ) {

                this.productCode = this.materialId.substring(0,10);
                this.batchId = this.materialId.substring(17,27);

                let param = {
                    materialId: this.materialId,
                };

                let params = {menuId:'M0001002',queryId:'getSubMatResinInInfo', queryParams:{materialId: this.materialId}, target: this.baseInfo};
                await this.$axios.api.search(params);

                if(_.isEmpty(this.baseInfo)){
                    this.$toast("info","해당 바코드로 입고된 정보가 없습니다!");
                    this.materialId = "";
                    return;
                }

                if(this.baseInfo.remainQty < 1){
                    this.$toast("info","이미 출고처리된 자재입니다!");
                    this.materialId = "";
                    return;
                }

                this.setAddRowBarcode();
            }

        },

		checkValidSaveData(checkData) {

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

            return true;

		},           

		async saveData() {

			let saveData = this.$refs.resinOutGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001002',
					delete: [{queryId:'deleteSubMatResinOut', data:saveData.delete}],
					insert: [{queryId:'insertSubMatResinOut', data:saveData.insert}],
					update: [{queryId:'updateSubMatResinOut', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode === 'C'){
                            this.stWorkDate = this.$utils.getWorkDate("-");
                            this.edWorkDate = this.$utils.getWorkDate("-");
                        }
                        this.curMode = 'R';
						this.searchBtnClick();
					}
					else if ( response.data.resultCode === "LACK_QTY") {
                        const msg = `[바코드(자재ID) 확인]\n[${response.data.resultData}] \n이미 공정투입된 자재입니다. 확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}					
				}).catch((error) => {
					this.$toast("error", error);
				});

			}
		},        

		searchBtnClick() {
            if(this.curMode == 'C' && this.resinOutGridDataProvider.getRowCount() > 0){
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
			this.resinOutGridView.commit();
			const checkedRows = this.resinOutGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하세요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.resinOutGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.resinOutGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.resinOutGridDataProvider.removeRows(delItems);

                this.setOutSeq();
			}
		},

        async saveBtnClick(){
            this.resinOutGridView.commitEditor();
			this.resinOutGridView.commit();
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
                            this.materialId = "";
                            this.getDataList();
                        }
                    });  
        },        

        async excelBtnClick(){

			const grid = this.resinOutGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `레진_공정투입_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

        onDataLoadComplatedResinOutGrid(grid){
			
		}
    },
    onDataLoadComplatedResinInGird(grid){}

}
</script>
<style scoped>
.disabled {
  pointer-events: none; /* 클릭 방지 */
  opacity: 0.2;         /* 투명도 조정 */
  background-color: #f5f5f5; /* 회색 배경 */
}
</style>