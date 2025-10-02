/**
* 제조 실적 입력 > Back#1 > 생산 실적 입력
*/
<template>
	<div>
		<div class="search_box">
			<b-row class="row search_area">
				<b-col cols="2">
					<div class="form-floating prc_name">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="srchInfo.process">
							<option v-for="(p, index) in processList" :value="p.sysResourceId" :key="index">
								{{ p.sysResourceName }}</option>
						</select>
						<label for="floatingSelect" class="select">공정명</label>
					</div>
				</b-col>
				<b-col cols="2">
					<div class="form-floating lot_run_num">
						<input type="text" class="form-control label-60" ref="runNo" id="floating" placeholder="RunNo"
							v-model="srchInfo.runNo"
							@input="convertToUpperEnglish"
							name="runNo"
  							data-group="srchInfo"
							@keydown.enter="searchClick"
							autocomplete="off"
							@mousedown="handleMouseDown"
							>
						<label for="floating">RunNo</label>
					</div>
				</b-col>
				<b-col cols="2">
					<code-select :codeList="nextProcessList" :label="'인계공정'" v-model="nextProcess"
						:oneRequired="true" />
				</b-col>
			</b-row>
			<!-- <div class="btn_area" v-show="'037' === srchInfo.process">
				<b-button @click="reCleanClick">재세정</b-button>
			</div> -->
			<div class="btn_area">
				<b-button @click="searchClick"><span class="ico_search"></span>조회</b-button>
			</div>
		</div>
		<div class="worker_wrap">
			<div class="title mr-4">작업자 정보</div>
			<div class="row worker_info">
				<div class="col-4">
					<div class="form-floating">
						<input type="text" class="form-control label-60" id="floating" placeholder="LotNo"
							v-model="worker">
						<label for="floating">작업자</label>
					</div>
				</div>
				<div class="col-4">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedShift">
							<option v-for="(o, index) in shifts" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">Shift</label>
					</div>
				</div>
				<div class="col-4">
					<div class="form-floating">
						<select class="form-select label-60 " id="floatingSelect"
							aria-label="Floating label select example" v-model="selectedMc">
							<option v-for="(o, index) in mcList" :value="o.value" :key="index">{{ o.text }}</option>
						</select>
						<label for="floatingSelect" class="select">M/C</label>
					</div>
				</div>
			</div>
			<div class="row worker_info ms-2">
				<div class="col-4">
					<DateTimeSpinner ref="dateTime1" @input="dateTimeInput1" label="작업시작"/>  
				</div>
				<div class="col-4">
					<DateTimeSpinner ref="dateTime2" @input="dateTimeInput2" label="작업종료"/>  
				</div>				
			</div>
		</div>
		<div class="accordion mt-2" id="accordionExample">
			<div class="accordion-item mt-2">
				<h2 class="accordion-header" id="headingTwo">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">제품현황</button>
				</h2>
				<div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo">
					<div class="accordion-body">
						<ProductStatus ref="prodStatus" :no="srchInfo.runNo" :process="srchInfo.process" :area="area" :runNo="srchInfo.runNo"/>
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
							<b-button class="sub" @click="cstOrder('asc')">CST ASC</b-button>
							<b-button class="sub" @click="cstOrder('desc')">CST DESC</b-button>
							<b-button class="sub" @click="cstOrder('복구')">복구</b-button>
							<div class="hr"></div>
							<b-button class="me-1" v-if="['035'].includes(srchInfo.process)"  @click="actionRerun">재진행</b-button>
							<div class="hr" v-if="['035'].includes(srchInfo.process)"></div>
							<b-button class="sub" v-if="equipLogBtnEnable || srchInfo.process === '022'" @click="manualCstAdd">수동추가</b-button>
							<b-button class="sub" v-if="equipLogBtnEnable" @click="equipLog">설비로그</b-button>
							<div class="hr" v-if="equipLogBtnEnable || srchInfo.process === '022'"></div>
							<b-button-group class="toggle_btn">
								<b-button :class="jobState === 'none' ? 'on' : ''" @click="startJobClick">작업시작</b-button>
								<b-button :class="jobState === 'start' ? 'on' : ''" @click="endJobClick">작업종료</b-button>
							</b-button-group>
							<div class="hr"></div>
							<b-button :class="jobCancelEnable?'me-1 main':'me-1'" @click="jobCancelClick">작업취소</b-button>
							<b-button :class="jobState !== 'end' ? 'main' : ''" @click="tempSave">임시저장</b-button>
						</div>
						<RealGrid ref="jsdGrid" :uid="'jsdGrid'" :rows="jobDtl" style="height: 72px;" class="mb-1" />
						<ErrorInfoStatus ref="errorInfoStatus" :inQty1="jobDtl.length > 0 ? jobDtl[0]['투입수량'] : 0" class="mb-1"/>
						<b-row>
							<b-col cols="3">
								<back1-lot-and-pre-cst-info ref="lapci" :runNo="srchInfo.runNo" :process="srchInfo.process" :lotOnly="srchInfo.process === '023'" :isEditabled="this.jobState !== 'end'" :callSaveData="callSaveData" @updateCstCell="updateCstCell" @save="saveCallback"/>
							</b-col>
							<b-col>
								<RealGrid ref="jsGrid" :uid="'jsGrid'" :rows="jobStatuses" :fitLayoutWidthEnable="false"/>
							</b-col>
						</b-row>
					</div>
				</div>
			</div>
			<!-- <div class="caution mt-2">
				<div class="title">RUN-CARD 특이 사항 및 작업 시 주의사항</div>
				<b-form-textarea id="textarea" v-model="note" rows="3" max-rows="10" placeholder="None" />
			</div> -->
			<!--2025.5.30 사용중지-->
			<!-- <div v-if="area === 'back1'" class="prc_summary mt-4">
				<div class="legend">
					<div class="finish">완료공정</div>
					<div class="ongoing">현공정</div>
					<div class="next">인계공정</div>
				</div>
				<div class="row">
					<div class="col" v-for="(obj, index) in processesStatus" :key="index"
						:class="getProcStatusClass(obj['status'])">
						<b-card>
							<b-card-title>{{ obj['sysResourceName'] }}
								<span>
									수율 : {{ Math.ceil(obj['yield']) }}%
								</span>
							</b-card-title>
							<b-card-text>
								<div>투입수량 : <span>{{ obj['투입수량'] }}</span></div>
								<div>양품수량 : <span>{{ obj['양품수량'] }}</span></div>
								<div>불량수량 : <span>{{ obj['불량수량'] }}</span></div>
							</b-card-text>
						</b-card>
					</div>
				</div>
			</div> -->
		</div>
		<EquipLog ref="elPopup" @confirm="equipLogConfirm"/>
		<ChangeCstNo ref="ccPopup" @confirm="changeCstNoConfirm"/>
		<ManualCstAdd ref="mcaPopup" @confirm="manualCstAddConfirm"/>
		<CstTCntInput ref="cstTCntInput" @confirm="confirmTCntInput"/>
	</div>
</template>
<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import Back1LotAndPreCstInfo from '@components/Back1LotAndPreCstInfo.vue';
import ProductStatus from '@components/ProductStatus.vue';
import EquipLog from "@web/popup/EquipLog";
import ManualCstAdd from "@web/popup/ManualCstAdd";
// import ReClean from "@web/popup/ReClean";
import moment from 'moment';
import { useM0003001 } from '@web/store/M0003001.js';
import { useM0003008 } from '@web/store/M0003008.js';
import { _ } from 'core-js';
// import ErrorInput from "@web/popup/ErrorInput";
import ErrorInfoStatus from '@components/ErrorInfoStatus.vue';
import ChangeCstNo from "@web/popup/ChangeCstNo";
import CstTCntInput from "@web/popup/CstTCntInput";

const URI_PREFIX = '/api/m0003000/m0003001';
export default {
	setup(props) {
		const userAuthInfo = useUserAuthInfo();
		const srchInfo = props.sysRescId === 'TAB031000'?useM0003001():useM0003008();
		
		return { userAuthInfo,  srchInfo};
	},
	props: {
		upperSysRescId:{ type: String, default: null },
		sysRescId:{ type: String, default: null },
	},
	components: {
		Back1LotAndPreCstInfo, EquipLog, ProductStatus, ErrorInfoStatus, ChangeCstNo, ManualCstAdd, CstTCntInput
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
			processList:[],
			jobState: 'none',	//none:아무상태 아님,start:시작,end:작업종료까지 완료료
			jobEnable: false,	//true:작업시작 했음,false: 안했음

			nextProcess: '',	//인계공정
			nextProcessList: [],
			jsdGrid: null,
			jsGrid: null,
			
			jobCancelEnable:false,

			shifts: [],
			// workCrews: [],
			jobDtl: [],
			jobStatuses: [],
			gridSrcMap: {
				'023': 'TAB031000_1',	//박리
				'027': 'TAB031000_2',	//박리후세정
				'033': 'TAB031000_2',	//bTP
				'035': 'TAB031000_2',	//재세정
				'037': 'TAB031000_3',	//전환적
				'040': 'TAB031000_6',	//강화	
				'043': 'TAB031000_3',	//후환적
				'047': 'TAB031000_2',	//강화후세정
				'050': 'TAB031000_2',	//aTP

				'022': 'TAB048000_3',	//rework run
			},
			worker: "",
			selectedShift: "",
			selectedMc: "",
			mcList: [],
			processesStatus: [],
			mProcessList:['023','037','043'],
			nics:[],	//전공정 미투입 카세트 리스트
			startDay: null,
			startTime: null,
			endDay: null,
			endTime: null,
		}
	},
	computed: {
		equipLogBtnEnable(){
			return this.mProcessList.indexOf(this.srchInfo.process) > -1;
		},
		area(){
			return this.srchInfo.process === '022'?'rework':"back1";
		},		
	},
	created() {
		this.getProcessList();
		this.initializeGrid();
	},
	mounted() {
		this.$eventBus.on("Back1MenuMove", this.back1MenuMove);
		this.getCodes();
		this.getMcListByProc();
		this.getNextProc();
	},
	beforeUnmount() {
		this.$eventBus.off("Back1MenuMove");
	},
	methods: {
		getProcessList(){
			this.processList = this.userAuthInfo.getTabInfoListBySRI(this.upperSysRescId, this.sysRescId);
		},
		back1MenuMove(data) {
			let searchFlag = false;
			this.$nextTick(()=>{
				if (this.srchInfo.process != data["공정코드"] || this.srchInfo.runNo != data["runNo"]) {
					searchFlag = true;
				}
				this.srchInfo.process = data["공정코드"];
				this.srchInfo.runNo = data["runNo"];
	
				if (searchFlag) {
					setTimeout(()=>{
						this.searchClick();
					}, 1000);
				}
			});
		},
		getProcStatusClass(status) {
			console.log("status:::", status);
			if (status === '완료공정') {
				return `finish`;
			}

			if (status === '현공정') {
				return `ongoing`;
			}

			return `next`;
		},
		jsdGV() {
			return this.$refs.jsdGrid.getGridView();
		},
		jsdDP() {
			return this.$refs.jsdGrid.getGridDataProvider();
		},
		jsGV() {
			return this.$refs.jsGrid.getGridView();
		},
		jsDP() {
			return this.$refs.jsGrid.getGridDataProvider();
		},
		initializeGrid() {
			this.jsdGrid = _.cloneDeep(require(`@web/m0003000/js/TAB031000_5`));
			let p = this.srchInfo.process||'023'	//default
			this.jsGrid = _.cloneDeep(require(`@web/m0003000/js/` + this.gridSrcMap[p] + `.js`));
		},
		tCstCntCellStyleCallback(grid, model) {
			let ds = grid.getDataSource();
			let jsonData = ds.getJsonRow(model.index.dataRow);
			let rtn = {};
			rtn['editable'] = (this.jobState !== 'end' && jsonData['tCnt'] === 1);	//tCnt : 1 은 단일 로우
			rtn['styleName'] = this.jobState !== 'end'?'edit tr':'tr';

			return rtn;
		},
		getCodes() {
			this.$utils.getCommonContentValueText(['06'], [this.shifts]);	//shift
			// console.log("this.shifts:::",this.shifts);
		},
		async getMcListByProc() {
			let qp = {};
			qp['process'] = this.srchInfo.process;
			let param = { menuId: 'M0003001', queryId: 'selectBack1McList', queryParams: qp, target: this.mcList };
			await this.$axios.api.search(param);
		},
		async getNextProc() {
			let qp = {};
			qp['process'] = this.srchInfo.process;
			let param = { menuId: 'M0003001', queryId: 'selectNextProcess', queryParams: qp, target: this.nextProcessList };
			await this.$axios.api.search(param);
			if (!_.isEmpty(this.nextProcessList)) {
				this.nextProcess = this.nextProcessList[0].value;
			}
			return true;
		},
		async onProcessChange(evt) {
			this.$refs.dateTime1.clearClick();
        	this.$refs.dateTime2.clearClick();
			this.initData();
			this.getMcListByProc();
			this.$refs.jsdGrid.destroy();
			this.$refs.jsGrid.destroy();

			this.initializeGrid();
			this.$refs.jsdGrid.created();
			this.$refs.jsGrid.created();

			//전공정미투입 카세트 표시를 위한 추가 2025.3.9
			this.jsGV().columnByName("fCstno").styleCallback = this.fCstnoCellStyleCallback;
			this.jsGV().columnByName("특이사항").styleCallback = this.bigoCellStyleCallback;
			
			this.jsGV().columnByName('t수량').styleCallback = this.tCstCntCellStyleCallback;

			if(this.srchInfo.process === '023'){
				this.jsGV().setRowStyleCallback(this.rowStyleCallback);
				// this.jsGV().onShowTooltip = this.onShowTooltip;
			}

			// this.$refs.lapci.clearData();
			this.$refs.prodStatus.clearData();
			this.getNextProc().then( r =>{
				if(!_.isEmpty(this.srchInfo.runNo)){
					this.search();
				}
			});
		},
		rowStyleCallback(grid, item, fixed){
			let ret = {};
			let cv = grid.getValue(item.index, "fCstno");
			let rds = this.jsDP().getJsonRows(); 
			let cnt = 0;
			rds.forEach(el => {
				if(el['fCstno'] === cv){
					cnt++;
				}
			})
			if(cnt > 1){
				ret.style = {background:"#FAFAD2"};
			}
			return ret;
		},
		getLotBadCellSum(lotNo){
			let s = 0;
			let rds = this.jsDP().getJsonRows();
			rds.forEach(el => {
				if(el['lotNo'] === lotNo){
					s += el['불량합계']||0;
				}
			});
			return s;
		},
		onShowTooltip(grid, index, value){
			let column = index.column;			
			if(column !== "lotNo"){
				return null;
			}

			let lotNoList = [];
			let lotInputCntList = [];
			let lotBadCellList = [];
			let inputCntSum = 0;
			let badCntSum = 0;
			let rds = this.jsDP().getJsonRows();
			//tCstno
			rds.forEach(el => {
				if (lotNoList.indexOf(el['lotNo']) === -1) {
					lotNoList.push(el['lotNo']);
					lotInputCntList.push(el['cell']);
					inputCntSum += Number(el['cell'])||0;
					let tempBadSum = this.getLotBadCellSum(el['lotNo']);
					lotBadCellList.push(tempBadSum);
					badCntSum += tempBadSum||0;
				}
			});
			
			let tooltip = "<table border='1' cellspacing='0' cellpadding='5' class='tooltip_grid'>"+
							"<thead>"+
								"<tr>"+
									"<th>LOT_NO</th>"+
									"<th>투입수량</th>"+
									"<th>양품수량량</th>"+
									"<th>불량수량</th>"+
								"</tr>"+
							"</thead>";
			for(let i = 0; i < lotNoList.length; i++){
				tooltip += "<tr><td>"+ lotNoList[i]+"</td><td>"+lotInputCntList[i]+"</td><td>"+(lotInputCntList[i] - lotBadCellList[i])+"</td><td>"+lotBadCellList[i]+"</td></tr>"
			};
			tooltip += "<tr class='amount'><td><strong>합계</strong></td><td><strong>"+inputCntSum+"</strong></td><td><strong>"+(inputCntSum - badCntSum)+"</strong></td><td><strong>"+badCntSum+"</strong></td></tr></tbody></table>";
				
			return tooltip;
		},
		fCstnoCellStyleCallback(grid, model){
			let v = grid.getValue(model.index.dataRow,"fCstno");      
			let b = this.nics.indexOf(v) > -1;
			let rtn = {};
			if(b){
				rtn['styleName'] = 'warning';
			}
			return rtn;
		},
		//특이사항 입력 가능여부
		bigoCellStyleCallback(grid, model){
			let rtn = {};
			rtn['editable'] = this.jobState !== 'end';
			return rtn;
		},

		searchClick() {
			if (this.jobEnable) {
				this.$confirmYesOrNo("선택", "진행중인 작업이 있습니다.조회 하시겠습니까?", (confirmed) => {
					if (confirmed) {
						this.search();
					}
				});
			} else {
				this.search();
			}
		},
		

		async search() {
			let vp = {};
			vp['runNo'] = this.srchInfo.runNo;
			vp['process'] = this.srchInfo.process;

			if (!this.$utils.validateFields(vp, ['C:공정:process','T:RunNo:runNo'])) {
				return;
			}

			this.searchExec();			
		},
		async searchExec(){
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['upperSysResourceId'] = 'TAB031000';
			params['prodCategory'] = this.userAuthInfo.curProdCtg;
			console.log("params['nextProcess']:::",params['nextProcess']);
			let resp = await this.$axios.post(URI_PREFIX + "/search", params);
			let result = resp.data;			
			if (result['msg'] !== 'ok') {
				this.initData();
				this.$refs.runNo.focus();
				this.$refs.runNo.select();
				this.$toast("info", result['msg']);

			} else {
				if (this.mProcessList.indexOf(this.srchInfo.process) > -1 && _.isEmpty(result['cstExist'])) {
					if (_.isEmpty(result['prodVLR']['작업시작']) && _.isEmpty(result['prodVLR']['시작시각'])) {
						let params = {};
						params['process'] = this.srchInfo.process;
						params['result'] = result;
						params['dialogTitle'] = 'RunNo: '+this.srchInfo.runNo;
						params['reload'] = false;
						params['runNo'] = this.srchInfo.runNo;
						this.$refs.elPopup.openDialog(params);
					} else {
						this.setInfo(result);
					}

				} else {
					this.setInfo(result);
				}
			}
		},
		async setInfo(result) {
			this.jsDP().setRows(result['list']);
			this.jobDtl = [result['prodVLR']];
			// this.processesStatus = result['processesStatus'];
			this.setJobStateByVLR(result['prodVLR']);

			this.nics = result['noInputCsts'];
			this.$refs.prodStatus.loadData();			
			
			if(_.isEmpty(result['cstExist']) && this.jobState !== 'end'){
				console.log("카세트 임시 저장 처리");
				
				this.initCstInfoSave(result['prodVLR']['차수'],result['prodVLR']['machineCode']);
			}else{
				this.$refs.lapci.loadData();
			}
			this.checkNextProcess(result['nextProdVLR']);
			this.loadErrorStatus();
		},
		async initCstInfoSave(degrees,machineCode) {
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;

			let cstList = this.replaceSeq(this.jsDP().getJsonRows(0,-1));
			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let inputCelSum = this.getInputCellSum(this.srchInfo.process);

			params['cstList'] = cstList;
			params['투입수량'] = inputCelSum;
			params['검사수량'] = inputCelSum;
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params["차수"] = degrees;
			params["machineCode"] = machineCode;

			let resp = await this.$axios.post(URI_PREFIX + "/initsave", params);			
			if (resp.data['msg'] === "ok") {
				this.jobDtl = [resp.data['prodVLR']];
				this.jsDP().setRows(resp.data['csts']);
				this.$refs.lapci.loadData();
			} else {
				this.$toast('info', 'CST 정보 초기화 실패하였습니다.');
			}
		},
		
		setJobStateByVLR(vlr) {			
			if (_.isEmpty(vlr['작업시작']) && _.isEmpty(vlr['시작시각'])) {
				this.jobState = 'none';
			} else if (_.isEmpty(vlr['작업종료']) && _.isEmpty(vlr['종료시각'])) {
				this.jobState = 'start'
				this.jobEnable = true;
			} else {
				this.jobState = 'end';	//작업종료된것인데 .... 일단 다시 시작 할 수 있게 
			}

			this.jsGV().setEditOptions({ editable: true });	//항상 수정 가능로
		},
		initData() {
			this.jobDtl = [];
			this.jobStatuses = [];
			this.worker = "";
			this.selectedShift = "";
			this.selectedMc = "";
			this.jobState = 'none';
			this.jobEnable = false;
			this.jsdDP().setRows([]);
			this.jsDP().setRows([]);
			this.$refs.lapci.clearData();
			// this.psDP().setRows([]);
		},
		async changeCstNoConfirm(params){
			this.jsDP().setRows(params["cstRows"]);
			if(params['jobDiv'] === "start"){	//작업시작
				this.startJob();
			}else if(params['jobDiv'] === "end"){	//작업종료
				this.endJobCheckCst();
			}
		},		
		async startJobClick(){
			//2025.3.18 전환적은 재세정 필요여부 체크 
			//org code
			if(this.srchInfo.process === '037'){
				let qp = {};
				let sd = this.startDay||moment().format('YYYYMMDD');
				let st = this.startTime||moment().format('HHmmss');
				qp['runNo'] = this.srchInfo.runNo;
				qp['dateTimeStr'] = sd + " "  + st;
				let param = { menuId: 'M0003001', queryId: 'checkReCleaning', queryParams: qp};
				this.$axios.api.search(param).then(rslt=>{
					if(_.isEmpty(rslt)){
						this.$toast("info","재세정 확인불가로 진행 할 수 없습니다.");
					}else{
						if(rslt[0]['상태'] === '정상'){
							this.startJobCheck();
						}else{
							this.$toast("info",rslt[0]['메시지']);
						}
					}
				});
			}else{
				this.startJobCheck();
			}

			//test code
			// this.startJobCheck();
		},		
		async startJobCheck(){
			if (this.jobState === 'start') {
				this.$toast('info', '이미 작업 시작되었습니다.');
				return;
			}

			if (this.jobState === 'end') {
				this.$toast('info', '이미 작업 완료되었습니다.');
				return;
			}

			let params = {};
			let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['worker'] = this.worker;
			params['selectedShift'] = this.selectedShift;
			params['selectedMc'] = this.selectedMc;

			let param = { menuId: 'M0003001', queryId: 'selectStartJobAlbe', queryParams: params};
			this.$axios.api.search(param).then(rslt=>{
				if(rslt[0] === '진행불가'){
					this.$toast("info","이전 공정이 작업완료 되지 않아 작업시작 할 수 없습니다.");
					return;
				}
				//start - check 로직			
				if (_.isEmpty(cstList)) {
					this.$toast('info', '조회된 작업정보가 없습니다.');
					return;
				}
	
				if (!this.$utils.validateFields(params, ['T:RunNo:runNo', 'T:작업자:worker', 'S:Shift:selectedShift', 'S:M/C:selectedMc'])) {
					return;
				}
				//end
	
				this.$confirmYesOrNo("선택", "변경된 카세트가 있습니까?", (confirmed) => {
					if (confirmed) {
						let p = {};
						p['cstRows'] = cstList;
						p['jobDiv'] = "start";	//start,end
						this.$refs.ccPopup.openDialog(p);
					}else{
						this.startJob();
					}
				});
			});

		},
		async startJob() {
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['worker'] = this.worker;
			params['selectedShift'] = this.selectedShift;			
			params['selectedMc'] = this.selectedMc;

			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
			let inputCelSum = this.getInputCellSum(this.srchInfo.process);

			params['투입수량'] = inputCelSum;
			params['검사수량'] = inputCelSum;	//2025.4.9 활성화 로직은 바뀔수 있음
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params['특이사항'] = this.jsdGV().getValue(0, '특이사항');
			params['cstList'] = cstList;
			params["peelingDiv"] = this.getPeelingDiv();
			params["차수"] = this.jobDtl[0]['차수'];
			
			params = this.setStartJobDateTime(params);

			let resp = await this.$axios.post(URI_PREFIX + "/startjob", params);
			if (resp.data.msg === "ok") {
				this.jobDtl = [resp.data['prodVLR']];
				this.jobEnable = true;
				this.jsGV().setEditOptions({ editable: this.jobEnable });
				this.$toast('success', '작업 시작되었습니다.');
				this.jobState = 'start';

				this.reloadCstInfo();
			} else {
				this.$toast('error', '작업시작 실패하였습니다.');
			}

		},
		getProcessFCstCell(){
			let list = this.jsDP().getJsonRows(0,-1);
			let cell = 0;
			list.forEach(el => {
				cell += new Number(el["f수량"])||0;
			});
			return cell;
		},
		endJobClick() {
			if (this.jobState === 'end') {
				this.$toast('info', '이미 작업 완료되었습니다.');
				return;
			}

			if (this.jobState !== 'start') {
				this.$toast('info', '작업시작 후 작업종료 가능합니다.');
				return;
			}

			let preProcessCell = this.$refs.prodStatus.getCstCell();
			let processFCstCell = this.getProcessFCstCell();
			let notEqualBadSumList = this.$refs.lapci.getNotEqualBadSum();
			
			if(preProcessCell !== processFCstCell){
				console.warn("preProcessCell:::",preProcessCell,"processFCstCell:::",processFCstCell);
				this.$toast('info', '전공정 양품수량과 현공정 투입수량이 상이 합니다. 확인하세요');
				return;
			}

			// console.log("notEqualBadSumList:::",notEqualBadSumList);
			if(notEqualBadSumList.length > 0){
				this.$toast('info', notEqualBadSumList.join(",") + ' CST_NO 불량입력 수량이 맞지 않습니다.');
				return;
			}

			let vlrBadCnt = this.jsdDP().getJsonRow(0)['불량수량']||0;
			let badSum = this.$refs.lapci.getBadSum();

			if(vlrBadCnt !== badSum){
				console.warn("vlrBadCnt:::",vlrBadCnt,"badSum:::",badSum);
				this.$toast('info', '불량수량을 확인하세요');
				return;
			}
			
			if (this.jobEnable) {
				let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
				this.$confirmYesOrNo("선택", "변경된 카세트가 있습니까?", (confirmed) => {
					if (confirmed) {
						let p = {};
						p['cstRows'] = cstList;
						p['jobDiv'] = "end";	//start,end
						this.$refs.ccPopup.openDialog(p);
					}else{
						this.endJobCheckCst();
					}
				});
			} else {
				this.$toast("info", "작업중인 정보가 없습니다.");
			}
		},
		endJobCheckCst(){
			let qp = {};
			let errorCstList = [];
			qp['process'] = this.srchInfo.process;
			qp['runNo'] = this.srchInfo.runNo;

			let param = { menuId: 'M0003001', queryId: "checkValidationOutCst", queryParams: qp};
			this.$axios.api.search(param).then(rslt =>{
				rslt.forEach(el => {
					if(el['message'] !== 'OK'){
						errorCstList.push(el);
					}
				});

				if(_.isEmpty(errorCstList)){
					this.endJob();
				}else{
					errorCstList.forEach(row => {
						this.$toast('info', row['message']);
					});
				}
			});



		},
		async endJob() {
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['worker'] = this.worker;
			params['selectedShift'] = this.selectedShift;
			params['selectedMc'] = this.selectedMc;
			params['작업종료'] = this.endDay||moment().format('YYYYMMDD');
			params['종료시각'] = this.endTime||moment().format('HHmmss');

			this.jsGV().commit();

			let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let inputCelSum = this.getInputCellSum(this.srchInfo.process);

			params['cstList'] = cstList;
			params['투입수량'] = inputCelSum;
			params['검사수량'] = inputCelSum;	//2025.4.9 활성화 로직은 바뀔수 있음      
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params['특이사항'] = this.jsdGV().getValue(0, '특이사항');
			params["peelingDiv"] = this.getPeelingDiv();
			params["차수"] = this.jobDtl[0]['차수'];

			//2025.4.8 - 박리,환적 의 경우 작업종료료 datetime 셋팅 기준 추가 && 자동
			if((this.mProcessList.indexOf(params['process']) > -1 && params["peelingDiv"] === "1") || params['process'] === '022'){
				let maxEndDateTime = "";
				cstList.forEach(el => {
					let tempDateTime = el['작업종료'] + ' '+ el['종료시각'] ;
					if(maxEndDateTime !== ""){
						maxEndDateTime = tempDateTime > maxEndDateTime ? tempDateTime : maxEndDateTime;
					}else{
						maxEndDateTime = tempDateTime;
					}
				});
				params['작업종료'] = maxEndDateTime.split(" ")[0];
				params['종료시각'] = maxEndDateTime.split(" ")[1];

				if(params['작업종료'] === 'null' && params['종료시각'] === 'null'){
					params['작업종료'] = moment().format('YYYYMMDD');
					params['종료시각'] = moment().format('HHmmss');

					cstList.forEach(el => {
						el['작업종료'] = moment().format('YYYYMMDD');
						el['종료시각'] = moment().format('HHmmss');
					});
				}
			}

			let resp = await this.$axios.post(URI_PREFIX + "/endjob", params);

			if (resp.data === "ok") {
				this.jobEnable = false;
				this.search();
				this.$toast('success', '작업종료 처리되었습니다.');
			} else {
				this.$toast('error', '작업종료 실패하였습니다.');
			}
		},
		getInputCellSum(process) {
			let s = 0;
			let rds = this.jsDP().getJsonRows();
			rds.forEach(el => {
				s += Number(el['f수량'])||0;
			});
			return s;
		},
		getCellSum() {
			let s = 0;
			let rds = this.jsDP().getJsonRows();
			rds.forEach(el => {
				s += el['tOrg수량']||0;
			});

			return s;
		},
		getBadSum() {
			let s = 0;
			let rds = this.jsDP().getJsonRows();
			rds.forEach(el => {
				s += el['f불량수량']||0;
			});
			
			return s;
		},
		getLotBadSum(lotNo) {
			let s = 0;
			let rds = this.jsDP().getJsonRows();
			rds.forEach(el => {
				if(el['lotNo'] === lotNo) {
					s += el['불량합계']||0;					
				}
			});
			return s;
		},
		dateTimeInput1(fullDateTime) {
			if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
				this.startDay = fullDateTime.split(" ")[0];
				this.startTime = fullDateTime.split(" ")[1];
			}else{
				this.startDay = null;
				this.startTime = null;
			}
		},

		dateTimeInput2(fullDateTime) {
			if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
				this.endDay = fullDateTime.split(" ")[0];
				this.endTime = fullDateTime.split(" ")[1];
			}else{
				this.endDay = null;
				this.endTime = null;
			}
		},
		onEditRowChangedJsdGrid(grid, itemIndex, dataRow, field, oldValue, newValue) {
			grid.commit();
		},
		onCellEditedJsGrid(grid, itemIndex, row, field) {      
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

		async tempSave() {
			if (this.jobState === 'end') {
				this.$toast('info', '이미 작업 완료되었습니다.');
				return;
			}
			let params = {};
			let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
			
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			//start - check 로직			
			if (_.isEmpty(cstList)) {
				this.$toast('info', '조회된 작업정보가 없습니다.');
				return;
			}
			
			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let inputCelSum = this.getInputCellSum(this.srchInfo.process);

			params['cstList'] = cstList;
			params['투입수량'] = inputCelSum;
			params['검사수량'] = inputCelSum;
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params["차수"] = this.jobDtl[0]['차수'];

			let resp = await this.$axios.post(URI_PREFIX + "/savetemp", params);
			if (resp.data === "ok") {
				this.$toast('success', '저장 되었습니다.');
				this.search();
			} else {
				this.$toast('info', resp.data);
			}
		},
		equipLogConfirm(value) {
			if(value['reload'] === true){
				this.reEquipLogConfirm(value.result);
			}else{
				//2025.0408 - 자동인 경우 로그의 작업자,shift,M/C 셋팅 				
				if(value.peelingDiv === "1" && value.result['list'].length > 0){	
					let obj = value.result['list'][0];
					this.worker = obj['작업자'];
					this.selectedShift = obj['근무조'];
					this.selectedMc = obj['설비호기'];
				}

				this.setInfo(value.result)
			}
		},
		onCellClickedJsGrid(grid, clickData) {
			if(clickData.cellType !== "data") return;

			let ds = grid.getDataSource();
			let current = grid.getCurrent();
			let jsonData = ds.getJsonRow(current.dataRow);

			if(clickData.fieldName == 't수량'){
				let c = this.srchInfo.process === "022"?999:30;	//적재수량량				
				let editable = this.jobState !== 'end';
				if(jsonData["tCnt"] > 1){
					let rows = this.jsDP().getJsonRows(0, -1)
					.map((item, index) => ({ ...item, idx: index }))
					.filter(item => item.tCstno === jsonData["tCstno"]);
					this.$refs.cstTCntInput.openDialog({ isLot:true,tCstno: jsonData["tCstno"], rows: rows, isEditabled: editable, errorCnt: c });
				}
			}else if(clickData.fieldName === '불량입력'){	//사용중지됨
				let p = {};
				p['type'] = this.srchInfo.process === "023"?'etcno':'cstno';
				p['etcNo'] = grid.getValue(clickData.dataRow,'lotNo');
				p['lotNo'] = grid.getValue(clickData.dataRow,'lotNo');
				p['fCstNo'] = grid.getValue(clickData.dataRow,'fCstno');
				p['tCstNo'] = grid.getValue(clickData.dataRow,'tCstno');
				p['runId'] = this.srchInfo.runNo;
				p['자동여부'] = this.srchInfo.process === "023"?"1":"0";
				p['공정코드'] = this.srchInfo.process;
				p['line'] = "D1UT";
				p['dialogTitle'] = this.srchInfo.runNo + " / " + grid.getValue(clickData.dataRow,'tCstno');
				console.log("this.jobEnable:::",this.jobEnable);
				p['isEditabled'] = true;
				
				let errorCnt = 30;
				if(this.srchInfo.process === "023"){
					errorCnt = grid.getValue(clickData.dataRow,'cell') - this.getLotBadSum(grid.getValue(clickData.dataRow,'lotNo')); 
				}
				console.log("errorCnt:::",errorCnt);
				
				p['errorCnt'] = errorCnt;

				this.badClick(p);
			}
		},
		
		confirmTCntInput(rows){
			if(!_.isEmpty(rows)){
				rows.forEach(el => {
					this.jsDP().setValue(el.idx, "tOrg수량", el['tOrg수량']);
					this.jsDP().setValue(el.idx, "t수량", el['sumCnt']);
				});
			}
			this.$refs.cstTCntInput.closeDialog();
		},
		badClick(params){
			this.$refs.errorInput.openDialog(params);
		},
		saveCallback(params,badSum){
			this.search();
		},
		async reloadCstInfo(){
			let params = {};
			params["runNo"] = this.srchInfo.runNo;
			params["process"] = this.srchInfo.process;
			params["peelingDiv"] = this.getPeelingDiv();
			
			let resp = await this.$axios.post(URI_PREFIX + "/reload/cst", params);
			// this.jobStatuses = resp.data;
			this.jsDP().setRows(resp.data);
			this.$refs.lapci.loadData();
		},
		async loadErrorStatus(){
			console.log("start loadErrorStatus");
			this.$refs.errorInfoStatus.loadData({
				'line':"D1UT",
				'공정코드':this.srchInfo.process,
				'runId':this.srchInfo.runNo,
				"자동여부": this.srchInfo.process === "023"?"1":"0",	
				'etcNo':this.srchInfo.runNo
			});
		},
		//수동,자동 구분
		getPeelingDiv(){
			let mcName = '';
			this.mcList.forEach(el => {
				if(el.value === this.selectedMc){
					mcName = el.text;
				}
			});			
			
			return mcName.indexOf("수동") > -1 ? "0":"1";
		},
		
		convertToUpperEnglish(event) {
			const group = event.target.dataset.group; // params 또는 params1 판별
			const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
			if (group && this[group]) {
				this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
			}
		},
		onRowCountChangedJsGrid(provider, newCount){ 
			console.log("onRowCountChangedJsGrid");
		},
		
		//[설비로그] 버튼에 의한 재조회 셋팅 로직 시작
		async equipLog(){
			if(this.jobState === "end"){
				this.$toast('info', '이미 작업종료되었습니다.');
				return;
			}

			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['upperSysResourceId'] = 'TAB031000';
			params['prodCategory'] = this.userAuthInfo.curProdCtg;

			let resp = await this.$axios.post(URI_PREFIX + "/search/equiplog", params);
			let result = resp.data;			
			if (result['msg'] !== 'ok') {
				this.initData();
				this.$refs.runNo.focus();
				this.$refs.runNo.select();
				this.$toast("info", result['msg']);

			} else {
				if (this.mProcessList.indexOf(this.srchInfo.process) > -1) {
					let params = {};
					params['process'] = this.srchInfo.process;
					params['result'] = result;
					params['dialogTitle'] = 'RunNo: '+this.srchInfo.runNo;
					params['reload'] = true;
					this.$refs.elPopup.openDialog(params);

				}else{
					this.$toast("info", "설비로그와 관련 없는 공정입니다.");
				}
			}
		},
		//[설비로그] 버튼에 의한 재조회 셋팅
		async reEquipLogConfirm(result) {			
			this.jsDP().setRows(result['list']);
			
			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['worker'] = this.jobDtl[0]['작업자'];
			params['selectedShift'] = this.jobDtl[0]['shift'];
			params['selectedMc'] = this.jobDtl[0]['machineCode'];

			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
			let inputCelSum = this.getInputCellSum(this.srchInfo.process);

			params['투입수량'] = inputCelSum;
			params['검사수량'] = inputCelSum;
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params['특이사항'] = this.jsdGV().getValue(0, '특이사항');
			params['cstList'] = cstList;
			params["peelingDiv"] = this.getPeelingDiv();
			params["차수"] = this.jobDtl[0]['차수'];
			
			params = this.setStartJobDateTime(params);
			
			let resp = await this.$axios.post(URI_PREFIX + "/restartjob", params);

			if (resp.data.msg === "ok") {
				this.$toast('success', '저장되었습니다.');
				this.jobDtl = [resp.data['prodVLR']];
				this.reloadCstInfo();
			} else {
				this.$toast('error', '저장 실패하였습니다.');
			}

			this.loadErrorStatus();
		},

		manualCstAdd(){	
			if(this.jobState === "end"){
				this.$toast('info', '이미 작업종료되었습니다.');
				return;
			}else if(_.isEmpty(this.jobDtl)){
				this.$toast('info', '조회된 작업정보가 없습니다.');
				return;
			}

			let params = {};
			params['process'] = this.srchInfo.process;
			params['runNo'] = this.srchInfo.runNo;
			params['dialogTitle'] = 'RunNo: '+this.srchInfo.runNo + ' 카세트 수동 추가' ;
			params['csts'] = this.jsDP().getJsonRows();
			params['shifts'] = this.shifts;
			params['mcList'] = this.mcList;
			params['worker'] = this.worker;
			params['selectedShift'] = this.selectedShift;
			params['selectedMc'] = this.selectedMc;
			params["차수"] = this.jobDtl[0]['차수'];

			this.$refs.mcaPopup.openDialog(params);
		},
		async manualCstAddConfirm(value) {
			this.jsDP().addRows(value['mlist']);

			let params = {};
			params['runNo'] = this.srchInfo.runNo;
			params['process'] = this.srchInfo.process;
			params['nextProcess'] = this.nextProcess;
			params['worker'] = value['worker'];
			params['selectedShift'] = value['selectedShift'];
			params['selectedMc'] = value['selectedMc'];

			let cellSum = this.getCellSum();
			let badCntSum = this.getBadSum();
			let cstList = this.addNewSeq(this.jsDP().getJsonRows(0,-1));
			let inputCelSum = this.getInputCellSum(this.srchInfo.process);

			params['투입수량'] = inputCelSum;
			params['검사수량'] = inputCelSum;
			params['불량수량'] = badCntSum;
			params['양품수량'] = cellSum;
			params['특이사항'] = this.jsdGV().getValue(0, '특이사항');
			params['cstList'] = cstList;
			params['작업시작'] = moment().format('YYYYMMDD');
			params['시작시각'] = moment().format('HHmmss');
			params["peelingDiv"] = this.getPeelingDiv();
			params["차수"] = this.jobDtl[0]['차수'];
			
			let resp = await this.$axios.post(URI_PREFIX + "/manualaddcst", params);

			if (resp.data.msg === "ok") {
				this.$toast('success', '저장되었습니다.');
				this.jobDtl = [resp.data['prodVLR']];
				this.reloadCstInfo();
			} else {
				this.$toast('error', '저장 실패하였습니다.');
			}

			this.loadErrorStatus();
		},
		
		setStartJobDateTime(params){
			let cstList = params["cstList"];
			
			if((this.mProcessList.indexOf(params['process']) > -1 && params["peelingDiv"] === "1") || params['process'] === '022'){
				let minStartDateTime = "";
				cstList.forEach(el => {
					let tempDateTime = el['작업시작'] + ' '+ el['시작시각'] ;
					if(minStartDateTime !== ""){
						minStartDateTime = tempDateTime < minStartDateTime ? tempDateTime : minStartDateTime;
					}else{
						minStartDateTime = tempDateTime;
					}
				});
				params['작업시작'] = minStartDateTime.split(" ")[0];
				params['시작시각'] = minStartDateTime.split(" ")[1];

				if(params['작업시작'] === 'null' && params['시작시각'] === 'null'){
					params['작업시작'] = moment().format('YYYYMMDD');
					params['시작시각'] = moment().format('HHmmss');

					cstList.forEach(el => {
						el['작업시작'] = moment().format('YYYYMMDD');
						el['시작시각'] = moment().format('HHmmss');
					});

					params["cstList"] = cstList;
				}

			}else{
				params['작업시작'] = this.startDay||moment().format('YYYYMMDD');
				params['시작시각'] = this.startTime||moment().format('HHmmss');
			}

			return params;
		},
		async actionRerun(){
			let params = {};
			params['공정코드'] = this.srchInfo.process;
			params['runNo'] = this.srchInfo.runNo;
			
			if (!this.$utils.validateFields(params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
       			return;
			}

			if(this.jobState === "none"){
				this.$toast('info', "진행된 내용이 없어 재진행 할 수 없습니다.");
				return;
			}

			let saveFunc = async () => {
				let param = {
					"menuId": 'M0003002',
					"update": [{ queryId: "M0003002_RERUN", data: [{...params}] }],
				};
				
				const resp = await this.$axios.api.saveData(param);
				if (resp.status === 'success') {
					this.$toast('success', "재진행 되었습니다.");
					this.search();
				} else {
					this.$toast('error', resp.message);
				}
			};

			this.$confirm("확인", "재진행 하시겠습니까?", (confirm)=>{
				if(confirm){
					saveFunc();
				}
			});
		},

		handleMouseDown(event) {
			const input = this.$refs.runNo;
			if (input && input.value) {
				event.preventDefault();
				input.select();
			}
		},

		callSaveData(){
			return this.$refs.jsGrid.getSaveData();
		},

		updateCstCell(jsonData){
			const gridData = this.jsDP().getJsonRows(0, -1);
			const targetIndex = gridData.findIndex(row => row.pkey === jsonData.pkey);
			if (targetIndex !== -1) {
				console.log("f수량 변경되었습니다.");
				this.jsDP().setValue(targetIndex, 'f수량', jsonData['cstCell']);
				this.jsDP().setValue(targetIndex, 'tOrg수량', jsonData['cstCell'] - (jsonData['f불량수량']||0));
			} else {
				this.$toast('warn','해당 pkey 값을 가진 데이터가 없습니다.');
			}
		},

		jobCancelClick(){			
			if(!this.jobCancelEnable){
				return;
			}

			let rows = this.jsdDP().getJsonRows(0, -1);
			if(_.isEmpty(rows)){
				this.$toast("info","취소 할 작업내용이 없습니다.");
				return;
			}
			this.$confirm("확인", '작업취소 하시겠습니까? <br><span style="color:red">작업했던 내용이 삭제됩니다.</span>', (confirm)=>{
          		if(confirm){
            		this.jobCancel(rows);					
          		}
        	});
		},
		async checkNextProcess(nextVlr){
			if(_.isEmpty(nextVlr) || _.isEmpty(nextVlr['작업시작'])){
				this.jobCancelEnable = true;
			}else{
				this.jobCancelEnable = false;
			}
		},

		async jobCancel(rows){
			let params = {"menuId": 'M0003002',"update": []};
            params["update"].push({ queryId: "M0003002_cancel", data: rows });
            
			const resp = await this.$axios.api.saveData(params);
			if (resp.status === 'success') {
				this.$toast('success', '작업취소 되었습니다.');
				this.search();
			} else {
				this.$toast('error', resp.message);
			}
          
		},
		addNewSeq(list){
			for(let i = 0; i < list.length; i++){
				list[i]['newSeq'] = String(i + 1).padStart(2, '0');	
			}
			return list;
		},
		replaceSeq(list){
			for(let i = 0; i < list.length; i++){
				list[i]['seq'] = String(i + 1).padStart(2, '0');	
			}
			return list;
		},
		cstOrder(order){
			let cl = this.jsDP().getJsonRows(0,-1);
			cl.sort((a, b) => {
				if (order === 'asc') {
					return a.tCstno > b.tCstno ? 1 : -1;
				} else if(order === '복구'){
					return a.seq > b.seq ? 1 : -1;
				}else {
					return a.tCstno < b.tCstno ? 1 : -1;
				}
			});

			this.jsDP().setRows(cl);
		}
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
	}
}
.tooltip_grid{
	background: #fff;
	margin: 2px 0;
	tr{
		&.amount{
			td{
			background: #fff8f8;
			color: #000;	
			border-bottom: 1px solid #797979;
			}
		}
	}
	th{
		background: #e9f1f5;
		color: #000;
		text-align: center!important;
		border-top: none;
		 border-right: 1px solid #D2D5DA;
		 border-bottom: 1px solid #797979;
		  border-left: none;
		&:last-child{
		 border-right: 1px solid #797979;
		}
	}
	td{
	text-align: right;
	border-top: none;
    border-right: 1px solid #D2D5DA;
    border-bottom: 1px solid #D2D5DA;
    border-left: none;
	color: #555;
		&:first-child{
		text-align: center;	
		}
		&:last-child{
		 border-right: 1px solid #797979;
		}
	}
}
</style>