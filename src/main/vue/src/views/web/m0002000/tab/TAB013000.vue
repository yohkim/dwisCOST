/**
*	프로세스 플래닝 > 생산 공정 관리 > 공정 스텝 마스터
*/
<template>
	<div>
  	<div class="search_box" >
		<b-row class="search_area">
			<b-col cols="3">
				<div class="form-floating">
					<select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="searchProcess">
						<option v-for="item in processList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
					</select>
					<label for="floatingSelect" class="select">Process</label>
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
				<b-button class="sub" @click="copyProcess">공정복사</b-button>                  
			</div>            
		</div>
		<div class="grid-border-none">
			<RealGrid ref="processPlanGrid" :uid="'processPlanGrid'" :step="'1'" :rows="gridRows" style="height:100%"/>		
			<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			<ProcessCopyPopup ref="processCopyPopup"  @confirm="processCopyPopupConfirm"  />
			<StepPopup ref="stepPopup" @confirm="stepPopupConfirm" />
		</div>
  	</div> 	</div>
 
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB013000.js';
import ProcessCopyPopup from '@web/m0002000/tab/TAB013000Popup1.vue';
import StepPopup from '@web/m0002000/tab/TAB013000Popup2.vue';

const URI_PREFIX = '/api/m0002000/m0002003';

export default {
	props: {},  
	components: {
		ProcessCopyPopup,StepPopup
	},
	watch: {},
	setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },		
	data () {
		return {
			processPlanGrid:null,
			gridRows:[],
			searchProcess:'',
			searchArea:'',
			processList: [],
			areaList:[],
			selectAreaList: [],
			popupColumns:['processId'],
		}
	},
	computed: {
		processPlanGridView(){
			return this.$refs.processPlanGrid.getGridView();
		},
		processPlanGridDataProvider(){
			return this.$refs.processPlanGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		//this.processPlanGridView.columnByName("line").styleCallback = this.cellStyleCallbackLine;
		this.processPlanGridView.onCellClicked = this.onCellClicked;		

		this.getSelectOptions();

		this.getDataList();			

		this.$eventBus.on('processListUpdated', async () => {
			await this.getSelectOptions();   // 드롭다운 갱신
		});		

	},
	beforeUnmount() {
		this.$eventBus.off('processListUpdated');
	},
	methods: {
		initializeGrid() {
			this.processPlanGrid = _.cloneDeep(gridField);
		},
		async getSelectOptions(){

			let processLst = [];

			let searchParam = 
				{ menuId:'M0002003', queryId:'selectProcess', 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["process", "description"],
											processLst	);
										}, 	
				};
				// 공정은 프로세스 선택시 해당 라인에 대한 공정만 필터링해서 가져왕야 함
				// { menuId:'M0002001', queryId:'selectCommonCode', queryParams:areaParam, 
				// 	callback: (data) => {
				// 							this.$utils.transformData(
				// 							data,
				// 							["itemValue", "itemText"],
				// 							["코드", "내용"],
				// 							this.areaList	);
				// 						}, 	
				// },

			let resp = await this.$axios.api.search(searchParam);

			if ( !_.isEmpty(processLst)) {
				this.processList = [];
				this.processList = processLst.map(item =>({
					itemValue: item.itemValue,
					itemText: `[${item.itemValue}]${item.itemText}`
				}));
			}
		},
		async getDataList(){
			this.processPlanGridView.commit();

			let line = '';
			let processId = '';
			let version = '';

			const parts = this.searchProcess.split("-");
			if (parts.length === 3) {
				line = parts[0];
				processId = parts[1];
				version = parts[2].slice(1);
			}
			
			let params = {
				line : line,
				processId : processId,
				version : version
			};
			let param = {menuId:'M0002003',queryId:'selectProcessPlanList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);			
		},
		// cellStyleCallbackLine(grid, model){
		// 	let rtn = {};
		// 	rtn['editable'] = model.item.rowState === RowState.CREATED;
		// 	return rtn;
		// },
		onCellClicked( grid, clickData ){

			console.log("clickData=" +  clickData);

			let searchParams = {};

			if (clickData.cellType != "data") return;

			this.processPlanGridView.setCurrent({ itemIndex: clickData.itemIndex });	
			
			const rowState = this.processPlanGridDataProvider.getRowState(clickData.dataRow);
			let line = grid.getValue(clickData.itemIndex, "line");
			searchParams = {line : line };

			if ( _.isEmpty(line) && clickData.fieldName.includes('공정')) {
				this.$toast("info", "Process를 먼저 선택하십시요!");
				return;
			} 

			if ( rowState === RowState.CREATED ) {
				if (clickData.fieldName === "line" || clickData.fieldName === "processId" ||  clickData.fieldName === "version" ){
					
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
				else if (clickData.fieldName === "공정코드" || clickData.fieldName === "공정명" || clickData.fieldName === "공정약어"){
					let params = {
						dialogTitle: "Step",
						step: 7,
						height: 300,
						width: 950,
						dataRow: clickData.dataRow,
						gridJs: `CP0000000008.js`,
						search: { menuId: "M0002003", queryId: "selectStepList", queryParams: searchParams }
					};	
					this.$refs.cmDialog1.openDialog(params);					
				}
			}

			if (clickData.fieldName === "다음공정코드" || clickData.fieldName === "다음공정명"){
					let params = {
						dialogTitle: "Step",
						step: 7,
						height: 300,
						//width: 950,
						popUpSize:'xl',
						dataRow: clickData.dataRow,
						clickRow: this.processPlanGridDataProvider.getJsonRow(clickData.dataRow),
						search: { menuId: "M0002003", queryId: "selectStepList", queryParams: searchParams }
					};	
					this.$refs.stepPopup.openDialog(params);					
			}			
		},

		handleConfirm(params){
			let data = {};
			let itemIndex = '';

			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {
				if (params.gridJs === "CP0000000007.js" ) {
					data = params.dataProvider.getJsonRow(checkRow[0]);
					itemIndex = params.dataRow;
					this.processPlanGridView.setValue(itemIndex, "line", data["line"]);
					this.processPlanGridView.setValue(itemIndex, "processId", data["processId"]);
					this.processPlanGridView.setValue(itemIndex, "version", data["version"]);
				}
				else if (params.gridJs === "CP0000000008.js" ) {
					data = params.dataProvider.getJsonRow(checkRow[0]);
					itemIndex = params.dataRow;
					this.processPlanGridView.setValue(itemIndex, "공정코드", data["공정코드"]);
					this.processPlanGridView.setValue(itemIndex, "공정명", data["공정명"]);
					this.processPlanGridView.setValue(itemIndex, "공정약어", data["공정약어"]);
					this.processPlanGridView.setValue(itemIndex, "area", data["area"]);
					this.processPlanGridView.setValue(itemIndex, "areaCode", data["areaCode"]);
				}
			}
			if (params.gridJs === "CP0000000009.js" ) {
				itemIndex = params.dataRow;

				if (checkRow.length <= 0) {
					this.processPlanGridView.setValue(itemIndex, "다음공정코드", '');
					this.processPlanGridView.setValue(itemIndex, "다음공정명", '');
				}
				else {
					// 멀티선택
					let stepCode = [];
					let stepName = [];
					checkRow.forEach(rowIndex => {
						let rowData = params.dataProvider.getJsonRow(rowIndex);
						stepCode.push(rowData['공정코드']);
						stepName.push(rowData['공정약어']);
					});

					let joinedStepCode = stepCode.join(',');
					let joinedStepName = stepName.join(',');
					
					this.processPlanGridView.setValue(itemIndex, "다음공정코드", joinedStepCode);
					this.processPlanGridView.setValue(itemIndex, "다음공정명", joinedStepName);
				}
			}				
		},

		addRow() {
			this.processPlanGridView.commit();

			let newRow = {
				line: "DFB1",
				useYn: "Y",
				등록일: this.$utils.getTodayDate(),
				등록자: this.userAuthInfo.userInfo.userName
			}			
			this.processPlanGridDataProvider.addRow(newRow);
			let itemIndex = this.processPlanGridView.getItemCount() - 1;
			this.processPlanGridView.setCurrent({ itemIndex: itemIndex });
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
				if ( item.processId === undefined || item.processId === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : processId는 필수 선택입니다!");
					return true;
				}
				if ( item.version === undefined || item.version === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : version은 필수 선택입니다!");
					return true;
				}
				if ( item.공정코드 === undefined || item.공정코드 === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 공정코드는 필수 선택입니다!");
					return true;
				}																				
			});

			return !invalid;
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.processPlanGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002003',
					delete: [{queryId:'deleteProcessPlan', data:saveData.delete}],
					insert: [{queryId:'insertProcessPlan', data:saveData.insert}],
					update: [{queryId:'updateProcessPlan', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveProcessPlanData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `${response.data.resultData}  관련 항목이 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Line-ProcessID-Version-Step코드 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
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

			this.processPlanGridView.commit();
			this.addRow();
		},
		delClick() {
			this.processPlanGridView.commit();
			const checkedRows = this.processPlanGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.processPlanGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.processPlanGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.processPlanGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.processPlanGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.processPlanGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `processPlanList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

		async copyProcess(){
			let params={userName:this.userAuthInfo.userInfo.userName}
			this.$refs.processCopyPopup.openDialog(params)
		},

		stepPopupConfirm(params){
			let itemIndex = params.dataRow;
			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length <= 0) {
				this.processPlanGridView.setValue(itemIndex, "다음공정코드", '');
				this.processPlanGridView.setValue(itemIndex, "다음공정명", '');
			}
			else {
				// 멀티선택
				let stepCode = [];
				let stepName = [];
				checkRow.forEach(rowIndex => {
					let rowData = params.dataProvider.getJsonRow(rowIndex);
					stepCode.push(rowData['공정코드']);
					stepName.push(rowData['공정약어']);
				});

				let joinedStepCode = stepCode.join(',');
				let joinedStepName = stepName.join(',');
				this.processPlanGridView.setValue(itemIndex, "다음공정코드", joinedStepCode);
				this.processPlanGridView.setValue(itemIndex, "다음공정명", joinedStepName);
			}
		},

		processCopyPopupConfirm(params){
			this.getDataList();
		},		

	},
}

</script>