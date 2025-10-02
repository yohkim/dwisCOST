/**
*	자재관리 > 부자재-레진 > 공정입고
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">
                    <div class="label_title">입고 일자</div>
                    <div class=" form-floating me-1"> 
                        <date-picker label="시작일"  v-model="stDate" />
                        <label for="floatingPicker">시작일</label>
                    </div>
                    ~
                    <div class=" form-floating  ms-1 "> 
                    <date-picker label="종료일"  v-model="edDate" />
                        <label for="floatingPicker">종료일</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="sSubMatTypeCode" @change="setBarcodeInfo">
                            <option v-for="item in sSubMatTypeList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">레진종류</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-130 " id="floatingSelect" aria-label="Floating label select example" v-model="sStoreValidPassYn" >
                            <option v-for="item in sStoreValidPassYnList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">상온보관 유효일 경과</label>
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
            <b-row class=" worker_info ">
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
                        <input type="text" ref="inpBarcode" class="form-control label-60" id="floating" placeholder="바코드" autocomplete="off" v-model="materialId" :disabled="this.sSubMatTypeCode==='' || this.workerName===''"  
                        @input="this.$utils.convertToUpperEng($event, 'materialId', this)" 
                        @keyup.enter="processBarcode">
                        <label for="floating">바코드</label>
                    </div> 
                </b-col>
                <b-col cols="2">
                    <div style="width:300px"><span style="font-size: 11px; color: blue;">* 입고작업전 레진종류를 선택, 담당자를 입력하십시요. </span></div>
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
                <RealGrid ref="resinInGird" :uid="'resinInGird'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
                <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
            </div>
        </div>
    </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001102.js';

const URI_PREFIX = '/api/m0001000/m0001002/TAB001102';
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
			resinInGird:null,
            curMode: 'R',
			gridRows:[],
            subMatTypeList: [],
            stDate: this.$utils.getWorkDate("-"), //this.$utils.getSomeMonthDate(-1),
            edDate: this.$utils.getTodayDate("-"), 
            sSubMatTypeCode: '',
            sSubMatTypeList: [],
            sStoreValidPassYnList: [],
            sStoreValidPassYn: '',
            workerId: this.userAuthInfo.userInfo.userId,
            workerName:'',
            materialId: '',
            searchMaterialId:'',
            productCode: '',
            batchId: '',
            baseInfo: {},
            resinList: [],
            barcodeLen: 0,
            validDays: 0,
            //makeDate: '',
            //makeElapseDays: 0,
		}
	},
	computed: {
		resinInGirdView(){
			return this.$refs.resinInGird.getGridView();
		},
		resinInGirdDataProvider(){
			return this.$refs.resinInGird.getGridDataProvider();
		},
        isBarcodeMode(){
            return ( this.curMode === 'C' )
        },            
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		// this.resinInGirdView.columnByName("inQty").styleCallback = this.cellStyleCallEdit;
        this.resinInGirdView.checkBar.checkableCallback = this.checkableCallback;
        this.resinInGirdView.onCellEdited  = this.onCellEdited;
        this.resinInGirdView.editOptions.commitByCell = true;	
        this.resinInGirdView.filteringOptions.automating.lookupDisplay = true;

        this.setCurTime();
		this.getSelectOptions();
        this.getDataList();	  

        this.$eventBus.on("TAB001102MenuMove", this.menuMove);
	},

	beforeUnmount() {
        this.$eventBus.off("TAB001102MenuMove");
    },
    beforeDestroy() {
        // 컴포넌트가 파괴될 때 setInterval을 정리
        clearInterval(this.timeInterval);
    },
    methods: {
        initializeGrid() {
			this.resinInGird = _.cloneDeep(gridField);
		},

        setCurTime(){
            // 1초마다 currentTime을 갱신
            this.timeInterval = setInterval(() => {
                this.currentTime = this.$utils.getTodayDateTime();
            }, 1000);
        },    

        menuMove(data) {
            this.$nextTick(()=>{

                this.stDate = this.$utils.formatDate(data.clickedField.slice(1),"-");
                this.edDate = this.stDate;
                this.sSubMatTypeCode = data.subMatTypeCode;      

                this.getDataList();
            });
        },    
        
        checkableCallback(dataSource, item){
            if ( this.resinInGirdDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }
            return false;
        },           

        setCellStyleCallbackResinInGird(grid, cell){
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

            if ( fieldName === "comments" || ( fieldName === "makeDate" && jsonData.subMatTypeCode === "DJ") || fieldName === "workerName" ) {

                let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y"  || fieldName === "comments" ) {
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

            this.resinInGirdView.commit(); 
           // if (field === 10) {
                const subMatTypeCode = grid.getValue(itemIndex, "subMatTypeCode");   
                
                if ( subMatTypeCode === "DJ"){
                    const makeDate = grid.getValue(itemIndex, "makeDate");                
                    grid.setValue(itemIndex, "makeElapseDays", this.$utils.getNumberOfDays(makeDate));                    

                }                
           // }
        },

        async getSelectOptions(){

			let param = { majCode : "74"};

			let searchParam = 
				{ menuId:'M0001002', queryId:'getResinInfo', queryParams:param,
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["code", "codeName"],
											this.subMatTypeList	);

                                            this.resinList = data;
										}
				};

			let resp = await this.$axios.api.search(searchParam);

			this.sSubMatTypeList.push({ itemValue:"", itemText:"전체" });
			this.sSubMatTypeList.push(...this.subMatTypeList	);		
			
			this.resinInGirdView.setColumnProperty("subMatTypeCode", "values", 
				this.subMatTypeList.map(item=>item.itemValue)
			);
			this.resinInGirdView.setColumnProperty("subMatTypeCode", "labels", 
				this.subMatTypeList.map(item=>item.itemText)
			);

            this.sStoreValidPassYnList.push({itemValue:"", itemText:"전체"},{itemValue:"Y", itemText:"Y"}, {itemValue:"N", itemText:"N"});            

		},

        async getDataList(){
			this.resinInGirdView.commit();
            if ( this.curMode == "C") {
                this.resinInGirdDataProvider.clearRows();
            }
            this.curMode = 'R';

            if(_.isEmpty(this.stDate) || _.isEmpty(this.edDate)){
                this.$toast('info', "입고일자를 입력하세요.");
                return;
            }

			let params = {
				stDate : this.stDate.replaceAll('-',''),
				edDate : this.edDate.replaceAll('-',''),
				subMatTypeCode : this.sSubMatTypeCode,
                storeValidPassYn: this.sStoreValidPassYn,
                searchMaterialId: this.searchMaterialId
			};

			let param = {menuId:'M0001002',queryId:'getSubMatResinInList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

        setBarcodeInfo(){
            if(_.isEmpty(this.sSubMatTypeCode)){
                return;
            }
            let resinInfo = this.resinList.find((item) => item.code === this.sSubMatTypeCode);
            this.barcodeLen = resinInfo.etc1;
            this.validDays = resinInfo.etc2;
        },

        getMakeDateMonth(code) {
            
            const monthMap = {
                "1": "01", "2": "02", "3": "03", "4": "04", "5": "05", "6": "06",
                "7": "07", "8": "08", "9": "09", "X": "10", "Y": "11", "Z": "12"
            };

            return monthMap[code];            
        },

        setAddRowBarcode(){
            this.resinInGirdView.commit();

            // 동진레진의 경우, 제조일 세팅
            let makeDate = "";
            let makeElapseDays = "";
            if ( this.sSubMatTypeCode === "DJ" ) {
                const year = new Date().getFullYear();
                const curYYYYDigit = year % 10;

                let makeYYYYDigit = parseInt(this.materialId.charAt(2), 10);

                let makeDateYear;
                if ( makeYYYYDigit <= curYYYYDigit ) {
                    makeDateYear = year.toString().slice(0,3) + makeYYYYDigit;
                }
                else {
                    makeDateYear  = (parseInt(year.toString().slice(0,3))-1).toString() + makeYYYYDigit;
                }

                const makeDateMonth = this.getMakeDateMonth(this.materialId.charAt(3));
                const makeDateDay = this.materialId.slice(4, 6);

                makeDate = `${makeDateYear}${makeDateMonth}${makeDateDay}`;
                makeElapseDays = this.$utils.getNumberOfDays(makeDate);
            }            

            this.resinInGirdDataProvider.addRow({
                'inDate': this.$utils.getTodayDate(""),
                'matTypeCode': MAT_TYPE_CODE,
                'subMatTypeCode': this.sSubMatTypeCode,
                'materialId': this.materialId,
               // 'unit': _.isUndefined(this.baseInfo.unitInfo) == true ? '' : this.baseInfo.unitInfo.unit,
                 'unit': ( this.sSubMatTypeCode === "DAM" )? "Kg" : _.isUndefined(this.baseInfo.unitInfo) == true ? '' : this.baseInfo.unitInfo.unit,
                'inQty': 1,
                'useQty': 0,
                'remainQty': 1,
                'useYn': 'N',
                'workerId': this.workerId,
                'workerName': this.workerName,
                'makeDate': makeDate,
                'makeElapseDays': makeElapseDays,
                'storeValidDays': this.validDays,
                'storeDays': 0,
                'comments': '',
            });
            let itemIndex = this.resinInGirdView.getItemCount() - 1;
            this.resinInGirdView.setCurrent({ itemIndex: itemIndex });

            // this.setBoxNum();
            this.materialId = '';
            this.$refs.inpBarcode.focus();
        },

        setBoxNum(){
            for (var i = 0; i < this.resinInGirdDataProvider.getRowCount(); i++) {
                this.resinInGirdDataProvider.setValue(i, "boxNum", i + 1);  // 각 행에 번호 부여
            }
        },

        async processBarcode(){
            if(this.resinInGirdDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.resinInGirdDataProvider.clearRows();
            }
            this.curMode = 'C';

            if(_.isEmpty(this.sSubMatTypeCode)){
                this.$toast('info', "레진구분을 선택하세요.");
                return false;
            }

            if(_.isEmpty(this.materialId)){
                this.$toast('info', "바코드를 입력하십시요!");
                return false;
            }            
            
            if(this.materialId.length < this.barcodeLen){
                this.$toast('info', "바코드 길이가 너무 짧습니다.");
                this.$refs.inpBarcode.focus();
                return false;
            }

            let rows = this.resinInGirdDataProvider.getJsonRows(0,-1);
            let dupRow = rows.find(ele => ele.materialId == this.materialId);
            if(!_.isUndefined(dupRow)){
                this.$toast('info', "이미 추가된 바코드입니다.");
                return false;
            }

            // console.log('materialId=====>',this.materialId);
            // console.log('productCode=====>',this.productCode);
            // console.log('batchId=====>',this.batchId);
            //동진레진의 경우 ex) DJ4723S082R049 로 DJ로 시작,DJ4723 제조일 2024-07-23 으로 표시 ( 댐레진의 경우는 제조일 알수 없으므로 미표시 )
            // if(this.sSubMatTypeCode === 'DJ'){
            //     //임시 하드코딩
            //     this.makeDate = '';
            //     this.makeElapseDays = this.$utils.getNumberOfDays(this.makeDate);
            //     // console.log('makeElapseDays=======>',this.makeElapseDays);
            // }else if(this.sSubMatTypeCode === 'DAM'){
            //     this.makeDate = '';
            //     this.makeElapseDays = 0;
            // }

            let param = {
				materialId: this.materialId,
			};

			await this.$axios.post(URI_PREFIX + "/getBaseInfo", param).then((response) => {
                this.baseInfo = response.data;
				if ( response.data.dupYn === "Y" ) {
					this.$toast("info", "이미 입고 처리된 바코드입니다.");
                    this.materialId = "";
                    return false;
				}else{
                    this.setAddRowBarcode();
                }
										
			}).catch((error) => {
				this.$toast("error", error);
			});

        },

		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

			return !invalid;
		},

		async saveData() {

			let saveData = this.$refs.resinInGird.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0001002',
					delete: [{queryId:'deleteSubMatResinIn', data:saveData.delete}],
					insert: [{queryId:'insertSubMatResinIn', data:saveData.insert}],
					update: [{queryId:'updateSubMatResinIn', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode == 'C'){
                            this.stDate = this.$utils.getTodayDate();
                            this.edDate = this.$utils.getTodayDate();
                            //this.sSubMatTypeCode = '';
                        }
                        this.curMode = 'R';
						this.searchBtnClick();
					}
					else if ( response.data.resultCode === "CHECK_USED") {
						const msg = `[바코드(자재ID) 확인]\n[${response.data.resultData}]\n이미 출고처리된 자재는 수정/삭제할 수 없습니다. 확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}                      
					else if ( response.data.resultCode === "DUP_ERR") {
                        let dupBarcode = response.data.resultData.map(item => JSON.stringify(item.glass_id)).join(", ");
						const msg = `[바코드 확인]\n[${dupBarcode}] 이미 입고처리된 바코드 입니다. 확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}						
				}).catch((error) => {
					this.$toast("error", error);
				});

			}
		},        

		searchBtnClick() {
            if(this.curMode == 'C' && this.resinInGirdDataProvider.getRowCount() > 0){
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
			this.resinInGirdView.commit();
			const checkedRows = this.resinInGirdView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하세요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.resinInGirdDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.resinInGirdDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.resinInGirdDataProvider.removeRows(delItems);

                // this.setBoxNum();
			}
		},

        async saveBtnClick(){
			this.resinInGirdView.commit();
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
                            this.materialId = "";2025
                            this.getDataList();
                        }
                    });  
        },        

        async excelBtnClick(){

			const grid = this.resinInGirdView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `레진_공정전입고_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

        onDataLoadComplatedResinInGird(grid){}
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