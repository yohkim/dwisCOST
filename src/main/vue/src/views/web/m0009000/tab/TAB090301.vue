/**
*	설비관리 > 설비효율 Report
*/
<template>
    <div>
        <div class="search_box">
            <b-row class="search_area">  
                <b-col cols="4" class="period">
                    <div class="label_title">기준일자</div>
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
            <div class="btn_area  ms-2">
				<b-button class="second" refs="btnCheckMst" @click="checkMstBtnClick">MST 등록 확인</b-button>
                <b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>
            </div>
        </div>
        <div class="grid_box search_onerow">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick" >엑셀</b-button>
                </div>            
            </div> 
            <div class="grid-border-none">
               <RealGrid ref="equipGrid" :uid="'equipGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
            </div>
        </div>
    </div>
</template>

<script>
import { RowState, ValueType } from 'realgrid';
import gridField from '@web/m0009000/js/TAB090301.js';

const URI_PREFIX = '/api/m0009000/m0009003/TAB090301';

export default {
	props: {},  
	components: {},
	watch: {
        searchStep(newVal) {
            this.filterEquipList(newVal);
        }     		
	},
	data () {
		return {
			equipGrid:null,
            gridRows:[],
            allEquipList: [],  
            stepList: [],
            equipList: [],            
			searchFromDate: this.$utils.getSomedayDate(-7, "-"), 
            searchToDate: this.$utils.getTodayDate("-"), 
            searchLine: 'DFB1',
			searchStep: '061',
            searchEquip:'',			
			dates:[]
		}
	},
	computed: {
		equipGridView(){
			return this.$refs.equipGrid.getGridView();
		},
		equipGridDataProvider(){
			return this.$refs.equipGrid.getGridDataProvider();
		},		
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		//this.equipGridView.layoutByColumn("itemName1").spanCallback = this.spanCallbackItemName1;
		this.getSelectOptions(); 
	},
	beforeUnmount() {},
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

            const step =  { line : 'DFB1', stepCode : '' };
            
			let searchParam = { menuId:'M0009001', queryId:'selectEquipListInSteps', queryParams:step, target:this.allEquipList };

			let resp = await this.$axios.api.search(searchParam);

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

			this.filterEquipList(this.searchStep);
			
            this.getDataList();	 
		},

		setGridField(){

			this.equipGridDataProvider.setFields(gridField.fields);

			let layout = [
					'stepName',
					'equipName',
					{
						name : "itemName",
						direction: "horizontal",
						hideChildHeaders: true,
						items: [
							'itemName',
							'subName'
						],
						header: {
							text : "구분"
						}
					},
				];
		    
		  	const currentColumns = this.equipGridView.getColumnNames();
			currentColumns.forEach(columnName => {
				if (columnName.startsWith("d2")) {
					this.equipGridView.removeColumn(columnName);
				}
			});

			this.dates.forEach(ele => { 
				this.equipGridDataProvider.addField({fieldName:`d${ele.column}`, dataType: ValueType.NUMBER});
				this.equipGridView.addColumn({name:`d${ele.column}`,
										fieldName:`d${ele.column}`,
										width: "100",
										header:{text:`${ele.day.slice(5,7)}/${ele.day.slice(8,10)}`},
										editable: false,
										styleName: "tr",
										styleCallback: function (grid, dataCell) {
											const item = grid.getValue(dataCell.index.dataRow, "item");
											const subName = grid.getValue(dataCell.index.dataRow, "subName");

											if ( item === "equip_efficiency" || item === "perform_efficiency" || item === "time_efficiency" ) {
												 return {numberFormat: "#,##0.00", excelFormat: "#,##0.00_ ",  suffix: "%", styleName : "eff-row tr"};
											}
											else if ( item === "mst" || item === "tact" ) {
												 return { numberFormat: "#,##0.0", excelFormat: "#,##0.0_ "};
											}
											if ( (item === "plan_off_time" || item === "loss_off_time" ) && subName === "Total" ) {
												 return {numberFormat: "#,##0", excelFormat: "#,##0_ ", styleName : "loss-row tr"};
											}
											else {
												return { numberFormat: "#,##0", excelFormat: "#,##0_ "};
											}

											return null;
    									}
				 });
				 layout.push(`d${ele.column}`)	;				
			});

			this.equipGridView.setColumnLayout(layout);

			this.equipGridView.layoutByColumn("itemName").spanCallback = this.spanCallbackItemName;			
		},

		setCellStyleCallbackEquipGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "itemName" ||  fieldName === "subName"  ) {

				if (jsonData.item === "equip_efficiency" || jsonData.item === "perform_efficiency" || jsonData.item === "time_efficiency") {
						rtn.styleName = "eff-row"
				}
			} 

			if ( fieldName === "subName"  ) {

				if (jsonData.item === "plan_off_time" || jsonData.item === "loss_off_time") {

					if ( jsonData.subName === "Total" ) {
						rtn.styleName = "loss-row";
					}						
				}

				if (jsonData.itemOrder === 25 || jsonData.itemOrder === 120) {
					rtn.styleName = "loss-detail_row";
				}
			}
			
			return rtn;
		},

		spanCallbackItemName(grid, layout, itemIndex) {
			let value = grid.getValue(itemIndex, "itemName");
			if ( value !== "비가동 실적" && value !== "LOSS" ) {
				return 2;
			}
			return 1;
		},

		async getDataList(){  

			this.dates = this.$utils.getDateRange(this.searchFromDate, this.searchToDate, "-");
            this.setGridField(this.dates);	
			let params = {
				fromDate : this.searchFromDate,
                toDate : this.searchToDate,
                fromDateTime : this.searchFromDate + " 08:00",
                toDateTime : this.$utils.getNextDay(this.searchToDate, "-") + " 08:00",
				days : this.dates,
				stepCode : this.searchStep,
				equipName : this.searchEquip
			};

			let param = {menuId:'M0009003',queryId:'selectEquipEffDailyReport', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		async checkMst(){  

			let checkMst = [];

			let params = {
				fromDate : this.searchFromDate,
                toDate : this.searchToDate
			};

			let param = {menuId:'M0009003',queryId:'selectCheckMstInform', queryParams:params, target: checkMst};
			let resp = await this.$axios.api.search(param);	
			
			if ( !_.isEmpty(checkMst)) {
				const checkMsg = checkMst.map(item => {
					return `설비 ${item.equipName} 모델 ${item.model}`
				}).join('\n');

				const msg = `[설비 모델 MST 적용일 등록 확인]\n${checkMsg}\n-> 설비기준정보 - 설비별 MST 정보가 등록되어 있는지 확인하십시오.` ;
				this.$toast("info", msg);

			}
		},

		searchBtnClick() {
			this.getDataList();
		},  		

		checkMstBtnClick() {
			this.checkMst();
		},  		
		
        excelBtnClick(){
			const grid = this.equipGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `설비효율_${this.searchFromDate.replace(/-/g,'')}_${this.searchToDate.replace(/-/g,'')}.xlsx`;

			const options = {
				type: "excel",
				target: "local",
				applyDynamicStyles: true,
				fileName: fileName,
				progressMessage: "엑셀 Export중입니다.",
				done: function() {
					alert("엑셀 내보내기가 완료되었습니다!");
				},
				
			};

			grid.exportGrid(options);            
		},
		
		onDataLoadComplatedEquipGrid(grid){
			
		}
	},
}

</script>

<style >

.eff-row {  
  background-color: #f8eadd !important;
}
.loss-row {  
  background-color: #d9e8f8 !important;
}
.loss-detail_row {  
  background-color: #f6f9fc !important;
}
</style>
<style lang="scss" scoped>
:deep.btn_area{
	display: flex;
    width: 240px!important;
}
</style>