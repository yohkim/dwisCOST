/**
*	자재관리 > 부자재 - Tray > Tray코드별 모델정보
*/
<template>
    <div>
        <div class="search_box" :class="{ disabled: isBarcodeMode }">
            <b-row class="search_area">
                <b-col cols="3">
                    <div class="form-floating">
						<input type="text" class="form-control label-80" id="floating" placeholder="Model" v-model="searchTrayCode">
						<label for="floating">Tray 코드</label>
                    </div>
                </b-col>
                <b-col cols="3">
                    <div class="form-floating">
						<input type="text" class="form-control label-80" id="floating" placeholder="Model" v-model="searchModel">
						<label for="floating">모델</label>
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
					<b-button class="second" @click="excelClick">엑셀</b-button>
					<b-button class="sub" @click="addClick">추가</b-button>
					<b-button @click="delClick">삭제</b-button>
					<b-button class="main" @click="saveClick">저장</b-button>           					
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
import gridField from '@web/m0001000/js/TAB001505.js';

const URI_PREFIX = '/api/m0001000/m0001005/TAB001505';

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
            searchTrayCode:'',
            searchModel:'',
            createUserId: this.userAuthInfo.userInfo.userId,
		}
	},
	computed: {
		matGridView(){
			return this.$refs.matGrid.getGridView();
		},
		matGridDataProvider(){
			return this.$refs.matGrid.getGridDataProvider();
		},
    },	
	created() {
		this.initializeGrid();
	},	
	mounted() {
        this.getSelectOptions();
    },
	beforeUnmount() {},
	methods: {
		initializeGrid() {
			this.matGrid = _.cloneDeep(gridField);
		},

        setCellStyleCallbackMatGrid(grid, cell){
            let rtn = {};
            let ds = grid.getDataSource();
            let jsonData = ds.getJsonRow(cell.index.dataRow);
            const fieldName = cell.index.fieldName;

            if ( fieldName === "trayCode" ) {
                
                if ( cell.item.rowState === RowState.CREATED ) {
                    rtn.editable = true;
                    rtn.styleName = "edit tc";
                }
                else {
                    rtn.editable = false;
                    rtn.styleName = "";   
                }    
            }

            return rtn;
        },

        async getSelectOptions(){
            this.getDataList();	  
		},  
        
        async getDataList(){
			this.matGridView.commit();
			let params = {
				trayCode : this.searchTrayCode,
                model    : this.searchModel,
			};

			let param = {menuId:'M0001005',queryId:'selectTrayCodeInfo', queryParams:params, target: this.gridRows};
            await this.$axios.api.search(param);
		},  
        
		addRow() {
			let newRow = {                
				createUserId: this.createUserId
			}
			this.matGridDataProvider.addRow(newRow);
			let itemIdx = this.matGridView.getItemCount() - 1;
			this.matGridView.setCurrent({ itemIndex: itemIdx });
		},

		checkValidSaveData(checkData) {

			let invalid = false;

			if ( checkData.delete.length <= 0 && checkData.insert.length <= 0 && checkData.update.length <= 0 ) {
				this.$toast('info', "변경 저장할 데이터가 없습니다!");
				return false;
			}

			invalid = checkData.insert.some((item, idx) => {
				let index = idx + 1;
				if ( item.trayCode === undefined || item.trayCode === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : Tray 코드는 필수 입력입니다!");
					return true;
				}
				if ( item.model === undefined || item.model === '' ) {
					this.$toast("info", index + "번째 추가 항목 확인 : 모델은 필수 입력입니다!");
					return true;
				}																
			});

			return !invalid;
		},            
        
		async saveData() {

			let saveData = this.$refs.matGrid.getSaveData();

			if ( this.checkValidSaveData(saveData) ) {

				let param = {
					menuId:'M0001005',
					delete: [{queryId:'deleteTrayCodeInfo', data:saveData.delete}],
					insert: [{queryId:'insertTrayCodeInfo', data:saveData.insert}],
					update: [{queryId:'updateTrayCodeInfo', data:saveData.update}],
				};

				await this.$axios.post(URI_PREFIX + "/saveTrayModelData", param).then((response) => {
					if ( response.data.resultCode === "SUCCESS" ) {
						this.$toast("info", "저장이 완료되었습니다!");
						this.searchBtnClick();
					}                 
					else if ( response.data.resultCode === "DUP_CODE") {

                        const msg = `[Tray코드 확인]\n[${response.data.resultData}] \n이미 등록된 코드입니다!` ;
						this.$toast("info", msg);
					}               					
				}).catch((error) => {
					this.$toast("error", error);
				});

			}            
		},         
        
		searchBtnClick() {
            this.getDataList();
		},   
		addClick() {

			this.matGridView.commit();
			this.addRow();

		},	
		delClick() {
			this.matGridView.commit();
			const checkedRows = this.matGridView.getCheckedRows();
			if ( checkedRows.length === 0 ) {
				this.$toast("info","삭제할 행을 선택하십시요!");
			}
			else {
				let delItems = [];
				checkedRows.forEach(itemIndex => {
					if ( this.matGridDataProvider.getRowState(itemIndex) === RowState.CREATED ) {
						delItems.push(itemIndex);
					}
					else {
						this.matGridDataProvider.setRowState(itemIndex, RowState.DELETED);
					}
				});
				this.matGridDataProvider.removeRows(delItems);
			}
		},	
		async saveClick(){

			this.matGridView.commit();
            this.$confirm("확인", "저장 하시겠습니까?", (confirm)=>{
                if(confirm){
                    this.saveData();
                }
            });  
		},
		async excelClick(){

			const grid = this.matGridView;

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate("");

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const fileName = `TrayCode별_모델정보_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
		} ,
		onDataLoadComplatedMatGrid(grid){}               
	},
}

</script>
