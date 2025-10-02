/**
*	기준정보 > 거래처 마스터
*/
<template>
	<div>
		<div class="search_box" >
			<b-row class="search_area">
				<b-col cols="2">
					<div class="form-floating">
						<select class="form-select label-80 " id="floatingSelect" aria-label="Floating label select example" v-model="selTradeCode" @change="searchBtnClick">
							<option v-for="item in tradeList" :value="item.itemValue" :key="item.itemValue">{{item.itemText}}</option>
						</select>
						<label for="floatingSelect" class="select">거래처분류</label>
					</div>
				</b-col>
				<b-col cols="2">
					<div class="form-floating">
						<input type="text" class="form-control label-80" id="floating" placeholder="Model" v-model="searchName" @keyup.enter="searchBtnClick">
						<label for="floating">거래처명</label>
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
				<RealGrid ref="venderGrid" :uid="'venderGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
				<CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
			</div>
		</div>  
	</div>
		
</template>

<script>
import { RowState } from 'realgrid';
import gridField from '@web/m0006000/js/M0006003.js';

const URI_PREFIX = '/api/m0006000/m0006003';

export default {
	props: {},  
	components: {},
	watch: {},
	data () {
		return {
			venderGrid:null,
			gridRows:[],
			tradeList:[],
			selTradeList:[],
			selTradeCode:'',
			searchName:'',
		}
	},
	computed: {
		venderGridView(){
			return this.$refs.venderGrid.getGridView();
		},
		venderGridDataProvider(){
			return this.$refs.venderGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.venderGridView.columnByName("거래처코드").styleCallback = this.cellStyleCallEdit;

		this.getSelectOptions();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.venderGrid = _.cloneDeep(gridField);
		},

		cellStyleCallEdit(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			rtn.styleName = model.item.rowState === RowState.CREATED ? "edit" : "";
			return rtn;
		},

		async getSelectOptions(){

			let param = { majCode : "07"};

			let searchParam = 
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:param,
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.selTradeList	);
										}
				};

			// console.log(searchParam);

			let resp = await this.$axios.api.search(searchParam);

			this.tradeList.push({ itemValue:"", itemText:"전체" });
			this.tradeList.push(...this.selTradeList	);		
			
			this.venderGridView.setColumnProperty("거래처분류", "values", 
				this.selTradeList.map(item=>item.itemValue)
			);
			this.venderGridView.setColumnProperty("거래처분류", "labels", 
				this.selTradeList.map(item=>item.itemText)
			);

			this.getDataList();
		},

		async getDataList(){
			this.venderGridView.commit();

			let params = {
				tradeCode : this.selTradeCode,
				name : this.searchName
			};

			let param = {menuId:'M0006003',queryId:'getVendorMstList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		searchBtnClick() {
			this.getDataList();
		},

		async excelBtnClick(){

			const grid = this.venderGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `vendorList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
			this.venderGridView.commit();
			this.venderGridDataProvider.addRow({
				'거래여부': true,
				'부가세적용여부': true,
				'금액표기여부': true,
			});
			let itemIndex = this.venderGridView.getItemCount() - 1;
			this.venderGridView.setCurrent({ itemIndex: itemIndex });
		},

		delBtnClick() {
			this.venderGridView.commit();
			const checkedRows = this.venderGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.venderGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.venderGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.venderGridDataProvider.removeRows(delItems);
			}
		},

		async saveBtnClick(){
			this.venderGridView.commit();
			if( await this.saveData()) {
				this.searchBtnClick();
			}
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.venderGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0006003',
					delete: [{queryId:'deleteVendorMst', data:saveData.delete}],
					insert: [{queryId:'insertVendorMst', data:saveData.insert}],
					update: [{queryId:'updateVendorMst', data:saveData.update}],
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
                if ( item.거래처코드 === undefined || item.거래처코드 === '' ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 코드는 필수 입력입니다!");
                    return true;
                }
                if ( item.거래처명 === undefined || item.거래처명 === ''  ) {
                    this.$toast("info", index + "번째 추가 항목 확인 : 거래처명은 필수 입력입니다!");
                    return true;
                }																												
            });

            return !invalid;
        },
	},
}

</script>