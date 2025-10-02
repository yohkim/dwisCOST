/**
*	프로세스 플래닝 > SITE 모델링 관리 > 설비 마스터
*/
<template>
	<div>
		<div class="search_box" >
			<b-row class="search_area">
				<b-col cols="2">
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
			<div class="left_box ">
				<div class="btn_wrap ms-auto">   
					<b-button class="second" @click="excelClick">엑셀</b-button>
					<b-button class="sub" @click="addClick">추가</b-button>
					<b-button @click="delClick">삭제</b-button>
					<b-button class="main" @click="saveClick">저장</b-button>                       
				</div>            
			</div>
			<div class="grid-border-none">
				<RealGrid ref="equipGrid" :uid="'equipGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
				<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			</div>
		</div>  
	</div>
		
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB008000.js';

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
			equipGrid:null,
			gridRows:[],
			lineList:[],
			searchLine:'',
			selectLineList:[]
		}
	},
	computed: {
		equipGridView(){
			return this.$refs.equipGrid.getGridView();
		},
		equipGridDataProvider(){
			return this.$refs.equipGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.$eventBus.on("TAB008000MenuMove", this.menuMove);
		this.equipGridView.columnByName("line").styleCallback = this.cellStyleCallbackLine;
		this.equipGridView.columnByName("설비번호").styleCallback = this.cellStyleCallbackEquipNo;
		this.equipGridView.onCellClicked = this.onCellClicked;		
		this.getSelectOptions();
		this.getDataList();
	},
	beforeUnmount() {
		this.$eventBus.off("TAB008000MenuMove");
	},
	methods: {
		menuMove(data) {
			this.$nextTick(()=>{
			});
		},
		initializeGrid() {
			this.equipGrid = _.cloneDeep(gridField);
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
			
			this.equipGridView.setColumnProperty("line", "editor", {
				type: "dropdown",
				textReadOnly: true,
				values: this.selectLineList.map(item=>item.itemValue),
				labels: this.selectLineList.map(item=>item.itemText)
			});			
		},
		async getDataList(){
			this.equipGridView.commit();

			let params = {
				line : this.searchLine
			};

			let param = {menuId:'M0002001',queryId:'selectEquipList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		cellStyleCallbackLine(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
		cellStyleCallbackEquipNo(grid, model) {
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

			if ( _.isEmpty(line) && ( clickData.fieldName.includes('공정') || clickData.fieldName === "area" )) {
				this.$toast("info", "Line을 먼저 선택하십시요!");
				return;
			} 
			if (clickData.fieldName.includes('공정') || clickData.fieldName === "area"){
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
		},
		handleConfirm(params){
			let data = {};
			let itemIndex = '';

			let checkRow = params.gridView.getCheckedRows(true);
			if (checkRow.length > 0) {
				if (params.gridJs === "CP0000000008.js" ) {
					data = params.dataProvider.getJsonRow(checkRow[0]);
					itemIndex = params.dataRow;
					this.equipGridView.setValue(itemIndex, "공정코드", data["공정코드"]);
					this.equipGridView.setValue(itemIndex, "공정명", data["공정명"]);
					this.equipGridView.setValue(itemIndex, "area", data["area"]);
					this.equipGridView.setValue(itemIndex, "areaCode", data["areaCode"]);
				}
			}	
		},		
		addRow() {
			this.equipGridView.commit();

			let newRow = {
				line: "DFB1",
				사용여부: "Y",
				생성일: this.$utils.getTodayDate("-"),
				생성자: this.userAuthInfo.userInfo.userName
			}
			this.equipGridDataProvider.addRow(newRow);
			let itemIdx = this.equipGridView.getItemCount() - 1;
			this.equipGridView.setCurrent({ itemIndex: itemIdx });
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
				if ( item.설비번호 === undefined || item.설비번호 === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 설비번호는 필수 입력입니다!");
					return true;
				}
				if ( item.설비명 === undefined || item.설비명 === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 설비명은 입력입니다!");
					return true;
				}	
				if ( item.설비약명 === undefined || item.설비약명 === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 설비약명은 필수 입력입니다!");
					return true;
				}
				if ( item.공정코드 === undefined || item.공정코드 === ''  ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Step은 필수 선택입니다!");
					return true;
				}																													
			});

			return !invalid;
		},	
		async saveData() {

			let result = false;

			let saveData = this.$refs.equipGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002001',
					delete: [{queryId:'deleteEquip', data:saveData.delete}],
					insert: [{queryId:'insertEquip', data:saveData.insert}],
					update: [{queryId:'updateEquip', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveEquipData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `[${response.data.resultData}] 관련 작업내역이 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Line-설비번호 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
						this.$toast("info", msg);
					}						
				}).catch((error) => {
					this.$toast("error", error);
				});

				return result;
			}
		},		

		searchClick() {
			this.getDataList();
		},

		addClick() {

			this.equipGridView.commit();
			this.addRow();
		},	
		delClick() {
			this.equipGridView.commit();
			const checkedRows = this.equipGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.equipGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.equipGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.equipGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.equipGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.equipGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");
		
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `equipList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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