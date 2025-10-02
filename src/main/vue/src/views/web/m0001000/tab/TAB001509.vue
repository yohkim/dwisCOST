/**
*	자재관리 > 포장재 - 품목관리
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchMatCategory" >
                            <option v-for="item in matCategoryList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">자재분류</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchMatType" >
                            <option v-for="item in matTypeList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">품명</label>
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
					<b-button class="second" @click="excelClick">엑셀</b-button>
					<b-button class="sub" @click="addClick">추가</b-button>
					<b-button @click="delClick">삭제</b-button>
					<b-button class="main" @click="saveClick">저장</b-button>           					
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
import gridField from '@web/m0001000/js/TAB001509.js';

const URI_PREFIX = '/api/m0001000/m0001009/TAB001509';
//const MAT_CATEGORY_CODE = '60';
//const MAT_CATEGORY_NAME = '포장재';

export default {
	props: {},  
	components: {},
	watch: {
        searchMatCategory(newVal){
            this.filterMatTypeList(newVal);
        }
	},
	setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },    
	data () {
		return {
			matGrid:null,
            gridRows:[],
            manageMatList: [],     
            matCategoryList: [],
            matTypeList: [],
            searchMatCategory:'',
            searchMatType:'',
            createUserId: this.userAuthInfo.userInfo.userId,
		}
	},
	computed: {
		matGridView(){
			return this.$refs.matGrid.getGridView();
		},
		matGridDataProvider(){
			return this.$refs.matGrid.getGridDataProvider();
		},
    },	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.matGridView.checkBar.checkableCallback = this.checkableCallback;
		this.matGridView.onCellClicked = this.onCellClicked;
		this.matGridView.editOptions.commitByCell = true;
        this.getSelectOptions();
    },
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        filterMatTypeList(selectMatCtg){

            this.matTypeList = _.uniqBy(
                    _.filter(this.manageMatList, { matCategoryCode: selectMatCtg }).map((item) => ({
                            itemValue: item.matTypeCode,
                            itemText: item.matTypeName,
                            })),
                "itemValue"
            );
            
            this.matTypeList.unshift({ itemValue:"", itemText:"전체" });    

			this.searchMatType = "";
                   
        },		

        async getSelectOptions(){

			let searchParam = [
					{ menuId:'M0001009', queryId:'selectEtcYnList', queryParams:{majCode:'03'}, target:this.matCategoryList },
					{ menuId:'M0001009', queryId:'selectMatCategoryList', queryParams:{etcYn:'Y'}, target:this.manageMatList }
			];

			let resp = await this.$axios.api.searchAll(searchParam);

			this.matGridView.setColumnProperty("matCategoryCode", "values", 
				this.matCategoryList.map(item=>item.itemValue)
			);
			this.matGridView.setColumnProperty("matCategoryCode", "labels", 
				this.matCategoryList.map(item=>item.itemText)
			);				

			this.matCategoryList.unshift({ itemValue:"", itemText:"전체" }); 
			this.matTypeList.unshift({ itemValue:"", itemText:"전체" }); 

            this.getDataList();	  
		}, 	
		
        async getMatTypeList(){

			let searchParam = { menuId:'M0001009', queryId:'selectMatCategoryList', queryParams:{etcYn:'Y'}, target:this.manageMatList };

			let resp = await this.$axios.api.search(searchParam);
			
			this.matTypeList.unshift({ itemValue:"", itemText:"전체" });
			this.filterMatTypeList(this.searchMatCategory);
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

            if ( fieldName === "matCategoryCode" || fieldName === "matTypeCode" || fieldName === "matTypeName" || fieldName === "unitCode" || fieldName === "unit" ) {

				let styleName = this.$utils.getAlignStyleGridField(fieldName);

                if ( jsonData.editable == "Y" || cell.item.rowState === RowState.CREATED ) {
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

                if (clickData.fieldName === "unitCode" || clickData.fieldName === "unit"){
                    let params = {
                        dialogTitle: "단위",
                        step: 9,
                        height: 300,
                        width: 1500,
                        dataRow: clickData.dataRow,
                        gridJs: `CP0000000006.js`,
                        search: { menuId: "CMDIALOG", queryId: "selectCommonCode", queryParams:{majCode:"01" }},
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
				this.matGridView.setValue(itemIndex, "unitCode", data["코드"]);
				this.matGridView.setValue(itemIndex, "unit", data["내용"]);
			}	
		},    		
        
        async getDataList(){
			this.matGridView.commit();

			let params = { 
				matCategoryCode : this.searchMatCategory,
				matTypeCode : this.searchMatType,
				etcYn : 'Y'
			};

			let param = {menuId:'M0001009',queryId:'selectMatCategoryList', queryParams:params, target: this.gridRows};
            await this.$axios.api.search(param);
		},  
        
		addRow() {
			let newRow = {
				matCategoryCode : this.searchMatCategory ,
				unitCode: '70',
				unit: 'EA',
                etcYn : 'Y',
				createUser: this.createUserId
			}
			this.matGridDataProvider.addRow(newRow);
			let itemIdx = this.matGridView.getItemCount() - 1;
			this.matGridView.setCurrent({ itemIndex: itemIdx });
		},

		checkValidSaveData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
				if ( item.matCategoryCode === undefined || item.matCategoryCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  자재분류명은 필수 선택입니다!");
					return true;
				}
				if ( item.matTypeCode === undefined || item.matTypeCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  품목코드는 필수 선택입니다!");
					return true;
				}	
				if ( item.matTypeName === undefined || item.matTypeName === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  품목명는 필수 선택입니다!");
					return true;
				}
				if ( item.unitCode === undefined || item.unitCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  단위는는 필수 선택입니다!");
					return true;
				}																		
			});

			return !invalid;

		},            
        
		async saveData() {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001009',
					delete: [{queryId:'deleteMatCategory', data:saveData.delete}],
					insert: [{queryId:'insertMatCategory', data:saveData.insert}],
					update: [{queryId:'updateMatCategory', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveMatCategoryData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
						this.getMatTypeList();
						this.searchBtnClick();
					}                 
					else if ( response.data.resultCode === "CHECK_USED") {

                        const msg = `[자재분류/품목코드 확인]\n[${response.data.resultData}] \n이미 공정전 입고된 데이터가 있어 삭제할 수 없습니다!` ;
						this.$toast("info", msg);
					}  
					else if ( response.data.resultCode === "CHECK_DUP") {

                        const msg = `[자재분류/품목코드 확인]\n[${response.data.resultData}] \n이미 등록된 코드입니다!` ;
						this.$toast("info", msg);
					}   					             					
				}).catch((error) => {
					this.$toast("error", error);
				});

			}            
		},         
        
		searchBtnClick() {
            this.getDataList();
		},   
		addClick() {

			this.matGridView.commit();
			this.addRow();

		},	
		delClick() {
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
		async saveClick(){

			this.matGridView.commit();
            this.$confirm("확인", "저장 하시겠습니까?", (confirm)=>{
                if(confirm){
                    this.saveData();
                }
            });  
		},
		async excelClick(){

			const grid = this.matGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `포장재_품목정보_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
