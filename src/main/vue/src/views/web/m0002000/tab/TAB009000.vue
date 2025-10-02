/**
*	프로세스 플래닝 > 제품 모델 관리 > 모델 마스터
*/
<template>
	<div>
		<div class="search_box" >
			<b-row class="search_area">
				<b-col cols="2">
					<div class="form-floating">
						<input type="text" class="form-control label-60" id="floating" placeholder="Model" v-model="searchModel">
						<label for="floating">Model</label>
					</div>              
					</b-col>	
					<b-col cols="2">
					<div class="form-floating">
						<input type="text" class="form-control label-80" id="floating" placeholder="Model" v-model="searchDesc">
						<label for="floating">Description</label>
					</div>              
					</b-col>
					<b-col cols="2">
					<div class="form-floating">
						<input type="text" class="form-control label-60" id="floating" placeholder="Model" v-model="searchTrayCell">
						<label for="floating">Tray Cell</label>
					</div>              
				</b-col>
				<b-col cols="1">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="searchUseYn">
							<option v-for="item in USE_YN_OPTIONS" :value="item.value" :key="item.value">{{item.label}}</option>
						</select>
						<label for="floatingSelect" class="select">사용여부</label>
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
				<RealGrid ref="modelGrid" :uid="'modelGrid'" :step="'1'" :rows="gridRows" style="height:100%;" />
			</div>
		</div>
		<input type="file" accept="image/jpeg" ref="fileInput" @change="onFileChange" style="display:none;"/>
		<ModelFilmPreview ref="filmPreview"/>
	</div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0002000/js/TAB009000.js';
import ModelFilmPreview from '@web/popup/ModelFilmPreview.vue';
const URI_PREFIX = '/api/m0002000/m0002002';

export default {
	props: {},  
	components: {ModelFilmPreview},
	watch: {},
	setup() {
		const userAuthInfo = useUserAuthInfo();
		return { userAuthInfo };
    },
	data () {
		return {
			modelGrid:null,
			gridRows:[],
			searchModel:'',
			searchDesc:'',
			searchTrayCell:'',
			searchUseYn:'',
			USE_YN_OPTIONS:[{ label: "전체", value: "" },
							{ label: "Y", value: "Y" },
							{ label: "N", value: "N" }],
			uploadRow:null
		}
	},
	computed: {
		modelGridView(){
			return this.$refs.modelGrid.getGridView();
		},
		modelGridDataProvider(){
			return this.$refs.modelGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {

		this.modelGridView.columnByName("model").styleCallback = this.cellStyleCallbackModel;
		this.modelGridView.columnByName("code").styleCallback = this.cellStyleCallbackCode;

		this.getDataList();
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.modelGrid =  _.cloneDeep(gridField);
		},
		async getDataList(){
			this.modelGridView.commit();
			let params = {
				model: this.searchModel,
				desc: this.searchDesc,
				trayCell: this.searchTrayCell,
				useYn: this.searchUseYn
			};			
			let param = {menuId:'M0002002',queryId:'selectModelList', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},

		cellStyleCallbackModel(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},

		cellStyleCallbackCode(grid, model) {
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},		

		addRow() {
			this.modelGridView.commit();

			let newRow = {
				useYn: "Y",
				createDate: this.$utils.getTodayDate(),
				createName: this.userAuthInfo.userInfo.userName
			}
			this.modelGridDataProvider.addRow(newRow);
			let itemIdx = this.modelGridView.getItemCount() - 1;
			this.modelGridView.setCurrent({ itemIndex: itemIdx });
		},		
		checkValidData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}			

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
				if ( item.model === undefined || item.model === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Model 코드는 필수 입력입니다!");
					return true;
				}			
			});

			return !invalid;
		},

		async saveData() {

			let result = false;

			let saveData = this.$refs.modelGrid.getSaveData();

			if ( this.checkValidData(saveData) ) {

				let param = {
					menuId:'M0002002',
					delete: [{queryId:'deleteModel', data:saveData.delete}],
					insert: [{queryId:'insertModel', data:saveData.insert}],
					update: [{queryId:'updateModel', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveModelData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장완료 되었습니다!");
						result = true;
					}
					else if ( response.data.resultCode === "CHECK_DELETE") {
						const msg = `${response.data.resultData} Model은 관련 제품이 등록되어 있어 삭제할 수 없습니다` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT") {
						const msg = `[Model 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
						this.$toast("info", msg);
					}
					else if ( response.data.resultCode === "CHECK_INSERT_CODE") {
						const msg = `[Code 확인]\n[${response.data.resultData}] 이미 등록되어 있어 추가 등록할 수 없습니다!` ;
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

			this.modelGridView.commit();
			this.addRow();

		},	
		delClick() {
			this.modelGridView.commit();
			const checkedRows = this.modelGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.modelGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.modelGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.modelGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.modelGridView.commit();
			if( await this.saveData()) {
				this.searchClick();
			}
		},
		async excelClick(){

			const grid = this.modelGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `modelList_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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

		onCellItemClickedModelGrid(grid, index, clickData) {
			if(clickData.cellType !== "data") return;
			console.log("index",index);
			console.log("clickData",clickData);
			let ds = grid.getDataSource();
			this.uploadRow = ds.getJsonRow(index.dataRow);

			if(clickData.fieldName == 'imageUpload'){
				this.$refs.fileInput.click();
			}
			else if(clickData.fieldName == 'imageExist'){
				this.$refs.filmPreview.openDialog(this.uploadRow);
			}
			return true;
		},
		onFileChange(event) {
			const file = event.target.files[0];
			console.log(file);
			if (file) {
				this.$confirm("확인", "이미지 등록을 진행하시겠습니까?", async(confirm)=>{
				if(confirm){
					const formData = new FormData();
        			formData.append("image", file);
					formData.append("model", this.uploadRow.model);
					formData.append("code", this.uploadRow.code);
					try {
						const response = await this.$axios.post('/api/m0002000/m0002002/uploadFilmImage', formData, {
							headers: {
							'Content-Type': 'multipart/form-data',
							},
						});
						console.log(response.data);
						this.$toast("info", response.data);
					} catch (error) {
						console.error("업로드 실패", error);
						this.$toast("error", "이미지 업로드 실패");
					}
					this.searchClick();
				}
				});
			}
		},
	},
}

</script>