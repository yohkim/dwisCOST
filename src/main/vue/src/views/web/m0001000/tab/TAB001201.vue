/**
*	자재관리 > 원자재 > 공정투입
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">
                    <div class="label_title">작업 일자</div>
                    <div class=" form-floating me-1"> 
                        <date-picker label="시작일"  v-model="stWorkDate" />
                        <label for="floatingPicker">시작일</label>
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
                <b-col cols="3">
                    <div class="form-floating">
                        <input type="text" ref="searchGlassId" class="form-control label-80" id="floating" placeholder="바코드 검색" autocomplete="off" 
                         v-model="searchGlassId"
                         @input="this.$utils.convertToUpperEng($event, 'searchGlassId', this)" 
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
                        <input type="text" class="form-control label-60" id="floating" placeholder="작업자" autocomplete="off" v-model="workerNm">
                        <label for="floating">작업자</label>
                    </div>              
                </b-col>
                <b-col cols="4">
                    <div class="form-floating">
                        <input type="text" ref="inpBarcode" class="form-control label-60" id="floating" placeholder="바코드" autocomplete="off" v-model="glassId" :disabled="isDisabledBarcode" 
                        @input="this.$utils.convertToUpperEng($event, 'glassId', this)"  
                        @keyup.enter="processBarcode">
                        <label for="floating">바코드</label>
                    </div>                                      
                </b-col>
                <b-col cols="2">
                        <div style="width:400px"><span style="font-size: 11px; color: blue;">* 공정투입 작업전 작업자를 입력하십시요. </span></div>
                </b-col>                                
            </b-row >
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
                <RealGrid ref="glsOutGrid" :uid="'glsOutGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
                <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
            </div>
        </div>
    </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001201.js';

const URI_PREFIX = '/api/m0001000/m0001001/TAB001201';
const MAT_TYPE_CODE = 'GLASS';

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
			glsOutGrid:null,
            curMode: 'R',
			gridRows:[],
            shiftCdList: [],
            stWorkDate: this.$utils.getWorkDate("-"), //this.$utils.getSomeMonthDate(-1),
            edWorkDate: this.$utils.getTodayDate("-"),
            sShiftCd: '',
            sShiftCdList: [],
            userId: this.userAuthInfo.userInfo.userId,
            userNm: this.userAuthInfo.userInfo.userName,
            workerNm: '',
            glassId: '',
            searchGlassId:'',
            productCode: '',
            batchId: '',
            baseInfo: {},
            workDate: ''
		}
	},
	computed: {
		glsOutGridView(){
			return this.$refs.glsOutGrid.getGridView();
		},
		glsOutGridDataProvider(){
			return this.$refs.glsOutGrid.getGridDataProvider();
		},
        isDisabledBarcode(){
            return  _.isEmpty(this.workerNm);
        },
        isBarcodeMode(){
            return ( this.curMode === 'C' )
        },          
        menuList() {
            return this.userAuthInfo.getSysResourceMap.childSysResc;
        },
        prodCtg() {
            return this.userAuthInfo.selectedProdCtg;
        },
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

        this.glsOutGridView.checkBar.checkableCallback = this.checkableCallback;
        this.glsOutGridView.onCellClicked = this.onCellClicked;
        this.glsOutGridView.onCellEdited  = this.onCellEdited;
        this.glsOutGridView.onValidateColumn = this.onValidateColumn;
        this.glsOutGridView.editOptions.commitByCell = true;	
        this.glsOutGridView.filteringOptions.automating.lookupDisplay = true;

        this.setCurTime();
		this.getSelectOptions();

        this.$eventBus.on("TAB001201MenuMove", this.menuMove);
	},
	beforeUnmount() {
        this.$eventBus.off("TAB001201MenuMove");
    },
    beforeDestroy() {
        // 컴포넌트가 파괴될 때 setInterval을 정리
        clearInterval(this.timeInterval);
    },
    methods: {
        initializeGrid() {
			this.glsOutGrid = _.cloneDeep(gridField);
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
                this.sShiftCd = '';

                this.getDataList();
            });
        },            

        checkableCallback(dataSource, item){
            if ( this.glsOutGridDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }
            return false;
        },        

        setCellStyleCallbackGlsOutGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "workerName" ||  fieldName === "equipNm" ||  fieldName === "outQty" ) {
                
                let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y" || this.isBarcodeMode  ) {
                    rtn.editable = true;
                    rtn.styleName = "edit " + styleName;
                }
                else {
                    rtn.editable = false;
                    rtn.styleName = styleName;   
                }    
            }

            if ( fieldName === "glassId" && !this.isBarcodeMode ) {
				rtn['renderer'] = {
					type: "link",
					urlCallback: function (grid, cell) {
					},
					titleField: "fieldName"
				}                    

            }
            return rtn;
        },

        onCellItemClickedGlsOutGrid(grid, index, clickData) {   

            if (clickData.type == "link" && clickData.url) {
                let ds = grid.getDataSource();
                let current = grid.getCurrent();
                let jsonData = ds.getJsonRow(current.dataRow);

                if(clickData.fieldName === "glassId") {
                    
                    let glassId = jsonData.glassId;
                    let logGlassId = glassId.slice(0,17) + "-" + glassId.slice(17,27) ;

					const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, '제조 실적 입력');
					const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, 'FRONT');
                    
                    let tabEvent = "TAB020000MenuMove";
                    let params = {
                        glassId : logGlassId
                    };

					this.$eventBus.emit('menuMoveClick', { menu: this.$utils.createMenuData(menu1, menu2, menu2.childSysResc[1]), 
						callback: () => { 
							this.$eventBus.emit( tabEvent, params);
						}}); 
                }

                return false;
            }
        },

        async getSelectOptions(){

			let param = { majCode : "75"};
            let shiftInfo = [];

			let searchParam = [
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:param,
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.shiftCdList	);
										}
				},
                { menuId:'COMCODE', queryId:'selectShiftInfo', target:shiftInfo }
            ];

			let resp = await this.$axios.api.searchAll(searchParam);
            this.sShiftCd = shiftInfo[0].shiftCode;

			this.sShiftCdList.push({ itemValue:"", itemText:"전체" });
			this.sShiftCdList.push(...this.shiftCdList	);		
			
			this.glsOutGridView.setColumnProperty("shiftCode", "values", 
				this.shiftCdList.map(item=>item.itemValue)
			);
			this.glsOutGridView.setColumnProperty("shiftCode", "labels", 
				this.shiftCdList.map(item=>item.itemText)
			);

            const today = new Date();
			const hours = today.getHours();
			const hhmm = String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0');
			this.workDate = ( hours < 8 ) ? this.$utils.getSomedayDate(-1,"") : this.$utils.getTodayDate("");            

            this.getDataList();
		},

        async getDataList(){
			this.glsOutGridView.commit();
            if ( this.curMode == "C") {
                this.glsOutGridDataProvider.clearRows();
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
                searchGlassId: this.searchGlassId  
			};

			let param = {menuId:'M0001001',queryId:'getRawMatOutList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);

		},

		searchBtnClick() {
            if(this.curMode == 'C' && this.glsOutGridDataProvider.getRowCount() > 0){
                this.$confirm("확인", '저장하지 않은 데이터가 있습니다. 조회를 하시겠습니까?', (confirm)=>{
                    if(confirm){
                        this.getDataList();
                    }
                });
            }else{
                this.getDataList();
            }
		},

        checkValidBarcodeData(checkData) {

            if(_.isEmpty(this.glassId)){
                this.$toast('info', "바코드를 입력하십시요!");
				this.glassId = "";
                return false;
            }            

            // if(_.isEmpty(this.sShiftCd)){
            //     this.$toast('info', "근무조를 선택하세요.");
            //     this.glassId = "";
            //     return false;
            // }

            if(this.glassId.length < 27){
                this.$toast('info', "바코드 길이가 너무 짧습니다.");
                this.$refs.inpBarcode.focus();
                this.glassId = "";
                return false;
            }

            if(_.isEmpty(this.workerNm)){
                this.$toast('info', "작업자를 입력하세요.");
                return false;
            }

            let rows = this.glsOutGridDataProvider.getJsonRows(0,-1);
            let dupRow = rows.find(ele => ele.glassId == this.glassId);
            // console.log('dupRow========>',dupRow);
            if(!_.isUndefined(dupRow)){
                this.$toast('info', "이미 추가된 바코드입니다.");
                this.glassId = "";
                return false;
            }
			return true;
		}, 

        async processBarcode(){

            if(this.glsOutGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.glsOutGridDataProvider.clearRows();
            }
            this.curMode = 'C';

            if ( this.checkValidBarcodeData() ) {   

                    this.productCode = this.glassId.substring(0,10);
                    this.batchId = this.glassId.substring(17,27);

                    let param = {
                        glassId: this.glassId,
                    };

                    await this.$axios.post(URI_PREFIX + "/getBaseInfo", param).then((response) => {
                        // console.log('data=====>',response.data);
                        this.baseInfo = response.data;

                        if(_.isEmpty(this.baseInfo.inDataInfo)){
                            this.$toast("info","해당 바코드로 입고된 정보가 없습니다!");
                            this.glassId = '';
                            return;
                        }
                        else {
                            if ( this.baseInfo.inDataInfo.stockQty <= 0 ) {
                                this.$toast("info", "재고수량이 없습니다!");
                                this.glassId = "";
                                return false;                                     
                            }
                            else {
                                this.setAddRowBarcode();
                            }
                        }                                                
                    }).catch((error) => {
                        this.$toast("error", error);
                    });
            }

        },

        setAddRowBarcode(){
            this.glsOutGridView.commit();          

            this.glsOutGridDataProvider.addRow({
                'workDate': this.$utils.getWorkDate(""),
                'shiftCode': this.$utils.getShiftCode(),
                'outDate': this.$utils.getTodayDate(""),
                'glassId': this.glassId,
                'inDate' : this.baseInfo.inDataInfo.inDate,
                'batchNo': this.batchId,
                'useCategory': this.baseInfo.inDataInfo.useCategory,
                'useCategoryNm': this.baseInfo.inDataInfo.useCategoryNm,
                'glassThickness': this.baseInfo.inDataInfo.glassThickness,
                'glassMaterial': this.baseInfo.inDataInfo.glassMaterial,
                'workerName': this.workerNm,
                'equipNm': '',
                'stepNm': '',
                'remainQty': this.baseInfo.inDataInfo.remainQty,
                'stockQty': this.baseInfo.inDataInfo.stockQty,
                'outQty': this.baseInfo.inDataInfo.stockQty,
                'goodQty': this.baseInfo.inDataInfo.stockQty,
                'unit': this.baseInfo.inDataInfo.unit,
                'errorRate': 0,
                'errorQty': 0,
                'errorNgportQty': 0,
                'errorWashQty': 0,
                'errorTkoutQty': 0,
                'errorEtcQty': 0,
                'comments': '',
                'inComments': this.baseInfo.inDataInfo.inComments,
                'userId': this.userId,
            });
            let itemIndex = this.glsOutGridView.getItemCount() - 1;
            this.glsOutGridView.setCurrent({ itemIndex: itemIndex });

            this.setBoxNum();
            this.glassId = '';
            this.$refs.inpBarcode.focus();
        },

        setBoxNum(){
            for (var i = 0; i < this.glsOutGridDataProvider.getRowCount(); i++) {
                this.glsOutGridDataProvider.setValue(i, "outSeq", i + 1);  // 각 행에 번호 부여
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

			let saveData = this.$refs.glsOutGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001001',
					delete: [{data:saveData.delete}],
					insert: [{data:saveData.insert}],
					update: [{data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode === 'C'){
                            this.curMode = 'R';
                            this.stWorkDate = `${this.workDate.slice(0, 4)}-${this.workDate.slice(4, 6)}-${this.workDate.slice(6, 8)}`;
                            this.edWorkDate = `${this.workDate.slice(0, 4)}-${this.workDate.slice(4, 6)}-${this.workDate.slice(6, 8)}`;
                        }
                        this.curMode = 'R';
						this.searchBtnClick();
					}
					else if ( response.data.resultCode === "LACK_QTY") {
                        // let dupBarcode = response.data.resultData.map(item => JSON.stringify(item.glass_id)).join(", ");
						// const msg = `[바코드 확인]\n[${dupBarcode}] 이미 입고처리 되었습니다.` ;
						this.$toast("info", response.data.resultMsg);
					}						
				}).catch((error) => {
					this.$toast("error", error);
				});

			}
		},        

        delBtnClick() {
			this.glsOutGridView.commit();
			const checkedRows = this.glsOutGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하세요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.glsOutGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.glsOutGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.glsOutGridDataProvider.removeRows(delItems);

                this.setBoxNum();
			}
		},

        async saveBtnClick(){
            this.glsOutGridView.commitEditor();
			this.glsOutGridView.commit();

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

        onCellClicked( grid, clickData ){
			let searchParams = {};

			if (clickData.cellType != "data" ) return;

            if ( clickData.editable ) {

                if (clickData.fieldName === "equipNm" || clickData.fieldName === "stepNm"){
                    let params = {
                        dialogTitle: "설비정보",
                        step: 9,
                        height: 300,
                        width: 1600,
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
				this.glsOutGridView.setValue(itemIndex, "line", data["line"]);
				this.glsOutGridView.setValue(itemIndex, "stepCode", data["공정코드"]);
				this.glsOutGridView.setValue(itemIndex, "stepNm", data["공정명"]);
				this.glsOutGridView.setValue(itemIndex, "equipNo", joinedEquipCode);
				this.glsOutGridView.setValue(itemIndex, "equipNm", joinedEquipName);
			}	
		},

        onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
            
			let error = {};
            var rowState = this.glsOutGridDataProvider.getRowState(dataRow);
/*              if(rowState != RowState.CREATED){
                return error;
            }  */

            const stockQty = grid.getValue(itemIndex, "stockQty");
            const outQty = grid.getValue(itemIndex, "outQty");
            const errorNgportQty = grid.getValue(itemIndex, "errorNgportQty");
            const errorWashQty = grid.getValue(itemIndex, "errorWashQty");
            const errorTkoutQty = grid.getValue(itemIndex, "errorTkoutQty");
            const errorEtcQty = grid.getValue(itemIndex, "errorEtcQty");     
            const errorQty =     errorNgportQty + errorWashQty + errorTkoutQty + errorEtcQty;
            
			if (column.fieldName === "outQty") {
				if(_.isUndefined(value)){					
					error.level = "warning";
					error.message = "투입수량을 입력하세요.";
					//this.$toast("warn", (itemIndex+1) + "번째 Row : 투입수량을 입력하세요.");
				}
                if(value > stockQty){					
					error.level = "warning";
					error.message = "투입수량은 재고수량을 초과할 수 없습니다.";
					//this.$toast("warn", (itemIndex+1) + "번째 Row : 투입수량은 재고수량을 초과할 수 없습니다.");
				}              
			} else if (column.fieldName === "errorNgportQty"||column.fieldName === "errorWashQty"||column.fieldName === "errorTkoutQty"||column.fieldName === "errorEtcQty") {
                if(_.isUndefined(value)){					
					error.level = "warning";
					error.message = "불량수량을 입력하세요.";
					//this.$toast("warn", (itemIndex+1) + "번째 Row : 불량수량을 입력하세요.");
				}
                if(errorQty > outQty){					
					error.level = "warning";
					error.message = "불량수량은 투입수량을 초과할 수 없습니다.";
					//this.$toast("warn", (itemIndex+1) + "번째 Row : 불량수량은 투입수량을 초과할 수 없습니다.");
				}
			} 
			return error;
		},

        cancelBtnClick() {

                this.$confirm("확인", "공정투입 작업을 취소하시겠습니까?", (confirm)=>{
                        if(confirm){
                            this.glassId = "";
                            this.getDataList();
                        }
                    });  
        },        

        async excelBtnClick(){

			const grid = this.glsOutGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `원자재_공정투입_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
        
        onDataLoadComplatedGlsOutGrid(grid){
			
		}
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