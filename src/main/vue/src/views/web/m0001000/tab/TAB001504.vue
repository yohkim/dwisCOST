/**
*	자재관리 > 부자재-필름 > 불량발생
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="4" class="period">        
                    <div class="label_title">작업 일자</div>                        
                    <div class=" form-floating me-1"> 
                        <date-picker label="시작일"  v-model="searchFromDate" />
                        <label for="floatingPicker">시작일</label>
                    </div>
                    ~
                  <div class=" form-floating ms-1 "> 
                        <date-picker label="종료일"  v-model="searchToDate" />
                        <label for="floatingPicker">종료일</label>
                    </div>  
                </b-col>
                <b-col cols="1">
                    <div class="form-floating">
                        <select class="form-select label-60 " id="floatingSelect" aria-label="Floating label select example" v-model="searchShift" >
                            <option v-for="item in shiftList" :value="item.itemValue" :key="item.itemText">{{item.itemText}}</option>
                        </select>
                        <label for="floatingSelect" class="select">근무조</label>
                    </div>
                </b-col>									
            </b-row>
            <div class="btn_area">
                <b-button @click="searchBtnClick"><span class="ico_search"></span>조회</b-button>
            </div>
        </div>
        <div class="grid_box search_onerow">
            <div class="left_box">
                <div class="btn_wrap ms-auto">
                    <b-button class="second" refs="btnExcel" @click="excelBtnClick">엑셀</b-button>
                   <!-- <b-button class="main" refs="btnSave" @click="saveBtnClick">저장</b-button>  -->
                </div>            
            </div> 
            <div class="grid-border-none">
                <RealGrid ref="matGrid" :uid="'matGrid'" :step="'1'" :rows="gridRows" style="height: 100%;"/>
            </div>
        </div>
    </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import gridField from '@web/m0001000/js/TAB001504.js';

const URI_PREFIX = '/api/m0001000/m0001004/TAB001504';
const MAT_TYPE_CODE = 'FILM';

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
			matGrid:null,
            gridRows:[],
            shiftList: [],
            searchFromDate: this.$utils.getWorkDate("-"), 
            searchToDate: this.$utils.getTodayDate("-"), 
            searchShift:'',	
			workDate:'',
			createUser: this.userAuthInfo.userInfo.userId,		
		}
	},
	computed: {
		matGridView(){
			return this.$refs.matGrid.getGridView();
		},
		matGridDataProvider(){
			return this.$refs.matGrid.getGridDataProvider();
		}
	},	
	created() {
		this.initializeGrid();
	},	
	mounted() {
		this.getSelectOptions();
		//this.matGridView.editOptions.commitByCell = true;
		this.matGridView.filteringOptions.automating.lookupDisplay = true;	
	},
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        async getSelectOptions(){

			let params = { majCode : "75"};
			let shiftInfo = [];

			let searchParam = [
				{ menuId:'CMDIALOG', queryId:'selectCommonCode', queryParams:params,
					callback: (data) => {
											this.$utils.transformData(
											data,
											["itemValue", "itemText"],
											["코드", "내용"],
											this.shiftList );
										}
				},
				{ menuId:'COMCODE', queryId:'selectShiftInfo', target:shiftInfo }
			];

			let resp = await this.$axios.api.searchAll(searchParam);
			this.searchShift = shiftInfo[0].shiftCode;

            this.shiftList.unshift({ itemValue:"", itemText:"전체" });

            this.getDataList();	  
		},
		
        async getDataList(){
			this.matGridView.commit();

			let params = {
				fromDate : this.searchFromDate.replaceAll('-',''),
                toDate : this.searchToDate.replaceAll('-',''),
				shiftCode : this.searchShift,
			};

			let param = {menuId:'M0001004',queryId:'selectMatFilmError', queryParams:params, target: this.gridRows};
			await this.$axios.api.search(param);
		},	

		checkValidSaveData(checkData) {

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

            return true;
		},    		
		
		async saveData() {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001004',
					update: [{queryId:'updateMatFilmError', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveErrorData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
						this.searchBtnClick();
					}  					
				}).catch((error) => {
					this.$toast("error", error);
				});

			}
		},

		searchBtnClick() {
            if(this.curMode == 'C' && this.matGridDataProvider.getRowCount() > 0){
                this.$confirm("확인", '저장하지 않은 데이터가 있습니다. 조회를 하시겠습니까?', (confirm)=>{
                    if(confirm){
                        this.getDataList();
                    }
                });
            }
			else {
                this.getDataList();
            }
		},   
		
        saveBtnClick(){
			this.matGridView.commit();

            this.$confirm("확인", "저장 하시겠습니까?", (confirm)=>{
                if(confirm){
                    this.saveData();
                }
            });            
    	},	
		
        async excelBtnClick(){

			const grid = this.matGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `필름_불량발생_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
		onDataLoadComplatedMatGrid(grid){}	
	},
}

</script>