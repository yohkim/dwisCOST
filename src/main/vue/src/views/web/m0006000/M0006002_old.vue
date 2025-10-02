/**
*	기준정보 > 일반코드
*/
<template>
	<div>
		<div class="search_box" >
			<b-row class="search_area">
				<b-col cols="2">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="selMajCode" @change="searchClick">
							<option v-for="item in majCdList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
						</select>
						<label for="floatingSelect" class="select">대분류</label>
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
					<b-button class="second" @click="excelBtnClick">엑셀</b-button>
					<b-button class="sub" @click="addBtnClick">추가</b-button>
					<b-button @click="delBtnClick">삭제</b-button>
					<b-button class="main" @click="saveBtnClick">저장</b-button>                       
				</div>            
			</div>
			<div class="grid-border-none">
				<RealGrid ref="cdGrid" :uid="'cdGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
				<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			</div>
		</div>  
	</div>
		
</template>

<script>
import { RowState } from 'realgrid';
import gridField from '@web/m0006000/js/M0006002.js';

const URI_PREFIX = '/api/m0006000/m0006002';

export default {
	props: {},  
	components: {},
	watch: {},
	data () {
		return {
			cdGrid:null,
			gridRows:[],
			majCdList:[],
			selMajCode:'',
		}
	},
	computed: {
		cdGridView(){
			return this.$refs.cdGrid.getGridView();
		},
		cdGridDataProvider(){
			return this.$refs.cdGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.cdGridView.columnByName("code").styleCallback = this.cellStyleCallEdit;
		this.cdGridView.columnByName("codeName").styleCallback = this.cellStyleCallEdit;

		this.getSelectOptions();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.cdGrid = _.cloneDeep(gridField);
		},

		cellStyleCallEdit(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			rtn.styleName = model.item.rowState === RowState.CREATED ? "edit" : "";
			return rtn;
		},

		async getSelectOptions(){

			let searchParam = 
				{ menuId:'M0006002', queryId:'getMajCodeList', 
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["majCode", "majCodeName"],
											this.majCdList	);
										}
				};

			// console.log(searchParam);

			let resp = await this.$axios.api.search(searchParam);
			
			if(this.majCdList.length > 0){
				this.selMajCode = this.majCdList[0].itemValue;
				this.getDataList();
			}
		},

		async getDataList(){
			this.cdGridView.commit();

			let params = {
				majCode : this.selMajCode
			};

			let param = {menuId:'M0006002',queryId:'getCommCodeList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		searchClick() {
			this.getDataList();
		},

		async excelBtnClick(){

			const grid = this.cdGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `commonCodeList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
			this.cdGridView.commit();
			this.cdGridDataProvider.addRow({
				majCode: this.selMajCode,
				useYn: true,
			});
            let itemIndex = this.cdGridView.getItemCount() - 1;
			this.cdGridView.setCurrent({ itemIndex: itemIndex });
		},

		delBtnClick() {
			this.cdGridView.commit();
			const checkedRows = this.cdGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.cdGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.cdGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.cdGridDataProvider.removeRows(delItems);
			}
		},

		async saveBtnClick(){
			this.cdGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.cdGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0006002',
					delete: [{queryId:'deleteCommCode', data:saveData.delete}],
					insert: [{queryId:'insertCommCode', data:saveData.insert}],
					update: [{queryId:'updateCommCode', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[코드 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
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
                if ( item.code === undefined || item.code === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 코드는 필수 입력입니다!");
                    return true;
                }
                if ( item.codeName === undefined || item.codeName === ''  ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 코드명은 필수 입력입니다!");
                    return true;
                }																												
            });

            return !invalid;
        },
	},
}

</script>