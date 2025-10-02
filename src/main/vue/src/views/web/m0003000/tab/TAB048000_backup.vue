/**
* 제조 실적 입력 > Rework > Rework Run 실적
*/
<template>
	<div>
		<div class="search_box">
			<b-row class="row search_area">
				<b-col cols="2">
					<div class="form-floating prc_name">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="srchInfo.process" @change="onProcessChange">
							<option v-for="(p, index) in processList" :value="p.sysResourceId" :key="index">
								{{ p.sysResourceName }}</option>
						</select>
						<label for="floatingSelect" class="select">공정명</label>
					</div>
				</b-col>
				<b-col cols="2">
					<div class="form-floating lot_run_num">
						<input type="text" class="form-control label-60 " id="floating" placeholder="RunNo"
							v-model="srchInfo.runNo"
							@input="convertToUpperEnglish"
							name="runNo"
  							data-group="srchInfo"
							>
						<label for="floating">RunNo</label>
					</div>
				</b-col>
			</b-row>
			<div class="btn_area">
				<b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>
			</div>
		</div>
		<div class="worker_wrap">
			<div class="title mr-4">작업자 정보</div>
			<div class="row worker_info">
				<div class="col-2">
					<div class="form-floating">
						<input type="text" class="form-control label-60" id="floating" placeholder="LotNo"
							v-model="worker">
						<label for="floating">작업자</label>
					</div>
				</div>
				<div class="col-2">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedShift">
							<option v-for="(o, index) in shifts" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">Shift</label>
					</div>
				</div>
				<div class="col-2">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedMc">
							<option v-for="(o, index) in mcList" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">M/C</label>
					</div>
				</div>
			</div>
		</div>
		<div class="accordion mt-2" id="accordionExample">
			<div class="accordion-item mt-2" v-show="curProcess !== '022'">
				<h2 class="accordion-header" id="headingTwo">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">제품현황</button>
				</h2>
				<div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo">
					<div class="accordion-body">
						<ProductStatus ref="prodStatus" :no="srchInfo.runNo" :process="srchInfo.process" :area="'rework'" :runNo="srchInfo.runNo"/>
					</div>
				</div>
			</div>
			<div class="accordion-item mt-2">
				<h2 class="accordion-header" id="headingOne">
					<button class="accordion-button" type="button" data-bs-toggle="collapse"
						data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
						작업현황
					</button>
				</h2>
				<div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne">
					<div class="accordion-body">
						<div class="btn_wrap mb-1">
							<b-button-group class="toggle_btn">
								<b-button :class="jobState === 'none' ? 'on' : ''" @click="startJobClick">작업시작</b-button>
								<b-button :class="jobState === 'start' ? 'on' : ''" @click="endJobClick">작업종료</b-button>
							</b-button-group>
						</div>
						<RealGrid ref="jsGrid" :uid="'jsGrid'" :rows="jsRows" style="height: 92px;" class="mb-1" />
						<ErrorInfoStatus ref="errorInfoStatus" :inQty1="jsRows.length > 0 ? jsRows[0]['투입수량'] : 0" class="mb-1" style="height: 82x;" />
						<b-row>
							<b-col cols="5" v-show="srchInfo.process === '022'">
								<RealGrid ref="mboxGrid" :uid="'mboxGrid'" :rows="mboxRows" :fitLayoutWidthEnable="false"/>
							</b-col>
							<b-col>
								<RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" :fitLayoutWidthEnable="false"/>
							</b-col>
						</b-row>
					</div>
				</div>
			</div>
			
		</div>
		<ReworkStartJob ref="rsjPopup" @startJobComplete="startJobComplete"/>
		<ReworkEndJob ref="rejPopup" @endJobComplete="endJobComplete"/>
		<ErrorInput ref="errorInput" @save="badSaveCallback"/>
	</div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import ReworkStartJob from "@web/popup/ReworkStartJob";
import ReworkEndJob from "@web/popup/ReworkEndJob";
import ProductStatus from '@components/ProductStatus.vue';
import { useM0003008 } from '@web/store/M0003008.js';
import moment from 'moment';
import ErrorInfoStatus from '@components/ErrorInfoStatus.vue';
import ErrorInput from "@web/popup/ErrorInput";

export default {
	setup() {
		const userAuthInfo = useUserAuthInfo();
		const processList = userAuthInfo.getTabInfoListBySRI('M0003008','TAB048000');  
		const srchInfo = useM0003008();
		return { userAuthInfo,processList,srchInfo };
	},
	props: {},
	components: {
		ReworkStartJob,
		ReworkEndJob,
		ProductStatus,
		ErrorInput,
		ErrorInfoStatus
	},
	watch: {
		'srchInfo.process': {
			handler(newValue, oldValue) {
				this.$nextTick(() => {
					if (newValue) {
						this.onProcessChange();
					}
				});
			},
			immediate: false, // 컴포넌트가 생성될 때 초기 실행 (필요에 따라 삭제 가능)
			deep: true, // 중첩된 객체의 변화를 감지하려면 추가
		},
	},
	data() {
		return {			
			jobState:'none',	//none:아무상태 아님,start:시작,end:작업종료까지 완료료
			jsGrid:null,
			jsRows:[],
			cstGrid:null,
			cstRows:[],
			mboxGrid:null,
			mboxRows:[],
			selectedShift:"",
			shifts: [],
			// selectedWorkCrew:"",
			// workCrews: [],
			selectedMc: "",
			mcList: [],
			worker:"",
			cstGridSrcMap: {
				'022': 'TAB048000_3',
				'059': 'TAB031000_2',
			},
			jsGridSrcMap: {
				'022': 'TAB048000_1',
				'059': 'TAB031000_5',
			},
			maxCnt:999,
		}
	},
	computed: {
		isEditabled(){
			// return this.jobState !== 'end';
			return true;	//test code
		}
	},
	created() {
		this.initializeGrid();
	},
	mounted() { 
		this.getCodes();
		this.getMcListByProc();
	},
	beforeUnmount() { },
	methods: {
		gv(name) {
			return this.$refs[name].getGridView();
		},
		dp(name) {
			return this.$refs[name].getGridDataProvider();
		},
		initializeGrid() {
			this.mboxGrid = _.cloneDeep(require(`@web/m0003000/js/TAB048000_2.js`));
			this.initJsAndCstGrid();
		},
		initJsAndCstGrid(){
			let p = this.srchInfo.process||'022'	//default
			this.jsGrid = _.cloneDeep(require(`@web/m0003000/js/` + this.jsGridSrcMap[p] + `.js`));
			this.cstGrid = _.cloneDeep(require(`@web/m0003000/js/` + this.cstGridSrcMap[p] + `.js`));
		},
		async searchClick(){
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['prodCategory'] = this.userAuthInfo.curProdCtg;

			if(!this.$utils.validateFields(params, ['S:공정명:process','T:RunNo:runNo'])){
				return;
			}

			if(this.srchInfo.process === '059'){
				this.searchReClean(params);
			}else{
				this.search(params);
			}
		},
		async search(qp){
			let param= {menuId:'M0003008',queryId:'selectMrunStatus',queryParams:qp, target: this.jsRows};
        	let rslt = await this.$axios.api.search(param);	
			this.$refs.prodStatus.loadData();
			this.loadErrorStatus();
			if(_.isEmpty(rslt)){
				this.$toast("info","M-RUN 발행이 안된 RUN입니다");
				this.mboxRows = [];
				this.cstRows = [];
			}else{
				//작업시작,시작시각,작업종료,종료시각
				if(!_.isEmpty(rslt[0]['작업시작']) && !_.isEmpty(rslt[0]['시작시각']) && !_.isEmpty(rslt[0]['작업종료']) && !_.isEmpty(rslt[0]['종료시각'])){
					this.jobState = 'end'; //작업종료 상태
				}else if(!_.isEmpty(rslt[0]['작업시작']) && !_.isEmpty(rslt[0]['시작시각'])){
					this.jobState = 'start'; //작업 시작만 한 상태
				}else{
					this.jobState = "end";
				}
				
				this.search2(qp);
			}
		},
		async search2(qp){
			let param1 = {menuId:'M0003008',queryId:'selectMrunMboxList',queryParams:qp, target: this.mboxRows};
        	let param2 = {menuId:'M0003008',queryId:'selectDpfFailInfo',queryParams:qp, target: this.cstRows};
			let rslt = await this.$axios.api.searchAll([param1,param2]);	
		},
		async searchReClean(params){
			this.$refs.prodStatus.loadData();
			let resp = await this.$axios.post("/api/m0003000/m0003001/search", params);
			let result = resp.data;
			
			if (result['msg'] !== 'ok') {
				this.$toast("info", result['msg']);
			}else{
				this.setInfo(result);
			}
		},
		async setInfo(result) {
			this.jsRows = [result['prodVLR']];
			this.worker = result['prodVLR']['작업자'];
			this.selectedShift = result['prodVLR']['shift'];
			// this.selectedWorkCrew = result['prodVLR']['작업조'];
			this.selectedMc = result['prodVLR']['machineCode'];
			this.cstRows = result['list'];

			this.setJobStateByVLR(result['prodVLR']);
			this.loadErrorStatus();
		},
		setJobStateByVLR(vlr) {
			if (_.isEmpty(vlr['작업시작']) && _.isEmpty(vlr['시작시각'])) {
				this.jobState = 'none';
			} else if (_.isEmpty(vlr['작업종료']) && _.isEmpty(vlr['종료시각'])) {
				this.jobState = 'start'
				// this.jobEnable = true;
			} else {
				this.jobState = 'end';
			}

			this.gv('cstGrid').setEditOptions({ editable: true });	//항상 수정 가능로
		},

		startJobClick(){
			if(this.jobState === 'start'){
				this.$toast("info","작업중인 M-RUN 입니다.");
				return;
			}

			if(this.jobState === 'end'){
				this.$toast("info","작업완료된 M-RUN 입니다.");
				return;
			}
			
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;

			if(this.srchInfo.process === '059'){
				params['nextProcess'] = '056';
				params['worker'] = this.worker;
				params['selectedShift'] = this.selectedShift;
				// params['selectedWorkCrew'] = this.selectedWorkCrew;
				params['selectedMc'] = this.selectedMc;

				//start - check 로직			
				if (_.isEmpty(this.cstRows)) {
					this.$toast('info', '조회된 작업정보가 없습니다.');
					return;
				}

				if (!this.$utils.validateFields(params, ['T:RunNo:runNo', 'T:작업자:worker', 'S:Shift:selectedShift', 'S:M/C:selectedMc'])) {
					return;
				}
				//end
				this.startJobReClean(params);
			}else{
				params['mboxRows'] = this.mboxRows;
				this.$refs.rsjPopup.openDialog(params);
			}
		},
		async startJobReClean(params){
			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let cstList = this.dp('cstGrid').getJsonRows();
			// params['투입수량'] = cellSum;
			// params['검사수량'] = cellSum;
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params['특이사항'] = null;
			params['cstList'] = cstList;
			params['작업시작'] = moment().format('YYYYMMDD');
			params['시작시각'] = moment().format('HHmmss');

			let resp = await this.$axios.post("/api/m0003000/m0003001/startjob", params);
			// console.log("resp:::",resp);
			if (resp.data.msg === "ok") {
				this.jsRows = [resp.data['prodVLR']];
				this.jobEnable = true;
				this.gv('cstGrid').setEditOptions({ editable: this.jobEnable });
				this.$toast('success', '작업 시작되었습니다.');
				this.jobState = 'start';
			} else {
				this.$toast('error', '작업시작 실패하였습니다.');
			}
		},
		startJobComplete(){
			this.searchClick();
		},
		endJobComplete(){
			this.searchClick();
		},
		endJobClick(){
			if(this.jobState === 'end'){
				this.$toast("info","작업완료된 M-RUN 입니다.");
				return;
			}

			this.$confirmYesOrNo("선택", "작업종료 하시겠습니까?", (confirmed) => {
				if (confirmed) {
					this.endJob();
				}
			});
		},
		async endJob(){
			if(this.srchInfo.process === '059'){
				this.endJobReClean();
			}else{
				let params = {};
				params['runNo'] = this.srchInfo.runNo;
				params['shift'] = this.jsRows[0]['shift'];
				params['worker'] = this.jsRows[0]['작업자'];
				params['작업시작'] = this.jsRows[0]['작업시작'];
				params['시작시각'] = this.jsRows[0]['시작시각'];
				params['mc'] = '';

				this.$refs.rejPopup.openDialog(params);
			}
		},
		async endJobReClean() {
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = '056'
			params['worker'] = this.worker;
			params['selectedShift'] = this.selectedShift;
			// params['selectedWorkCrew'] = this.selectedWorkCrew;
			params['selectedMc'] = this.selectedMc;
			this.gv('cstGrid').commit();
			let saveData = this.$refs.cstGrid.getSaveData();
			let update = saveData.update;
			let insert = saveData.insert;

			update = update.concat(insert);
			// console.log("saveData::",update);

			let badList = [];
			let cstList = [];
			// let cellSum = this.jsDP().getFieldValues('f수량', 0, -1).reduce((acc, curr) => acc + Number(curr), 0);
			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			update.forEach(el => {
				Object.keys(this.cstGrid.badColumns).forEach(badNm => {
					let obj = {};
					obj['runNo'] = el['runNo'];
					obj['lotNo'] = el['lotNo'];
					obj['process'] = el['공정코드'];
					obj['tCstno'] = el['tCstno'];
					obj['fCstno'] = el['fCstno'];
					obj['badNm'] = this.cstGrid.badColumns[badNm];
					obj['badCnt'] = el[badNm] || 0;
					obj['machineCode'] = this.selectedMc;
					badList.push(obj);
				});

				el['worker'] = this.worker;
				el['shift'] = this.selectedShift;
				// el['workCrew'] = this.selectedWorkCrew;
				el['machineCode'] = this.selectedMc;

				cstList.push(el);
			});
			
			params['badList'] = badList;
			params['cstList'] = cstList;
			// params['검사수량'] = cellSum;
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params['특이사항'] = null;
			params['작업종료'] = moment().format('YYYYMMDD');
			params['종료시각'] = moment().format('HHmmss');

			let resp = await this.$axios.post("/api/m0003000/m0003001/endjob", params);

			if (resp.data === "ok") {
				// this.jobEnable = false;
				this.searchReClean(params);
				this.$toast('success', '작업종료 처리되었습니다.');
			} else {
				this.$toast('error', '작업종료 실패하였습니다.');
			}
		},
		getCellSum() {
			let sumCstNoList = [];
			let s = 0;
			let rds = this.dp('cstGrid').getJsonRows();
			rds.forEach(el => {
				if (sumCstNoList.indexOf(el['tCstno']) === -1) {
					s += el['t수량'];
					sumCstNoList.push(el['tCstno']);
				}
			});
			return s;
		},
		getBadSum() {
			let sumCstNoList = [];
			let s = 0;
			let rds = this.dp('cstGrid').getJsonRows();
			rds.forEach(el => {
				if (sumCstNoList.indexOf(el['tCstno']) === -1) {
					s += el['불량합계'];
					sumCstNoList.push(el['tCstno']);
				}
			});
			return s;
		},
		getCodes() {
			this.$utils.getCommonContentValueText(['06'], [this.shifts]);	//shift
		},

		async getMcListByProc() {
			let qp = {};
			qp['process'] = this.srchInfo.process;
			let param = { menuId: 'M0003001', queryId: 'selectBack1McList', queryParams: qp, target: this.mcList };
			await this.$axios.api.search(param);
		},

		async onProcessChange(evt) {
			this.initData();
			this.getMcListByProc();

			this.$refs.jsGrid.destroy();
			this.$refs.cstGrid.destroy();

			this.initJsAndCstGrid();
			this.$refs.jsGrid.created();
			this.$refs.cstGrid.created();

			this.$refs.prodStatus.clearData();

			this.gv("cstGrid").columnByName('t수량').styleCallback = this.tCstCntCellStyleCallback;

			if(!_.isEmpty(this.runNo)){
				this.searchClick();
			}
		},

		tCstCntCellStyleCallback(grid, model) {
			let ds = grid.getDataSource();
			let jsonData = ds.getJsonRow(model.index.dataRow);
			let rtn = {};
			let editable = this.jobState !== 'end';
			editable = true;
			rtn['editable'] = editable;
			rtn['styleName'] = editable?'edit tr':'tr';
			return rtn;
		},

		initData() {
			this.cstRows = [];
			this.jsRows = [];
			this.worker = "";
			this.selectedShift = "";
			this.selectedMc = "";
			this.jobState = 'none';
			this.dp('jsGrid').setRows([]);
			this.dp('cstGrid').setRows([]);
		},
		setCellStyleCallbackMboxGrid(grid, cell){
			let rtn = {};
			const fieldName = cell.index.fieldName;
			if(fieldName == 'cstCell'){
				if(this.isEditabled){
					rtn.editable = true;
					rtn.styleName = "tr edit";
				}else{
					rtn.editable = false;
					rtn.styleName = "tr";
				}        
			}
			return rtn
		},
		onCellEditedMboxGrid(grid, itemIndex, row, field) {      
			grid.commit();
			let ds = grid.getDataSource();
			let fieldName = ds.getOrgFieldName(field);
			let jsonDatas = ds.getJsonRows(0,-1);
			console.log(jsonDatas);

			if(fieldName === "cstCell"){        
				let key = grid.getValue(itemIndex,"cstNo")+'|'+grid.getValue(itemIndex,"tCstno");
				let sumCstCell = 0;
				jsonDatas.forEach(el => {
					if(el['cstNo'] +'|'+ el['tCstno'] === key){
						sumCstCell += el['cstCell']||0;	
					}
				});

				this.updateCstCell(sumCstCell,key);
			}
		},

		onCellItemClickedMboxGrid(grid, index, clickData) {
		   if(clickData.cellType !== "data") return;
      
			let ds = grid.getDataSource();
			let current = grid.getCurrent();
			let jsonData = ds.getJsonRow(current.dataRow);
			
			if(clickData.fieldName === '불량입력'){
				let saveData = this.callSaveData();
				if(saveData.update.length > 0){
				this.$toast("info", "변경된 내용이있습니다. 임시저장후 진행하세요.");        
				return;
				}

				this.badClick(jsonData);
			}
			return true;
		},

		callSaveData(){
			return this.$refs.cstGrid.getSaveData();
		},

		onCellEditedCstGrid(grid, itemIndex, row, field) {      
			grid.commit();
			let ds = grid.getDataSource();
			let fieldName = ds.getOrgFieldName(field);
			let jsonData = ds.getJsonRow(row);
			if(fieldName === 't수량'){        
				if(jsonData["t수량"] > 30){
					this.$toast("info", "수량 30개보다 크게 입력할수 없습니다.");
					grid.setValue(row, "t수량", 30);
				}
				let jsonData1 = ds.getJsonRow(row);
				grid.setValue(row, "tOrg수량", jsonData1["t수량"]);
			}
		},

		badClick(values){
			let p = {};
			p['type'] = this.srchInfo.process === "022"?'etcno':'cstno';
			
			if(this.srchInfo.process === "022"){
				p['etcNo'] = values['mboxNo'];
				p['fCstNo'] = values['cstNo'];
				p['tCstNo'] = values['tCstno'];
				p['pkey'] = values['pkey'];
			}else{
				p['etcNo'] = '';
				p['fCstNo'] = values['cstNo'];
				p['tCstNo'] = values['tCstno'];
				p['pkey'] = values['pkey'];
			}
			p['runId'] = this.srchInfo.runNo;
			p['자동여부'] = "0";
			p['공정코드'] = this.srchInfo.process;
			p['line'] = "D1UT";
			p['dialogTitle'] = this.srchInfo.runNo + " / " + values['cstNo'];
			// p['isEditabled'] = this.jobState !== 'end';
			p['isEditabled'] = true;
			p['errorCnt'] = values['cstCell']; 
			p['callback'] = { queryId:'M0003001Error', data:[{
				...values,
				'차수': values["차수"],
				'code': values['공정코드'],
				line: 'D1UT',
				"자동여부": p['자동여부'],
				fCstNo: values["cstNo"],
				tCstNo: values["tCstno"],
				'etcNo':p['etcNo']
			}]};
			
			this.$refs.errorInput.openDialog(p);
		},
		async loadErrorStatus(){
			this.$refs.errorInfoStatus.loadData({
				'line':"D1UT",
				'공정코드':this.srchInfo.process
				,'runId':this.srchInfo.runNo,
				"자동여부": "0",				
			});
		},
		async reloadCstInfo(){
			let params = {};
			params["runNo"] = this.srchInfo.runNo;
			params["process"] = this.srchInfo.process;
			params["peelingDiv"] = "0";

			let resp = await this.$axios.post("/api/m0003000/m0003001/reload/cst", params);
			this.cstRows = resp.data;
		},
		convertToUpperEnglish(event) {
			const group = event.target.dataset.group; // params 또는 params1 판별
			const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
			if (group && this[group]) {
				this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
			}
		},
		updateCstCell(cstCell,key){
			let gridData = this.dp('cstGrid').getJsonRows(0, -1);
			let isExist = false;
			for(let i = 0 ; i < gridData.length; i++){
				if(gridData[i]['fCstno']+'|'+ gridData[i]['tCstno']=== key){
					console.log(i,"f수량 변경되었습니다.");
					this.dp('cstGrid').setValue(i, 'f수량', cstCell);	
					isExist = true;
				}
			}
			
			if(!isExist) {
				this.$toast('warn','해당 pkey 값을 가진 데이터가 없습니다.');
			} 
		},
		badSaveCallback(params,badSum){
			// this.reloadCstInfo();
			this.loadErrorStatus();
			let list = this.dp('mboxGrid').getJsonRows();
			list.forEach(el => {
				if(el['pkey'] === params['pkey']){
          			el['f불량수량'] = badSum;					
          			el['불량합계'] = badSum;					
				}
			});
			this.dp('mboxGrid').setRows(list);
		},
	},
}
</script>
<style lang="scss">
.rg-renderer{
	button{
		&.btn_error{
			border: 1px solid  #ff7f58;
      color:  #df4802;
		}
    &.btn_sucess{
			border: 1px solid  #2f46c7;
      color:   #2f46c7;
		}
	}
}
</style>