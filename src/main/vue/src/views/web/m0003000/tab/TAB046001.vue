/**
*	제조 실적 입력 > Rework > M-BOX 관리
*/
<template>
	<div>
		<div class="search_box">
			<b-row class="search_area">
				<b-col cols="1" style="width:10%">
					<code-select :code="'36'" :label="'제품유형'" v-model="srchInfo.model" :isCodeText="true"/>
				</b-col>
				<b-col cols="2">
					<code-select ref="workType" :code="'31'" :label="'작업구분'" v-model="srchInfo.worktype"/>
				</b-col>
				<b-col cols="2">
					<code-select :code="'65'" :label="'R/W구분'" v-model="srchInfo.rw"/>
				</b-col>
				<b-col cols="3">
					<div class="d-flex">
						<code-select :codeList="selTypeList" :label="'선택'" class="me-2" v-model="selectedSelType" :oneRequired="true" style="width:40%"/>
						<div class="form-floating lot_run_num">
							<input type="text" class="form-control label-60" id="floating" placeholder=""
								v-model="srchInfo.no"
								@input="convertToUpperEnglish"
								name="no"
								data-group="srchInfo"
								>
							<label for="floating">{{ getNoLabel }}</label>
						</div>
					</div>
				</b-col>
				<b-col cols="3" class="period">
					<div class=" form-floating me-1">
						<date-picker label="시작일" v-model="srchInfo.startDate" />
						<label for="floatingPicker">시작일</label>
					</div>
					~
					<div class=" form-floating ms-1 ">
						<date-picker label="종료일" v-model="srchInfo.endDate" />
						<label for="floatingPicker">종료일</label>
					</div>
				</b-col> <!--
				<b-col cols="2" class="radio-group">
					<div label-for="searchDiv">
						<b-form-radio-group id="searchDiv" v-model="searchDiv" name="searchDiv" :options="searchDivList"></b-form-radio-group>
					</div>
				</b-col>
				<b-col cols="2" class="radio-group">
					<div label-for="createDiv">
						<b-form-radio-group id="createDiv" v-model="createDiv" name="createDiv" :options="createDivList"></b-form-radio-group>
					</div>
				</b-col> -->			
				</b-row>
			<div class="btn_area">
				<b-button @click="searchClick">
					<span class="ico_search"></span>
					조회
				</b-button> 
			</div>
		</div>
		<div class="grid_box search_onerow">
		<div class="left_box">
			<div class="btn_wrap ms-auto">
				<b-button @click="paidSalesClick" v-show="saleNdisassemble == true">유상판매</b-button>
				<b-button @click="disClick" v-show="saleNdisassemble == true">해체</b-button>
				<b-button @click="mCstMgmtClick" class="main">M-CST 관리</b-button>
				<b-button @click="mboxMngClick" class="main" @close="handlePopupClose">M-BOX 관리</b-button>
			</div>
		</div>

		<div class="grid-border-none">
			<div style="height: 210px">
				<RealGrid ref="gcGrid" :uid="'gcGrid'" :rows="genCntRows" style="height: 100%" />
			</div>
			      <!--div class="left_box"-->
        <div class="btn_wrap ms-auto">
          <!--b-button class="main" @click="quantityChangeClick" v-show="params.gubun == '미생성'">수량수정</b-button-->
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      <!--div-->
			<div class="top-border" style="border-top:1px solid #bcc0c8;height:calc(100% - 250px);">
		 	  <RealGrid ref="glGrid" :uid="'glGrid'" :rows="genRows" style="height: 100%" />
			</div>
		</div>
			</div>
		<MboxMng ref="mbmngPopup"/>
		<McstMng ref="mcmngPopup"/>
	</div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import MboxMng from "@web/popup/MboxMng";
import McstMng from "@web/popup/McstMng";
import { useM0003008 } from '@web/store/M0003008.js';

export default {
	setup() {
		const srchInfo = useM0003008();
		const userAuthInfo = useUserAuthInfo();
		
		return { 
			srchInfo,
			userAuthInfo 
		};
	},
	components: {
		MboxMng,McstMng
	},
	data () {
		return {
			gcGrid:null,
			genCntRows:[],
			glGrid:null,
			genRows:[],

			modelList:[],
			workTypeList:[],
			rwList:[],
			searchDiv: "sum",
			searchDivList: [
				{ text: '집계분', value: 'sum' },
				{ text: '상세분', value: 'dtl' },
			],
			createDiv:"nc",
			createDivList: [
				{ text: '생성분', value: 'c' },
				{ text: '미생성분', value: 'nc' },
			],
			selectedSelType:"1",
			selTypeList: [
				{ text: 'RunNo', value: '1' },
				{ text: 'CellNo', value: '2' },
				{ text: 'MBoxNo', value: '3' },
				{ text: 'MRunNo', value: '4' },
			],
			mboxNo:null,
			mrunNo:null,
			saleNdisassemble: false,
			user:null,
     		isExcelExportDisabled: true,
		}
	},
	computed: {
		getNoLabel(){
			let rtnStr = "";
			this.selTypeList.forEach(el => {
				if(el.value === this.selectedSelType){
					rtnStr = el.text;
				}
			});
			return rtnStr;
		},
	},	
	created() {		
		this.initializeGrid();
		this.user = this.userAuthInfo.loginUserName;		
	},	
	mounted() {
	},
	beforeUnmount() {},
	methods: {
		handlePopupClose(returnData) {
			//this.isPopupOpen = false;
			this.search(); // 팝업 닫힐 때 실행할 부모 메서드
			console.log('팝업에서 전달한 데이터:', returnData);
		},
		gv(nm){
			return this.$refs[nm].getGridView();	
		},
		dp(nm){
			return this.$refs[nm].getGridDataProvider();
		},
		initializeGrid() {
			this.gcGrid = _.cloneDeep(require(`@web/m0003000/js/TAB046001_1.js`));
			this.glGrid = _.cloneDeep(require(`@web/m0003000/js/TAB046001_2.js`));
		},
		async excelClick() {
			const grid = this.gv('glGrid');

			const now = new Date();
			const yyyymmdd = this.$utils.getTodayDate();

			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');

			const fileName = `MBOX관리_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

			const options = {
				type: 'excel',
				target: 'local',
				fileName: fileName,
				progressMessage: '엑셀 Export중입니다.',
				done: function () {
				alert('엑셀 내보내기가 완료되었습니다!');
				},
			};

		grid.exportGrid(options);
		},
		searchClick(){ //this.$toast('info',this.getWorkType()); return;
			this.search();
		},
		search(){
			let qp = {};
			qp['selectedModel'] = this.srchInfo.model+'.'+this.getWorkType();
			qp['no'] = this.srchInfo.no;
			qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			qp['selectedSelType'] = this.selectedSelType
			qp['selectedWorktype'] =this.getWorkType();
			let param = {menuId:'M0003008',queryId:'selectMboxGenCount',queryParams:qp, target: this.genCntRows};
			let result = this.$axios.api.search(param);
			
			if (result.length == 0) {
			this.isExcelExportDisabled = true;
			return;
			}
			this.isExcelExportDisabled = false;
		},
		onCellClickedGcGrid(grid, clickData){
			if(clickData.cellType === 'header'){
				return;
			}

			if(['code','구분'].indexOf(clickData.column) > -1){
				return;
			}
			//clickData.column
			let qp = {};
			if(clickData.itemIndex === 3 || clickData.itemIndex === 5)
				qp['selectedModel'] = this.srchInfo.model+'.'+this.getWorkType();
			else
				qp['selectedModel'] = this.srchInfo.model;
			qp['no'] = this.srchInfo.no;
			qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			if(clickData.itemIndex === 4 || clickData.itemIndex === 5)
				qp['selectedSelType'] = '5';
			else 
				qp['selectedSelType'] = this.selectedSelType;
			qp['selectedWorktype'] =this.getWorkType();
			qp['scrapCode'] = clickData.column;
			
			this.mboxNo = null;
			this.mrunNo = null;
			let qi = "";
			//if(this.searchDiv === 'sum' && this.createDiv === 'c'){	//집계분,생성분
			if(clickData.itemIndex === 2 || clickData.itemIndex === 4){
				this.saleNdisassemble = false;
				qi = "selectMboxGenSum";
			}else //if(this.searchDiv === 'dtl' && this.createDiv === 'c'){	//상세분,생성분
			if(clickData.itemIndex === 3 || clickData.itemIndex === 5){
				this.saleNdisassemble = false;
				qi = "selectMboxGenList";
			}else //if(this.searchDiv === 'dtl' && this.createDiv === 'nc'){	//상세분,미생성분
			if(clickData.itemIndex === 1){
				this.saleNdisassemble = true;
				qi = "selectMboxNoGenList";
			}else //if(this.searchDiv === 'sum' && this.createDiv === 'nc'){	//집계분,미생성분
			if(clickData.itemIndex === 0){
				this.saleNdisassemble = true;
				qi = "selectMboxNoGenSum";
			}else
				return;

			let param = {menuId:'M0003008',queryId:qi,queryParams:qp, target: this.genRows};
			this.$axios.api.search(param);	
		},onCellClickedGlGrid(grid, clickData){
			if(clickData.cellType === 'header'){
				return;
			}
			const current = grid.getCurrent();
			const rowIndex = current.itemIndex;	
			this.mboxNo = grid.getValue(rowIndex,"mboxNo");	
			this.mrunNo = grid.getValue(rowIndex,"after");
			//this.$toast("info","MBOX()"+this.mboxNo+"),MRUN("+this.mrunNo+")가 선택 되었습니다");
		},	
		async mboxMngClick(){
			if(_.isEmpty(this.srchInfo.model)){
				this.$toast("info","선택된 제품유형이 없습니다.");
				return;
			}
			if(_.isEmpty(this.srchInfo.worktype)){
				this.$toast("info","선택된 작업구분이 없습니다.");
				return;
			}
			if(_.isEmpty(this.srchInfo.rw )){
				this.$toast("info","선택된 R/W가 없습니다.");
				return;
			}
			let params = {};
			params['selectedModel'] = this.srchInfo.model;
			params['runNo'] = this.srchInfo.no;
			params['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			params['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			params['selectedWorktype'] =this.getWorkType();
			params['selectedRw'] = this.srchInfo.rw;
			//this.$refs.mbmngPopup.openDialog(params);
			 try {
				// 팝업 열기 (Promise 반환)
				const result = await this.$refs.mbmngPopup.openDialog(params);
				
				// 팝업이 정상적으로 닫힌 후 실행할 코드
				//this.parentMethodAfterClose();
				this.search(); // 예: 검색 메서드 재실행
				
				// 필요시 팝업에서 반환한 데이터 사용
				if (result) {
				console.log('팝업에서 반환한 데이터:', result);
				}
			} catch (error) {
				console.error('팝업 처리 중 오류:', error);
				this.$toast.error('팝업 처리에 실패했습니다');
			}
		},
		getWorkType(){
			return String(this.$refs.workType.selectedText).substring(2,1);
		},
		convertToUpperEnglish(event) {
			const group = event.target.dataset.group; // params 또는 params1 판별
			const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
			if (group && this[group]) {
				this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
			}
		},
		paidSalesClick(){
			if(_.isNil(this.mboxNo) || this.mboxNo.indexOf('계') !== -1){
				this.$toast("info","먼저 M BOX NO 컬럼에서 유상판매할 M-BOX NO를 선택 하세요");
				return;
			}else if(!_.isNil(this.mrunNo) && this.mrunNo !==''){
				this.$toast("info","MBOX("+ this.mboxNo+ ")는 이미 MRUN("+this.mrunNo+ ") 으로 구성 되었습니다");
				return;
			}
			//this.$toast("info",this.user);
			this.$confirm(
			"확인",
			`선택하신 MBOX(${this.mboxNo})를 유상판매하시겠습니까?`,
			async (confirm) => {
				if (!confirm) {
				this.$toast("info", `${this.mboxNo} 유상판매 처리를 취소하였습니다`);
				return;
				}

				// 로딩 상태 표시
				//this.$toast("loading", "처리 중입니다...");

				try {
				const param = {
					menuId: 'M0003008',
					queryId: 'execMboxPaidSales',
					queryParams: { mboxNo: this.mboxNo, username: this.user },
					target: null
				};

				const resp = await this.$axios.api.search(param);
				
				if (resp[0]?.errormessage) {
					throw new Error(resp[0].errormessage);
				}

				const successMessage = resp[0]?.message || `${this.mboxNo} 유상판매 처리가 완료되었습니다`;
				this.$toast("success", successMessage);

				} catch (error) {
				console.error("MBOX 유상판매 실패:", error);
				const errorMessage = error.message || "에러가 발생했습니다. 다시 시도해주세요.";
				this.$toast("error", errorMessage);
				return; // 추가 처리 방지
				
				} finally {
				// 데이터 리프레시
				this.dp('glGrid').clearRows();
				this.search();
				}
			}
			);
		},
		disClick(){
			if(_.isNil(this.mboxNo) || this.mboxNo.indexOf('계') !== -1){
				this.$toast("info","먼저 M BOX NO 컬럼에서 해체할 M-BOX NO를 선택 하세요");
				return;
			}else if(!_.isNil(this.mrunNo) && this.mrunNo !==''){
				this.$toast("info","MBOX("+ this.mboxNo+ ")는 이미 MRUN("+this.mrunNo+ ") 으로 구성 되었습니다");
				return;
			}
			this.$confirm(
			"확인",
			`선택하신 MBOX(${this.mboxNo})를 해체하시겠습니까?`,
			async (confirm) => {
				if (!confirm) {
				this.$toast("info", `${this.mboxNo} 해체 처리를 취소하였습니다`);
				return;
				}

				// 로딩 상태 표시
				//this.$toast("loading", "처리 중입니다...");

				try {
				const param = {
					menuId: 'M0003008',
					queryId: 'execMboxDisassembly',
					queryParams: { mboxNo: this.mboxNo },
					target: null
				};

				const resp = await this.$axios.api.search(param);
				
				if (resp[0]?.errormessage) {
					throw new Error(resp[0].errormessage);
				}

				const successMessage = resp[0]?.message || `${this.mboxNo} 해체 처리가 완료되었습니다`;
				this.$toast("success", successMessage);

				} catch (error) {
				console.error("MBOX 해체 실패:", error);
				const errorMessage = error.message || "에러가 발생했습니다. 다시 시도해주세요.";
				this.$toast("error", errorMessage);
				return; // 추가 처리 방지
				
				} finally {
				// 데이터 리프레시
				this.dp('glGrid').clearRows();
				this.search();
				}
			}
			);
		},
		mCstMgmtClick(){
			// this.$toast("info","기능 준비중입니다.");
			// return;
			if(_.isEmpty(this.srchInfo.model)){
				this.$toast("info","선택된 제품유형이 없습니다.");
				return;
			}
			if(_.isEmpty(this.srchInfo.worktype)){
				this.$toast("info","선택된 작업구분이 없습니다.");
				return;
			}
			if(_.isEmpty(this.srchInfo.rw )){
				this.$toast("info","선택된 R/W가 없습니다.");
				return;
			}
			let params = {};
			params['selectedModel'] = this.srchInfo.model;
			params['selectedWorktype'] =this.getWorkType();
			params['selectedRw'] = this.srchInfo.rw;
			params['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			params['endDate'] = this.srchInfo.endDate.replace(/-/g, "");

			this.$refs.mcmngPopup.openDialog(params);
		},
	},
}

</script>
<style lang="scss">
.radio-group{
	margin-top: 10px;
	max-width: 200px;
}
</style>
<style lang="scss" scoped>
::v-deep .grid_box{
	&.search_tworow{
		height: calc(100% - 100px);
	}
}
</style>
	