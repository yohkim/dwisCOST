/**
*	자재관리 > 부자재-더미글라스 > 재고현황
>/
<template>
    <div>
        <div class="search_box">
            <b-row class="search_area">
                <b-col cols="2" class="period">
                    <div class=" form-floating me-1"> 
                        <date-picker label="기준월" mode="month"  v-model="searchStockMonth"  />
						<label for="floatingSelect" class="select">기준월</label>
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
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick"  >엑셀</b-button>
                </div>            
            </div> 
            <div class="grid-border-none">
               <RealGrid ref="matGrid" :uid="'matGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
            </div>
        </div>
    </div>
</template>

<script>
import { RowState, ValueType } from 'realgrid';
import gridField from '@web/m0001000/js/TAB001408.js';

const URI_PREFIX = '/api/m0001000/m0001008/TAB001408';
const MAT_TYPE_CODE = 'DUMMY';

export default {
	props: {},  
	components: {},
	watch: {
		searchStockMonth(newDate) {
			let month = newDate.replaceAll('-','');
			this.dates = this.$utils.getDatesInMonth(month);
		}
	},
	data () {
		return {
			matGrid:null,
            gridRows:[],
			searchStockMonth:'',
			searchedMonth:'',
			curMode: 'R',
			dates:[]
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
		this.matGridView.layoutByColumn("itemName1").spanCallback = this.spanCallbackItemName1;
		this.matGridView.layoutByColumn("itemName2").spanCallback = this.spanCallbackItemName2;
		this.matGridView.layoutByColumn("itemName3").spanCallback = this.spanCallbackItemName3;
		this.getSelectOptions(); 
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        async getSelectOptions(){

			let stockDate = [];

			let searchParam = { menuId:'M0001008', queryId:'selectMaxStockDate', target:stockDate }
			let resp = await this.$axios.api.search(searchParam);

			this.searchStockMonth = `${stockDate[0].slice(0, 4)}-${stockDate[0].slice(4, 6)}`;
			this.dates = this.$utils.getDatesInMonth(this.searchStockMonth.replaceAll("-",""));
            this.getDataList();	  
		},

		setGridField(){

			this.matGridDataProvider.setFields(gridField.fields);

			let layout = [
					'subMatTypeName',
					{
						name : "itemName",
						direction: "horizontal",
						hideChildHeaders: true,
						items: [
							'itemName1',
							'itemName2',
							'itemName3',
							'itemName4'
						],
						header: {
							text : "구분"
						}
					},
					'preStock',
					'dTotal',
				];
		    
		  	const currentColumns = this.matGridView.getColumnNames();
			currentColumns.forEach(columnName => {
				if (columnName.startsWith("d2")) {
					this.matGridView.removeColumn(columnName);
				}
			});

			this.dates.forEach(ele => { 
				this.matGridDataProvider.addField({fieldName:`d${ele.day}`, dataType:ValueType.NUMBER, numberFormat:'#,##0'});
				this.matGridView.addColumn({name:`d${ele.day}`,
										fieldName:`d${ele.day}`,
										width: "60",
										header:{text:`${ele.day.slice(4,6)}/${ele.day.slice(6,8)}`},
										editable: false,
										numberFormat: "#,##0",
										styleName: "tr"
				 });
				 layout.push(`d${ele.day}`)	;				
			});

			this.matGridView.setColumnLayout(layout);

			this.matGridView.layoutByColumn("itemName1").spanCallback = this.spanCallbackItemName1;
			this.matGridView.layoutByColumn("itemName2").spanCallback = this.spanCallbackItemName2;
			this.matGridView.layoutByColumn("itemName3").spanCallback = this.spanCallbackItemName3;
		},

		spanCallbackItemName1(grid, layout, itemIndex) {
			let itemName1 = grid.getValue(itemIndex, "itemName1");
			let itemName2 = grid.getValue(itemIndex, "itemName2");
			let subMatTypeName = grid.getValue(itemIndex, "subMatTypeName");
			let dTotal = grid.getValue(itemIndex, "dTotal");
			let nextIemName1 = grid.getValue(itemIndex+1, "itemName1");
			if ( itemName1 === "입고") {
				return 4;
			}
			else if ( itemName1 === "투입" )  {
				if ( subMatTypeName === "Total" || ( itemName2 === "Total" && dTotal === 0 )) 
					return 4;
				else 
					return 1;
			}
			else if ( itemName1 === "Loss")  {

				if ( subMatTypeName === "Total" ||( itemName2 === "Total" &&  nextIemName1 !== "Loss" ) )  
					return 4;
				else {				
					return 2;				
				}
				
			}
			else if ( itemName1 === "재고")  {
				return 3;
			}
			return 1;
		},

		spanCallbackItemName2(grid, layout, itemIndex) {
			let itemName2 = grid.getValue(itemIndex, "itemName2");

			if ( itemName2 === 'Total')  {
				return 3;
			}

			return 1;
		},		

		spanCallbackItemName3(grid, layout, itemIndex) {

			let itemName1 = grid.getValue(itemIndex, "itemName1");
			let itemName3 = grid.getValue(itemIndex, "itemName3");		
			let itemName4 = grid.getValue(itemIndex, "itemName4");		

			if ( itemName3 === 'Total' && ( itemName1 === "투입" || itemName4 === "" ))  {
				return 2;
			}

			return 1;
		},	
		
		async getDataList(){  

			let month = this.searchStockMonth.replaceAll('-','');
			if ( this.searchedMonth !== month ) {			
				this.setGridField(this.dates);
			}
			this.searchedMonth = month;			
			let params = {
				month : month,
				days : this.dates
			};

			let param = {menuId:'M0001008',queryId:'selectSubMatDummyMonthReport', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		searchBtnClick() {
			this.getDataList();
		},  		
		
        excelBtnClick(){
			const grid = this.matGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `더미글라스_${this.searchStockMonth}월_재고현황_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
		
		onDataLoadComplatedMatGrid(grid){
			
		}
	},
}

</script>
