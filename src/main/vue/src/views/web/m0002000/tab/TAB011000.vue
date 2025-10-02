/**
*	프로세스 플래닝 > 생산 공정 관리 > 제품 공정 마스터
*/
<template>
	<div>
		<div class="search_box" >
			<b-row class="search_area">
				<b-col cols="1">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="searchLine">
							<option v-for="item in lineList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
						</select>
						<label for="floatingSelect" class="select">Line</label>
					</div>
				</b-col>
				<b-col cols="2">
					<div class="form-floating">
						<select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="searchProdType">
							<option v-for="item in prodTypeList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
						</select>
						<label for="floatingSelect" class="select">제품 구분</label>
					</div>
				</b-col>     			         
			</b-row>
			<div class="btn_area">
				<b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>         
			</div> 	
		</div>
		<div class="grid_box search_onerow">
			<div class="left_box">
				<div class="btn_wrap ms-auto">  
					<b-button class="main" @click="prodProcessAddClick">신규제품 공정마스터 등록</b-button>
					<b-button class="second" @click="excelClick">엑셀</b-button>
					<b-button class="sub" @click="addClick">추가</b-button>
					<b-button @click="delClick">삭제</b-button>
					<b-button class="main" @click="saveClick">저장</b-button>
				</div>            
			</div>
			<div class="grid-border-none">
				<RealGrid ref="prodProcGrid" :uid="'prodProcGrid'" :step="'1'" :rows="gridRows" style="height: 100%"/>		
				<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			</div>
		</div>	
	</div>

</template>
<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB011000.js';

const URI_PREFIX = '/api/m0002000/m0002003';

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
			prodGrid:null,
			gridRows:[],
			searchLine:'',
			searchProdType:'',
			lineList: [],
			prodTypeList: [],
			selectLineList: [],
			selectProcssList: [],
			popupColumns:['prodCode'],
		}
	},
	computed: {
		prodProcGridView(){
			return this.$refs.prodProcGrid.getGridView();
		},
		prodProcGridDataProvider(){
			return this.$refs.prodProcGrid.getGridDataProvider();
		}		

	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.prodProcGridView.columnByName("line").styleCallback = this.cellStyleCallbackLine;
		this.prodProcGridView.onCellClicked = this.onCellClicked;		

		this.getSelectOptions();

		this.getDataList();	

	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.prodProcGrid = _.cloneDeep(gridField);
		},
		async getSelectOptions(){

			let lineParam = { majCode : "74"};
			let prodTypeParam = { majCode : "04"};
			let prodTypelst = [];
			let searchParam = [
				{ menuId:'M0002001', queryId:'selectLineList', 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["line", "line"],
											this.selectLineList	);
										}
				},
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:prodTypeParam, 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											prodTypelst	);
										}, 	
				}
			];		
			
			let resp = await this.$axios.api.searchAll(searchParam);

			this.lineList.push({ itemValue:"", itemText:"전체" });
			this.lineList.push(...this.selectLineList);

			this.prodTypeList.push({ itemValue:"", itemText:"전체" });
			prodTypelst.forEach((elem) => {
				this.prodTypeList.push({
					itemValue: elem["itemValue"],
					itemText: `${elem["itemValue"]} - ${elem["itemText"]}`
				});
			});

			this.prodProcGridView.setColumnProperty("line", "editor", {
				type: "dropdown",
				textReadOnly: true,
				values: this.selectLineList.map(item=>item.itemValue),
				labels: this.selectLineList.map(item=>item.itemText)
			});

		},
		async getDataList(){
			this.prodProcGridView.commit();
			let params = {
				line : this.searchLine,
				prodType: this.searchProdType
			};
			let param = {menuId:'M0002003',queryId:'selectProdProcList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);			
		},
		cellStyleCallbackLine(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
		onCellClicked( grid, clickData ){

			console.log("clickData=" +  clickData);

			let searchParams = {};

			if (clickData.cellType != "data") return;

			let line = grid.getValue(clickData.itemIndex, "line");
			searchParams = {line : line };
			
			const rowState = this.prodProcGridDataProvider.getRowState(clickData.dataRow);

			if ( rowState === RowState.CREATED ) {
				if ( _.isEmpty(line) ) {
					this.$toast("info", "Line을 먼저 선택하십시요!");
					return;
				} 

				if (clickData.fieldName === "prodCode"){
					let params = {
						dialogTitle: "제품",
						step: 7,
						height: 300,
						width: 1000,
						dataRow: clickData.dataRow,
						gridJs: `CP0000000002.js`,
						search: { menuId: "CMDIALOG", queryId: "selectDwProductMast" },
					};	
					this.$refs.cmDialog1.openDialog(params);
				}
			}

			if (clickData.fieldName === "processId"){
				let params = {
					dialogTitle: "Process",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000007.js`,
					search: { menuId: "CMDIALOG", queryId: "selectProcess" },
				};	
				this.$refs.cmDialog1.openDialog(params);					
			}			


		},

		handleConfirm(params){
			let data = {};
			let itemIndex = '';

			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {
				data = params.dataProvider.getJsonRow(checkRow[0]);
				itemIndex = params.dataRow;
			}

			if (params.gridJs === "CP0000000002.js") {
				this.prodProcGridView.setValue(itemIndex, "prodCode", data["제품코드"]);
				this.prodProcGridView.setValue(itemIndex, "model", data["제품모델"]);
				this.prodProcGridView.setValue(itemIndex, "modelName", data["modelName"]);
				this.prodProcGridView.setValue(itemIndex, "inch", data["제품inch"]);
				this.prodProcGridView.setValue(itemIndex, "glassThick", data["glass두께"]);
				this.prodProcGridView.setValue(itemIndex, "prodVersion", data["제품버젼"]);
				this.prodProcGridView.setValue(itemIndex, "sheet", data["sheet"]);
				this.prodProcGridView.setValue(itemIndex, "block", data["block"]);
				this.prodProcGridView.setValue(itemIndex, "runSize", data["runSize"]);
				this.prodProcGridView.setValue(itemIndex, "spec", data["제품규격"]);
			}
			else if (params.gridJs === "CP0000000007.js" ) {
				this.prodProcGridView.setValue(itemIndex, "processId", data["processId"]);
				this.prodProcGridView.setValue(itemIndex, "version", data["version"]);
			}
		},

		addRow() {
			this.prodProcGridView.commit();

			let newRow = {
				line: "DFB1",
				createDate: this.$utils.getTodayDate(),
				createName: this.userAuthInfo.userInfo.userName
			}			
			this.prodProcGridDataProvider.addRow(newRow);
			let itemIndex = this.prodProcGridView.getItemCount() - 1;
			this.prodProcGridView.setCurrent({ itemIndex: itemIndex });
		},		
		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}			

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
				if ( item.line === undefined || item.line === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 라인은 필수 선택입니다!");
					return true;
				}
				if ( item.prodCode === undefined || item.prodCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 제품코드는 필수 선택입니다!");
					return true;
				}
				if ( item.processId === undefined || item.processId === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Process ID는 필수 선택입니다!");
					return true;
				}																
			});

			return !invalid;
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.prodProcGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002003',
					delete: [{queryId:'deleteProdProc', data:saveData.delete}],
					insert: [{queryId:'insertProdProc', data:saveData.insert}],
					update: [{queryId:'updateProdProc', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveProdProcData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `${response.data.resultData}  관련 항목이 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Line-제품코드-Process ID 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
						this.$toast("info", msg);
					}						
				}).catch((error) => {
					this.$toast("error", error);
				});

				return result;
			}
		},

		async searchClick() {
			this.getDataList();
		},	
		addClick() {

			this.prodProcGridView.commit();
			this.addRow();
		},
		delClick() {
			this.prodProcGridView.commit();
			const checkedRows = this.prodProcGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.prodProcGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.prodProcGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.prodProcGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.prodProcGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},

		async prodProcessAddClick(){

			this.prodProcGridView.commit();

			let qp = {
				yyyymmdd : this.$utils.getTodayDate("")
			}

			let param = {menuId:'M0002003', queryId:'saveNewProdProcess', queryParams:qp};
			let resp = await this.$axios.api.search(param);

			if ( !_.isNil(resp) ) {
				this.$toast("info",'신규제품에 대한 Process ID 등록되었습니다.');
				this.searchClick();
			}
			else {
				const msg = `[오류발생]\n${resp[0].errormessage}`;
				this.$toast("erroe", msg);
			}
		},

		async excelClick(){

			const grid = this.prodProcGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `prodProcList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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