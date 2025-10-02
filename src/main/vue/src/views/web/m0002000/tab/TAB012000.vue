/**
*	프로세스 플래닝 > 생산 공정 관리 > 공정 마스터
*/
<template>
 <div>
	  	<div class="grid_box">
		<div class="left_box">
			<div class="btn_wrap ms-auto">  
				<b-button class="second" @click="searchClick">새로고침</b-button>   
				<b-button class="second" @click="excelClick">엑셀</b-button>
				<b-button class="sub" @click="addClick">추가</b-button>
				<b-button @click="delClick">삭제</b-button>
				<b-button class="main" @click="saveClick">저장</b-button>                       
			</div>            
		</div>
		<div class="grid-border-none">			
			<RealGrid ref="processGrid" :uid="'processGrid'" :step="'1'" :rows="gridRows" style="height:100%;"/>			
			<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
		</div>
	</div>
 </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB012000.js';

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
			processGrid:null,
			gridRows:[],
			selectLineList: [],
		}
	},
	computed: {
		processGridView(){
			return this.$refs.processGrid.getGridView();
		},
		processGridDataProvider(){
			return this.$refs.processGrid.getGridDataProvider();
		}			

	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

		this.processGridView.columnByName("line").styleCallback = this.cellStyleCallbackProcess;
		this.getSelectOptions();
		this.getDataList();

	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.processGrid = _.cloneDeep(gridField);
		},
		async getSelectOptions(){

			let lineParam = { majCode : "74"};
			let searchParam = 
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:lineParam, 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "코드"],
											this.selectLineList	);
										}, 	
				};
			
			let resp = await this.$axios.api.search(searchParam);

			this.processGridView.setColumnProperty("line", "editor", {
				type: "dropdown",
				textReadOnly: true,
				values: this.selectLineList.map(item=>item.itemValue),
				labels: this.selectLineList.map(item=>item.itemText)
			});
		},

		async getDataList(){
			this.processGridView.commit();

			let param = {menuId:'M0002003',queryId:'selectProcessList', target: this.gridRows};
			await this.$axios.api.search(param);			
		},	
		cellStyleCallbackProcess(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},		
		addRow() {
			this.processGridView.commit();

			let newRow = {
				line: "DFB1",
				version:1,
				createDate: this.$utils.getTodayDate(),
				createName: this.userAuthInfo.userInfo.userName
			}			
			this.processGridDataProvider.addRow(newRow);
			let itemIndex = this.processGridView.getItemCount() - 1;
			this.processGridView.setCurrent({ itemIndex: itemIndex });
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
				if ( item.processId === undefined || item.processId === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Process ID는 필수 입력입니다!");
					return true;
				}																
			});

			return !invalid;
		},	
		async saveData() {

			let result = false;

			let saveData = this.$refs.processGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002003',
					delete: [{queryId:'deleteProcess', data:saveData.delete}],
					insert: [{queryId:'insertProcess', data:saveData.insert}],
					update: [{queryId:'updateProcess', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveProcessData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						this.$eventBus.emit('processListUpdated');
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `${response.data.resultData}  관련 제품공정이 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Line-Process ID 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
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

			this.processGridView.commit();
			this.addRow();
		},
		delClick() {
			this.processGridView.commit();
			const checkedRows = this.processGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.processGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.processGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.processGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.processGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.processGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `processList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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