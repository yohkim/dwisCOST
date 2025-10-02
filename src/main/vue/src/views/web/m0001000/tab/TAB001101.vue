/**
*	자재관리 > 원자재 > 공정입고
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
                <b-col cols="1">
                    <div class="form-floating">
                        <select class="form-select label-65 " id="floatingSelect" aria-label="Floating label select example" v-model="sCategory" >
                            <option v-for="item in sCategoryList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">투입구분</label>
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
            <div class="row worker_info">
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
                        <input type="text" ref="inpBarcode" class="form-control label-60" id="floating" placeholder="바코드" autocomplete="off" v-model="glassId" :disabled="this.sCategory==='' || this.workerName===''" 
                        @input="this.$utils.convertToUpperEng($event, 'glassId', this)" 
                        @keydown.enter="processBarcode"
                        maxlength="30">
                        <label for="floating">바코드</label>
                    </div>              
                </b-col>
                <b-col cols="2">
                    <div style="width:300px"><span style="font-size: 11px; color: blue;">* 입고작업전 투입구분을 선택, 담당자를 입력하십시요. </span></div>
                </b-col >                            
            </div>
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
                <RealGrid ref="glsInGrid" :uid="'glsInGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
                <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
            </div>
        </div>
    </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001101.js';

const URI_PREFIX = '/api/m0001000/m0001001/TAB001101';
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
			glsInGrid:null,
            curMode: 'R',
			gridRows:[],
            categoryList: [],
            stDate: this.$utils.getWorkDate("-"), //this.$utils.getSomeMonthDate(-1),
            edDate: this.$utils.getTodayDate("-"),
            sCategory: '',
            sCategoryList: [],
            category: '',
            workerId: this.userAuthInfo.userInfo.userId,
            workerName:'',
            glassId: '',
            searchGlassId:'',
            productCode: '',
            batchId: '',
            baseInfo: {},
		}
	},
	computed: {
		glsInGridView(){
			return this.$refs.glsInGrid.getGridView();
		},
		glsInGridDataProvider(){
			return this.$refs.glsInGrid.getGridDataProvider();
		},
        isBarcodeMode(){
            return ( this.curMode === 'C' )
        },           
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
        this.$eventBus.on("TAB001101MenuMove", this.menuMove);

        this.glsInGridView.checkBar.checkableCallback = this.checkableCallback;
        this.glsInGridView.onCellEdited = this.onCellEdited;	
        this.glsInGridView.editOptions.commitByCell = true;	        
        this.glsInGridView.filteringOptions.automating.lookupDisplay = true;

        this.setCurTime();
		this.getSelectOptions();
        this.getDataList();	  
	},
	beforeUnmount() {
        this.$eventBus.off("TAB001101MenuMove");
    },
    beforeDestroy() {
        // 컴포넌트가 파괴될 때 setInterval을 정리
        clearInterval(this.timeInterval);
    },
    methods: {
        initializeGrid() {
			this.glsInGrid = _.cloneDeep(gridField);
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
                this.sCategory = data.useCategory;

                this.getDataList();
            });
        },      
        
        checkableCallback(dataSource, item){
            if ( this.glsInGridDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }
            return false;
        },            

        setCellStyleCallbackGlsInGrid(grid, cell){
            let rtn = {};            
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "comments" || fieldName === "inQty" || fieldName === "workerName"  ) {

                let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y" || fieldName === "comments" || fieldName === "inQty" || fieldName === "workerName" ) {
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
            const orgInQty = grid.getValue(itemIndex, "orgInQty");
            const remainQty = grid.getValue(itemIndex, "remainQty") +( inQty - orgInQty  ) ;
			grid.setValue(itemIndex, "remainQty", remainQty );
		},          

        async getSelectOptions(){

			let param = { majCode : "74"};

			let searchParam = 
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:param,
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.categoryList	);
										}
				};

			let resp = await this.$axios.api.search(searchParam);
            this.category = this.categoryList[0].itemValue;

			this.sCategoryList.push({ itemValue:"", itemText:"전체" });
			this.sCategoryList.push(...this.categoryList	);		
			
			this.glsInGridView.setColumnProperty("useCategory", "values", 
				this.categoryList.map(item=>item.itemValue)
			);
			this.glsInGridView.setColumnProperty("useCategory", "labels", 
				this.categoryList.map(item=>item.itemText)
			);
		},

        async getDataList(){
			this.glsInGridView.commit();
            if ( this.curMode == "C") {
                this.glsInGridDataProvider.clearRows();
            }            
            this.curMode = 'R';

            if(_.isEmpty(this.stDate) || _.isEmpty(this.edDate)){
                this.$toast('info', "입고일자를 입력하세요.");
                return;
            }

			let params = {
				stDate : this.stDate.replaceAll('-',''),
				edDate : this.edDate.replaceAll('-',''),
				useCategory : this.sCategory,
                searchGlassId: this.searchGlassId
			};

			let param = {menuId:'M0001001',queryId:'getRawMatInList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);

		},

		checkValidBarcodeData() {

            if(_.isEmpty(this.sCategory)){
                this.$toast('info', "투입구분을 선택하세요.");
                return false;
            }

            if(_.isEmpty(this.workerName)){
                this.$toast('info', "담당자를 입력하십시요!");
                return false;
            }               

            if(_.isEmpty(this.glassId)){
                this.$toast('info', "바코드를 입력하십시요!");
                return false;
            }            

            // if(this.glassId.length < 27){
            //     this.$toast('info', "바코드 길이가 너무 짧습니다.");
            //     this.$refs.inpBarcode.focus();
            //     return false;
            // }

            let rows = this.glsInGridDataProvider.getJsonRows(0,-1);
            let dupRow = rows.find(ele => ele.glassId == this.glassId);
            if(!_.isUndefined(dupRow)){
                this.$toast('info', "이미 추가된 바코드입니다.");
                return false;
            }

			return true;
		},           

        async processBarcode(){
            // console.log('curMode====>',this.curMode);
            if(this.glsInGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
                this.glsInGridDataProvider.clearRows();
            }
            this.curMode = 'C';

             if ( this.checkValidBarcodeData() ) {

                this.productCode = this.glassId.substring(0,10);
                this.batchId = this.glassId.substring(17,27);

                let param = {
                    glassId: this.glassId,
                    glassCode: this.productCode,
                    yCode: this.batchId.substring(1,2),
                    mCode: this.batchId.substring(2,3),
                    dCode: this.batchId.substring(3,4),
                    inDate: this.$utils.getTodayDate("")
                };

                await this.$axios.post(URI_PREFIX + "/getBaseInfo", param).then((response) => {
                    this.baseInfo = response.data;
                    if ( response.data.dupYn === "Y" ) {
                        this.$toast("info", "금일 이미 입고 처리된 바코드입니다.");
                        this.glassId = "";
                        return;
                    }                    
                    else if ( this.baseInfo.glassInfo === null  ) {
                            this.$toast('info', "원장정보에 등록되지 않은 원자재입니다.\n관련코드 10자리에 대한 원장정보를 등록하십시요!");
                            this.glassId = "";
                            return;
                    }
                    else {
                        this.setAddRowBarcode();
                    }
                                            
                }).catch((error) => {
                    this.$toast("error", error);
                });
             }

        },

        setAddRowBarcode(){
            this.glsInGridView.commit();
            this.glsInGridDataProvider.addRow({
                'inDate': this.$utils.getTodayDate(""),
                'useCategory': this.sCategory,
                'glassId': this.glassId,
                'inQty': 100,
                'useQty':0,
                //'remainQty': 100,
                'unit': _.isUndefined(this.baseInfo.unitInfo) == true ? '' : this.baseInfo.unitInfo.unit,
                'useYn': 'N',
                'workerId': this.workerId,
                'workerName': this.workerName,
                'glassThickness': _.isEmpty(this.baseInfo.glassInfo) == true ? '' : this.baseInfo.glassInfo.glassThickness,
                'glassMaterial': _.isEmpty(this.baseInfo.glassInfo) == true ? '' : this.baseInfo.glassInfo.glassMaterial,
                'glassSize': _.isEmpty(this.baseInfo.glassInfo) == true ? '' : this.baseInfo.glassInfo.glassSize,
                'cutType': this.batchId.substring(8,9) == "G" ? "ACL" : "MANUAL",
                'cutDate': _.isEmpty(this.baseInfo.dateInfo) == true ? '' : this.baseInfo.dateInfo.cutDate,
                'comments': '',
            });
            let itemIndex = this.glsInGridView.getItemCount() - 1;
            this.glsInGridView.setCurrent({ itemIndex: itemIndex });

            this.setBoxNum();
            this.glassId = '';
            this.$refs.inpBarcode.focus();
        },

        setBoxNum(){
            for (var i = 0; i < this.glsInGridDataProvider.getRowCount(); i++) {
                this.glsInGridDataProvider.setValue(i, "boxNum", i + 1);  // 각 행에 번호 부여
            }
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

			let saveData = this.$refs.glsInGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0001001',
					delete: [{queryId:'deleteRawMatIn', data:saveData.delete}],
					insert: [{queryId:'insertRawMatIn', data:saveData.insert}],
					update: [{queryId:'updateRawMatIn', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        if(this.curMode == 'C'){                           
                            this.stDate = this.$utils.getTodayDate();
                            this.edDate = this.$utils.getTodayDate();
                            //this.sCategory = '';
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
						const msg = `[바코드(Glass ID) 확인]\n[${dupBarcode}]\n이미 입고처리 되었습니다. 확인 후 진행하십시요!` ;
						this.$toast("info", msg);
					}						
				}).catch((error) => {
					this.$toast("error", error);
				});

			}
		},    
        
		searchBtnClick() {
            if(this.curMode == 'C' && this.glsInGridDataProvider.getRowCount() > 0){
                this.$confirm("확인", '저장하지 않은 데이터가 있습니다. 조회를 하시겠습니까?', (confirm)=>{
                    if(confirm){
                        this.glsInGridDataProvider.clearRows();
                        this.getDataList();
                    }
                });
            }else{
                this.getDataList();
            }
		},        

        delBtnClick() {
			this.glsInGridView.commit();
			const checkedRows = this.glsInGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하세요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.glsInGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.glsInGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.glsInGridDataProvider.removeRows(delItems);

                if ( this.curMode == 'C' ) {
                     this.setBoxNum();
                }                
			}
		},

        async saveBtnClick(){
			this.glsInGridView.commit();
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
                            this.glassId = "";
                            this.getDataList();
                        }
                    });  
        },        

        async excelBtnClick(){

			const grid = this.glsInGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `원자재_공정전입고_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

        onDataLoadComplatedGlsInGrid(grid){
			
		}
    },

}
</script>