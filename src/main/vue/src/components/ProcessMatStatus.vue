/**
*	공정 자재현황
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
                <b-col cols="2"  class="ms-3">
                    <div class="form-floating">
                        <select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchMatCategory" >
                            <option v-for="item in matCategoryList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">자재분류</label>
                    </div>
                </b-col>
                <b-col cols="2">
                    <div class="form-floating" >
                        <select class="form-select label-80" id="floatingSelect" aria-label="Floating label select example" v-model="searchMatType" >
                            <option v-for="item in matTypeList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">품명</label>
                    </div>
                </b-col>   
                <b-col cols="1" class="ms-3" v-show="this.searchMatCategory === '10'">
                    <div class="form-floating">
                        <select class="form-select label-65 " id="floatingSelect" aria-label="Floating label select example" v-model="searchUseCategory" >
                            <option v-for="item in useCategoryList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">투입구분</label>
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
               <RealGrid ref="matGrid" :uid="'matGrid'" :rows="gridRows" style="height: 100%;"/>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { RowState, ValueType } from 'realgrid';
import gridField from '@web/m0001000/js/TAB001401.js';
const PACK_CTG_CODE = '60';

export default {
	props: {},  
	components: {},
	setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
	},	
	watch: {
		searchStockMonth(newDate) {
			let month = newDate.replaceAll('-','');
			this.dates = this.$utils.getDatesInMonth(month);
		},
        searchMatCategory(newVal){
            this.filterMatTypeList(newVal);
        }		
	},
	data () {
		return {
			matGrid:null,
            gridRows:[],
            manageMatList: [],     
            matCategoryList: [],
            matTypeList: [],	
			useCategoryList: [],		
			searchStockMonth:'',
            searchMatCategory:'',
            searchMatType:'', 
			searchUseCategory:'',
			searchedMonth:'',
			curMode: 'R',
			dates:[],
			categoryMap : {
				"10GLASS": { menuId:'M0001001', moduleId:'TAB001401', queryId:'selectRawMatMonthReport', menuName:'원자재' },
				"30RESIN": { menuId:'M0001002', moduleId:'TAB001402', queryId:'selectSubMatResinMonthReport', menuName:'화학물류 - 레진' },
				"40TOOL" : { menuId:'M0001003', moduleId:'TAB001403', queryId:'selectSubMatToolMonthReport', menuName:'공정 소모품 - 툴' },
				"20FILM" : { menuId:'M0001004', moduleId:'TAB001404', queryId:'selectSubMatFilmMonthReport', menuName:'부자재 - 필름' },
				"20TRAY" : { menuId:'M0001005', moduleId:'TAB001405', queryId:'selectSubMatTrayMonthReport', menuName:'부자재 - 트레이' },
				"30CHEMICAL" : { menuId:'M0001006', moduleId:'TAB001406', queryId:'selectSubMatChemicalMonthReport', menuName:'화학물류 - 약액' },
				"40FILTER" : { menuId:'M0001007', moduleId:'TAB001407', queryId:'selectSubMatFilterMonthReport', menuName:'공정 소모품 - 필터' },
				"20DUMMY" : { menuId:'M0001008', moduleId:'TAB001408', queryId:'selectSubMatDummyMonthReport', menuName:'부자재 - 더미글라스' },
				"ETC" : { menuId:'M0001009', moduleId:'TAB001409', queryId:'selectSubMatEtcMonthReport', menuName:'포장재 / 기타자재' },
				
			},
			key: '',
			menuId: '',
			moduleId: '',
			queryId: '',
			menuName: ''	
		}
	},
	computed: {
		menuList() {
			return this.userAuthInfo.getSysResourceMap.childSysResc;
		},
		prodCtg() {
			return this.userAuthInfo.selectedProdCtg;
		},		
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
			this.getSelectOptions(); 
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        filterMatTypeList(selectMatCtg){

			if ( selectMatCtg === PACK_CTG_CODE ) {

				this.matTypeList = [{ itemValue:"", itemText:"전체" }];
			}
			else {
				this.matTypeList = _.uniqBy(
						_.filter(this.manageMatList, { matCategoryCode: selectMatCtg }).map((item) => ({
								itemValue: item.matTypeCode,
								itemText: item.matTypeName,
								})),
					"itemValue"
				);
			}

			this.searchMatType = this.matTypeList[0].itemValue;           
        },  		

        async getSelectOptions(){

			let searchParam = [
								{ menuId:'M0001009', queryId:'selectMatCategoryStatusList', target:this.manageMatList },
								{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{ majCode : "74"},
									callback: (data) => {
															this.$utils.transformData(
															data,
															["itemValue", "itemText"],
															["코드", "내용"],
															this.useCategoryList );
														}
				},
			];

			let resp = await this.$axios.api.searchAll(searchParam);

            this.matCategoryList = _.uniqBy(
                    this.manageMatList.map((item) => ({
                        itemValue: item.matCategoryCode,
                        itemText: item.matCategoryName,
                    })),
                    "itemValue"
            ); 
			
			this.searchMatCategory = this.matCategoryList[0].itemValue;
			this.searchUseCategory = this.useCategoryList[0].itemValue;

			let yyyymmdd = this.$utils.getTodayDate();

			this.searchStockMonth = `${yyyymmdd.slice(0, 7)}`;
			this.dates = this.$utils.getDatesInMonth(this.searchStockMonth.replaceAll("-",""));   		
            
			this.$nextTick(() => {
				this.getDataList();	
			});			  
		},

		async setGridField(){

			const gridField =  _.cloneDeep(require(`@web/m0001000/js/${this.moduleId}.js`));
			
			this.matGridDataProvider.setFields(gridField.fields);
			this.matGridView.setColumns(gridField.columns);
			this.matGridView.setOptions(gridField.options);

			let layout = [];
			layout = gridField.layout;
		    
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

			gridField.applySpanCallback(this.matGridView);

		},

		async getDataList(){  

			this.key = this.searchMatCategory + this.searchMatType;
			this.menuId = this.categoryMap[this.key].menuId;
			this.moduleId = this.categoryMap[this.key].moduleId;
			this.queryId = this.categoryMap[this.key].queryId;
			this.menuName = this.categoryMap[this.key].menuName;

			let month = this.searchStockMonth.replaceAll('-','');

			await	this.setGridField(this.dates);

			this.searchedMonth = month;			
			let params = {
				month : month,
				days : this.dates,
				useCategory : this.searchUseCategory,
			};

			this.gridRows = [];
			let param = { menuId:this.menuId, queryId:this.queryId, queryParams:params, target: this.gridRows};
			let resp = await this.$axios.api.search(param);

		},

        setCellStyleCallbackMatGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName.startsWith("d2") && cell.value !== 0 ) {
                
				rtn['renderer'] = {
					type: "link",
					urlCallback: function (grid, cell) {
					},
					titleField: "fieldName"
				}    
            }

            return rtn;
        },
		
		onCellItemClickedMatGrid(grid, index, clickData) {
			if (clickData.type == "link" && clickData.url) {
				let ds = grid.getDataSource();
        		let current = grid.getCurrent();
        		let jsonData = ds.getJsonRow(current.dataRow);	

				jsonData.useCategory = this.searchUseCategory;
				jsonData.clickedField = clickData.fieldName;

				if (clickData.fieldName.startsWith("d2") ) {

					const menu1 = this.$utils.findMenu(this.menuList, this.prodCtg, '자재관리');
					const menu2 = this.$utils.findMenu(this.menuList, this.prodCtg, this.menuName);

					let tabIndex = 0;
					let moduleIndex = tabIndex;

					switch ( jsonData.itemName1 ) {
						case "입고" : tabIndex = 0; moduleIndex = tabIndex+1; break;
						case "사용" : 
						case "투입" : 
						case "불출" : 
						case "양품" : 	
						case "반납" : 					
						case "Loss" : tabIndex = 1;  moduleIndex = tabIndex+1; break;
						case "재고" : if ( this.menuId === "M0001004" || this.menuId === "M0001006") { 
										tabIndex = 3;
										moduleIndex = tabIndex;
									  }
									  else {
										tabIndex = 2;
										moduleIndex = tabIndex+1; 
									  }
							 	 	  break;
					}


					let tabEvent = this.moduleId.substring(0,6) + moduleIndex + this.moduleId.substring(7) + "MenuMove";

					this.$eventBus.emit('menuMoveClick', { menu: this.$utils.createMenuData(menu1, menu2, menu2.childSysResc[tabIndex]), 
						callback: () => { 
							this.$eventBus.emit( tabEvent, jsonData);
						}});
				}

				return false;

			}
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

			const matName = this.searchMatCategory.itemText + "_" + this.searchMatType.itemText;

            const selectedItem = this.manageMatList.find(item => item.matCategoryCode === this.searchMatCategory && item.matTypeCode === this.searchMatType );
			const fileName = `${selectedItem.matCategoryName}_${selectedItem.matTypeName}_${this.searchStockMonth}월_재고현황_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
