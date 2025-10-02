<template>
  <div>
    <div class="search_box">
      <b-row class="row search_area">
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select
              class="form-select label-60"
              id="floatingSelect"
              aria-label="Floating label select example"
              v-model="params['공정코드']"
            >
              <option 
                v-for="(item, index) in processList" 
                :key="index" 
                :value="item.sysResourceId"
              >
                {{ item.sysResourceName }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating lot_run_num">
            <input
              type="text"
              class="form-control label-60"
              id="floating"
              placeholder="RunNo"
              name="runNo"
              data-group="params"
              @input="convertToUpperEnglish"
              v-model="params['runNo']"
              @keydown.enter="searchClick"
              ref="runNoField"
              autocomplete="off"
              @mousedown="handleMouseDown"
            />
            <label for="floating">RunNo</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <select
              class="form-select label-80"
              id="floatingSelect"
              aria-label="Floating label select example"
              v-model="params['nxt공정코드']"
            >
              <option 
                v-for="(item, index) in items1" 
                :key="index" 
                :value="item.value"
              >
                {{ item.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">인계 공정명</label>
          </div>
        </b-col>
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="worker_wrap">
      <div class="title mr-4">작업자 정보</div>
          <div class="row worker_info">
            <div class="col-3" v-if="params['공정코드']=='054'">
              <div class="form-floating prc_name">
                <input
                  type="text"
                  class="form-control label-60"
                  id="floating"
                  placeholder="책임자"
                  autocomplete="off"
                  v-model="params['책임자']"
                />
                <label for="floating">책임자</label>
              </div>
            </div>
            <div class="col-3" v-if="params['공정코드']=='054'">
              <div class="form-floating prc_name">
                <input
                  type="text"
                  class="form-control label-60"
                  id="floating"
                  placeholder="선임자"
                  autocomplete="off"
                  v-model="params['선임자']"
                />
                <label for="floating">선임자</label>
              </div>
            </div>
            <div class="col-3" v-if="params['공정코드']!=='054'">
              <div class="form-floating prc_name">
                <input
                  type="text"
                  class="form-control label-60"
                  id="floating"
                  placeholder="작업자"
                  autocomplete="off"
                  v-model="params['작업자']"
                />
                <label for="floating">작업자</label>
              </div>
            </div>
            <div class="col-2">
              <div class="form-floating prc_name">
                <select
                  class="form-select label-60"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  v-model="params.shift"
                >
                  <option 
                    v-for="(item, index) in shifts" 
                    :key="index" 
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
                <label for="floatingSelect" class="select">근무조</label>
              </div>
            </div>
            <div class="col-3" v-if="params['공정코드']=='054'" v-show="false">
              <div class="form-floating prc_name">
                <select
                  class="form-select label-80"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                  v-model="params['작업조']" autocomplete="off" :disabled="true"
                >
                  <option 
                    v-for="(item, index) in shiftTypes" 
                    :key="index" 
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
                <label for="floatingSelect" class="select">근무 시간</label>
              </div>
            </div>   
            <div class="col-4" v-if="params['공정코드']=='058' || params['공정코드']=='059'">
            <div class="form-floating prc_name">
              <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example"
                v-model="params.machineCode" autocomplete="off"
              >
                <option 
                  v-for="(item, index) in machineCodes" 
                  :key="index" 
                  :value="item.value"
                >
                  {{ item.text }}
                </option>
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
    <div class="accordion mt-2" id="accordionExample1">
      <div class="accordion-item mt-2">
				<h2 class="accordion-header" id="headingTwo">
					<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">제품현황</button>
				</h2>
				<div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo">
					<div class="accordion-body">
						<ProductStatus ref="prodStatus" :no="params['runNo']" :process="params['공정코드']" :area="'back2'" :runNo="params['runNo']"/>
					</div>
				</div>
			</div>
    </div>
    <div class="accordion mt-2" id="accordionExample2">
      <!-- 첫 번째 패널 -->
      <div class="accordion-item mt-2">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="true"
            aria-controls="collapseOne"
          >
            작업현황
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse show"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionExample2"
        >
          <div class="accordion-body">
            <div class="d-flex mb-1">
            <div class="d-flex me-auto ">
              <b-form-checkbox  v-if="params['공정코드']=='054'"  
                v-model="runStartChk"
                @click="actionRunClick('start')"   
                :disabled="runStartChk"
              >
                RUN 시작
              </b-form-checkbox>
              <b-form-checkbox  v-if="params['공정코드']=='054'"
                v-model="runEndChk"
                @click="actionRunClick('end')"
                :disabled="!runStartChk || runEndChk"
              >
                RUN 종료
              </b-form-checkbox>
              <div class="hr" v-if="params['공정코드']=='054'"></div>
              <b-button class="me-1" :class="{ main : (runStartChk && isEditabled) || (Number(params['차수']) > 1 && !runStartChk) }" v-if="params['공정코드']=='054'" @click="actionRunClick('cancel')">RUN 취소</b-button>
               </div>
              <div class="btn_wrap" v-if="params['공정코드']=='054'">
                <b-button class="me-1 second" v-if="params['차수']>1" @click="actionClick('workStatus')">전체 작업현황</b-button>
                <div class="hr" v-if="params['차수']>1"></div>
				        <!--<b-button class="me-1 second" @click="actionClick('cstChange')">카세트변경</b-button>-->
                <b-button class="me-1 second" @click="actionClick('errorStatus')">불량 맵핑 현황</b-button>
                <b-button class="me-1" :class="{ sub : isRunDisabled }" :disabled="!isRunDisabled" @click="actionRerun">재진행</b-button>
                <!--<div class="form-floating cell_no">
                  <input
                    type="text"
                    class="form-control label-60"
                    id="floating"
                    placeholder="작업자"
                    autocomplete="off"
                    ref="cstno"
                    name="cstno"
                    data-group="params1"
                    @input="convertToUpperEnglish"
                    v-model="params1['cstno']"
                    @keydown.enter="handleCstnoEnter"
                  />
                  <label for="floating">CST No</label>
                </div>                
                <div class="hr"></div>
                <div class="form-floating cell_no">
                  <input
                    type="text"
                    class="form-control label-60"
                    id="floating"
                    placeholder="작업자"
                    autocomplete="off"
                    v-model="params1['작업자']"
                  />
                  <label for="floating">작업자</label>
                </div>-->
                <div class="hr"></div>
                <b-button-group class="toggle_btn" >
                  <b-button :class="{ on : runStartChk && !runEndChk && startChk }" @click="actionClick('start')">작업시작</b-button>
                  <b-button :class="{ on : runStartChk && !runEndChk && endChk }" @click="actionClick('end')">작업종료</b-button>
                </b-button-group>
                <div class="hr"></div>
                <b-button class="me-1" :class="{ main : runStartChk && !runEndChk && isEditabled }" @click="actionClick('cancel')">작업취소</b-button>
                <b-button :class="{ main : isEditabled }" @click="actionClick('temp')">임시저장</b-button>
              </div>
              <div class="btn_wrap" v-else>
                <b-button class="me-1 second" v-if="params['차수']>1" @click="actionClick('workStatus')">전체 작업현황</b-button>
                <div class="hr" v-if="params['차수']>1"></div>
                <b-button class="me-1 second" v-if="['061','067'].includes(params['공정코드'])" @click="actionClick('QR')">QR 발행</b-button>
                <b-button class="me-1 second" v-if="['055'].includes(params['공정코드'])" @click="actionClick('errorStatus')">불량 맵핑 현황</b-button>
                <b-button class="second" @click="actionClick('sample')" v-if="['061','067'].includes(params['공정코드'])">QR Cell 불량/시료처리</b-button>
                <div class="hr" v-if="['061','067'].includes(params['공정코드'])"></div>
                <b-button class="me-1" :class="{ sub : (['058','059'].includes(params['공정코드']) ? isDisabled1 : isDisabled) }" :disabled="(['058','059'].includes(params['공정코드']) ? !isDisabled1 : !isDisabled)" @click="actionRerun" v-if="['058','059'].includes(params['공정코드'])">재진행</b-button>
                <b-button class="mr0" :class="{ sub : isStartDisabled || (!isStartDisabled && isEndDisabled) }" @click="actionLogClick" v-if="['055','056','058','059','061','067'].includes(params['공정코드'])">{{ ['058','059'].includes(params['공정코드']) ? '투입카세트' : '설비로그'}}</b-button>
                <div class="hr" v-if="['055','056','058','059','061','067'].includes(params['공정코드'])"></div>
                <b-button-group class="toggle_btn">
                  <b-button :class="{ on : isStartDisabled }" @click="actionClick('start')">작업시작</b-button>
                  <b-button :class="{ on : isEndDisabled }" @click="actionClick('end')">작업종료</b-button>
                </b-button-group>
                <div class="hr"></div>
                <b-button class="me-1" :class="{ main : (!isStartDisabled && isEditabled) || (Number(params['차수']) > 1 && isStartDisabled) }" @click="actionClick('cancel')">작업취소</b-button>
                <b-button :class="{ main : isEditabled }" @click="actionClick('temp')">임시저장</b-button>
              </div>
           </div>
            <div class="row mb-1">
              <RealGrid ref="tab032000Grid1" :uid="'tab032000Grid1'" :rows="rows" class="mb-1"/>              
              <ErrorInfoStatus ref="errorInfoStatus" :inQty1="params['투입수량']" :title="['061','067'].includes(params['공정코드']) ? 'Bare Cell 불량현황' : '불량현황'"/>
            </div>
            <b-row>
              <b-col cols="3">
                <lot-and-pre-cst-info ref="lapci" :runNo="params['runNo']" :process="params['공정코드']" :isEditabled="isStartDisabled1" @save="saveCallback1" :maxCnt="params['적재수량']" :callSaveData="callSaveData" @updateCstCell="updateCstCell"/>
              </b-col>
              <b-col>
                <RealGrid ref="tab032000Grid3" :uid="'tab032000Grid3'" :rows="rows1" :fitLayoutWidthEnable="false"/>      
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>
    <SampleInfoStatus ref="sampleInfoStatus" v-show="['061','067'].includes(params['공정코드'])" :title="'QR Cell 불량/시료현황'"/>
    <ProcessingMapping1 ref="processingMapping1" @save="saveCallback1"/>
    <LogExecutePopup ref="logExecutePopup"/>
    <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
    <ReliabilitySamplePopup ref="reliabilitySamplePopup" @save="saveCallback1" :title="'QR Cell 불량/시료처리'"/>
    <ReliabilitySampleConfirmPopup ref="reliabilitySampleConfirmPopup" @save="saveCallback1" :title="'QR Cell 불량/시료'"/>
    <ErrorInput ref="errorInput" @save="saveCallback1"/>
    <CstTCntInput ref="cstTCntInput" @confirm="confirmTCntInput"/>
    <ProcessingMappingStatus ref="processingMappingStatus"/>
    <CompQrLabel ref="compQrLabel" />
    <OverallWorkStatusPopup ref="overallWorkStatusPopup" />
    <WorkerPopup ref="workerPopup" @confirm="workerConfirm" />
    <DateTimeSpinner v-show="false" ref="dateTime3" :centerFlag="true" @input="dateTimeInput3"/>
	  <ChangeCstNo1 ref="ccPopup" @save="saveCallback1"/>
  </div>
</template>

<script>
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import ProcessingMapping1 from "@web/popup/ProcessingMapping1";
import ProcessingMappingStatus from "@web/popup/ProcessingMappingStatus";
import LogExecutePopup from "@web/popup/LogExecutePopup";
import LotAndPreCstInfo from '@components/LotAndPreCstInfo.vue';
import ReliabilitySamplePopup from "@web/popup/ReliabilitySamplePopup";
import ErrorInfoStatus from '@components/ErrorInfoStatus.vue';
import SampleInfoStatus from '@components/SampleInfoStatus.vue';
import ErrorInput from "@web/popup/ErrorInput";
import CstTCntInput from "@web/popup/CstTCntInput";
import ProductStatus from '@components/ProductStatus.vue';
import { useM0003002 } from '@web/store/M0003002.js';
import ReliabilitySampleConfirmPopup from "@web/popup/ReliabilitySampleConfirmPopup";
import OverallWorkStatusPopup from "@web/popup/OverallWorkStatusPopup";
import WorkerPopup from "@web/popup/WorkerPopup";
import CompQrLabel from "@web/popup/CompQrLabel.vue";
import ChangeCstNo1 from "@web/popup/ChangeCstNo1";
import moment from 'moment';
const { ValueType, RowState } = require('realgrid');

export default {
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {
    ProcessingMapping1,
    LotAndPreCstInfo,
    LogExecutePopup,
    ReliabilitySamplePopup,
    ErrorInput,
    ProductStatus,
    ErrorInfoStatus,
    ReliabilitySampleConfirmPopup,
    SampleInfoStatus,
    CstTCntInput,
    ProcessingMappingStatus,
    CompQrLabel,
    OverallWorkStatusPopup,
    WorkerPopup	,
	  ChangeCstNo1
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    const processList = userAuthInfo.getTabInfoListBySRI('M0003002', 'TAB032000');
    const srchInfo = useM0003002();
    return { userAuthInfo, srchInfo, processList};
  },
  watch: {
    "params.공정코드"(newVal) {
      this.$utils.initializeParamsInPlace(this.params, ["공정코드","runNo"]);
      this.$refs.dateTime1.clearClick();
      this.$refs.dateTime2.clearClick();
      this.searchTab032000GridFields().then(() => {
        if(this.$utils.isValidProperty(this.params, 'runNo')){
          this.searchClick();
        }
        this.searchMachineCode();
        //this.searchCodes();
        
      });

      this.srchInfo.process = newVal;
      if(!_.isEmpty(this.params.runNo) && this.srchInfo.runNo != this.params.runNo)  this.srchInfo.runNo = this.params.runNo;

		},
    "params.machineCode"(newVal) {
      const index = this.machineCodes.findIndex((item) => item.value === newVal);
      if(index > -1){
        this.params["chamber"] = this.machineCodes[index]['chamber'];
        this.params["설비약명"] = (this.machineCodes[index]?.['text'] || '').split(' ')[0];
        this.params["설비명"] = this.machineCodes[index]['설비명'];
      }
		},
    "params.nxt공정코드"(newVal) {
      this.$nextTick(()=>{
        if(newVal == "-"){
          this.params["nxt공정코드"] = null;
        }else{
          if(!this.isSearch){
            for (var i = 0; i < this.tab032000Grid3DP().getRowCount(); i++) {
              this.tab032000Grid3DP().setValue(i, "nxt공정코드", newVal);
            }
          }          
        }
      });
		},
    "params.shift"(newVal) {
      this.$nextTick(()=>{
        if(!this.isSearch){
          if(this.params['공정코드'] === '054'){
            for (var i = 0; i < this.tab032000Grid3DP().getRowCount(); i++) {
              this.tab032000Grid3DP().setValue(i, "shift", newVal);
            }
          }
        }
      });
		},
    "params.runNo"(newVal, oldVal) {
      this.srchInfo.runNo = newVal;
      //this.searchCodes();
    },
  },
  data() {
    return {      
      tab032000Grid1: null,
      tab032000Grid3: null,
      rows: [],
      rows1: [],
      rows2: [],
      params: {
				'공정코드': null,				
        'nxt공정코드': null,
        runNo: null,
        '책임자': null,
        '선임자': null,
        '작업자': null,
        shift: null,
        '작업조': null,
        '책임자시작': 0,
        '책임자종료': 0,
        machineCode: null,
        '설비명': null,
        '설비약명': null,
				chamber: null,
        'next작업시작': null,				
        '차수': null,
        '적재수량': 30,
        '작업시작': null, 
        '시작시각': null,
        '작업종료': null, 
        '종료시각': null,
        '제품모델': null,
        '투입수량': null,
        'nextFlag': null,
        'pre양품수량': null,
			},
      params1: {
				'작업자': null,				
        'cstno': null,
			},      
      items: [],
      items1: [],
      shifts: [],
      shiftTypes: [],
      codes: [],
      machineCodes: [],
      isStartMessge: false,
      isSearch: true,
      runStartChk: false,
      runEndChk: false,
      userCheck: false,
      startChk: false,
      endChk: false,
      selCstNo: null,
      nics:[],	//전공정 미투입 카세트 리스트
      startDay: null,
      startTime: null,
      endDay: null,
      endTime: null,
      dateTarget: null,
      changeCstFlag: false,
    };
  },
  computed: {
    menuList(){
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    /*isEditabled(){
      return !((!this.runStartChk && !this.runEndChk) || (this.runStartChk && this.runEndChk));
    },*/
    isStartDisabled(){
      return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && !this.$utils.isValidProperty(this.params, '작업시작');      
		},
    isStartDisabled1(){
      return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작');      
		},
		isEndDisabled(){
			return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작') && !this.$utils.isValidProperty(this.params, '작업종료');
		},
    isDisabled(){
			return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작') && this.$utils.isValidProperty(this.params, '작업종료') && (!this.$utils.isValidProperty(this.params, 'next작업시작') || this.params["nextFlag"] == 'TRUE');
		},
    isDisabled1(){
			return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작') && this.$utils.isValidProperty(this.params, '작업종료')
		},
    isRunDisabled(){
			return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.params['책임자시작'] == 1 && this.params['책임자종료'] == 1 && (!this.$utils.isValidProperty(this.params, 'next작업시작') || this.params["nextFlag"] == 'TRUE');
		},
    isTempDisabled(){
      return (!this.$utils.isValidProperty(this.params, 'next작업시작') || this.params["nextFlag"] == 'TRUE') && !this.isStartDisabled
    },
    isEditabled(){
      return this.isTempDisabled//this.isStartDisabled || this.isEndDisabled
    },    
  },
  created() {
    // this.items = this.$utils.fetchAuthorizedMenuProcesses(this.menuList, this.tabId);
    this.initializeGrid();
    this.searchComCode();
    //this.searchCodes();
  },
  mounted() {
    this.$eventBus.on("Back2CassetteQCMenuMove", this.back2CassetteQCMenuMove);
    
    this.srchInfo.process = this.params.공정코드;
    this.srchInfo.runNo = this.params.runNo;
  },
	beforeUnmount() {
    this.$eventBus.off("Back2CassetteQCMenuMove");
  },
  methods: {
    back2CassetteQCMenuMove(data){
      /*let searchFlag = false;
      if(this.params["공정코드"] != data["공정코드"] || this.params["runNo"] != data["runNo"]){
        searchFlag = true;
      }*/
      this.params["공정코드"] = data["공정코드"];
      this.params["runNo"] = data["runNo"];
      
      //if(searchFlag)
      setTimeout(()=>{
        this.searchClick();
      }, 1000);
    },
    tab032000Grid1GV() {
      return this.$refs.tab032000Grid1?.getGridView();
    },
    tab032000Grid1DP() {
      return this.$refs.tab032000Grid1?.getGridDataProvider();
    },
    tab032000Grid3GV() {
      return this.$refs.tab032000Grid3?.getGridView();
    },
    tab032000Grid3DP() {
      return this.$refs.tab032000Grid3?.getGridDataProvider();
    },    
    initializeGrid() {
      this.tab032000Grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_1.js`));
      //this.tab032000Grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB032000_2.js`));
      this.tab032000Grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_1.js`));
      //this.tab032000Grid4 = _.cloneDeep(require(`@web/m0003000/js/TAB032000_4.js`));
    },    
    async searchComCode(){
			this.$utils.getCommonContentValueText(['75', '06'], [this.shiftTypes, this.shifts]);
		},
    async searchMachineCode(){

			let searchParam = {
				menuId: "M0003005", queryId: "M0003005_Sch5", queryParams: {'공정코드': this.params['공정코드']}, 
				callback: (data) => {
					this.$utils.transformData(
					data,
					["value", "text", "설비명", "chamber"],
					["설비번호", "설비약명", "설비명", "chamber"],
					this.machineCodes
					);
				},
			};
			await this.$axios.api.search(searchParam);
		},
    getTab032000Grid1(code) {
      switch (code) {
        case '054':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_1.js`));
        case '055':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_2.js`));
        case '056':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_3.js`));
        case '058':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_4.js`));
        case '059':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_4.js`));
        case '061':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_5.js`));
        case '067':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_5.js`));  
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_1_1.js`));
      }
    },
    getTab032000Grid3(code) {
      switch (code) {
        case '054':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_1.js`));
        case '055':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_2.js`));
        case '056':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_3.js`));
        case '058':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_4.js`));
        case '059':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_4.js`));
        case '061':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_5.js`));    
        case '067':
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_5.js`));    
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB032000_3_1.js`));
      }
    },    
    async searchTab032000GridFields(){

      this.tab032000Grid1 = this.getTab032000Grid1(this.params["공정코드"]);
      this.tab032000Grid3 = this.getTab032000Grid3(this.params["공정코드"]);
      this.$nextTick(() => {
        this.$refs.tab032000Grid1.created();
        this.$refs.tab032000Grid3.created();
        this.tab032000Grid3DP().restoreMode = "auto";
      });
		},
    async searchCodes(){

			let searchParam = {
				menuId: "M0003002", queryId: "M0003002_Sch1", queryParams: this.params, 
				callback: (data) => {
					this.$utils.transformData(
					data,
					["value", "text", "다음공정"],
					["공정코드", "공정명", "다음공정"],
					this.codes
					);
				},
			};
			await this.$axios.api.search(searchParam);
      this.items1 = this.codes;
      /*if(this.items1.length == 1){
        this.params["nxt공정코드"] = this.items1[0].value;
      }*/
		},
    searchClick(){
      this.searchCodes();
      this.$nextTick(async()=>{
        this.isSearch = true;
        this.startChk = false;
        this.endChk = false;
        let target = ["공정코드","runNo","책임자","선임자","작업자","shift"];
        /*if (this.items1.length < 2) {
          target.push("nxt공정코드");
        }*/
        this.$utils.initializeParamsInPlace(this.params, target);
        
        if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])){
          return;
        }
        let params = {
          runNo: this.params.runNo,
          '공정코드': this.params['공정코드'],
          'code': this.params['공정코드']
        };	
        let searchParam = [
          {menuId: "M0003002", queryId: "M0003002_Sch2", queryParams: params, target: this.rows},
        ];

        if (["054", "055"].includes(this.params['공정코드'])) {
          searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch4", queryParams: params, target: this.rows1});
        }else if(["056", "058", "059"].includes(this.params['공정코드'])){
          searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch10", queryParams: params, target: this.rows1});
        }else if(["061", "067"].includes(this.params['공정코드'])){
          searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch15", queryParams: params, target: this.rows1});
        }

        searchParam.push({menuId: "M0003002", queryId: "M0003002_Sch19", queryParams: params, target: this.nics});

        let result = await this.$axios.api.searchAll(searchParam);
        if(result[0].length==0){
          this.$toast("info", "해당 RunNo의 공정 작업 이력 내역이 없습니다.");        
          this.$refs.runNoField.focus();
          this.$refs.runNoField.select();
          return;
        }
        this.$refs.prodStatus.loadData();

        // 기본 필드 배열
        let fields = ["책임자", "선임자", "shift", "작업조", "책임자시작", "책임자종료", "next작업시작", "작업자", "작업시작", "시작시각", "작업종료", "종료시각", "machineCode","차수","nxt공정코드","적재수량","제품모델","투입수량","nextFlag","pre양품수량"];

        // 공정코드가 '054'일 때 "작업자" 추가
        /*if (this.params['공정코드'] !== '054') {
          fields.push(...["작업자", "작업시작", "작업종료"]);
        }
        if(this.params['공정코드'] == '058'){
          fields.push(...["machineCode"]);
        }*/
       this.$utils.updateParamsFromRows(
         this.params,
          this.rows,
          fields,
          this.$utils.isValidProperty
        );

        /*this.$utils.updateParamsFromRows(
          this.params,
          this.rows1,
          [
            "nxt공정코드"
          ],
          this.$utils.isValidProperty
        );*/
        if (this.params['공정코드'] === '054') {
          this.runStartChk = this.params["책임자시작"] == 1;
          this.runEndChk = this.params["책임자종료"] == 1;
          if(!_.isNil(this.selCstNo)){
            this.findCstNo(this.selCstNo);
          }
        }
        this.isStartMessge = false;
        if(this.tab032000Grid1GV())this.tab032000Grid1GV().refresh(true);
        //if(this.tab032000Grid2GV())this.tab032000Grid2GV().refresh(true);
        if(this.tab032000Grid3GV())this.tab032000Grid3GV().refresh(true);
        this.isSearch = false;

        // PFL, BFL 세정단계 체크
        if(["061","067"].includes(this.params["공정코드"])){
          let result3 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_ValidationPFLChk", queryParams: this.params});
          if(!_.isNil(result3) && !_.isEmpty(result3) && result3[0]["상태"] == "재세정"){
            this.$toast('info', "RUN No["+this.params["runNo"]+"] 2시간 이상 대기 시 재세정 진행.");
            return;
          }
        }

        this.$refs.lapci.loadData();
        let loadParams = { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] };
        this.$refs.errorInfoStatus.loadData(loadParams);
        this.$refs.sampleInfoStatus.loadData(loadParams);

        if(this.changeCstFlag){
          this.changeCstFlag = false;
          this.$confirmYesOrNo("선택", "카세트 변경 하시겠습니까?", (confirmed) => {
            if (confirmed) {
              this.$refs.ccPopup.openDialog({
                runNo: this.params.runNo,
                '공정코드': this.params['공정코드'],
                'code': this.params['공정코드'],
              });
            } 
          });
        }
      });
		},
    async actionRunClick(action) {
      if(this.tab032000Grid3GV())this.tab032000Grid3GV().commit();     
      let target = ['C:공정:공정코드', 'T:RunNo:runNo',"T:책임자:책임자","T:선임자:선임자","C:근무조:shift"];
      if (action === 'end') {
        target.push(...["C:인계공정:nxt공정코드"]);
        let rows = this.tab032000Grid3DP().getJsonRows(0, -1)
        .filter((item, index) => _.isNil(item["작업시작"]) || _.isNil(item["작업종료"]))
        .map(item => ({
          ...item,            
        }));
        setTimeout(()=>{
          this.runEndChk = false;
        }, 300);
        if(rows.length > 0){
          this.$toast('info', "작업이 완료되지 않은 대상 "+rows.length+"건이 있습니다.");
          return;
        }
      }else if(action === 'cancel'){
        
        if(!((this.runStartChk && this.isEditabled) || (Number(this.params['차수']) > 1 && !this.runStartChk))) return;
        
        let saveCancelFunc = async () => {

          let params = {
            "menuId": 'M0003002',
            "update": [{ queryId: (this.params['차수'] > 1 ? 'M0003002_remove' : 'M0003002_cancel'), data: [{ ...this.params, 'code': this.params['공정코드'], type: 'RUN' }] }]
          };
          
          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            
            this.$toast('success', 'RUN 취소 되었습니다.');
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        }
        this.$confirm("확인", 'RUN 취소 하시겠습니까? <br><span style="color:red">작업했던 내용이 삭제됩니다.</span>', (confirm)=>{
          if(confirm){
            saveCancelFunc();
          }
        });
        return;
      }
      let result1 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_LogStartChk", queryParams: {...this.params, code: this.params["공정코드"]}});
      
      /*if(action === 'start' && (_.isNil(result1) || _.isEmpty(result1) || result1[0]["진행가능여부"] !== "진행가능")){
        this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. 전 공정에서 작업이 완료되지 않았습니다.');
        if(action === 'start'){
          setTimeout(()=>{
            this.runStartChk = false;
          }, 300);
        }
        return;
      }*/

      let result2 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_HoldChk", queryParams: this.params});
      
      if(action === 'start' && (!_.isNil(result2) && !_.isEmpty(result2) && result2[0]["hold여부"] === "Y")){
        this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. HOLD상태입니다.');
        if(action === 'start'){
          setTimeout(()=>{
            this.runStartChk = false;
          }, 300);
        }
        return;
      }

      if(!this.$utils.validateFields(this.params, target)){
        if(action === 'start'){
          setTimeout(()=>{
            this.runStartChk = false;
          }, 300);
        }else{
          setTimeout(()=>{
            this.runEndChk = false;
          }, 300);
        }
        return;
      }

      let saveFunc = async () => {

        let dateTimeArray = this.$utils.getDateAndTimeArray1();
        
        let params = {
          "menuId": 'M0003002',
          "update": [
            { queryId: (action === 'start' ? "M0003002_RunStart" : "M0003002_RunEnd"), 
              data: [{
              ...this.params,
              ...(action === 'start' 
              ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
              : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
              )
            }] 
            },
            (action === 'end' ? {
              queryId: "M0003002_EndCassetteStatus",
              data: [{...this.params}]
            } : {})
          ],
        };
        if(action === 'end'){
          let inCnt = this.params["pre양품수량"];            
          let inCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["투입수량"];
          let inCnt2 = this.$refs.lapci.rgDP('ppGrid').getJsonRows(0, -1).reduce((sum, item) => sum + (item["cstCell"] || 0), 0);;
          inCnt = _.isNil(inCnt) ? 0 : inCnt;
          inCnt1 = _.isNil(inCnt1) ? 0 : inCnt1;
          inCnt2 = _.isNil(inCnt2) ? 0 : inCnt2;
          if(inCnt != inCnt1 || inCnt1 != inCnt2){
            this.$toast("error", "이전공정 Cell 수량과 입고현황 입고수량 합계와 투입수량이 동일한 수량이 아닙니다.");
            return;
          }

          let rows1 = this.tab032000Grid3DP().getJsonRows(0, -1)
          .filter((_, index) => this.tab032000Grid3DP().getRowState(index) == RowState.UPDATED)
          .map(item => ({
            "code": item["공정코드"],
            "shift": item["shift"],
            "runNo": item["runNo"],
            "공정코드": item["공정코드"],
            "fCstno": item["fCstno"],
            "tCstno": item["tCstno"],
            "작업시작": item["작업시작"],
            "시작시각": item["시작시각"],
            "작업종료": item["작업종료"],
            "종료시각": item["종료시각"],
            "작업자": item["작업자"],
            "차수": item["차수"],
            "특이사항": item["특이사항"],
            "nxt공정코드": item["nxt공정코드"],
            "f수량": item["f수량"],
            "t수량": item["tOrg수량"],
          }));
          params["update"].push({ queryId: "M0003002_Temp", data: rows1 });
        }

        const resp = await this.$axios.api.saveData(params);
        if (resp.status === 'success') {
          
          if(action === 'start')this.isStartMessge = true;

          this.$toast('success', action === 'start' ? 'RUN 시작 되었습니다.' : 'RUN 종료 되었습니다.');

          this.changeCstFlag = true;
          this.searchClick();
        } else {
          this.$toast('error', resp.message);
        }
      };
      
      this.$confirm("확인", action === 'start' ? 'RUN 시작 하시겠습니까?<br><span style="color:red">(기존에 저장되어있던 내용이 삭제 될수있습니다.)</span>' : 'RUN 종료 하시겠습니까?', (confirm)=>{
				if(confirm){
					saveFunc();
				}else{
          this.$nextTick(()=>{
            if(action === 'start'){
              this.runStartChk = false;
            }else{
              this.runEndChk = false;
            }
          });
        }
      });

    },
    async actionLogClick() {
      if(this.tab032000Grid3GV())this.tab032000Grid3GV().commit();     
      this.$nextTick(async()=>{
        if((["055", "056", "058", "059", "061", "067"].includes(this.params['공정코드'])) && !(this.isStartDisabled || (!this.isStartDisabled && this.isEndDisabled))){
          return;
        }
        let target = ['C:공정:공정코드', 'T:RunNo:runNo', 'T:작업자:작업자', 'C:근무조:shift'];        
        if(this.params["공정코드"] == '058' || this.params["공정코드"] == '059'){
          target.push("C:M/C:machineCode");
        }
        if(!this.$utils.validateFields(this.params, target)){
          return;
        }
        let result2 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_HoldChk", queryParams: this.params});
        if(!_.isNil(result2) && !_.isEmpty(result2) && result2[0]["hold여부"] === "Y"){
          this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. HOLD상태입니다.');
          return;
        }
        let result1 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_LogStartChk", queryParams: {...this.params, code: this.params["공정코드"]}});
        if(_.isNil(result1) || _.isEmpty(result1) || result1[0]["진행가능여부"] !== "진행가능"){
          this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. 전 공정에서 작업이 완료되지 않았습니다.');
          return;
        }
        
        let result = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_LogChk", queryParams: {...this.params, code: this.params["공정코드"]}});
        if(_.isNil(result) || _.isEmpty(result) || result[0].cnt == 0){
          this.$toast('info', ((this.params["공정코드"] == '058' || this.params["공정코드"] == '059') ? "투입카세트" : "설비로그")+" 대상이 없습니다.");
          return;
        }
        
        let saveFunc = async () => {
          
          let dateTimeArray = this.$utils.getDateAndTimeArray1();
          //console.log("this.params[작업시작]", this.params["작업시작"]);
          let rows = [{
            ...this.params,
            'code': this.params['공정코드'],
            line: 'D1UT',
            "자동여부": 0,              
            ...(["058","059"].includes(this.params["공정코드"])
              ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
              : {}
            ),
          }];
          let params = {
            "menuId": 'M0003002',
            "update": [{ queryId: "M0003002_Log", data: rows }],
          };

          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            this.$toast('success', ((this.params["공정코드"] == '058' || this.params["공정코드"] == '059') ? "투입카세트" : "설비로그")+" 가져오기를 완료하였습니다.");
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        };
        
        this.$confirm("확인", ((this.params["공정코드"] == '058' || this.params["공정코드"] == '059') ? "투입카세트" : "설비로그") + " 가져오기를 하시겠습니까?<br><span style='color:red'>(기존에 저장되어있던 내용이 삭제 될수있습니다.)</span>", (confirm)=>{
          if(confirm){
            saveFunc();
          }
        });
      });
    },

    async actionClick(action) {

      if(this.tab032000Grid3GV())this.tab032000Grid3GV().commit();
      if(action === 'sample'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }
        this.$refs.reliabilitySamplePopup.openDialog({
          ...this.params,
          runId: this.params['runNo'],
          isEditabled: this.isStartDisabled1,
          line: 'D1UT',
          "자동여부": 0,
          callback: { queryId:'M0003002_Sample', data:[{
            ...this.params,
            'code': this.params['공정코드']            
          }]}
        });
        return;
      }else if(action === 'cancel'){

        if((this.params['공정코드'] == '054' && !(this.runStartChk && !this.runEndChk && this.isEditabled))
          || (this.params['공정코드'] != '054' && !((!this.isStartDisabled && this.isEditabled) || (Number(this.params['차수']) > 1 && this.isStartDisabled)))) return;

        if (this.params["공정코드"] == '054'){
          let checkedRows = this.tab032000Grid3GV().getCheckedRows(false);
          if(_.isEmpty(checkedRows)){
            this.$toast("info", "선택된 대상이 없습니다.");
            return;
          }
        }
        let saveCancelFunc = async () => {

          let params = {
            "menuId": 'M0003002',
            "update": []
          };

          if (this.params["공정코드"] == '054'){
            let rows = this.tab032000Grid3DP().getJsonRows(0, -1)
            .filter((_, index) => this.tab032000Grid3GV().isCheckedRow(index))
            .map(item => ({
              ...this.params,
              ...item,
              'code': this.params['공정코드'],
              type: (this.params['공정코드'] == '054' ? 'CST' : '')
            }));
            params["update"].push({ queryId: "M0003002_cancel", data: rows });
          }else{
            let rows = [{
              ...this.params,
              'code': this.params['공정코드'],
              type: (this.params['공정코드'] == '054' ? 'CST' : '')
            }];
            params["update"].push({ queryId: (this.params['차수'] > 1 ? 'M0003002_remove' : 'M0003002_cancel'), data: rows });
          }
          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            
            this.$toast('success', '작업취소 되었습니다.');
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        }
        this.$confirm("확인", '작업취소 하시겠습니까? <br><span style="color:red">작업했던 내용이 삭제됩니다.</span>', (confirm)=>{
          if(confirm){
            saveCancelFunc();
          }
        });
        return;
      }else if(action == 'errorStatus'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }
        this.$refs.processingMappingStatus.openDialog({
          ...this.params,
          runId: this.params['runNo'],
          line: 'D1UT',
          "자동여부": 0,         
        });
        return;
      }else if(action == 'QR'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }
        let qrText1 = "";
        let qrText2 = "";
        let qrText3 = "";
        let qrCode1 = "";
        let qrCode2 = "";
        let qrCode3 = "";
        let result5 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_CompQrInfo", queryParams: {
          ...this.params
          ,shift: ["055"].includes(this.params["공정코드"]) ? this.params["shift"] : null
        }});
        if(!_.isNil(result5) && !_.isEmpty(result5)){
          qrText1 = result5[0]?.qr || "";
          qrText2 = result5[1]?.qr || "";
          qrText3 = result5[2]?.qr || "";
          qrCode1 = result5[0]?.code || "";
          qrCode2 = result5[1]?.code || "";
          qrCode3 = result5[2]?.code || "";
        }
        this.$refs.compQrLabel.openDialog({ qrCodes1: [
          {text: qrText1, code: qrCode1}, {text: qrText2, code: qrCode2}, {text: qrText3, code: qrCode3}
        ]});
        return;
      }else if(action == 'workStatus'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }

        this.$refs.overallWorkStatusPopup.openDialog({...this.params});
        return;
		  }
      this.$nextTick(async()=>{
        let target = ['C:공정:공정코드', 'T:RunNo:runNo'];
        if(this.params["공정코드"] !== '054'){
          target.push(...["T:작업자:작업자"], ...["C:근무조:shift"]);
        }
        if (this.params["공정코드"] == '054' 
          //&& ((!this.runStartChk && !this.runEndChk) || (this.runStartChk && this.runEndChk) || (action == 'start' && !this.startChk) || (action == 'end' && !this.endChk) || (action == 'temp' && !this.isEditabled))
          && ((action == 'start' && !this.startChk) || (action == 'end' && !this.endChk) || (action == 'temp' && !this.isEditabled))
        ) {
          return;
        }else if((["055", "056", "058", "059", "061", "067"].includes(this.params['공정코드'])) && 
          ((action == 'start' && !this.isStartDisabled) || (action == 'end' && !this.isEndDisabled) || (action == 'temp' && !this.isEditabled))
        ){
          return;
        }
        if(this.params["공정코드"] == '058' || this.params["공정코드"] == '059'){
          target.push("C:M/C:machineCode");
        }
        if(this.params["공정코드"] == '054'){
          target.push("C:인계공정:nxt공정코드");
        }
        if (action === 'end' || action === 'temp') {
          target.push("C:인계공정:nxt공정코드");
        }
        if(!this.$utils.validateFields(this.params, target)){
          return;
        }
        if(action === 'start' || action === 'end'){
          let result2 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_HoldChk", queryParams: this.params});
          if(!_.isNil(result2) && !_.isEmpty(result2) && result2[0]["hold여부"] === "Y"){
            this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. HOLD상태입니다.');
            return;
          }
        }
        // PFL, BFL 세정단계 체크
        if(["061","067"].includes(this.params["공정코드"])){
          let result3 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_ValidationPFLChk", queryParams: this.params});
          if(action === 'start' && (!_.isNil(result3) && !_.isEmpty(result3) && result3[0]["상태"] == "재세정")){
            this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. 2시간 이상 대기 시 재세정 진행.');
            return;
          }

          // 작업시작 종료시 PFL, BFL 중복 cell 체크
          if((action === 'start' || action === 'end')){
            const isDuplicate = await this.checkDuplicateCells();
            if(isDuplicate){
              return;
            }            
          }
        }

        if(action == 'end' && this.params["공정코드"]=='056'){
          let result4 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_AGBForBareCell", queryParams: this.params});
          if(!_.isNil(result4) && !_.isEmpty(result4) && result4[0]['불량수량'] < result4[0]['수량']){
            this.$toast("info", "RUN No["+result4[0]["runNo"]+"] "+"작업 완료가 불가합니다.<br><span style='color:red'>UTM측정시료("+result4[0]['불량수량']+")를 필요수량("+result4[0]['수량']+")만큼 불량입력 추가.</span>", {
              dangerouslyHTMLString: true,
            });
            return;
          }
        }
        // 임시저장, 작업시작, 작업종료 외
        if(!(action == 'temp' || action == 'start' || action == 'end'))return;

        if (this.params["공정코드"] == '054'){          
          let rows = this.tab032000Grid3DP().getJsonRows(0, -1)
          .filter((_, index) => this.tab032000Grid3DP().getRowState(index) == RowState.UPDATED);            
          if(action == 'start' || action == 'end'){                        
            let checkedRows = this.tab032000Grid3GV().getCheckedRows(false);
            if(_.isEmpty(checkedRows)){
              this.$toast("info", "선택된 대상이 없습니다.");
              return;
            }
            if(action == 'start'){
              let rows1 = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((item, index) => this.tab032000Grid3GV().isCheckedRow(index) && _.isNil(item["작업자"]))
              .map(item => ({
                ...item,            
              }));
              if(!_.isEmpty(rows1)){
                this.$toast("info", "선택된 카세트에 작업자가 없습니다.");
                return;
              }
              let rows2 = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((item, index) => this.tab032000Grid3GV().isCheckedRow(index) && !_.isNil(item["작업시작"]))
              .map(item => ({
                ...item,            
              }));
              if(!_.isEmpty(rows2)){
                this.$toast("info", "선택된 카세트에 작업시작된 대상이 있습니다.");
                return;
              }
            }
            if(action == 'end'){
              let rows1 = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((item, index) => this.tab032000Grid3GV().isCheckedRow(index) && _.isNil(item["작업시작"]))
              .map(item => ({
                ...item,            
              }));
              if(!_.isEmpty(rows1)){
                this.$toast("info", "선택된 카세트에 작업시작 되지 않은 대상이 있습니다.");
                return;
              }
              let rows2 = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((item, index) => this.tab032000Grid3GV().isCheckedRow(index) && !_.isNil(item["작업종료"]))
              .map(item => ({
                ...item,            
              }));
              if(!_.isEmpty(rows2)){
                this.$toast("info", "선택된 카세트에 작업종료된 대상이 있습니다.");
                return;
              }

              let dateTimeArray = this.$utils.getDateAndTimeArray1();
              let rows3 = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((item, index) => !_.isNil(item["작업시작"]) && !_.isNil(item["시작시각"]) && !this.$utils.isValidTimeRange(item["작업시작"], item["시작시각"], (this.endDay ? this.endDay : dateTimeArray[0]), (this.endTime ? this.endTime : dateTimeArray[1])))
              .map(item => ({
                ...item,            
              }));
              if(!_.isEmpty(rows3)){
                this.$toast("info", "선택된 카세트에 종료시각 시간은 작업시작 시간보다 전의 대상이 있습니다.");
                return;
              }
            }
          }else{
            if(_.isEmpty(rows)){
              this.$toast("info", "변경 대상이 없습니다.");
              return;
            }
          }
        }else{
          let rows = this.tab032000Grid3DP().getJsonRows(0, -1);
          if ((["055", "056"].includes(this.params['공정코드'])) && action == 'end'){
            let errorCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["불량수량"];
            let errorCnt2 = this.$refs.errorInfoStatus.dp().getJsonRows(0, -1)[0]["불량합계"];
            errorCnt1 = _.isNil(errorCnt1) ? 0 : errorCnt1;
            errorCnt2 = _.isNil(errorCnt2) ? 0 : errorCnt2;
            if(errorCnt1 != errorCnt2){
              this.$toast("error", "불량현황의 불량합계 수량과 불량수량이 동일한 수량이 아닙니다.");
              return;
            }

            let outCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["양품수량"];
            let outCnt2 = this.tab032000Grid3DP().getJsonRows(0, -1).reduce((sum, item) => sum + (item["tOrg수량"] || 0), 0);
            outCnt1 = _.isNil(outCnt1) ? 0 : outCnt1;
            outCnt2 = _.isNil(outCnt2) ? 0 : outCnt2;
            if(outCnt1 != outCnt2){
              this.$toast("error", "출고수량과 양품수량이 동일한 수량이 아닙니다.");
              return;
            }

            let inCnt = this.params["pre양품수량"];            
            let inCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["투입수량"];
            let inCnt2 = this.$refs.lapci.rgDP('ppGrid').getJsonRows(0, -1).reduce((sum, item) => sum + (item["cstCell"] || 0), 0);;

            inCnt = _.isNil(inCnt) ? 0 : inCnt;
            inCnt1 = _.isNil(inCnt1) ? 0 : inCnt1;
            inCnt2 = _.isNil(inCnt2) ? 0 : inCnt2;
            if(inCnt != inCnt1 || inCnt1 != inCnt2){
              this.$toast("error", "이전공정 Cell 수량과 입고현황 입고수량 합계와 투입수량이 동일한 수량이 아닙니다.");
              return;
            }
          }else if ((["061", "067"].includes(this.params['공정코드'])) && action == 'end'){
            let errorCnt = this.$refs.lapci.rgDP('ppGrid').getJsonRows(0, -1).reduce((sum, item) => sum + (item["f불량수량"] || 0), 0);
            let errorCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["불량수량"];
            let errorCnt2 = this.$refs.errorInfoStatus.dp().getJsonRows(0, -1)[0]["불량합계"];
            errorCnt = _.isNil(errorCnt) ? 0 : errorCnt;
            errorCnt1 = _.isNil(errorCnt1) ? 0 : errorCnt1;
            errorCnt2 = _.isNil(errorCnt2) ? 0 : errorCnt2;
            if(errorCnt != errorCnt1 || errorCnt1 != errorCnt2){
              this.$toast("error", "불량현황의 불량합계 수량과 입고현황 불량수량합계와 불량수량이 동일한 수량이 아닙니다.");
              return;
            }
            
            let sampleCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["시료수량"];
            let sampleCnt2 = this.$refs.sampleInfoStatus.dp().getJsonRows(0, -1)[0]["시료합계"];
            let sampleCnt3 = this.tab032000Grid3DP().getJsonRows(0, -1).reduce((sum, item) => sum + (item["qty"] || 0), 0);
            sampleCnt1 = _.isNil(sampleCnt1) ? 0 : sampleCnt1;
            sampleCnt2 = _.isNil(sampleCnt2) ? 0 : sampleCnt2;
            sampleCnt3 = _.isNil(sampleCnt3) ? 0 : sampleCnt3;
            if(sampleCnt1 != sampleCnt2 || sampleCnt2 != sampleCnt3){
              this.$toast("error", "QR Cell 불량/시료현황의 시료합계와 불량/시료수량 합계와 검사실적의 시료수량이 동일한 수량이 아닙니다.");
              return;
            }

            let inCnt = this.params["pre양품수량"];            
            let inCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["투입수량"];
            let inCnt2 = this.$refs.lapci.rgDP('ppGrid').getJsonRows(0, -1).reduce((sum, item) => sum + (item["cstCell"] || 0), 0);;

            inCnt = _.isNil(inCnt) ? 0 : inCnt;
            inCnt1 = _.isNil(inCnt1) ? 0 : inCnt1;
            inCnt2 = _.isNil(inCnt2) ? 0 : inCnt2;
            if(inCnt != inCnt1 || inCnt1 != inCnt2){
              this.$toast("error", "이전공정 Cell 수량과 입고현황 입고수량 합계와 투입수량이 동일한 수량이 아닙니다.");
              return;
            }

            let outCnt1 = this.tab032000Grid1DP().getJsonRows(0, -1)[0]["양품수량"];
            let outCnt2 = this.tab032000Grid3DP().getJsonRows(0, -1).reduce((sum, item) => sum + (item["tOrg수량"] || 0), 0);
            outCnt1 = _.isNil(outCnt1) ? 0 : outCnt1;
            outCnt2 = _.isNil(outCnt2) ? 0 : outCnt2;
            if(outCnt1 != outCnt2){
              this.$toast("error", "출고수량과 양품수량이 동일한 수량이 아닙니다.");
              return;
            }
          }
          if(_.isEmpty(rows) && action == 'end'){
            this.$toast("info", action == 'temp' ? "임시저장 대상이 없습니다." : (action == 'start' ? "작업시작 대상이 없습니다." : "작업종료 대상이 없습니다."));
            return;
          }
          let rows1 = this.tab032000Grid3DP().getJsonRows(0, -1)
          .filter((_, index) => this.tab032000Grid3DP().getRowState(index) == RowState.UPDATED);            
          if(action == 'end'){
            if(!_.isEmpty(rows1)){
              this.$toast("info", "변경 대상이 있습니다. 임시저장후 진행하세요.");
              return;
            }
          }
          if(action == 'temp'){
            /*if(_.isEmpty(rows1)){
              this.$toast("info", "변경 대상이 없습니다.");
              return;
            }*/
          }
        }

        let saveFunc = async () => {
          let dateTimeArray = this.$utils.getDateAndTimeArray1();
          let params = {
            "menuId": 'M0003002',
            "update": [],
          };

          if(action === 'start' || action === 'end'){
            if (this.params["공정코드"] == '054'){
              let rows1 = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((_, index) => this.tab032000Grid3DP().getRowState(index) == RowState.UPDATED)
              .map(item => ({
                "code": item["공정코드"],
                "shift": item["shift"],
                "runNo": item["runNo"],
                "공정코드": item["공정코드"],
                "fCstno": item["fCstno"],
                "tCstno": item["tCstno"],
                "작업시작": item["작업시작"],
                "시작시각": item["시작시각"],
                "작업종료": item["작업종료"],
                "종료시각": item["종료시각"],
                "작업자": item["작업자"],
                "차수": item["차수"],
                "특이사항": item["특이사항"],
                "nxt공정코드": item["nxt공정코드"],
                "f수량": item["f수량"],
                "t수량": item["tOrg수량"],
              }));
              params["update"].push({ queryId: "M0003002_Temp", data: rows1 });
              
              let rows = this.tab032000Grid3DP().getJsonRows(0, -1)
              .filter((_, index) => this.tab032000Grid3GV().isCheckedRow(index))
              .map(item => ({
                ...this.params,
                ...item,
                ...(action === 'start' 
                    ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
                    : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
                    ),
                'code': this.params['공정코드'],
                'shift':  this.params["shift"],
              }));
              params["update"].push({ queryId: (action === 'start' ? "M0003002_Start" : "M0003002_End"), data: rows });
            }else{
              let rows = [{
                ...this.params,
                ...(action === 'start' 
                    ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
                    : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
                    ),
                'code': this.params['공정코드'],
                '작업자': this.params['작업자'],
                'shift':  this.params["shift"],
              }];
              params["update"].push({ queryId: (action === 'start' ? "M0003002_Start" : "M0003002_End"), data: rows });

              if(action == 'end' && this.params["공정코드"]=='056'){
                let result4 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_AGBForBareCell", queryParams: this.params});
                if(!_.isNil(result4) && !_.isEmpty(result4)){
                  params["update"].push({ queryId: 'M0003002_Exec_AGBForBareCell', data: [{...result4[0], userName: this.userAuthInfo.userInfo.userName}] });
                }
              }

              if(action == 'end'){
                params["update"].push({ queryId: 'M0003002_EndCassetteStatus', data: [{...this.params}] });
              }
            }
          }else{
            let rows = this.tab032000Grid3DP().getJsonRows(0, -1)
            .filter((_, index) => this.tab032000Grid3DP().getRowState(index) == RowState.UPDATED)
            .map(item => ({
              "code": item["공정코드"],
              "shift": item["shift"],
              "runNo": item["runNo"],
              "공정코드": item["공정코드"],
              "fCstno": item["fCstno"],
              "tCstno": item["tCstno"],
              "작업시작": item["작업시작"],
              "시작시각": item["시작시각"],
              "작업종료": item["작업종료"],
              "종료시각": item["종료시각"],
              "작업자": item["작업자"],
              "차수": item["차수"],
              "특이사항": item["특이사항"],
              "nxt공정코드": item["nxt공정코드"],
              "f수량": item["f수량"],
              "t수량": item["tOrg수량"],
            }));
            params["update"].push({ queryId: "M0003002_RunTemp", data: [{...this.params, 'code': this.params['공정코드']}] }, { queryId: "M0003002_Temp", data: rows }, ['055',"056","061","067"].includes(this.params["공정코드"]) ? { queryId: "M0003002_Update12", data: [{...this.params, 'code': this.params['공정코드']}] } : {});
          }
          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            this.$toast('success', (action === 'temp' ? '임시저장 되었습니다.' : (action === 'start' ? '작업시작 되었습니다.' : '작업종료 되었습니다.')));
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        };
        
        this.$confirm("확인", (action === 'temp' ? '임시저장 하시겠습니까?' : (action === 'start' ? '작업시작 하시겠습니까?' : '작업종료 하시겠습니까?')), (confirm)=>{
          if(confirm){
            saveFunc();
          }
        });
      });

    },

    handleCstnoEnter(event){
      event.preventDefault();
      
      this.findCstNo(event.target.value);
      
      this.$refs.cstno.focus();
      this.$refs.cstno.select();
    },

    findCstNo(cstno){
      this.tab032000Grid3GV().checkAll(false);
      var options = {
        fields : ["tCstno"],
        value : cstno,
        startIndex : 0,
        startFieldIndex : 1,
        wrap : true,
        caseSensitive : true,
        partialMatch : false
      };

      var index = this.tab032000Grid3GV().searchCell(options);
      if(!_.isNil(index)){
        this.tab032000Grid3GV().setCurrent(index);
        this.tab032000Grid3GV().checkItem(index.itemIndex);        
      }
    },

    saveCallback1(){
      this.isStartMessge = true;
      this.searchClick();
    },

    handleConfirm(params){},

    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },

    async actionRerun(){
      if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
        return;
      }
      /* PFL, BFL 은 재진행 안함.
        if(["061","067"].includes(this.params["공정코드"])){
        let result = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_RERUNChk", queryParams: {...this.params, code: this.params["공정코드"]}});
        if(_.isNil(result) || _.isEmpty(result) || result[0].cnt == 0){
          this.$toast('info', "재진행 대상이 없습니다.");
          return;
        }
      }*/
      let saveFunc = async () => {
        let params = {
          "menuId": 'M0003002',
          "update": [{ queryId: "M0003002_RERUN", data: [{...this.params}] }],
        };

        
        const resp = await this.$axios.api.saveData(params);
        if (resp.status === 'success') {
          this.$toast('success', "재진행 되었습니다.");
          this.searchClick();
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

    confirmTCntInput(rows){
      if(!_.isEmpty(rows)){
        rows.forEach(el => {
          this.tab032000Grid3DP().setValue(el.idx, "tOrg수량", el['tOrg수량']);
          this.tab032000Grid3DP().setValue(el.idx, "t수량", el['sumCnt']);
        });
      }
      this.$refs.cstTCntInput.closeDialog();
    },

    callSaveData(){
      return this.$refs.tab032000Grid3.getSaveData();
    },

    updateCstCell(jsonData){
      const gridData = this.tab032000Grid3DP().getJsonRows(0, -1);
      const targetIndex = gridData.findIndex(row => row.pkey === jsonData.pkey);
      if (targetIndex !== -1) {
        this.tab032000Grid3DP().setValue(targetIndex, 'f수량', jsonData.cstCell);
      } else {
        console.warn('해당 pkey 값을 가진 데이터가 없습니다.');
      }
    },

    handleMouseDown(event) {
      const input = this.$refs.runNoField;
      if (input && input.value) {
        event.preventDefault();
        input.select();
      }
    },

    async checkDuplicateCells(){
      let result2 = await this.$axios.api.search({menuId: "M0003002", queryId: (["061"].includes(this.params["공정코드"]) ? "M0003002_Sch26" : "M0003002_Sch27"), queryParams: this.params});
      if(!_.isNil(result2) && !_.isEmpty(result2)){

        let params = {
          dialogTitle: "중복 Cell_ID 리스트",					
          height: 300,
          width: 1800,
          gridJs: `CP0000000026.js`,
          btnConfirm: false,
          search: { menuId: "M0003002", queryId: (["061"].includes(this.params["공정코드"]) ? "M0003002_Sch26" : "M0003002_Sch27"), queryParams: this.params }
        };	
        this.$refs.cmDialog1.openDialog(params);
        this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'중복된 CELL 이 존재합니다.\n확인후 진행하시기 바랍니다.');
        return true;
      }
      return false;
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

    dateTimeInput3(fullDateTime) {
      let current = this.tab032000Grid3GV().getCurrent();
      let jsonData = this.tab032000Grid3DP().getJsonRow(current.dataRow);
      if (moment(fullDateTime, 'YYYYMMDD HHmmss', true).isValid()) {
        if(["작업시작","시작시각"].includes(this.dateTarget)){
          if(_.isNil(jsonData["작업종료"])){
            if (!this.$utils.isValidTimeRange(fullDateTime.split(" ")[0], fullDateTime.split(" ")[1], jsonData["작업종료"], jsonData["종료시각"])){
              this.$toast('info', "작업시작 시간은 작업종료 시간보다 이후일수 없습니다.");
              return;
            }
          }
          this.tab032000Grid3DP().setValue(current.dataRow, "작업시작", fullDateTime.split(" ")[0]);
          this.tab032000Grid3DP().setValue(current.dataRow, "시작시각", fullDateTime.split(" ")[1]);
        }else if(["작업종료","종료시각"].includes(this.dateTarget)){
          if (!this.$utils.isValidTimeRange(jsonData["작업시작"], jsonData["시작시각"], fullDateTime.split(" ")[0], fullDateTime.split(" ")[1])){
            this.$toast('info', "종료시각 시간은 작업시작 시간보다 전일수 없습니다.");
            return;
          }
          this.tab032000Grid3DP().setValue(current.dataRow, "작업종료", fullDateTime.split(" ")[0]);
          this.tab032000Grid3DP().setValue(current.dataRow, "종료시각", fullDateTime.split(" ")[1]);
        }
      }else{
        if(["작업시작","시작시각"].includes(this.dateTarget)){
          this.tab032000Grid3DP().setValue(current.dataRow, "작업시작", null);
          this.tab032000Grid3DP().setValue(current.dataRow, "시작시각", null);
        }else if(["작업종료","종료시각"].includes(this.dateTarget)){
          this.tab032000Grid3DP().setValue(current.dataRow, "작업종료", null);
          this.tab032000Grid3DP().setValue(current.dataRow, "종료시각", null);
        }
      }
    },

    workerClick(shift){
      if(!_.isNil(shift)){

        let current = this.tab032000Grid3GV().getCurrent();
        let jsonData = this.tab032000Grid3DP().getJsonRow(current.dataRow);

        let params = {
            dialogTitle: "작업자 정보 ["+jsonData["tCstno"]+"]",
            height: 750,
            popUpSize: "lg",          
            gridJs: `WorkerPopup1.js`,
            search: { menuId: "M0003003", queryId: "M0003003_Sch17", queryParams: { majCode: '101', code: shift.substring(0, 1) } }
        };	
        this.$refs.workerPopup.openDialog(params);			
      }
    },

    workerConfirm(val){
      let current = this.tab032000Grid3GV().getCurrent();
      this.tab032000Grid3DP().setValue(current.dataRow, "작업자", val);
      this.$refs.workerPopup.closeDialog();		
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackTab032000Grid3(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(cell.index.dataRow);
      if(fieldName == '특이사항'){
        if(this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tl edit";
        }/*else if(jsonData['공정코드'] !== '054' && !this.isStartDisabled && this.isEndDisabled){
          rtn.editable = true;
          rtn.styleName = "tl edit";
        }*/else{
          rtn.editable = false;
          rtn.styleName = "tl";
        }        
      }else if(jsonData["공정코드"]!= '054' && fieldName == 't수량'){
        if(this.isEditabled){
          rtn.editable = true;
          rtn.styleName = "tr edit";          
        }else{
          rtn.editable = false;
          rtn.styleName = "tr";
        }
      }else if(fieldName == 'fCstno'){
        let v = jsonData["fCstno"]
        let b = this.nics.indexOf(v) > -1;
        if(b){
          rtn.styleName = 'tl warning';
        }else{
          rtn.styleName = 'tl';
        }
      }
      return rtn
    },

    onCellEditedTab032000Grid3(grid, itemIndex, row, field) {      
      grid.commit();
      let ds = grid.getDataSource();
      let fieldName = ds.getOrgFieldName(field);
      let jsonData = ds.getJsonRow(itemIndex);
      if(fieldName == 't수량'){        
        if(jsonData["t수량"] > 30){
          this.$toast("info", "수량 30개보다 크게 입력할수 없습니다.");
          grid.setValue(itemIndex, "t수량", 30);
        }
        let jsonData1 = ds.getJsonRow(itemIndex);
        grid.setValue(itemIndex, "tOrg수량", jsonData1["t수량"]);
      }
    },

    onCellClickedTab032000Grid3(grid, clickData) {
      if (clickData.cellType === "head" && clickData.subType === "indicator") {
        let itemCount = grid.getItemCount();
        let col = grid.getDisplayColumns();
        let sel = {
          style: "block",
          startItem: 0,
          startColumn: col[0].name,
          endItem: itemCount,
          endColumn: col[col.length - 1].name,
        };
        grid.setSelection(sel);
      }else if(clickData.cellType == "data"){
        let ds = grid.getDataSource();
        let current = grid.getCurrent();
        let jsonData = ds.getJsonRow(current.dataRow);
        if(["061", "067"].includes(jsonData['공정코드']) && (clickData.fieldName == 'fCstno' || clickData.fieldName == 'tCstno')){
          let params = {
            dialogTitle: "Cell_ID 리스트",					
            height: 300,
            width: 1800,
            gridJs: `CP0000000015.js`,
            btnConfirm: false,
            search: { menuId: "M0003002", queryId: "M0003002_Sch11", queryParams: { runId: jsonData["runNo"], cstno: jsonData[clickData.fieldName], code: jsonData['공정코드'] } }
          };	
          this.$refs.cmDialog1.openDialog(params);
        }else if(["055", "056", "061"].includes(jsonData['공정코드']) && clickData.fieldName == 't수량'){
          if(jsonData["tCnt"] > 1){
            let rows = this.tab032000Grid3DP().getJsonRows(0, -1)
            .map((item, index) => ({ ...item, idx: index }))
            .filter(item => item.tCstno === jsonData["tCstno"]);
            this.$refs.cstTCntInput.openDialog({ tCstno: jsonData["tCstno"], rows: rows, isEditabled: this.isEditabled, errorCnt: this.params["적재수량"] });
          }
        }else if(jsonData['공정코드'] == '054'){
          if(clickData.fieldName == '작업자'){
            this.workerClick(jsonData['shift']);
          }else if(["작업시작","시작시각","작업종료","종료시각"].includes(clickData.fieldName)){
            if(_.isNil(jsonData[clickData.fieldName])){
              return;
            }
            this.dateTarget = clickData.fieldName;
            this.$refs.dateTime3.openPicker(); // 팝업 강제 열기
          }
          //this.tab032000Grid3GV().checkAll(false);
          //this.tab032000Grid3GV().checkItem(current.dataRow);
        }
      }
      //if(clickData.cellType !== "data") return;

    }, 

    onCellItemClickedTab032000Grid3(grid, index, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '불량입력'){
        if(jsonData["공정코드"] == "054"){
          /*this.$refs.processingMapping1.openDialog({
            ...this.params, 
            ...{             
              isEditabled: this.isEditabled,//(jsonData["공정코드"] == "054" ? (!_.isNil(jsonData["작업시작"]) && _.isNil(jsonData["작업종료"])) : this.isEndDisabled),            
              line: 'D1UT',
              "자동여부": 0,
              cstNo: jsonData["fCstno"],
              fCstNo: jsonData["fCstno"],
              tCstNo: jsonData["tCstno"],
              runId: jsonData["runNo"],
              '차수': jsonData["차수"],
              machineCode: null,
            }
          });*/
          this.$refs.errorInput.openDialog(
            {
              ...this.params,
              type: 'cstno1',
              line: 'D1UT',
              "자동여부": 0,
			        dialogTitle: ""+ jsonData["tCstno"]+" / 불량입력",
		          cstNo: jsonData["tCstno"],
              fCstNo: jsonData["tCstno"],
              '투입수량': jsonData["f수량"],
              runId: jsonData["runNo"],
              '차수': jsonData["차수"],
              isEditabled: this.isStartDisabled1,
              keyPadFlag: true,
              isMapping: true,
              callback: { queryId:'M0003002Error', data:[{
                ...this.params,
                '차수': jsonData["차수"],
                'code': this.params['공정코드'],
                line: 'D1UT',
                "자동여부": 0,
                fCstNo: jsonData["fCstno"],
                tCstNo: jsonData["tCstno"],
              }]}
            }
          );
        }else{
          this.$refs.errorInput.openDialog(
            {
              ...this.params,
              type: 'cstno1',
              line: 'D1UT',
              "자동여부": 0,
              errorCnt: jsonData["t수량"],
              dialogTitle: ""+ jsonData["fCstno"]+" / 불량입력",
              cstNo: jsonData["fCstno"],
              fCstNo: jsonData["fCstno"],
              //tCstNo: jsonData["tCstno"],
              runId: this.params["runNo"],
              '차수': jsonData["차수"],
              '투입수량': jsonData["t수량"],
              keyPadFlag: true,
              isEditabled: this.isStartDisabled1,
              callback: { queryId:'M0003002Error', data:[{
                ...this.params,
                '차수': jsonData["차수"],
                'code': this.params['공정코드'],
                line: 'D1UT',
                "자동여부": 0,
                fCstNo: jsonData["fCstno"],
                //tCstNo: jsonData["tCstno"],
              }]}
            }
          );
        }
      }else if(clickData.fieldName == '시료확인'){
        this.$refs.reliabilitySampleConfirmPopup.openDialog({
            ...this.params, 
            ...{                           
              cstNo: jsonData["fCstno"],
              fCstNo: jsonData["fCstno"],
              tCstNo: jsonData["tCstno"],
              runId: jsonData["runNo"],
            }
          });
      }
      return true;
    },

    onRowCountChangedTab032000Grid3(provider, newCount) {
      let rows = this.tab032000Grid3DP().getJsonRows(0, -1);
      let startRows = rows.filter((row) => _.isNil(row["작업시작"]));
      if(_.isEmpty(startRows)){
        this.startChk = false;
      }else{
        this.startChk = true;
      }
      let endRows = rows.filter((row) => !_.isNil(row["작업시작"]) && _.isNil(row["작업종료"]));
      if(_.isEmpty(endRows)){
        this.endChk = false;
      }else{
        this.endChk = true;
      }
		},
    
    /*onItemCheckedTab032000Grid3(grid, itemIndex, checked){
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(itemIndex);
      if(jsonData["공정코드"] == "054"){
        //this.startChk = _.isNil(jsonData["작업시작"]);
        //this.endChk = !_.isNil(jsonData["작업시작"]) && _.isNil(jsonData["작업종료"]);
        //this.selCstNo = jsonData["tCstno"];
		
      }
    }*/
  },
};
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
.cell_no{
  .form-control{
   height:28px!important;
   min-height:28px!important;
  }
  label{top:-3px!important;}
  .form-control:not(:placeholder-shown) ~ label {
    top: 3px!important;
  }
}
</style>