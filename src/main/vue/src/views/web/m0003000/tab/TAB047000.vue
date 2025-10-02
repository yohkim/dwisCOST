/**
*	제조 실적 입력 > Rework > M-RUN 발행
*/
<template>
	<div>
		<div class="search_box">
			<b-row class="search_area">
				<b-col cols="1">
					<code-select :code="'36'" :label="'제품유형'" v-model="srchInfo.model" :isCodeText="true" />
				</b-col>
				<b-col cols="2">
					<code-select ref="workType" :code="'31'" :label="'작업구분'" v-model="srchInfo.worktype" />
				</b-col>
				<b-col cols="2">
					<code-select :code="'65'" :label="'R/W구분'" v-model="srchInfo.rw" />
				</b-col>
				<b-col cols="3">
					<div class="d-flex">
						<code-select :codeList="selTypeList" :label="'선택'" class="me-2" v-model="selectedSelType"
							:oneRequired="true" />
						<div class="form-floating  lot_run_num">
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
				</b-col>
				<!--b-col cols="2" class="radio-group">
					<div label-for="radio-options">
						<b-form-radio-group id="radio-options" v-model="createDiv" name="radioGroup1"
							:options="createDivList"></b-form-radio-group>
					</div>
				</b-col-->	
			</b-row>
			<div class="btn_area">
				<b-button @click="searchClick">
					<span class="ico_search"></span>
					조회
				</b-button>
			</div>
		</div>
		<div class="grid_box search_onerow">
			<div class="grid-border-none">
				<b-row style="height: 170px">
					<b-col>
						<RealGrid ref="gcGrid" :uid="'gcGrid'" :rows="genCntRows" style="height: 100%" />
					</b-col>
				</b-row>
				<b-row style="height: 250px" class="mt-2">
					<b-col>
						<div class="left_box">
							<div class="title">M-RUN 발행</div>
							<div class="ms-auto">
								<b-button class="second" @click="displayProcessPlan">공정확인</b-button>
								<b-button v-show="createDiv === 'nc'" class="main" @click="mrunGenerate">생성처리</b-button>
							</div>
						</div>
						<RealGrid ref="mrGrid" :uid="'mrGrid'" :rows="mrRows"  style="height:calc(100% - 40px)" />
					</b-col>
				</b-row>
				<b-row style="height:calc(100% - 435px)" class="mt-2">
					<b-col>
					<div class="left_box">
						<div class="title">RUN CARD</div>
							<div class="ms-auto">
								<b-button @click="printRunCard" class="second">미리보기</b-button>
								<b-button @click="printRunCard" class="main">인쇄</b-button>
								<b-button @click="delClick">삭제</b-button>
								<b-button class="main" @click="saveClick"> 저장</b-button>
							</div>
						</div>
						<RealGrid ref="rcGrid" :uid="'rcGrid'" :rows="rcRows"  style="height:calc(100% - 40px)" />
					</b-col>
				</b-row>
			</div>
		</div>
		<CmDialog1 ref="cmDialog1TAB047000" @confirm="handleConfirm" />
		<mRunCard ref="mRunCard"/>
	</div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0003008 } from '@web/store/M0003008.js';
import { RowState } from 'realgrid';
import mRunCard from "./M_RunCard.vue";

export default {
	setup() {
		// const srchInfo = useM0003008();
		// return {srchInfo};
		
		const srchInfo = useM0003008();
		const userAuthInfo = useUserAuthInfo();
		
		return { 
		srchInfo,
		userAuthInfo 
		};
	},
	components: {
		mRunCard
	},
	watch: {},
	data () {
		return {
			gcGrid:null,
			genCntRows:[],
			mrGrid:null,
			mrRows:[],
			rcGrid:null,
			rcRows:[],

			modelList:[],
			workTypeList:[],
			rwList:[],
			
			createDiv: "nc",
			createDivList: [
				{ text: '생성분', value: 'c' },
				{ text: '미생성', value: 'nc' },
			],
			selectedRw:"",
			selectedSelType:"1",
			selTypeList: [
				{ text: 'RunNo', value: '1' },
				{ text: 'CellNo', value: '2' },
				{ text: 'MBoxNo', value: '3' },
			],
			selectedRunNo:null,
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
		isNotCreatedMode() {
			return this.createDiv === 'nc';
		}
	},	
	created() {		
		this.initializeGrid();		
	},	
	mounted() {
		this.gv("rcGrid").columnByName('특기사항').styleCallback = this.cellStyleCallback;
	},
	beforeUnmount() {},
	methods: {
		gv(nm){
			return this.$refs[nm].getGridView();	
		},
		dp(nm){
			return this.$refs[nm].getGridDataProvider();
		},
		initializeGrid() {
			this.gcGrid = _.cloneDeep(require(`@web/m0003000/js/TAB046001_1.js`));
			this.mrGrid = _.cloneDeep(require(`@web/m0003000/js/TAB047000_1.js`));
			this.rcGrid = _.cloneDeep(require(`@web/m0003000/js/TAB047000_3.js`));
		},
		searchClick(){
			this.search();
		},
		search(){
			let qp = {};
			qp['selectedModel'] = this.srchInfo.model;
			qp['no'] = this.srchInfo.no;
			qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			qp['selectedSelType'] = this.selectedSelType
			qp['selectedWorktype'] =this.getWorkType();
			qp['rwClass']='_';
			
			let param1 = {menuId:'M0003008',queryId:'selectMboxGenCount',queryParams:qp, target: this.genCntRows};
			let param2 = {menuId:'M0003008',queryId:'selectMrunbox',queryParams:qp, target: this.mrRows};
			let param3 = {menuId:'M0003008',queryId:'selectMrunboxInfo',queryParams:qp, target: this.rcRows};
			
			this.$axios.api.searchAll([param1,param2,param3]);
			
			this.createDiv = 'nc';	
		},
		onCellClickedGcGrid(grid, clickData){
			//todo?
		},
		getWorkType(){
			return String(this.$refs.workType.selectedText).substring(2,1);
		},
		async displayProcessPlan(){
			let params = {
				dialogTitle: "공정확인",
				step: 7,
				height: 500,
				width: 700,
				gridJs: `CP0000000013.js`,
				search: { menuId: "M0003008", queryId: "getProcessPlan",queryParams:null },
			};
			this.$refs.cmDialog1TAB047000.openDialog(params);
		},
		async mrunGenerate(){
			let checkRows = this.gv('mrGrid').getCheckedRows(true);

			if(_.isEmpty(checkRows)){
				this.$toast("info","선택된 MBOX가 없습니다.")
				return;
			}

			let mboxNoList = [];
			checkRows.forEach(row => {
				mboxNoList.push(this.gv('mrGrid').getValue(row, "mboxNo"));
			});
			
			try {
					let qp = {};
					qp['mboxNoList'] = mboxNoList.join(',');					
					qp['issuer'] = this.userAuthInfo.loginUserName; //M-RUN발행자(로그인 USER)
					let param = {menuId:'M0003008',queryId:'execMrunGenerate',queryParams:qp, target: null};
					let rslt = await this.$axios.api.search(param);	
					console.log(JSON.stringify( rslt[0]?.message, null, 2));
					if (rslt[0]?.errormessage) {
						throw new Error(rslt[0].errormessage);
					} else if (rslt[0]?.message) {
						this.$toast("info", rslt[0]?.message);
						return;
					}
					if (!_.isEmpty(rslt) && rslt[0] && typeof rslt[0] === 'object') {
						const originalObj = rslt[0];
						
						// 원본 객체를 복사하여 새 객체 생성 (원본 변경 방지)
						const newObj = { ...originalObj };

						// 필드명 매핑 정의 (유지보수성 향상)
						const fieldMappings = {
							'등록일시': '승인일자',
							'내용': '모델',
							'제품inch': 'inch',
							'제품버젼': '버전',
							'제품규격': '규격',
							'입고일자': { field: 'date', transform: (v) => v.replace(/-/g, '') },
							'입고시각': { field: 'time', transform: (v) => v.replace(/[\s:]/g, '') },
							'작업일자': { field: 'date1', transform: (v) => v.replace(/-/g, '') },
							'작업시각': { field: 'time1', transform: (v) => v.replace(/[\s:]/g, '') },
							'발행자': '담당자',
							'특기사항': '특이사항'
						};

						// 매핑 적용
						Object.entries(fieldMappings).forEach(([newKey, mapping]) => {
							if (typeof mapping === 'string') {
								if (originalObj.hasOwnProperty(mapping)) {
									newObj[newKey] = originalObj[mapping];
								}
							} else if (mapping.transform && originalObj.hasOwnProperty(mapping.field)) {
								newObj[newKey] = mapping.transform(originalObj[mapping.field]);
							}
						});

						// 그리드에 안전하게 추가
						const grid = this.dp('rcGrid');
						if (grid && typeof grid.insertRow === 'function') {
							grid.insertRow(0, newObj);
						} else {
							console.error('Grid or insertRow method not available');
						}
						
						this.$toast("info",[rslt.length +"건 생성처리 되었습니다.\n특이사항 입력후 저장클릭 하면 M-RUN발행 됩니다"]);
						this.createDiv = 'c';
					}
				} catch (error) {
					console.error("MBOX 유상판매 실패:", error);
					const errorMessage = error.message || "에러가 발생했습니다. 다시 시도해주세요.";
					this.$toast("error", errorMessage);
					return; // 추가 처리 방지				
				} finally {
					// 데이터 리프레시
					//this.dp('glGrid').clearRows();
					//this.search();
				}
			// console.log(rslt);
			//this.$toast("info",rslt.length +"건 생성처리 되었습니다.");

			// if(!_.isEmpty(rslt)){
			// 	let newObj = rslt[0];
				
			// 	//필드명 맵핑 후 추가
			// 	newObj['등록일시'] = newObj['승인일자'];
			// 	newObj['내용'] = newObj['모델'];
			// 	newObj['제품inch'] = newObj['inch'];
			// 	newObj['제품버젼'] = newObj['버전'];
			// 	newObj['제품규격'] = newObj['규격'];
			// 	newObj['입고일자'] = newObj['date'].replace(/-/g, ""); ;
			// 	newObj['입고시각'] = newObj['time'].replace(/[\s:]/g, "");
			// 	newObj['작업일자'] = newObj['date1'].replace(/-/g, ""); ;
			// 	newObj['작업시각'] = newObj['time1'].replace(/[\s:]/g, "");
			// 	newObj['발행자'] = newObj['담당자'];
			// 	newObj['특기사항'] = newObj['특이사항'];
				
			// 	this.dp('rcGrid').insertRow(0,newObj);
			// }
		},

		cellStyleCallback(grid, model){
			let rtn = {};
			rtn['editable'] = model.item.rowState === RowState.CREATED;
			return rtn;
		},
		async saveClick(){
			this.gv('rcGrid').commit();
			if(this.dp('rcGrid').getRowState(0) !== RowState.CREATED){
				this.$toast('info','생성된 M-RUN이 없습니다.');
				return;
			}

			let mboxNoList = [];
			let qp = {};
			for(let i = 1; i <= 8 ; i++){
				let tempNo = this.gv('rcGrid').getValue(0,'box-no'+i);	
				if(!_.isEmpty(tempNo)){
					mboxNoList.push(tempNo);
				}
			}
			
			qp['mboxNoList'] = mboxNoList.join(',');
			qp['note'] = this.gv('rcGrid').getValue(0,'특기사항');
			qp['issuer'] = this.userAuthInfo.loginUserName; //M-RUN발행자(로그인 USER)
			let param = {menuId:'M0003008',queryId:'execMrunSave',queryParams:qp, target: null};
			let rslt = await this.$axios.api.search(param);	
			//rslt 확인필요
			this.$toast("info",'저장되었습니다.');
			this.dp('rcGrid').setRows([]);
			this.search();
		},
		async delClick(){
			this.gv('rcGrid').commit();
			let checkRows = this.gv('rcGrid').getCheckedRows(true);
			if(_.isEmpty(checkRows)){
				this.$toast("info","선택된 M-RUN이 없습니다.")
				return;
			}

			this.$confirmYesOrNo("선택", "삭제 하시겠습니까?", (confirmed) => {
				if (confirmed) {
					this.mrunDelete();
				} 
			});
		},
		async mrunDelete(){
			let checkRows = this.gv('rcGrid').getCheckedRows(true);
			let mrunNoList = [];
			checkRows.forEach(row => {
				if(this.dp('rcGrid').getRowState(row) !== RowState.CREATED){
					mrunNoList.push(this.gv('rcGrid').getValue(row, "runNo"));
				}
			});

			if(!_.isEmpty(mrunNoList)){	//생성처리된것만 선택하고 삭제한 경우
				let qp = {};
				qp['mrunNoList'] = mrunNoList.join(',');
				let param = {menuId:'M0003008',queryId:'execMrunDelete',queryParams:qp, target: null};
				let rslt = await this.$axios.api.search(param);	
				//rslt 확인필요
			}
			
			this.$toast('info','삭제되었습니다.')
			this.search();
		},
		async printRunCard(){
			if(_.isNil(this.selectedRunNo)){
				this.$toast("error", "선택하신 Runcard가 없습니다.");
				return;
			}
			let qp = {};
			qp['runNo'] = this.selectedRunNo;
			let runInfo=[];
			let param = {menuId:'M0003008',queryId:'selectPrintMRunCardInfo',queryParams:qp, target: runInfo};
			await this.$axios.api.search(param);	
			if(runInfo.length==0){
				this.$toast("error", "RunCard 데이터를 가져 올 수 없습니다.");
				return;
			}
			runInfo[0]['작업구분'] = '(M) Merge Run_별도'
			await this.$refs.mRunCard.loadExcel();
			await this.$refs.mRunCard.addDataToExcel(runInfo[0]);
			await this.$refs.mRunCard.downloadExcel(this.selectedRunNo);
		},
		onCellClickedRcGrid(grid, clickData) {
			if (clickData.cellType != "data"&&clickData.cellType != "check") return; 
			
			const prod = grid.getDataSource();
			let row = prod.getJsonRow(clickData.dataRow);
			this.selectedRunNo = row.runNo;
		},
		setRowStyleCallbackRcGrid(grid, item, fixed) {
			var ret = {};
			var new_mrun = grid.getValue(item.index, 'runNo');
			//var reason = grid.getValue(item.index, 'NG사유');
			//var status2 = grid.getValue(item.index, 'boxno검증');
			//this.$toast("info",new_mrun);
			if (new_mrun.includes('-NEW')) {
				ret.style = { background: '#99FF33' }; //#FAFAD2
			 } //else if (status == 'NG' || status2 == 'NG') {
			// 	ret = 'red';
			// }

			return ret;
		},
		onCellClickedGcGrid(grid, clickData){
			if(clickData.cellType === 'header'){
				return;
			}

			if(['code','구분'].indexOf(clickData.column) > -1){
				return;
			}
			//this.$toast('info',clickData.column); return;
			let qp = {};
			qp['selectedModel'] = this.srchInfo.model;
			qp['no'] = this.srchInfo.no;
			qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			qp['selectedSelType'] = this.selectedSelType
			qp['selectedWorktype'] =this.getWorkType();
			qp['rwClass'] = clickData.column;
			
			let param = {menuId:'M0003008',queryId:'selectMrunbox',queryParams:qp, target: this.mrRows};
			this.$axios.api.search(param);	
		},
		convertToUpperEnglish(event) {
			const group = event.target.dataset.group; // params 또는 params1 판별
			const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
			if (group && this[group]) {
				this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
			}
		},
	},
}

</script>
<style lang="scss" scoped>
::v-deep .period{
	width: 20%!important;
	}
::v-deep .radio-group{
	margin-top: 0px;
	max-width: 200px;
}
::v-deep .grid_box{
	&.search_onerow{
		overflow: hidden;
		.grid-border-none{
			height: 100%;
		}
	}
}
</style>
