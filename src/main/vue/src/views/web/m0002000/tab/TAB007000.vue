/**
*	프로세스 플래닝 > SITE 모델링 관리 > 라인/AREA 마스터
*/
<template>
	<div>
        <b-row class="row h_100">
            <b-col cols="4">
				<div class="grid_box thee_d_box">
					<div class="left_box">
						<div class="title">Line</div>
					</div>
					<div class="grid-border-none">
						<RealGrid ref="lineGrid" :uid="'lineGrid'" :step="3" :rows="lineGridRows" style="height:100%"/>
					</div>
				</div>
            </b-col> 
            <b-col cols="8">
				<div class="grid_box thee_d_box">
					<div class="left_box">
						<div class="title">AREA</div>					
						<div class="btn_wrap ms-auto">
							<b-button class="second" @click="excelClick">엑셀</b-button>
							<b-button class="second" @click="searchClick">조회</b-button>
							<b-button class="sub" @click="addClick"> 추가</b-button>
							<b-button @click="delClick">삭제</b-button>
							<b-button class="main"  @click="saveClick">저장</b-button>
						</div>            
					</div> 
					<div class="grid-border-none">
						<RealGrid ref="areaGrid" :uid="'areaGrid'" :step="3" :rows="areaGridRows" style="height:100%;"/>
					</div>
				</div>
            </b-col> 
        </b-row>
	</div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import lineGridField from '@web/m0002000/js/TAB007000_1.js';
import areaGridField from '@web/m0002000/js/TAB007000_2.js';

const URI_PREFIX = '/api/m0002000/m0002001';

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
			lineGrid:null,
			areaGrid:null,
			lineGridRows:[],
			areaGridRows:[],
			selectedLine:'DFB1',
			allAreaList:[]
		}
	},
	computed: {
		lineGridView(){
			return this.$refs.lineGrid.getGridView();
		},
		lineGridDataProvider(){
			return this.$refs.lineGrid.getGridDataProvider();
		},
		areaGridView(){
			return this.$refs.areaGrid.getGridView();
		},
		areaGridDataProvider(){
			return this.$refs.areaGrid.getGridDataProvider();
		}		
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {		
		this.lineGridView.onCellClicked = this.onCellClickedLineGrid;
		//this.areaGridView.styleCallback = this.styleCallbackArea;
		this.areaGridView.columnByName("line").styleCallback = this.cellStyleCallbackLine;
		this.areaGridView.columnByName("공정구분").styleCallback = this.cellStyleCallbackAreaCode;
		
		this.getLineDataList();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.lineGrid = _.cloneDeep(lineGridField);
			this.areaGrid = _.cloneDeep(areaGridField);

		},

		async getLineDataList(){
			this.lineGridView.commit();
			let param = {menuId:'M0002001',queryId:'selectLineList', target: this.lineGridRows};
			let resp = await this.$axios.api.search(param);	

			this.areaGridView.setColumnProperty("line", "editor", {
				type: "dropdown",
				textReadOnly: true,
				values: this.lineGridRows.map(item=>item.line),
				labels: this.lineGridRows.map(item=>item.line)
			});

			this.getAreaDataList();
		},
		async getAreaDataList(){
			this.areaGridView.commit();
			// let searchParams = {
			// 	line : this.selectedLine			}
			//let param = {menuId:'M0002001',queryId:'selectAreaList', queryParams:searchParams,  target: this.areaGridRows};
			let param = {menuId:'M0002001',queryId:'selectAreaList',  target: this.areaGridRows};
			let resp = await this.$axios.api.search(param);	

			this.allAreaList = this.areaGridDataProvider.getJsonRows(0, -1);
		},		
		
		onCellClickedLineGrid( grid, clickData ){

			if (clickData.cellType != "data") return;

			this.selectedLine = grid.getValue(clickData.itemIndex, "line");

			const filteredData = this.allAreaList.filter(row => row.line === this.selectedLine);

  		   	this.areaGridView.getDataSource().setRows(filteredData);
        	this.areaGridView.refresh();
		},

		cellStyleCallbackLine(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
		cellStyleCallbackAreaCode(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
		addRow() {
			this.areaGridView.commit();

			let newRow = {
				line: "DFB1",
				useYn: "Y",
				createDate: this.$utils.getTodayDate("-"),
				createName: this.userAuthInfo.userInfo.userName
			}
			this.areaGridDataProvider.addRow(newRow);
			let itemIdx = this.areaGridView.getItemCount() - 1;
			this.areaGridView.setCurrent({ itemIndex: itemIdx });
		},
		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}			

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
				if ( item.line === undefined || item.line === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 라인은 필수 선택입니다!");
					return true;
				}
				if ( item.공정구분 === undefined || item.공정구분 === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Area 코드는 필수 입력입니다!");
					return true;
				}
				if ( item.area === undefined || item.area === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Area명은 필수 입력입니다!");
					return true;
				}	
				if ( item.areaOrd === undefined || item.areaOrd === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 순서는 필수 입력입니다!");
					return true;
				}																									
			});

			return !invalid;
		},	
		async saveData() {

			let result = false;

			let saveData = this.$refs.areaGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002001',
					delete: [{queryId:'deleteArea', data:saveData.delete}],
					insert: [{queryId:'insertArea', data:saveData.insert}],
					update: [{queryId:'updateArea', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveAreaData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `[${response.data.resultData}] 관련 Step이 등록되어 있어 삭제할 수 없습니다!` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Line-Area코드 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
						this.$toast("info", msg);
					}					
				}).catch((error) => {
					this.$toast("error", error);
				});

				return result;
			}
		},		

		searchClick() {
			this.getLineDataList();
		},

		addClick() {

			this.areaGridView.commit();
			this.addRow();
		},	
		delClick() {
			this.areaGridView.commit();
			const checkedRows = this.areaGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.areaGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.areaGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.areaGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.areaGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.areaGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");
		
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `areaList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
		}		
	},
}

</script>
