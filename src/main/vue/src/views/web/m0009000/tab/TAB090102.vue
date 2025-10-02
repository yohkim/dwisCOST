/**
*   설비관리 > 설비 기준정보 > 비가동 항목 정보
*/
<template>
    <div>
        <div class="search_box">
            <b-row class="search_area">              
                <b-col cols="2">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchGubun" >
                            <option v-for="item in gubunList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">구분</label>
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
                <RealGrid ref="grid1" :uid="'grid1'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
            </div>
        </div>
    </div>
</template>
<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0009000/js/TAB090102.js';
const URI_PREFIX = '/api/m0009000/m0009001/TAB090102';
export default {
    props: {},  
    components: {},
    watch: {
    },
    setup() {
        const userAuthInfo = useUserAuthInfo();
        return { userAuthInfo };
    },
    data () {
        return {
            grid1:null,
            gridRows:[],
            subCategoryList: [],
            gubunList: [],
            curMode: 'R',           
            searchGubun: '',
            workerId: this.userAuthInfo.userInfo.userId,
            workerName: this.userAuthInfo.userInfo.userName,
        }
    },
    computed: {
        grid1View(){
            return this.$refs.grid1.getGridView();
        },
        grid1DataProvider(){
            return this.$refs.grid1.getGridDataProvider();
        },       
    },  
    created() {
        this.initializeGrid();
    },  
    mounted() {
        this.grid1View.checkBar.checkableCallback = this.checkableCallback;
        this.grid1View.editOptions.commitByCell = true;
        this.grid1View.filteringOptions.automating.lookupDisplay = true;    
        this.grid1View.setCellStyleCallback = this.setCellStyleCallbackGrid1;  
		this.grid1View.onCellEdited = this.onCellEditedGrid1;
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
            this.grid1 = _.cloneDeep(gridField);
        },
        async getSelectOptions(){  
            
            let searchParam = [
                    { menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{ majCode : "98"},
                        callback: (data) => {
                                                this.$utils.transformData(
                                                data,
                                                ["itemValue", "itemText"],
                                                ["코드", "내용"],
                                                this.gubunList );
                                            }
                    },
                    { menuId:'M0009001', queryId:'selectSubCategoryList', target:this.subCategoryList },                    
                ];
            let resp = await this.$axios.api.searchAll(searchParam);    
			
			const uniqueCategory =  _.uniqBy(this.subCategoryList, "offCategoryCode");
                        
            this.grid1View.setColumnProperty("offCategoryCode", "values", 
                uniqueCategory.map(item=>item.offCategoryCode)
            );
            this.grid1View.setColumnProperty("offCategoryCode", "labels", 
                uniqueCategory.map(item=>item.offCategoryName)
            );

            this.subCategoryLookup(this.subCategoryList);
            
            this.grid1View.setColumnProperty("offGubunCode", "values", 
                this.gubunList.map(item=>item.itemValue)
            );
            this.grid1View.setColumnProperty("offGubunCode", "labels", 
                this.gubunList.map(item=>item.itemText)
            );
            
            this.gubunList.unshift({ itemValue:"", itemText:"전체" }); 
        },

        subCategoryLookup(subCategoryList) {
            const lookupKeys = [];
            const lookupValues = [];
            subCategoryList.forEach(item => {
                lookupKeys.push([item.offCategoryCode, item.subCategoryCode]);
                lookupValues.push([item.subCategoryName]);
            });
            this.grid1View.setLookups([
                {
                    id: "subCategoryLookup",
                    levels:2,
                    keys: lookupKeys,
                    values: lookupValues
                }
            ]);
            this.grid1View.setColumnProperty("subCategoryCode", "lookupSourceId", "subCategoryLookup");
            this.grid1View.setColumnProperty("subCategoryCode", "lookupKeyFields", [ "offCategoryCode","subCategoryCode"]);
        },

		onCellEditedGrid1(grid, itemIndex, row, field) {
			grid.commit();
			var fieldName = this.grid1DataProvider.getOrgFieldName(field);

			if (fieldName == "offCategoryCode") {
				let offCategoryCode = grid.getValue(itemIndex, "offCategoryCode");
				grid.setValue(itemIndex, "displayOffCategoryCode", offCategoryCode);
				grid.setValue(itemIndex, "subCategoryCode", "");
				grid.setValue(itemIndex, "displaySubCategoryCode", "");
			};			

			if (fieldName == "subCategoryCode") {
				let subCategoryCode = grid.getValue(itemIndex, "subCategoryCode");
				grid.setValue(itemIndex, "displaySubCategoryCode", subCategoryCode);
			};					
		},

        async getDataList(){
            this.grid1View.commit();
            if ( this.curMode == "C") {
                this.grid1DataProvider.clearRows();
            }             
            this.curMode = 'R';            
            let queryParams = {
                offGubunCode : this.searchGubun
            }
            
            let searchParam = { menuId:'M0009001', queryId:'selectEquipOffCodeList', queryParams:queryParams, target:this.gridRows }   
            await this.$axios.api.search(searchParam);
        },
        checkableCallback(dataSource, item){
            if ( this.grid1DataProvider.getValue(item.dataRow, "editable") === "Y" || item.rowState == "created") {
                return true;
            }
            return false;
        },
        setCellStyleCallbackGrid1(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;
            const rowState = this.grid1DataProvider.getRowState(cell.index.dataRow);
            if ( fieldName === "offCategoryCode" ||   fieldName === "subCategoryCode"  || fieldName === "offCode" ) {
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
        checkValidData(checkData) {
            let invalid = false;
            if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
                this.$toast('info', "변경 저장할 데이터가 없습니다!");
                return false;
            }
            let seen = new Set();
            invalid = checkData.insert.some((item, idx) => {
                let index = idx + 1;
                if ( item.offCategoryCode === undefined || item.offCategoryCode === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 대분류는 필수 선택입니다!");
                    return true;
                }
                if ( item.subCategoryCode === undefined || item.subCategoryCode === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 중분류는 필수 선택입니다!");
                    return true;
                }				
                if ( item.offName === undefined || item.offName === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 비가동 항목명은 필수 입력입니다!");
                    return true;
                }                
                if ( item.offCode === undefined || item.offCode === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 비가동 항목코드는 필수 입력입니다!");
                    return true;
                }
                if ( item.offGubunCode === undefined || item.offGubunCode === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 구분은 필수 선택입니다!");
                    return true;
                }      
                if ( item.itemOrder === undefined || item.itemOrder === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 순서는 필수 입력입니다!");
                    return true;
                }                   
                
            });            
            return !invalid;
        },  
        
        addRow(){
            this.grid1View.commit();
            let newRow ={
                
               useYn: 'Y',
               workerId: this.workerId
            };
            this.grid1DataProvider.addRow(newRow);
            let itemIndex = this.grid1View.getItemCount() - 1;
            this.grid1View.setCurrent({ itemIndex: itemIndex });
        },
        async saveData() {
            let saveData = this.$refs.grid1.getSaveData();
            if ( this.checkValidData(saveData) ) {
                let param = {
                    menuId:'M0009001',
                    delete: [{queryId:'deleteEquipOffCode', data:saveData.delete}],
                    insert: [{queryId:'insertEquipOffCode', data:saveData.insert}],
                    update: [{queryId:'updateEquipOffCode', data:saveData.update}],
                };
                await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
                    if ( response.data.resultCode === "SUCCESS" ) {
                        this.$toast("info", "저장이 완료되었습니다!");
                        this.curMode = 'R';
                        this.searchBtnClick();
                    }
                    else if ( response.data.resultCode === "CHECK_DUP") {
                        const msg = `[항목 코드 확인]\n[${response.data.resultData}] \n동일한 비가동 항목코드가 이미 등록되어 있습니다.\n항목코드 확인 후 진행하십시오!` ;
                        this.$toast("info", msg);
                    } 
                    else if ( response.data.resultCode === "CHECK_USED") {
                        const msg = `[항목 사용 확인]\n[${response.data.resultData}] \n비가동 항목코드가 설비별 비가동 실적으로 등록되어 삭제할 수 없습니다.\n등록된 비가동 실적 확인 후 진행하십시오!` ;
                        this.$toast("info", msg);
                    }                                       
                }).catch((error) => {
                    this.$toast("error", error);
                });
            }            
        },      
        searchBtnClick() {
            if(this.curMode == 'C' && this.grid1DataProvider.getRowCount() > 0){
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
            //     if(this.grid1DataProvider.getRowCount() > 0 && this.curMode == 'R'){
            //         this.grid1DataProvider.clearRows();
            //     }
                this.curMode = 'C';
                this.addRow();
            //}
        },
        delBtnClick() {
            this.grid1View.commit();
            const checkedRows = this.grid1View.getCheckedRows();
            if ( checkedRows.length === 0 ) {
                this.$toast("info","삭제할 행을 선택하십시요!");
            }
            else {
                let delItems = [];
                checkedRows.forEach(itemIndex => {
                    if ( this.grid1DataProvider.getRowState(itemIndex) === RowState.CREATED ) {
                        delItems.push(itemIndex);
                    }
                    else {
                        this.grid1DataProvider.setRowState(itemIndex, RowState.DELETED);
                    }
                });
                this.grid1DataProvider.removeRows(delItems);
            }            
        },
        async saveBtnClick(){
            this.grid1View.commit();
            let msg = "저장 하시겠습니까?";
            this.$confirm("확인", msg, (confirm)=>{
                if(confirm){
                    this.saveData();
                }
            });            
        },
        async excelBtnClick(){
            const grid = this.grid1View;
            const now = new Date();
            const yyyymmdd = this.$utils.getTodayDate("");
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const fileName = `비가동항목정보_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;
            const options = {
                type: "excel",
                target: "local",
                fileName: fileName,
                lookupDisplay: true,
                progressMessage: "엑셀 Export중입니다.",
                done: function() {
                    alert("엑셀 내보내기가 완료되었습니다!");
                }
            };
            grid.exportGrid(options);            
        },
        onDataLoadComplatedGrid1(grid){}
    },
}
</script>