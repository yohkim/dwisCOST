/**
*	자재관리 > 원자재 > 원장정보등록
*/
<template>
	<div>
        <b-row class="row h_100">
            <b-col cols="4">
				<div class="grid_box thee_d_box">
					<div class="left_box">
						<div class="title">원장 컷팅 날짜 코드</div>
					</div>
					<div class="grid-border-none">
						<RealGrid ref="dateGrid" :uid="'dateGrid'" :step="3" :rows="dateGridRows" style="height:100%"/>
					</div>
				</div>
            </b-col> 
            <b-col cols="8">
				<div class="grid_box thee_d_box">
					<div class="left_box">
						<div class="title">원장 속성 정보</div>					
						<div class="btn_wrap ms-auto">
							<b-button class="second" @click="excelBtnClick">엑셀</b-button>
							<b-button class="second" @click="searchBtnClick">조회</b-button>
							<b-button class="sub" @click="addBtnClick"> 추가</b-button>
							<b-button @click="delBtnClick">삭제</b-button>
							<b-button class="main"  @click="saveBtnClick">저장</b-button>
						</div>            
					</div> 
					<div class="grid-border-none">
						<RealGrid ref="glsMstGrid" :uid="'glsMstGrid'" :step="3" :rows="glsMstGridRows" style="height:100%;"/>
					</div>
				</div>
            </b-col> 
        </b-row>
	</div>
</template>

<script>
import { RowState } from 'realgrid';
import dateGridField from '@web/m0001000/js/TAB001501_1.js';
import glsGridField from '@web/m0001000/js/TAB001501_2.js';

const URI_PREFIX = '/api/m0001000/m0001001/TAB001501';

export default {
	props: {},  
	components: {},
	watch: {},
	data () {
		return {
			dateGrid:null,
			glsMstGrid:null,
			dateGridRows:[],
			glsMstGridRows:[],
			materialList:[],
			thickList:[],
			selMajCode:'',
		}
	},
	computed: {
		dateGridView(){
			return this.$refs.dateGrid.getGridView();
		},
		dateGridDataProvider(){
			return this.$refs.dateGrid.getGridDataProvider();
		},
		glsMstGridView(){
			return this.$refs.glsMstGrid.getGridView();
		},
		glsMstGridDataProvider(){
			return this.$refs.glsMstGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.glsMstGridView.columnByName("glassCode").styleCallback = this.cellStyleCallEdit;
		// this.glsMstGridView.onValidateColumn = this.onValidateColumn;

		this.getSelectOptions();
		this.getDataList();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.dateGrid = _.cloneDeep(dateGridField);
			this.glsMstGrid = _.cloneDeep(glsGridField);
		},

		cellStyleCallEdit(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			rtn.styleName = model.item.rowState === RowState.CREATED ? "edit" : "";
			return rtn;
		},

		async getSelectOptions(){
			//공통코드 테이블에 재질과 두께가 있는데?????????????????????????
			let param1 = 
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{majCode : "09"}, 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.materialList	);
										}
				};
			
			let param2 = 
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:{majCode : "11"}, 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.thickList	);
										}
				};

			let param3 = {menuId:'M0001001',queryId:'getDateCodeList', queryParams:{}, target: this.dateGridRows};

			let resp = await this.$axios.api.searchAll([param1, param2, param3]);

		},

		async getDataList(){
			this.glsMstGridView.commit();

			let params = {
			};

			let param = {menuId:'M0001001',queryId:'getGlassMstList', queryParams:params, target: this.glsMstGridRows};
			await this.$axios.api.search(param);
		},

		searchBtnClick() {
			this.getDataList();
		},

		async excelBtnClick(){

			const grid = this.glsMstGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `원장정보_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

		addBtnClick() {
			this.glsMstGridView.commit();
			this.glsMstGridDataProvider.addRow({
			});
            let itemIndex = this.glsMstGridView.getItemCount() - 1;
			this.glsMstGridView.setCurrent({ itemIndex: itemIndex });
		},

		delBtnClick() {
			this.glsMstGridView.commit();
			const checkedRows = this.glsMstGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.glsMstGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.glsMstGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.glsMstGridDataProvider.removeRows(delItems);
			}
		},

		async saveBtnClick(){
			this.glsMstGridView.commitEditor();
			this.glsMstGridView.commit();
			if( await this.saveData()) {
				this.searchBtnClick();
			}
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.glsMstGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0001001',
					delete: [{queryId:'deleteGlassMst', data:saveData.delete}],
					insert: [{queryId:'insertGlassMst', data:saveData.insert}],
					update: [{queryId:'updateGlassMst', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "DUP_ERR") {
						const msg = `[PRODUCT CODE 확인]\n[${response.data.resultData}]\n이미 등록되어 있어 추가 등록할 수 없습니다!` ;
						this.$toast("info", msg);
					}						
				}).catch((error) => {
					this.$toast("error", error);
				});

				return result;
			}
		},

		checkValidData(checkData) {

            let invalid = false;

            if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
                this.$toast('info', "변경 저장할 데이터가 없습니다!");
                return false;
            }			

            invalid = checkData.insert.some((item, idx) => {
                let index = idx + 1;
                if ( item.glassCode === undefined || item.glassCode === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : PRODUCT CODE는 필수 입력입니다!");
                    return true;
                }																											
            });

            return !invalid;
        },

		onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
            // console.log('onValidateColumn===>', column);
			let error = {};
            var rowState = this.glsOutGridDataProvider.getRowState(dataRow);
            if(rowState != RowState.CREATED){
                return error;
            }

			if (column.fieldName === "glassCode") {
				if(_.isUndefined(value)){					
					error.level = "warning";
					error.message = "PRODUCT CODE를 입력하세요.";
					this.$toast("warn", (itemIndex+1) + "번째 Row : PRODUCT CODE를 입력하세요.");
				}
			}
			return error;
		},

		onDataLoadComplatedGlsMstGrid(grid){
			
		}

	},
}

</script>