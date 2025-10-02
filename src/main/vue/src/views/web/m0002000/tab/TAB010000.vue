/**
*	프로세스 플래닝 > 제품 모델 관리 > 제품 마스터
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
						<b-button class="second" @click="excelClick">엑셀</b-button>
						<b-button class="sub" @click="addClick">추가</b-button>
						<b-button @click="delClick">삭제</b-button>
						<b-button class="main" @click="saveClick">저장</b-button>                       
					</div>            
				</div>
				<div class="grid-border-none">
					<RealGrid ref="prodGrid" :uid="'prodGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>		
					<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
					<!-- <Popup ref="codePopup" @confirm="handleConfirmProdCode"/> -->
				</div>
		</div>
	</div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB010000.js';
import Popup from "./TAB020001Popup.vue"

const URI_PREFIX = '/api/m0002000/m0002002';

export default {
	props: {},  
	components: {Popup},
	watch: {
		searchProdType(newValue) {
			this.addable = false;
		}

	},
	setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },		
	data () {
		return {
			prodGrid:null,
			gridRows:[],
			lineList:[],
			prodTypeList: [],
			searchLine:'DFB1',
			searchProdType:'A2',
			selectLineList: [],
			addable: false,			
		}
	},
	computed: {
		prodGridView(){
			return this.$refs.prodGrid.getGridView();
		},
		prodGridDataProvider(){
			return this.$refs.prodGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.prodGridView.columnByName("line").styleCallback = this.cellStyleCallbackLine;
		this.prodGridView.columnByName("prodCode").styleCallback = this.cellStyleCallbackProdCode;
		this.prodGridView.onCellClicked = this.onCellClicked;
		this.prodGridView.onCellEdited = this.onCellEdited;

		this.getSelectOptions();

		this.searchClick();
		//this.getDataList();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.prodGrid = _.cloneDeep(gridField);
		},
		async getSelectOptions(){

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

			this.prodGridView.setColumnProperty("line", "editor", {
				type: "dropdown",
				textReadOnly: true,
				values: this.selectLineList.map(item=>item.itemValue),
				labels: this.selectLineList.map(item=>item.itemText)
			});			
		},
		async getDataList(){
			this.prodGridView.commit();
			let params = {
				line: this.searchLine,
				prodType: this.searchProdType
			};
			let param = {menuId:'M0002002',queryId:'selectProductList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);			
		},
		cellStyleCallbackLine(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
		cellStyleCallbackProdCode(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},

		onCellEdited(grid, itemIndex, row, field){

			let fieldName = this.prodGridDataProvider.getFieldName(field);
			if (fieldName.toLowerCase() === "sheet" || fieldName.toLowerCase() === "block") {
				const sheet = grid.getValue(itemIndex,  "sheet") || 0;
				const block = grid.getValue(itemIndex,  "block") || 0;
				const cellValue = sheet * block;

				grid.setValue(itemIndex, "cell", cellValue );
			}
		},		

		onCellClicked( grid, clickData ){

			console.log(clickData);

			let params = {};

			if (clickData.cellType != "data") return;

			this.prodGridView.setCurrent({ itemIndex: clickData.itemIndex });
			
			// if(clickData.fieldName == "prodCode"){
			// 		let prodCode = grid.getValue(clickData.itemIndex,clickData.fieldName);
			// 		let params={
			// 			dataRow:clickData.dataRow
			// 		};
			// 		if(!_.isNil(prodCode)&&prodCode.length==8){
			// 			params.prodGubun=prodCode.substring(0,1);
			// 			params.site=prodCode.substring(1,2);
			// 			params.process=prodCode.substring(2,3);
			// 			params.size=prodCode.substring(3,4);
			// 			params.prodNo=prodCode.substring(4,6);
			// 			params.revNo=prodCode.substring(6,8);
			// 		}
			// 		this.$refs.codePopup.openDialog(params);

			// } else 
			if (clickData.fieldName.includes("customer") ){
				params = {
					dialogTitle: "고객사",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000001.js`,
					search: { menuId: "CMDIALOG", queryId: "selectDwVendorMast" },
				};	
				this.$refs.cmDialog1.openDialog(params);
			}
			else if (clickData.fieldName.includes("model")){
				params = {
					dialogTitle: "제품모델",
					step: 7,
					height: 300,
					width: 660,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000012.js`,
					search: { menuId: "M0002002", queryId: "selectModelList", },
				};	
				this.$refs.cmDialog1.openDialog(params);
			}
			else if (clickData.fieldName === "inch"){
				params = {
					dialogTitle: "제품Inch",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000006.js`,
					search: { menuId: "CMDIALOG", queryId: "selectCommonCode", queryParams:{majCode:"46" }},
				};	
				this.$refs.cmDialog1.openDialog(params);
			}
			else if (clickData.fieldName === "version"){
				params = {
					dialogTitle: "제품버전",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000006.js`,
					search: { menuId: "CMDIALOG", queryId: "selectCommonCode", queryParams:{majCode:"48" }},
				};	
				this.$refs.cmDialog1.openDialog(params);
			}
			else if (clickData.fieldName === "glassThick"){
				params = {
					dialogTitle: "GLASS두께",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000006.js`,
					search: { menuId: "CMDIALOG", queryId: "selectCommonCode", queryParams:{majCode:"11" }},
				};	
				this.$refs.cmDialog1.openDialog(params);
			}				
			else if (clickData.fieldName === "spec"){
				params = {
					dialogTitle: "제품규격",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000006.js`,
					search: { menuId: "CMDIALOG", queryId: "selectCommonCode", queryParams:{majCode:"34" }},
				};	
				this.$refs.cmDialog1.openDialog(params);
			}	
			else if (clickData.fieldName === "unit" || clickData.fieldName === "unitCode"){
				params = {
					dialogTitle: "제품단위",
					step: 7,
					height: 300,
					width: 700,
					dataRow: clickData.dataRow,
					gridJs: `CP0000000006.js`,
					search: { menuId: "CMDIALOG", queryId: "selectCommonCode", queryParams:{majCode:"01" }},
				};	
				this.$refs.cmDialog1.openDialog(params);
			}
		},
		// handleConfirmProdCode(params){
		// 	this.prodGridDataProvider.setValue(params.dataRow,"prodCode",params.prodCode);
		// },
		handleConfirm(params){
			let data = {};
			let itemIndex = '';

			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {
				data = params.dataProvider.getJsonRow(checkRow[0]);
				itemIndex = params.dataRow;
			}

			if (params.gridJs === "CP0000000001.js") {
				this.prodGridView.setValue(itemIndex, "customerCode", data["거래처코드"]);
				this.prodGridView.setValue(itemIndex, "customerName", data["거래처명"]);
			}
			else if (params.gridJs === "CP0000000012.js" ){
				this.prodGridView.setValue(itemIndex, "model", data["model"]);
				this.prodGridView.setValue(itemIndex, "modelName", data["description"]);
			}
			else if (params.gridJs === "CP0000000006.js" && params.dialogTitle === "제품Inch" ){

				let inchValue = parseFloat(data["내용"].replace(/[^0-9.-]+/g, ''));
				this.prodGridView.setValue(itemIndex, "inch", inchValue);
			}
			else if (params.gridJs === "CP0000000006.js" && params.dialogTitle === "제품버전" ){
				this.prodGridView.setValue(itemIndex, "version", data["내용"]);	
			}		
			else if (params.gridJs === "CP0000000006.js" && params.dialogTitle === "GLASS두께" ){
				this.prodGridView.setValue(itemIndex, "glassThick", data["내용"]);				
			}
			else if (params.gridJs === "CP0000000006.js" && params.dialogTitle === "제품규격" ){
				this.prodGridView.setValue(itemIndex, "spec", data["내용"]);				
			}	
			else if (params.gridJs === "CP0000000006.js" && params.dialogTitle === "제품단위" ){
				this.prodGridView.setValue(itemIndex, "unitCode", data["코드"]);
				this.prodGridView.setValue(itemIndex, "unit", data["내용"]);
			}
		},

		addRow() {
			this.prodGridView.commit();

			const productCodes = this.prodGridDataProvider.getJsonRows(0, -1).map(row => row.prodCode.slice(-4));

			const addProductCode = this.searchProdType + ( productCodes.length > 0 ? (Math.max(...productCodes) + 1).toString().padStart(4,'0') : "0001");			

			let newRow = {
				line: "DFB1",
				prodCode: addProductCode,				
				inch : 0,
				glassThick : 0,
				unitCode : 76,
				unit : "Cell",
				customerCode: "30001",
				customerName : "삼성디스플레이",
				sheet : 0,
				block : 0,
				cell : 0,
				runSize : 540,
				massProd : "Y",
				createDate: this.$utils.getTodayDate(),
				createName: this.userAuthInfo.userInfo.userName				
			}			
			this.prodGridDataProvider.addRow(newRow);
			let itemIdx = this.prodGridView.getItemCount() - 1;
			this.prodGridView.setCurrent({ itemIndex: itemIdx });
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
				if ( item.prodCode  === undefined || item.prodCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 제품코드는 필수 입력입니다!");
					return true;
				}
				else if ( item.model  === undefined || item.model === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 제품모델 필수 입력입니다!");
					return true;					
				}				
			});

			return !invalid;
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.prodGrid.getSaveData();
//this.$toast('info',JSON.stringify(saveData,null,2)); return;
			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002002',
					delete: [{queryId:'deleteProduct', data:saveData.delete}],
					insert: [{queryId:'insertProduct', data:saveData.insert}],
					update: [{queryId:'updateProduct', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveProductData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `${response.data.resultData}  관련 공정(Process)이 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Line-제품코드 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
						this.$toast("info", msg);
					}							
				}).catch((error) => {
					this.$toast("error", error);
				});

				return result;
			}
		},

		async searchClick() {
			if ( this.searchProdType == '' || this.searchLine == '' ) {
				this.addable = false;	
			} 
			else {
				this.addable = true;
			}
			this.getDataList();
		},	
		addClick() {

			this.prodGridView.commit();

			if ( this.addable ) {
				this.addRow();
			}
			else {
				this.$toast('info', "추가할 제품의 제품구분으로 조회 후\n추가 하십시요!");
			}
		},
		delClick() {
			this.prodGridView.commit();
			const checkedRows = this.prodGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.prodGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.prodGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.prodGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.prodGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.prodGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `prodList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

	}

}

</script>