/**
*	제조 실적 입력 > Rework > M-BOX 대기 관리
*/
<template>
	<div>
		<div class="search_box">
			<b-row class="search_area">
				<b-col cols="1" style="width:10%">
					<code-select :code="'36'" :label="'제품유형'" v-model="srchInfo.model" :isCodeText="true"/>
				</b-col>
				<b-col cols="2">
					<code-select ref="workType" :code="'31'" :label="'작업구분'" v-model="srchInfo.worktype" />
				</b-col>
				<b-col cols="2">
					<code-select :code="'93'" :label="'공정'" v-model="process" />
				</b-col>
				<b-col cols="2">
					<div class="form-floating lot_run_num">
						<input type="text" class="form-control label-60 " id="floating" placeholder="RunNo"
							v-model="srchInfo.no"
							@input="convertToUpperEnglish"
							name="no"
  							data-group="srchInfo"
							>
						<label for="floating">RunNo</label>
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
				<!--b-col cols="2">
					<div label-for="radio-options" style="width: 200px;">
						<b-form-radio-group id="radio-options" v-model="searchDiv" name="radioGroup"
							:options="searchDivList" class="custom-radio-group" width="100px"
							></b-form-radio-group>
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
			<div class="left_box">
				<b-col cols="2">
					<div label-for="radio-options" style="width: 300px;">
						<b-form-radio-group id="radio-options" v-model="searchDiv" name="radioGroup"
							:options="searchDivList" buttons    button-variant="outline-primary"
							></b-form-radio-group>
					</div>
				</b-col>
				<div class="btn_wrap ms-auto">
					<b-button @click="bareCellMngClick" class="main">Bare Cell 관리</b-button>
					<b-button @click="mboxWaitCellMngClick" class="main">M-BOX 대기 Cell 관리</b-button>
				</div>
			</div> 

			<div class="grid-border-none">
				<RealGrid ref="wGrid" :uid="'wGrid'" :rows="waitRows" style="border-bottom:1px solid #bcc0c8;height: 195px" />
				&nbsp;
				<div v-show="searchDiv === 'sum'" style="border-top:1px solid #bcc0c8;border-bottom:1px solid #bcc0c8;height:calc(100% - 220px);">
					<RealGrid ref="wsGrid" :uid="'wsGrid'" :rows="waitSumRows" style="height: 100%" />
				</div>
				<div v-show="searchDiv === 'dtl'" style="border-top:1px solid #bcc0c8;border-bottom:1px solid #bcc0c8;height:calc(100% - 220px);">
					<RealGrid ref="wdGrid" :uid="'wdGrid'" :rows="waitDtlRows" style="height: 100%" />
				</div>
			</div>
		</div>
		<MboxWaitCellMng ref="mwcmPopup" />
		<BareCellMng ref="bcmPopup" />
	</div>
</template>

<script>
import {ValueType} from 'realgrid';
import MboxWaitCellMng from "@web/popup/MboxWaitCellMng";
import BareCellMng from "@web/popup/BareCellMng";
import { useM0003008 } from '@web/store/M0003008.js';

export default {
	setup() {
		const srchInfo = useM0003008();
		return {srchInfo};
	},
	components: {
		MboxWaitCellMng, BareCellMng
	},
	data () {
		return {
			wGrid:null,
			waitRows:[],
			wsGrid:null,
			waitSumRows:[],
			wdGrid:null,
			waitDtlRows:[],
			sumColumns:[],
			// modelList:[],
			workTypeList:[],
			// rwList:[],
			searchDiv: "sum",
			searchDivList: [
				{ text: '집계분', value: 'sum' },
				{ text: '상세분', value: 'dtl' },
			],
			process:'',
		}
	},
	computed: {
	},	
	created() {		
		this.initializeGrid();		
	},	
	mounted() {
		this.getCodes();	
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
			this.wGrid = _.cloneDeep(require(`@web/m0003000/js/TAB046000_1.js`));
			this.wsGrid = _.cloneDeep(require(`@web/m0003000/js/TAB046000_3.js`));
			this.wdGrid = _.cloneDeep(require(`@web/m0003000/js/TAB046000_2.js`));
		},
		makeSumGrid(){
			this.sumColumns.forEach(el => {
				let nm = el['text'].replace(/-/g, '').replace(/ /g, '').toLowerCase();
				this.dp('wGrid').addField({fieldName: nm,dataType: ValueType.NUMBER});
				this.gv('wGrid').addColumn({name: el.value,fieldName: nm,width: 150,header: {text: el.text}, numberFormat:'#,##0', footer:{expression: 'sum', numberFormat: '#,##0'}});
			});
		},
		async getCodes(){
			await this.$utils.getCommonCodeValueText(['73'],[this.sumColumns]);	//집계 분류
			//this.$toast('info',JSON.stringify(this.sumColumns,null,2));
			// let param = {menuId:'M0003008',queryId:'selectModelList',target: this.modelList};	//제품유형
			// this.$axios.api.search(param);	
			this.makeSumGrid();
		},
		searchClick(){
			this.search();
		},
		init(){
			this.dp('wsGrid').setRows([]);
			this.dp('wdGrid').setRows([]);
		},
		// async search(){
		// 	let qp = {};
		// 	qp['selectedModel'] = this.srchInfo.model;
		// 	qp['runNo'] = this.srchInfo.no;
		// 	qp['process'] = this.process;
		// 	qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
		// 	qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
		// 	let param = {menuId:'M0003008',queryId:'selectMboxSummary',queryParams:qp, target: this.waitRows}; 

		// 	await this.$axios.api.search(param);
		// 	const gridView = this.gv('wGrid');
		// 	gridView.setRowGroup({
		// 		expandedAdornments: "footer",
		// 		collapsedAdornments: "footer",
		// 		footers: [{
		// 			criteria: "rowIndex == 4", // 0-based index이므로 4가 5번째 행
		// 			text: "합계:",
		// 			style: "background:#f5f5f5; font-weight:bold",
		// 			expressions: ["", "sum"]
		// 		}]
		// 	});	 
        //   try {
        // // 그룹 푸터 설정
        //     //gridView.setColumnProperty("수량", "groupFooter", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f", fontBold: true}});            
        // // 전체 푸터 설정
        //     gridView.setColumnProperty("미처리", "footer", {expression: "sum",numberFormat: "#,##0",styles: {foreground: "#d32f2f",fontBold: true}});
        //   } finally {
        //   }	
		// 	this.init();			
		// },
		async search() {
			try {
				// 1. 그리드 뷰 가져오기
				const gridView = this.gv('wGrid');
				if (!gridView) {
					console.error("그리드 뷰를 찾을 수 없습니다.");
					return;
				}

				// 2. 데이터 요청
				let qp = {
					selectedModel: this.srchInfo.model,
					runNo: this.srchInfo.no,
					process: this.process,
					startDate: this.srchInfo.startDate.replace(/-/g, ""),
					endDate: this.srchInfo.endDate.replace(/-/g, "")
				};
				
				let param = {
					menuId: 'M0003008',
					queryId: 'selectMboxSummary',
					queryParams: qp,
					target: this.waitRows
				};
				await this.$axios.api.search(param);
				
				// gridView.setFooter({
				// 		styles: {
				// 			border: '#e0e0e0',  // 푸터 하단 테두리 색상
				// 			borderBottom: '1px solid #e0e0e0'  // 명시적으로 하단 테두리 설정
				// 		}
				// });
				gridView.refresh();
				this.init();
			} catch (error) {
				console.error("검색 중 오류 발생:", error);
			}
		},
		// onDataLoadComplatedWGrid(grid) {
		// 	this.$toast('info','222222222222');
		// 	grid.setColumnProperty('0', 'numberFormat', '#,##0.00');
		// 	grid.refresh();
		// },		
		onCellClickedWGrid(grid, clickData){
			if(clickData.cellType !== 'data' || clickData.column == '공정'){
				return;
			}

			const current = grid.getCurrent();
			const rowIndex = current.itemIndex;
			
			let qp = {};
			qp['selectedModel'] = this.srchInfo.model;
			qp['runNo'] = this.srchInfo.no;
			qp['process'] = this.process;
			qp['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			qp['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			qp['selectedRw'] = clickData.column;
			qp['selectedWorktype'] = this.getWorkType();
			qp['prcOrder'] = grid.getValue(rowIndex,"공정순서");
			
			//this.$confirm( "확인",this.searchDiv+"-"+(rowIndex+1)+"-");
			//if(this.searchDiv==='sum') {
			let qi = "";
			let qiDtl = "";
			//if( this.searchDiv === 'sum'){ //집계분분
				if(rowIndex === 0){	//M-FQC & ISM
					qi	  = 'selectFQCSumList';
					qiDtl = 'selectFQCList';
				}else if(rowIndex === 1){ //필름 포장 검사, 집계분분		
					qi	  = 'selectMboxSumList';
					qiDtl = 'selectMboxList';
				}else if(rowIndex === 2){ //ECI & VRS
					qi	  = 'selectEciSumList';
					qiDtl = 'selectEciList';
				}else if(rowIndex === 3){ //이물제거
					qi	  = 'selectPaclSumList';
					qiDtl = 'selectPaclList';
				}	
				let	paramSum = {menuId:'M0003008',queryId:qi,queryParams:qp, target: this.waitSumRows};
				let paramDtl = {menuId:'M0003008',queryId:qiDtl,queryParams:qp, target: this.waitDtlRows};
				try {
					this.$axios.api.searchAll([paramSum,paramDtl]);	
				} catch (error) {
					console.error('Error during searchAll:', error);
					throw error;
				}
		},
		bareCellMngClick(){
			let params = {};
			params['selectedModel'] = this.srchInfo.model;
			params['runNo'] = this.srchInfo.no;
			params['process'] = this.process;
			params['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			params['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			params['selectedWorktype'] = this.getWorkType();

			this.$refs.bcmPopup.openDialog(params);
		},
		mboxWaitCellMngClick(){
			if(_.isEmpty(this.srchInfo.model)){
				this.$toast("info","선택된 제품유형이 없습니다.");
				return;
			}
			if(_.isEmpty(this.process )){
				this.$toast("info","선택된 공정이 없습니다.");
				return;
			}
			if(this.process==='BC'){
				this.$toast("info","선택된 공정은 Bare Cell 처리 공정입니다.");
				return;
			}
			let params = {};
			params['selectedModel'] = this.srchInfo.model;
			params['runNo'] = this.srchInfo.no;
			params['process'] = this.process;
			params['startDate'] = this.srchInfo.startDate.replace(/-/g, "");
			params['endDate'] = this.srchInfo.endDate.replace(/-/g, "");
			params['selectedRw'] = this.srchInfo.rw;
			params['selectedWorktype'] = this.getWorkType();
			
			this.$refs.mwcmPopup.openDialog(params);
			
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
	},
}

</script>
<style lang="css" scoped>
::v-deep .period{
width: 20%!important;
}
</style>
<style>
.rg-footer-cell {
    text-align: center;
}
</style>
