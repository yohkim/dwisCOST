/*
* 기준정보 > 불량사유 코드
*/
<template>
	<div>
		<div class="search_box" >
			<b-row class="search_area">
				<b-col cols="2">
					<div class="form-floating">
						<input autocomplete="off" type="text" class="form-control label-80" id="floating" placeholder="Model" v-model="searchDefectNm" @keyup.enter="searchBtnClick">
						<label for="floating">불량명</label>
					</div> 
				</b-col>
			</b-row>
			<div class="btn_area">
				<b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>         
			</div> 	
		</div>
		<div class="grid_box search_onerow">
			<div class="left_box ">
				<div class="btn_wrap ms-auto">
					<b-button class="second" @click="excelBtnClick">엑셀</b-button>
					<b-button class="sub" @click="addBtnClick">추가</b-button>
					<b-button @click="delBtnClick">삭제</b-button>
					<b-button class="main" @click="saveBtnClick">저장</b-button>                       
				</div>            
			</div>
			<div class="grid-border-none">
				<RealGrid ref="defectCdGrid" :uid="'defectCdGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
				<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			</div>
		</div>  
	</div>
		
</template>

<script>
import { RowState } from 'realgrid';
import gridField from '@web/m0006000/js/M0006005.js';

const URI_PREFIX = '/api/m0006000/m0006005';

export default {
	props: {},  
	components: {},
	watch: {},
	data () {
		return {
			defectCdGrid:null,
			gridRows:[],
			searchDefectNm:'',
		}
	},
	computed: {
		defectCdGridView(){
			return this.$refs.defectCdGrid.getGridView();
		},
		defectCdGridDataProvider(){
			return this.$refs.defectCdGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.defectCdGridView.columnByName("불량코드").styleCallback = this.cellStyleCallEdit;

		this.getDataList();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.defectCdGrid = _.cloneDeep(gridField);
		},

		cellStyleCallEdit(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			rtn.styleName = model.item.rowState === RowState.CREATED ? "edit" : "";
			return rtn;
		},

		async getDataList(){
			this.defectCdGridView.commit();

			let params = {
				defectNm : this.searchDefectNm
			};

			let param = {menuId:'M0006005',queryId:'getDefectCdList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		searchBtnClick() {
			this.getDataList();
		},

		async excelBtnClick(){

			const grid = this.defectCdGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `defectCodeList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
			this.defectCdGridView.commit();
			this.defectCdGridDataProvider.addRow({
				'검사불량': false,
				'일반불량': false,
				'사용여부': true,
			});
			let itemIndex = this.defectCdGridView.getItemCount() - 1;
			this.defectCdGridView.setCurrent({ itemIndex: itemIndex });
		},

		delBtnClick() {
			this.defectCdGridView.commit();
			const checkedRows = this.defectCdGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.defectCdGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.defectCdGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.defectCdGridDataProvider.removeRows(delItems);
			}
		},

		async saveBtnClick(){
			this.defectCdGridView.commit();
			if( await this.saveData()) {
				this.searchBtnClick();
			}
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.defectCdGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0006005',
					delete: [{queryId:'deleteDefectCd', data:saveData.delete}],
					insert: [{queryId:'insertDefectCd', data:saveData.insert}],
					update: [{queryId:'updateDefectCd', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[불량코드 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
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
                if ( item.불량코드 === undefined || item.불량코드 === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 불량코드는 필수 입력입니다!");
                    return true;
                }																											
            });

            return !invalid;
        },
	},
}

</script>