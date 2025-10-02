/**
*	설비관리 > 설비 기준정보 > 설비 MST 정보
*/
<template>
    <div>
        <div class="search_box">
            <b-row class="search_area">              
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchStep" >
                            <option v-for="item in stepList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">Step</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchEquip" >
                            <option v-for="item in equipList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">설비약명</label>
                    </div>
                </b-col>                
            </b-row>
            <div class="btn_area">
                <b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>
            </div>
        </div>
        <div class="grid_box search_onerow">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick">엑셀</b-button>
					<b-button refs="btnAdd" @click="addBtnClick">추가</b-button>
                    <b-button refs="btnDelete" @click="delBtnClick">삭제</b-button>
                    <b-button class="main" refs="btnSave" @click="saveBtnClick">저장</b-button>
                </div>            
            </div> 
            <div class="grid-border-none">
                <RealGrid ref="equipGrid" :uid="'equipGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
                <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
                <CmDialog2 ref="cmDialog2" @confirm="handleConfirm" />
            </div>
        </div>
    </div>
</template>
<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0009000/js/TAB090101.js';

const URI_PREFIX = '/api/m0009000/m0009001/TAB090101';

export default {
	props: {},  
	components: {},
	watch: {
        searchStep(newVal) {
            this.filterEquipList(newVal);
        }
    },
    setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },
	data () {
		return {
			equipGrid:null,
            gridRows:[],
            allEquipList: [],  
            stepList: [],
            equipList: [],
            useCategoryList: [],
            curMode: 'R',			
            searchLine: 'DFB1',
            searchStep: '061',
            searchEquip: '',
            workerId: this.userAuthInfo.userInfo.userId,
            workerName: this.userAuthInfo.userInfo.userName,
		}
	},
	computed: {
		equipGridView(){
			return this.$refs.equipGrid.getGridView();
		},
		equipGridDataProvider(){
			return this.$refs.equipGrid.getGridDataProvider();
		},
        selectedStepName() {
            const selectedItem = this.stepList.find(item => item.itemValue === this.searchStep);
            return selectedItem ? selectedItem.itemText : "";
        },    
        selectedEquipName() {
            const selectedItem = this.equipList.find(item => item.itemValue === this.searchEquip);
            return selectedItem ? selectedItem.itemText : "";
        },                
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

        this.equipGridView.checkBar.checkableCallback = this.checkableCallback;
        this.equipGridView.onCellClicked = this.onCellClicked;
        this.equipGridView.editOptions.commitByCell = true;
        this.equipGridView.filteringOptions.automating.lookupDisplay = true;		

        this.$nextTick(() => {
		this.getSelectOptions();
        this.getDataList();
        });
	},
	beforeUnmount() {		
	},
    beforeDestroy() {
    },
    methods: {
        initializeGrid() {
			this.equipGrid = _.cloneDeep(gridField);
		},

        filterEquipList(selectStep){

            if ( selectStep === '' ) {
                this.equipList = _.uniqBy(
                        this.allEquipList.map((item) => ({
                            itemValue: item.설비약명,
                            itemText: item.설비약명,
                        })),
                        "itemValue"
                );
            }
            else {
                this.equipList = _.uniqBy(
                        _.filter(this.allEquipList, { 공정코드: selectStep }).map((item) => ({
                                itemValue: item.설비약명,
                                itemText: item.설비약명,
                                })),
                    "itemValue"
                );
            }
            
            this.equipList.unshift({ itemValue:"", itemText:"전체" });    
            if ( this.searchStep === ""  ) {
                this.searchEquip = "";
            }                    
        },        

        async getSelectOptions(){   
            
            const step =  { line : 'DFB1', stepCode : ''};
            
			let searchParam = [{ menuId:'M0009001', queryId:'selectEquipListInSteps', queryParams:step, target:this.allEquipList },
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{ majCode : "74"},
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.useCategoryList );
										}
				}];

			let resp = await this.$axios.api.searchAll(searchParam);

            this.stepList = _.uniqBy(
                    this.allEquipList.map((item) => ({
                        itemValue: item.공정코드,
                        itemText: item.공정명,
                    })),
                    "itemValue"
            );

            this.equipList = _.uniqBy(
                    this.allEquipList.map((item) => ({
                        itemValue: item.설비약명,
                        itemText: item.설비약명,
                    })),
                    "itemValue"
            );            
            
            this.stepList.unshift({ itemValue:"", itemText:"전체" });   
            this.equipList.unshift({ itemValue:"", itemText:"전체" });   
            
			this.equipGridView.setColumnProperty("useCategory", "values", 
				this.useCategoryList.map(item=>item.itemValue)
			);
			this.equipGridView.setColumnProperty("useCategory", "labels", 
				this.useCategoryList.map(item=>item.itemText)
			);
            
            this.filterEquipList(this.searchStep);
		},

        async getDataList(){
			this.equipGridView.commit();

            if ( this.curMode == "C") {
                this.equipGridDataProvider.clearRows();
            }             
            this.curMode = 'R';            

            let queryParams = {
                stepCode : this.searchStep,
                equipName : this.searchEquip
            }
			
			let searchParam = { menuId:'M0009001', queryId:'selectEquipProdBaseList', queryParams:queryParams, target:this.gridRows }   
			await this.$axios.api.search(searchParam);
		},

        checkableCallback(dataSource, item){
            if ( this.equipGridDataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }

            return false;
        },

        setCellStyleCallbackEquipGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;
            const rowState = this.equipGridDataProvider.getRowState(cell.index.dataRow);

            if ( fieldName === "stepName" ||  fieldName === "equipName" || fieldName === "applyDate" || fieldName === "model" ) {

				let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( rowState === "created" ) {
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

            let searchParams = { line : 'DFB1', stepCode : this.searchStep};

            if ( clickData.editable ) { 

                if (clickData.fieldName === "stepName" || clickData.fieldName === "equipName"){
                    let params = {
                        dialogTitle: "설비정보",
                        popUpSize: "lg" ,     
                        height: 300,
                        width: 500,
                        dataRow: clickData.dataRow,
                        gridJs: `CP0000000028.js`,
                        search: { menuId: "M0009001", queryId: "selectEquipListInSteps", queryParams: searchParams }
                    };	
                    this.$refs.cmDialog2.openDialog(params);					
                }
                else if ( clickData.fieldName === "model" ) {
                    let params = {
                        dialogTitle: "모델정보", 
                        popUpSize: "lg" ,                  
                        height: 300,
                        width: 1500,
                        dataRow: clickData.dataRow,
                        gridJs: `CP0000000023.js`,
                        search: { menuId: "M0009001", queryId: "selectModelList" }
                    };	
                    this.$refs.cmDialog2.openDialog(params);
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

                if (params.gridJs === "CP0000000028.js") {                
                    this.equipGridView.setValue(itemIndex, "line", data["line"]);
                    this.equipGridView.setValue(itemIndex, "stepCode", data["공정코드"]);
                    this.equipGridView.setValue(itemIndex, "stepName", data["공정명"]);
                    this.equipGridView.setValue(itemIndex, "equipNo", data["설비번호"]);
                    this.equipGridView.setValue(itemIndex, "equipName", data["설비약명"]);
                }
                else if (params.gridJs === "CP0000000023.js") {                
                    this.equipGridView.setValue(itemIndex, "model", data["model"]);
			    }	
            }
		}, 

		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

            let seen = new Set();

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
                const step = item.stepCode;
	            const equip = item.equipNo;
                const model = item.model;
				if ( item.stepCode === undefined || item.stepCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Step 은 필수 선택입니다!");
					return true;
				}
				if ( item.equipNo === undefined || item.equipNo === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 설비는 필수 선택입니다!");
					return true;
				}

                const key = `${step}_${equip}_${model}`;
                if (seen.has(key)) {
                    this.$toast("info", `${index}번째 추가 항목 확인 : 동일한 Step/설비/Model은 한번에 하나씩 추가 저장 가능합니다.`);
                    return true;
                }
                seen.add(key); 

				if ( item.applyDate === undefined || item.applyDate === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 적용일자는 필수 선택입니다!");
					return true;
				}
				if ( item.model === undefined || item.model === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  모델은 필수 선택입니다!");
					return true;
				}                
				if ( item.useCategory === undefined || item.useCategory === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  양산/개발 필수 선택입니다!");
					return true;
				}
				if ( item.mst === undefined || item.mst === '' || item.mst ===  0  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : MST 값은 필수 입력입니다!");
					return true;
				}                                   																		
			});            

			return !invalid;
		},  
        
        addRow(){

            this.equipGridView.commit();

            const now = new Date();

            let newRow = {
               line: this.searchLine,
               stepCode : (   this.searchStep === ''  ) ? '' : this.searchStep,
               equipNo : (  this.searchEquip === '' ) ? '' : this.searchEquip,
               equipName: (  this.searchEquip === '' ) ? '' : this.selectedEquipName,               
               applyDate: this.$utils.getTodayDate("-") ,
               model:'',
               stepName : ( this.searchStep === '' ) ? '' : this.selectedStepName,
               useCategory: 'P',               
               mst: 0,
               workerName: this.workerName,
               workerId: this.workerId
            };

            this.equipGridDataProvider.insertRow(0, newRow);
            //let itemIndex = this.equipGridView.getItemCount() - 1;
            this.equipGridView.setCurrent({ itemIndex: 0 });
        },

		async saveData() {

			let saveData = this.$refs.equipGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0009001',
					delete: [{queryId:'deleteEquipProdBase', data:saveData.delete}],
					insert: [{queryId:'insertEquipProdBase', data:saveData.insert}],
					update: [{queryId:'updateEquipProdBase', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
                        this.curMode = 'R';
						this.searchBtnClick();
					}
					else if ( response.data.resultCode === "CHECK_DATE") {

                        const checkList = response.data.resultData;
                        const checkMsg = checkList.map(item => {
                            return `설비 ${item.equipName} MST 적용일 확인 : ${item.applyDate} - ${item.model}`;
                        }).join('\n');

						const msg = `[설비 모델 MST 적용일 확인]\n${checkMsg}\n* 적용일은 이전 적용일 이후로 지정가능합니다.` ;
						this.$toast("info", msg);
					} 				
				}).catch((error) => {
					this.$toast("error", error);
				});

			}            
		},  	

		searchBtnClick() {
            if(this.curMode == 'C' && this.equipGridDataProvider.getRowCount() > 0){
                this.$confirm("확인", '저장하지 않은 데이터가 있습니다. 조회를 하시겠습니까?', (confirm)=>{
                    if(confirm){
                        this.getDataList();
                    }
                });
            }else{
                this.getDataList();
            }
		},   

		addBtnClick() {

            // if ( this.checkValidCond() ) {
            //     if(this.equipGridDataProvider.getRowCount() > 0 && this.curMode == 'R'){
            //         this.equipGridDataProvider.clearRows();
            //     }
                this.curMode = 'C';

                this.addRow();
            //}
		},

        delBtnClick() {
			this.equipGridView.commit();
			const checkedRows = this.equipGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.equipGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.equipGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.equipGridDataProvider.removeRows(delItems);
			}            
		},

        async saveBtnClick(){
			this.equipGridView.commit();

            let msg = "저장 하시겠습니까?";

            this.$confirm("확인", msg, (confirm)=>{
                if(confirm){
                    this.saveData();
                }
            });            
    	},

        async excelBtnClick(){
			const grid = this.equipGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `설비별MST정보_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

			const options = {
				type: "excel",
				target: "local",
                lookupDisplay: true,
				fileName: fileName,
				progressMessage: "엑셀 Export중입니다.",
				done: function() {
					alert("엑셀 내보내기가 완료되었습니다!");
				}
			};

			grid.exportGrid(options);            
		},
        onDataLoadComplatedEquipGrid(grid){}
    },

}
</script>