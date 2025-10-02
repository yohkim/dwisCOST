/**
*	프로세스 플래닝 > 생산 공정 관리 > 스탭 마스터
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
				<RealGrid ref="stepGrid" :uid="'stepGrid'" :step="'1'" :rows="gridRows" style="height:100%;"/>		
				<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			</div>
		</div>
	</div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB014000.js';

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
			stepGrid:null,
			gridRows:[],
			lineList:[],
			searchLine:'',
			selectLineList: [],
		}
	},
	computed: {
		stepGridView(){
			return this.$refs.stepGrid.getGridView();
		},
		stepGridDataProvider(){
			return this.$refs.stepGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

		this.stepGridView.columnByName("line").styleCallback = this.cellStyleCallbackLine;
		this.stepGridView.columnByName("공정코드").styleCallback = this.cellStyleCallbackStepCode;
		this.stepGridView.onCellClicked = this.onCellClicked;		
		this.getSelectOptions();
		this.getDataList();

	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.stepGrid = _.cloneDeep(gridField);
		},
		async getSelectOptions(){

			let searchParam = 
				{ menuId:'M0002001', queryId:'selectLineList', 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["line", "line"],
											this.selectLineList	);
										}
				};
			
			let resp = await this.$axios.api.search(searchParam);

			this.lineList.push({ itemValue:"", itemText:"전체" });
			this.lineList.push(...this.selectLineList	);		
			
			this.stepGridView.setColumnProperty("line", "editor", {
				type: "dropdown",
				textReadOnly: true,
				values: this.selectLineList.map(item=>item.itemValue),
				labels: this.selectLineList.map(item=>item.itemText)
			});						
		},
		async getDataList(){
			this.stepGridView.commit();

			let params = {
				line : this.searchLine
			};

			let param = {menuId:'M0002003',queryId:'selectStepList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},
		cellStyleCallbackLine(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},		
		cellStyleCallbackStepCode(grid, model){
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

			if ( _.isEmpty(line) && clickData.fieldName.includes('area') ) {
				this.$toast("info", "Line을 먼저 선택하십시요!");
				return;
			} 
			if (clickData.fieldName.includes('area') ){
					let params = {
						dialogTitle: "Area",
						step: 7,
						height: 300,
						width: 550,
						dataRow: clickData.dataRow,
						gridJs: `CP0000000011.js`,
						search: { menuId: "M0002001", queryId: "selectAreaList", queryParams: searchParams }
					};	
					this.$refs.cmDialog1.openDialog(params);					
			}			
		},
		handleConfirm(params){
			let data = {};
			let itemIndex = '';

			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {
				if (params.gridJs === "CP0000000011.js" ) {
					data = params.dataProvider.getJsonRow(checkRow[0]);
					itemIndex = params.dataRow;
					this.stepGridView.setValue(itemIndex, "area", data["area"]);
					this.stepGridView.setValue(itemIndex, "areaCode", data["공정구분"]);
				}
			}	
		},			

		addRow() {
			this.stepGridView.commit();

			let newRow = {
				line: "DFB1",
				작업순서:0,
				목표치:10000,
				치수관리:'N',
				작업여부:'Y',
				createDate: this.$utils.getTodayDate("-"),
				createName: this.userAuthInfo.userInfo.userName
			}			
			this.stepGridDataProvider.addRow(newRow);
			let itemIndex = this.stepGridView.getItemCount() - 1;
			this.stepGridView.setCurrent({ itemIndex: itemIndex });
		},

		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}			

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
				if ( item.공정코드 === undefined || item.공정코드 === '' ) {
					this.$toast("info", index  + "번째 추가 항목 확인 : 공정코드는 필수 입력선택입니다!");
					return true;
				}
				if ( item.공정명 === undefined || item.공정명 === '' ) {
					this.$toast("info", index  + "번째 추가 항목 확인 : 공정명은 필수 입력선택입니다!");
					return true;
				}
				if ( item.공정약어 === undefined || item.공정약어 === '' ) {
					this.$toast("info", index  + "번째 추가 항목 확인 : 공정약어는 필수 입력선택입니다!");
					return true;
				}								
				if ( item.areaCode === undefined || item.areaCode === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 :  Area는 필수 선택입니다!");
					return true;
				}																
			});

			return !invalid;
		},	
		async saveData() {

			let result = false;

			let saveData = this.$refs.stepGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002003',
					delete: [{queryId:'deleteStep', data:saveData.delete}],
					insert: [{queryId:'insertStep', data:saveData.insert}],
					update: [{queryId:'updateStep', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveStepData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `${response.data.resultData}  관련 Process가 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Step코드 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
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

			this.stepGridView.commit();
			this.addRow();
		},
		delClick() {
			this.stepGridView.commit();
			const checkedRows = this.stepGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.stepGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.stepGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.stepGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.stepGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.stepGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `stepList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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