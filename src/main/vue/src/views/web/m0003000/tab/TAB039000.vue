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
              ref="runNoField"
              name="runNo"
              data-group="params"
              @input="convertToUpperEnglish"
              v-model="params['runNo']"
              @keydown.enter="searchClick"
              autocomplete="off"
              @mousedown="handleMouseDown"
            />
            <label for="floating">RunNo</label>
          </div>
        </b-col>
        <!--<b-col cols="2">
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
        </b-col>-->
      </b-row>
      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="worker_wrap" v-if="['072','069'].includes(params['공정코드'])">
      <div class="title mr-4">작업자 정보</div>
          <div class="row worker_info">                         
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
            <div class="col-2">
              <div class="form-floating prc_name">
                <input
                  type="text"
                  class="form-control label-60"
                  id="floating"
                  placeholder="작업자"
                  autocomplete="off"
                  v-model="params['작업자']"
                  @click="workerClick"
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
                  v-model="params['작업조']"
                  :disabled="true"
                >
                  <option 
                    v-for="(item, index) in shiftTypes" 
                    :key="index" 
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
                <label for="floatingSelect" class="select">근무시간</label>
              </div>
            </div>   
            <div class="col-2" v-if="params['공정코드']=='058'">
            <div class="form-floating prc_name">
              <select class="form-select label-120" id="floatingSelect" aria-label="Floating label select example"
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
          <div class="col-2">
            <DateTimeSpinner ref="dateTime1" @input="dateTimeInput1" label="작업시작"/>  
          </div>
          <div class="col-2">
            <DateTimeSpinner ref="dateTime2" @input="dateTimeInput2" label="작업종료"/>  
          </div>        
        </div>
    </div>    
    <div class="accordion mt-2" id="accordionExample">
      <!-- 첫 번째 패널 -->
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
          data-bs-parent="#accordionExample"
        >
          <div class="accordion-body">
            <div class="btn_wrap mb-1">
                <b-button class="me-1 second" v-if="params['차수']>1" @click="actionClick('workStatus')">전체 작업현황</b-button>
                <div class="hr" v-if="params['차수']>1"></div>
                <b-button class="second me-1" v-if="['072','069'].includes(params['공정코드'])" @click="actionClick('filmBoxJob')">작업진행</b-button>
                <b-button class="second me-1" v-if="['072','069','070'].includes(params['공정코드'])" @click="actionClick('errorStatus')">불량 맵핑 현황</b-button>
                <b-button class="second me-1" @click="actionClick('resultInput')" v-if="['070','073','068'].includes(params['공정코드'])">결과 입력</b-button>
                <b-button class="second me-1" @click="actionClick('detailView')" v-if="['072','069'].includes(params['공정코드'])">상세 보기</b-button>
                <b-button class="second me-1" @click="actionClick('film')" v-if="['072','069'].includes(params['공정코드'])">필름 확인</b-button>
                <b-button class="second me-1" @click="actionClick('sample')" v-if="['070','072','069','073'].includes(params['공정코드'])">신뢰성 시료</b-button>
                <b-button class="second me-1" @click="actionClick('sampleConfirm')" v-if="['070','072','069','073'].includes(params['공정코드'])">시료확인</b-button>
                <b-button class="second me-1" @click="actionClick('monitoringSample')" v-if="['070','072','069'].includes(params['공정코드'])">모니터링 시료</b-button>
                <div class="hr" v-if="['070','073','068'].includes(params['공정코드'])"></div>
                <b-button class="me-1" :class="{ sub : isDisabled }" :disabled="!isDisabled" @click="actionRerun" v-if="['072','069'].includes(params['공정코드'])">재진행</b-button>
                <b-button class="mr0 sub" @click="actionLogClick" v-if="['070','073','068'].includes(params['공정코드'])">설비로그</b-button>
                <div class="hr" v-if="params['공정코드'] != null"></div>
                <b-button-group class="toggle_btn" v-if="params['공정코드'] != null">
                    <b-button :class="{ on : isStartDisabled }" @click="actionClick('start')">작업시작</b-button>
                    <b-button :class="{ on : isEndDisabled }" @click="actionClick('end')">작업종료</b-button>
                </b-button-group>
                <div class="hr" v-if="params['공정코드'] != null"></div>
              <b-button class="me-1" :class="{ main : (!isStartDisabled && isEditabled) || (Number(params['차수']) > 1 && isStartDisabled) }" v-if="params['공정코드'] != null" @click="actionClick('cancel')">작업취소</b-button>
              <b-button  :class="{main : isEditabled }" @click="actionClick('temp')" v-if="['072','069'].includes(params['공정코드'])">임시저장</b-button>
            </div>
            <div class="row mb-1">
              <RealGrid ref="tab039000Grid1" :uid="'tab039000Grid1'" :rows="rows"/>
            </div>
            <template v-if="['072','069'].includes(params['공정코드'])">              
              <div class="row mt-2">
                <div class="col">
                  <div class="etc">
                    <div class="title">특이사항</div>
                    <b-form-textarea rows="2" no-resize 
                      v-model="params['특이사항']"
                      :disabled="!isEditabled"
                      @click="textInputPopupOpen"
                      />
                  </div>
                </div>
              </div>  
              <div class="etc mt-1"> 
                <div class="title">불량현황</div>
                <RealGrid ref="tab039000Grid3" :uid="'tab039000Grid3'" :rows="rows2" class="mb-1" :fitLayoutWidthEnable="false"/>
              </div>
              <div class="hold_wrap" v-if="holdChk1 || holdChk2">
                <div class="hold">HOLD {{(holdChk1 ? '깨짐('+ holdVal1+')' : '') +''+ (holdChk2 ? '유리이물('+ holdVal2+')' : '')}}</div>
               </div>
              <b-row class="mt-2">
                <b-col>                
                  <div class="d-flex mb-1">
                    <div class="col-8">
                      <div class="form-floating cell-no">
                        <input
                          type="text"
                          class="form-control label-80"
                          id="floating"
                          placeholder="CELL No."
                          name="cellNo"
                          data-group="params1"
                          @input="convertToUpperEnglish"
                          @keydown.enter="handleEnter"
                          ref="cellNoField"
                          autocomplete="off"
                          v-model="params1.cellNo"
                          :disabled="!isStartDisabled1"
                          :style="{ backgroundColor: isStartDisabled1 ? '#fff959' : '' }"
                        />
                        <label for="floating">CELL No.</label>
                      </div>                    
                    </div>
                    <div class="col-4">
                      <b-button class="none">미진행 : {{notProgCnt}}</b-button>                        
                    </div>
                  </div>
                  <RealGrid ref="tab039000Grid4" :uid="'tab039000Grid4'" v-show="detailView" :rows="rows4" :style="`height: 460px`"/>      
                </b-col>
                <b-col>
                    <div class="d-flex  mb-1">                    
                          <b-button :class="{ good: type == '양품' } "  @click="actionType('양품')">양품 : {{successCnt}}</b-button>                        
                    </div>
                  <RealGrid ref="tab039000Grid5" :uid="'tab039000Grid5'" v-show="detailView" :rows="rows5" :style="`height: 460px`"/>      
                </b-col>
                <b-col>
                  <div class="d-flex  mb-1">
                          <b-button :class="{ error : type == '불량' } " @click="actionType('불량')">불량 : {{errorCnt}}</b-button>
                   
                      <div class="d-flex ms-1" @click="errorPopupOpen" style="cursor: pointer;">
                        <b-form-input 
                          v-model="defective['불량사유']"
                          :disabled="true"
                          style="height:40px; pointer-events: none"
                        />
                      </div>
                  </div>                
                  <RealGrid ref="tab039000Grid6" :uid="'tab039000Grid6'" v-show="detailView" :rows="rows6" :style="`height: 460px`"/>      
                </b-col>
              </b-row>            
            </template>
            <template v-else-if="['073'].includes(params['공정코드'])">              
              <div class="etc mt-1"> 
                <div class="title">불량현황</div>
                <RealGrid ref="tab039000Grid3" :uid="'tab039000Grid3'" :rows="rows2" class="mb-1" :fitLayoutWidthEnable="false"/>
              </div>
              <b-row class="mt-2">
                <b-col cols="2">
                  <RealGrid ref="tab039000Grid4" :uid="'tab039000Grid4'" :rows="rows4" :style="`height: 460px`"/>             
                </b-col>
                <b-col cols="10">                    
                  <RealGrid ref="tab039000Grid5" :uid="'tab039000Grid5'" :rows="rows5" :style="`height: 460px`"/> 
                </b-col>                
              </b-row>            
            </template>
            <template v-else>
              <div class="etc mt-1" v-if="['070','068'].includes(params['공정코드'])">
                <div class="title">불량현황</div>
                <RealGrid ref="tab039000Grid3" :uid="'tab039000Grid3'" :rows="rows2" class="mb-1" :fitLayoutWidthEnable="false"/>
              </div>
              <RealGrid ref="tab039000Grid4" :uid="'tab039000Grid4'" :rows="rows4" :style="`height: 460px`"/> 
            </template>
          </div>
        </div>        
      </div>
    </div>
    <SampleInfoStatus ref="sampleInfoStatus" v-show="params['공정코드']=='072' || params['공정코드']=='070' || params['공정코드']=='073'"/>      
    <ProcessingMapping2 ref="processingMapping2" @save="saveCallback1"/>
    <ReliabilitySamplePopup ref="reliabilitySamplePopup" @save="saveCallback1"/>
    <MonitoringSamplePopup ref="monitoringSamplePopup" @save="saveCallback1"/>
    <ReliabilitySampleConfirmPopup ref="reliabilitySampleConfirmPopup" @save="saveCallback1"/>
    <WorkerPopup ref="workerPopup" @confirm="workerConfirm" />
    <ProcessingMappingStatus ref="processingMappingStatus"/>
    <ProcessingMappingStatus1 ref="processingMappingStatus1"/>
    <ResultInputPopup ref="resultInputPopup" @save="saveCallback1"/>
    <OverallWorkStatusPopup ref="overallWorkStatusPopup" />
    <CmDialog1 ref="cmDialog1" @confirm="handleConfirm" />
    <ErrorSchPopup ref="errorSchPopup" @confirm="ErrorInput" />
    <FilmBoxJobPopup ref="filmBoxJobPopup" @closeDialog="saveCallback1"/>
    <VlrRemarkInputPopup ref="vlrRemarkInputPopup" @save="saveCallback1"/>
    <CellQcRemarkInputPopup ref="cellQcRemarkInputPopup" @save="saveCallback1"/>
  </div>
</template>

<script>
import { useUserAuthInfo } from "@store/auth/userAuthInfo";
import ProcessingMapping2 from "@web/popup/ProcessingMapping2";
import ReliabilitySamplePopup from "@web/popup/ReliabilitySamplePopup";
import MonitoringSamplePopup from "@web/popup/MonitoringSamplePopup";
import WorkerPopup from "@web/popup/WorkerPopup";
import ProductStatus from '@components/ProductStatus.vue';
import SampleInfoStatus from '@components/SampleInfoStatus.vue';
import ReliabilitySampleConfirmPopup from "@web/popup/ReliabilitySampleConfirmPopup";
import ProcessingMappingStatus from "@web/popup/ProcessingMappingStatus";
import ProcessingMappingStatus1 from "@web/popup/ProcessingMappingStatus1";
import ResultInputPopup from "@web/popup/ResultInputPopup";
import OverallWorkStatusPopup from "@web/popup/OverallWorkStatusPopup1";
import ErrorSchPopup from "@web/popup/ErrorSchPopup";
import FilmBoxJobPopup from "@web/popup/FilmBoxJobPopup";
import VlrRemarkInputPopup from "@web/popup/VlrRemarkInputPopup";
import CellQcRemarkInputPopup from "@web/popup/CellQcRemarkInputPopup";
import { useM0003003 } from '@web/store/M0003003.js';
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
    ProcessingMapping2,
    ReliabilitySamplePopup,
    MonitoringSamplePopup,
    ProductStatus,
    SampleInfoStatus,
    ReliabilitySampleConfirmPopup,
    WorkerPopup,
    ProcessingMappingStatus,
    ProcessingMappingStatus1,
    ResultInputPopup,
    OverallWorkStatusPopup,
    ErrorSchPopup,
    FilmBoxJobPopup,
    VlrRemarkInputPopup,
    CellQcRemarkInputPopup
  },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    const processList = userAuthInfo.getTabInfoListBySRI('M0003003', 'TAB039000');
    const srchInfo = useM0003003();
    return { userAuthInfo, srchInfo, processList};
  },
  watch: {
    "params.공정코드"(newVal) {
      //this.items1 = this.$utils.getNextProcessNamesFromCode(newVal, this.codes);
      setTimeout(()=>{
        this.$utils.initializeParamsInPlace(this.params, ["공정코드","runNo"]);
        if(this.$refs.dateTime1)this.$refs.dateTime1.clearClick();
        if(this.$refs.dateTime2)this.$refs.dateTime2.clearClick();
        this.searchTab039000GridFields().then(() => {
          if(this.$utils.isValidProperty(this.params, 'runNo')){          
            this.searchClick();
          }
          this.searchMachineCode();
        });
      }, 300)
      

      this.detailView = false;
      this.srchInfo.process = newVal;
      if(!_.isEmpty(this.params.runNo) && this.srchInfo.runNo != this.params.runNo) this.srchInfo.runNo = this.params.runNo;

		},
    "params.machineCode"(newVal) {
      const index = this.machineCodes.findIndex((item) => item.value === newVal);
      if(index > -1){
        this.params["chamber"] = this.machineCodes[index]['chamber'];
        this.params["설비약명"] = this.machineCodes[index]['text'].split(' ')[0];
        this.params["설비명"] = this.machineCodes[index]['설비명'];
      }
		},
    /*"params.nxt공정코드"(newVal) {
      this.$nextTick(()=>{
        if(newVal == "-"){
          this.params["nxt공정코드"] = null;
        }
      });
		},*/
    "params.runNo"(newVal, oldVal) {
      this.srchInfo.runNo = newVal;
    },
  },
  data() {
    return {      
      tab039000Grid1: null,
      tab039000Grid3: null,
      tab039000Grid4: null,
      tab039000Grid5: null,
      tab039000Grid6: null,
      rows: [],
      rows2: [],
      rows4: [],
      rows5: [],
      rows6: [],
      params: {
				'공정코드': null,				
        //'nxt공정코드': null,
        runNo: null,
        shift: null,
        '작업조': null,
        '책임자': null,
        '선임자': null,
        '작업자': null,
        machineCode: null,
        '설비명': null,
        '설비약명': null,
				chamber: null,
        'next작업시작': null,
        '차수': null,
        'pre공정코드': null,
        '투입수량': null,
        '작업시작': null, 
        '시작시각': null,
        '작업종료': null, 
        '종료시각': null,
        '특이사항': null,
        'pre양품수량': null,
			},
      params1: {
        cellNo: null,
      },
      type: "양품",
      defective: {
        "불량사유": null,
        "불량코드": null       
      },
      dynamic: {
        layout1: [],
      },
      // items: [],
      items1: [],
      shifts: [],
      shiftTypes: [],
      codes: [],
      machineCodes: [],
      isStartMessge: false,
      detailView: false,
      notProgCnt: 0,
      errorCnt: 0,
      successCnt: 0,
      startDay: null,
      startTime: null,
      endDay: null,
      endTime: null,
      holdChk1: false,
      holdChk2: false,
      holdVal1: null,
      holdVal2: null,
    };
  },
  computed: {
    menuList(){
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
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
			return this.rows.length > 0 && this.$utils.isValidProperty(this.params, '공정코드') && this.$utils.isValidProperty(this.params, '작업시작') && this.$utils.isValidProperty(this.params, '작업종료') && !this.$utils.isValidProperty(this.params, 'next작업시작');
		},
    isTempDisabled(){
      return !this.$utils.isValidProperty(this.params, 'next작업시작') && !this.isStartDisabled
    },
    isEditabled(){
      return this.isTempDisabled//this.isStartDisabled || this.isEndDisabled
    },    
  },
  created() {
    // this.items = this.$utils.fetchAuthorizedMenuProcesses(this.menuList, this.tabId);
    this.initializeGrid();
    this.searchComCode();
    this.searchCodes();
  },
  mounted() {
    this.$eventBus.on("Back2CellQCMenuMove", this.back2CellQCMenuMove);

    this.srchInfo.process = this.params.공정코드;
    this.srchInfo.runNo = this.params.runNo;
  },
	beforeUnmount() {
    this.$eventBus.off("Back2CellQCMenuMove");
  },
  methods: {
    back2CellQCMenuMove(data){
      /*let searchFlag = false;
      if(this.params["공정코드"] != data["공정코드"] || this.params["runNo"] != data["runNo"]){
        searchFlag = true;
      }*/
      this.params["공정코드"] = data["공정코드"];
      this.params["runNo"] = data["runNo"];
      this.detailView = false;
      
      //if(searchFlag)
      //this.$nextTick(()=>{
      setTimeout(()=>{
        this.searchClick();
      }, 1000);
      //})
    },
    tab039000Grid1GV() {
      return this.$refs.tab039000Grid1?.getGridView();
    },
    tab039000Grid1DP() {
      return this.$refs.tab039000Grid1?.getGridDataProvider();
    },    
    tab039000Grid3GV() {
      return this.$refs.tab039000Grid3?.getGridView();
    },
    tab039000Grid3DP() {
      return this.$refs.tab039000Grid3?.getGridDataProvider();
    },
    tab039000Grid4GV() {
      return this.$refs.tab039000Grid4?.getGridView();
    },
    tab039000Grid4DP() {
      return this.$refs.tab039000Grid4?.getGridDataProvider();
    },
    tab039000Grid5GV() {
      return this.$refs.tab039000Grid5?.getGridView();
    },
    tab039000Grid5DP() {
      return this.$refs.tab039000Grid5?.getGridDataProvider();
    },
    tab039000Grid6GV() {
      return this.$refs.tab039000Grid6?.getGridView();
    },
    tab039000Grid6DP() {
      return this.$refs.tab039000Grid6?.getGridDataProvider();
    },
    initializeGrid() {
      this.tab039000Grid1 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
      //this.tab039000Grid2 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_2.js`));
      this.tab039000Grid3 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_3.js`));
      this.tab039000Grid4 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
      this.tab039000Grid5 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_5.js`));
      this.tab039000Grid6 = _.cloneDeep(require(`@web/m0003000/js/TAB039000_6.js`));
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
    getTab039000Grid1(code) {
      switch (code) {
        case '072':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
        case '068':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_2.js`));
        case '070':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_3.js`));        
        case '073':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_3.js`));        
        case '069':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_1_1.js`));
      }
    },
    getTab039000Grid4(code) {
      switch (code) {
        case '072':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
        case '068':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_2.js`));
        case '070':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_3.js`));
        case '073':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
        case '069':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_1.js`));
      }
    },
    getTab039000Grid5(code) {
      switch (code) {
        case '073':
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_4_3.js`));
        default:
          return _.cloneDeep(require(`@web/m0003000/js/TAB039000_5.js`));
      }
    },
    async searchTab039000GridFields(){

      this.tab039000Grid1 = this.getTab039000Grid1(this.params["공정코드"]);
      this.tab039000Grid4 = this.getTab039000Grid4(this.params["공정코드"]);
      this.tab039000Grid5 = this.getTab039000Grid5(this.params["공정코드"]);

      let result = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch5", 
        queryParams: { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] }
      });

      if(['072','069','070','068','073'].includes(this.params['공정코드'])){
        this.tab039000Grid3.fields = [];
        this.tab039000Grid3.columns = [];
        let gsfc1 = this.$utils.generateSeparatedFieldsAndColumns(result, "불량코드", "불량명", ValueType.INT, "c", { styleName: "tr",
          footer: { valueCallback: this.footerValueCallback }
        });
        
        this.tab039000Grid3.orgColumns[0].footer = {valueCallback : this.footerValueCallback};
      

        this.tab039000Grid3.fields = [
          this.tab039000Grid3.orgFields[0],
          ...gsfc1.fields,
        ];
  
        this.tab039000Grid3.columns = [
          this.tab039000Grid3.orgColumns[0],
          ...gsfc1.columns,
        ];
        
        this.tab039000Grid3.layout[1].items = result.map((defect) => ("c"+defect["불량코드"]));
        this.dynamic.layout1 = result.map(defect => ({
          value: defect["불량코드"],
          text: `c${defect["불량코드"]}`
        }));

        if(['070','068','073'].includes(this.params['공정코드'])){
          this.tab039000Grid3.options.display.rowHeight = 28;
        }else if(['072'].includes(this.params['공정코드'])){
          this.tab039000Grid3.options.display.rowHeight = 45;
        }
      }

      this.$nextTick(() => {
        if(this.tab039000Grid1DP())this.$refs.tab039000Grid1.created();
        if(this.tab039000Grid3DP())this.$refs.tab039000Grid3.created();
        if(this.tab039000Grid4DP())this.$refs.tab039000Grid4.created();
        if(this.tab039000Grid5DP())this.$refs.tab039000Grid5.created();
        
        if(this.tab039000Grid4DP())this.tab039000Grid4DP().restoreMode = "auto";
        if(this.tab039000Grid5DP())this.tab039000Grid5DP().restoreMode = "auto";
        if(this.tab039000Grid6DP())this.tab039000Grid6DP().restoreMode = "auto";
        if(this.params["공정코드"] == '054' || this.params["공정코드"] == '055')this.$refs.tab039000Grid4.created();
      });
		},
    async searchCodes(){
			let searchParam = {
				menuId: "M0003003", queryId: "M0003003_Sch1", queryParams: this.params, 
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
		},
    searchClick(init = true){
      this.searchCodes();
      this.$nextTick(async()=>{        
        if(init){
          let target = ["공정코드","runNo","작업자","작업조","shift","특이사항"];          
          /*if (this.items1.length < 2) {
            target.push("nxt공정코드");
          }*/
          this.$utils.initializeParamsInPlace(this.params, target);
        }

        if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])){
          return;
        }
        let params = {
          runNo: this.params.runNo,
          line: 'D1UT',
          "자동여부": 0,
          '공정코드': this.params['공정코드'],
          'code': this.params['공정코드'],
        };	
        let searchParam = [
          {menuId: "M0003003", queryId: "M0003003_Sch2", queryParams: params, target: this.rows},
        ];

        let result = await this.$axios.api.searchAll(searchParam);
        if(result[0].length==0){
          this.$toast("info", "해당 RunNo의 공정 작업 이력 내역이 없습니다.");        
          this.$refs.runNoField.focus();
          this.$refs.runNoField.select();
          return;
        }

        let searchParam1 = [];
        let searchParam2 = [];
        params["차수"] = result[0][0]["차수"];
        params["pre공정코드"] = result[0][0]["pre공정코드"];
        if (['072','069'].includes(this.params['공정코드'])) {
          searchParam1.push(
            {menuId: "M0003003", queryId: "M0003003_Sch3", queryParams: params, target: this.rows4}, 
            {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2}
          );
          searchParam2.push(
            {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '양품' }, target: this.rows5},
            {menuId: "M0003003", queryId: "M0003003_Sch4", queryParams: {...params, 'result': '불량' }, target: this.rows6},
          );
        }else if (['068','070'].includes(this.params['공정코드'])) {
          searchParam1.push(
            {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2},            
            {menuId: "M0003003", queryId: "M0003003_Sch9", queryParams: params, target: this.rows4} 
          );
        }else if(['073'].includes(this.params['공정코드'])){
          searchParam1.push(
            {menuId: "M0003003", queryId: "M0003003_Sch6", queryParams: {...params, columns1: this.dynamic.layout1 }, target: this.rows2},            
            {menuId: "M0003003", queryId: "M0003003_Sch3", queryParams: params, target: this.rows4},
            {menuId: "M0003003", queryId: "M0003003_Sch9", queryParams: params, target: this.rows5} 
          );
        }
        await this.$axios.api.searchAll(searchParam1);
        await this.$axios.api.searchAll(searchParam2);

        await this.$refs.prodStatus.loadData();

        let loadParams = { ...this.params, line: 'D1UT', "자동여부": 0, runId: this.params["runNo"] };
        await this.$refs.sampleInfoStatus.loadData(loadParams);
        /*else{
          if(!this.isStartMessge && this.$utils.isValidProperty(this.rows[0], '작업시작') && !this.$utils.isValidProperty(this.rows[0], '작업종료')){
            this.$toast("info", "작업중입니다.");
          }
        }*/
      
        if(init){
          // 기본 필드 배열
          let fields = ["shift", "작업조", "작업자", "작업시작", "시작시각", "작업종료", "종료시각", "차수","pre공정코드",'투입수량',"특이사항","next작업시작","pre양품수량"];
  
          this.$utils.updateParamsFromRows(
            this.params,
            this.rows,
            fields,
            this.$utils.isValidProperty
          );

          /*if(this.items1.length == 1){
            this.params["nxt공정코드"] = this.items1[0].value;
          }*/
  
          this.isStartMessge = false;
        }

        if(!init && ["072","069"].includes(this.params['공정코드'])){
          this.focusCellNoField();
          this.params1.cellNo = null;
        }        
        
        this.holdChk1 = false;
        this.holdChk2 = false;

        if(["072","069"].includes(this.params['공정코드'])){
          let result4 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_PFLRunHold", queryParams: this.params});
          if(!_.isNil(result4) && !_.isEmpty(result4)){
            if(result4[0]['불량률1'] > result4[0]['rate1']){
              this.holdChk1 = true;
              this.holdVal1 = ('기준: '+(Math.floor(result4[0]['rate1']*100 * 100) / 100)+'% 불량률: '+ Math.floor(result4[0]['불량률1']*100 * 100) / 100)+'%';
            }
            if(result4[0]['불량률2'] > result4[0]['rate2']){
              this.holdChk2 = true;
              this.holdVal2 = ('기준: '+(Math.floor(result4[0]['rate2']*100 * 100) / 100)+'% 불량률: '+ Math.floor(result4[0]['불량률2']*100 * 100) / 100)+'%';
            }
          }          
          const el = this.$refs.tab039000Grid3?.$el || this.$refs.tab039000Grid3;
          if (el) {
            el.classList.toggle('error', this.holdChk1 || this.holdChk2);
          }
        }
        if(this.tab039000Grid1GV())this.tab039000Grid1GV().refresh(true);
        if(this.tab039000Grid3GV())this.tab039000Grid3GV().refresh(true);
        if(this.tab039000Grid4GV())this.tab039000Grid4GV().refresh(true);
        if(this.tab039000Grid6GV())this.tab039000Grid6GV().refresh(true);
      });

		},

    async actionLogClick(){
      this.$nextTick(async()=>{
        if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])){
          return;
        }
        let result3 = await this.$axios.api.search({menuId: "M0003002", queryId: "M0003002_HoldChk", queryParams: this.params});
        if(!_.isNil(result3) && !_.isEmpty(result3) && result3[0]["hold여부"] === "Y"){
          this.$toast('info', "RUN No["+this.params["runNo"]+"] "+'진행이 불가합니다. HOLD상태입니다.');
          return;
        }
        if(["068","070"].includes(this.params["공정코드"])){
          let result2 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch22", queryParams: this.params});
          if(!_.isNil(result2) && !_.isEmpty(result2) && _.isNil(result2[0]['작업종료'])){
            this.$toast('info', "RUN No["+this.params["runNo"]+"] 필름 포장 검사에서 작업이 완료되지 않아 진행할수 없습니다.");
            return;
          }
        }
        let result = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_LogChk", queryParams: {...this.params, line: 'D1UT', "자동여부": 0, code: this.params["공정코드"]}});
        if(_.isNil(result) || _.isEmpty(result) || result[0].cnt == 0){
          this.$toast('info', "설비로그 대상이 없습니다.");
          return;
        }
        let saveFunc = async () => {
          
          let rows = [{
            ...this.params,
            line: 'D1UT', "자동여부": 0,
            'code': this.params['공정코드']
          }];
          let params = {
            "menuId": 'M0003003',
            "update": [
              (this.params['공정코드'] == '070' ? { queryId: "M0003003_Log", data: [{ ...this.params, line: 'D1UT', "자동여부": 0, 공정코드: '068', code: '068'}] } : {}),
              { queryId: "M0003003_Log", data: rows }
            ],
          };

          const resp = await this.$axios.api.saveData(params);
          if (resp.status === 'success') {
            this.$toast('success', "설비로그 가져오기를 완료하였습니다.");
            this.searchClick();
          } else {
            this.$toast('error', resp.message);
          }
        };
        
        this.$confirm("확인", "설비로그 가져오기를 하시겠습니까?<br><span style='color:red'>(기존에 저장되어있던 내용이 삭제 될수있습니다.)</span>", (confirm)=>{
          if(confirm){
            saveFunc();
          }
        });
      });
    },
    
    async actionClick(action) {

      if(this.tab039000Grid5GV())this.tab039000Grid5GV().commit();
      if(this.tab039000Grid6GV())this.tab039000Grid6GV().commit();
      if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])){
        return;
      }
      if(action === 'sample'){
        this.$refs.reliabilitySamplePopup.openDialog({
          ...this.params,
          runId: this.params['runNo'],
          isEditabled: true,
          line: 'D1UT',
          "자동여부": 0,
          callback: { 
            queryId:'M0003002_Sample', 
            data:[{
              ...this.params,
              'code': this.params['공정코드'],
            }]
          }
        });
        return;
      }else if(action === 'sampleConfirm'){
        this.$refs.reliabilitySampleConfirmPopup.openDialog({
          ...this.params, 
          ...{            
            runId: this.params["runNo"],
          },
          menu: 'M0003003',
        });
        return;
      }else if(action === 'film'){

        this.$refs.processingMapping2.openDialog({
          ...this.params,
          model: this.rows[0]["제품모델"],
          isEditabled: false,
          isFilm: true,
        });
        return;
      }else if(action === 'monitoringSample'){
        this.$refs.monitoringSamplePopup.openDialog({
          ...this.params,
          runId: this.params['runNo'],
          isEditabled: this.isEditabled,
          line: 'D1UT',
          "자동여부": 0,
          /*callback: { queryId:'M0003002_Sample', data:[{
            ...this.params,
            'code': this.params['공정코드']            
          }]
          }*/
        });
        return;
      }else if(action === 'cancel'){

        if(!((!this.isStartDisabled && this.isEditabled) || (Number(this.params['차수']) > 1 && this.isStartDisabled))) return;
        
        let saveCancelFunc = async () => {
          
          let params = {
            "menuId": 'M0003003',
            "update": [{ queryId: (this.params['차수'] > 1 ? 'M0003003_remove' : 'M0003003_cancel'), data: [{ ...this.params, 'code': this.params['공정코드'] }] }]
          };

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
      }else if(action === 'detailView'){
        this.detailView = !this.detailView;
        return;
      }else if(action == 'errorStatus'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }
        if(['070'].includes(this.params["공정코드"])){

          let result2 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch19", queryParams: {'제품모델': this.rows[0]["제품모델"]}});
          if(_.isNil(result2) || _.isEmpty(result2)){
            this.$toast('info', "제품모델["+this.rows[0]["제품모델"]+"] 정보가 없습니다.");
            return;
          }

          this.$refs.processingMappingStatus1.rowCount = result2[0]["장면수"];
          this.$refs.processingMappingStatus1.colCount = result2[0]["단면수"];
          this.$refs.processingMappingStatus1.openDialog({
            ...this.params,
            runId: this.params['runNo'],
            line: 'D1UT',
            "자동여부": 0,         
          });
        }else{
          this.$refs.processingMappingStatus.openDialog({
            ...this.params,
            runId: this.params['runNo'],
            line: 'D1UT',
            "자동여부": 0,         
          });
        }
        return;
      }else if(action == 'resultInput'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }
        if(['070', '073', '068'].includes(this.params["공정코드"])){
          this.$refs.resultInputPopup.openDialog({
            ...this.params,
            runId: this.params['runNo'],
            isEditabled: this.isEditabled,
            line: 'D1UT',
            "자동여부": 0,
            callback: { queryId:'M0003003_ResultMerge', data:[{
              ...this.params,
              line: 'D1UT',
              "자동여부": 0,
              'code': this.params['공정코드']
            }]
            }
          });
        }
        return;
      }else if(action == 'workStatus'){
        if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }

        this.$refs.overallWorkStatusPopup.openDialog({...this.params});
        return;
      }else if(action == 'filmBoxJob'){
         if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
          return;
        }
        this.$refs.filmBoxJobPopup.openDialog({...this.params, '제품모델': this.rows[0]["제품모델"], isEditabled: this.isEditabled});
        return;
      }
      this.$nextTick(async()=>{
        let target = ['C:공정:공정코드', 'T:RunNo:runNo'];
        if(action == 'temp'){
          //target.push("T:작업자:작업자");
        }
       
        if(( ['072','068','070','069','073'].includes(this.params['공정코드'])) && 
          ((action == 'start' && !this.isStartDisabled) || (action == 'end' && !this.isEndDisabled)  || (action == 'temp' && !this.isEditabled))
        ){
          return;
        }
        if(['072','069'].includes(this.params['공정코드'])){
          target.push(...["T:작업자:작업자",'T:근무조:shift']);
          if(action == 'start'){
            if((this.tab039000Grid4DP().getRowCount()) == 0){
              this.$toast("info", "CELL 리스트 대상이 없습니다.");
              return;
            } 
          }else if(action == 'end'){
            if((this.tab039000Grid4DP().getRowCount()) > 0){
              this.$toast("info", "작업이 끝나지 않은 CELL이 존재합니다.");
              return;
            } 
          }
        }
        /*if (action === 'end') {
          target.push("C:인계공정:nxt공정코드");          
        }*/
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

        if(action === 'start' && ["068","070"].includes(this.params["공정코드"])){
          let result2 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch22", queryParams: this.params});
          if(!_.isNil(result2) && !_.isEmpty(result2) && _.isNil(result2[0]['작업종료'])){
            this.$toast('info', "RUN No["+this.params["runNo"]+"] 필름 포장 검사에서 작업이 완료되지 않아 진행할수 없습니다.");
            return;
          }
        }  
        if(action === 'end'){
          // 작업종료시 ECI, VRS 양품수량이 일치해야함.
          if(["070"].includes(this.params["공정코드"])){
            let result2 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch18", queryParams: this.params});
            if(!_.isNil(result2) && !_.isEmpty(result2) && result2[0]['양품수량'] !== result2[1]['양품수량']){
              this.$toast('info', "RUN No["+this.params["runNo"]+"] ECI 양품수량, VRS 투입수량이 일치하지 않습니다.");
              return;
            }
          }else if(["072"].includes(this.params["공정코드"])){ // 작업종료시 필름 포장 검사에서는 양품체크
            let result2 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_Sch25", queryParams: this.params});
            if(!_.isNil(result2) && !_.isEmpty(result2)){
              let chkVal1 = this.successCnt == result2[0]['양품수량'] ? "<span style='color:blue'>양품수량: O</span>" : "<span style='color:red'>양품수량: X</span>";
              let chkVal2 = this.errorCnt == result2[0]['불량수량'] ? "<span style='color:blue'>불량수량: O</span>" : "<span style='color:red'>불량수량: X</span>";
              let chkVal3 = result2[0]['시료수량'] == this.$refs.sampleInfoStatus.dp().getJsonRow(0)['시료합계'] ? "<span style='color:blue'>시료수량: O</span>" : "<span style='color:red'>시료수량: X</span>";
              if(this.successCnt != result2[0]['양품수량'] || this.errorCnt != result2[0]['불량수량'] || result2[0]['시료수량'] != this.$refs.sampleInfoStatus.dp().getJsonRow(0)['시료합계']){
                this.$toast('info', `RUN No[${this.params["runNo"]}] 검사현황 수량이 일치하지 않습니다. <br>${chkVal1} ${chkVal2} ${chkVal3}`, {
                  dangerouslyHTMLString: true,
                });
                return;
              }
              let inCnt = this.params["pre양품수량"];            
              let inCnt1 = result2[0]['양품수량'];
              let inCnt2 = result2[0]['불량수량'];
              let inCnt3 = result2[0]['시료수량']
              inCnt = _.isNil(inCnt) ? 0 : inCnt;
              inCnt1 = _.isNil(inCnt1) ? 0 : inCnt1;
              inCnt2 = _.isNil(inCnt2) ? 0 : inCnt2;
              inCnt3 = _.isNil(inCnt3) ? 0 : inCnt3;
              if(inCnt != inCnt1 + inCnt2 + inCnt3){
                this.$toast("error", "이전공정 Cell 수량과 검사현황 양품,불량,시료의 합계가 동일한 수량이 아닙니다.");
                return;
              }
            }
          }
        }

        // 작업시작 종료시 필름 포장 검사에서는 중복 cell 체크
        if((action === 'start' || action === 'end') && ["072"].includes(this.params["공정코드"])){
          const isDuplicate = await this.checkDuplicateCells(action);
          if(isDuplicate){
            return;
          }   
        }
        let params = {
          "menuId": 'M0003003',
          "update": [],
        };
        let rows = [];
        let rows1 = [];
        let queryId = null;
        if (['072','069'].includes(this.params['공정코드'])){
          if(action === 'start' || action === 'end'){
            
            let dateTimeArray = this.$utils.getDateAndTimeArray1();

            rows.push({
              ...this.params,
              code: this.params["공정코드"],
              ...(action === 'start' 
              ? { '작업시작': (this.startDay ? this.startDay : dateTimeArray[0]), '시작시각': (this.startTime ? this.startTime : dateTimeArray[1]) }
              : { '작업종료': (this.endDay ? this.endDay : dateTimeArray[0]), '종료시각': (this.endTime ? this.endTime : dateTimeArray[1]) }
              )
            });
            if(action === 'start'){
              queryId = "M0003003_Start";
            }else{
              queryId = "M0003003_End";
            }
            params["update"].push(
              { queryId: queryId, data: rows }
            );
            
            // 필름포장검사, Hold 및 검사의뢰 처리
            //깨짐불량, 0.2% 이상, 해당 Run & PFL Stage → 211-1
            //유리이물 0.4% 이상, 해당 Run & PFL Stage → 211-2
            if(action == 'end' && this.params["공정코드"]=='072'){
              let result4 = await this.$axios.api.search({menuId: "M0003003", queryId: "M0003003_PFLRunHold", queryParams: this.params});
              if(!_.isNil(result4) && !_.isEmpty(result4) && result4[0]['불량률1'] > result4[0]['rate1']){
                params["update"].push({ queryId: 'M0003003_Exec_PFLRunHold', data: [{...this.params, 불량명: '깨짐'}] });
              }
              if(!_.isNil(result4) && !_.isEmpty(result4) && result4[0]['불량률2'] > result4[0]['rate2']){
                params["update"].push({ queryId: 'M0003003_Exec_PFLRunHold', data: [{...this.params, 불량명: '유리이물'}] });
              }
            }
          }else{
            queryId = "M0003003_Temp";
            rows.push({
              ...this.params,
              code: this.params["공정코드"]
            });
            /*const updatedCells1 = this.tab039000Grid5DP().getUpdatedCells();
            let tRows1 = [];
            if(!_.isEmpty(updatedCells1)){
              tRows1 = this.tab039000Grid5DP().getJsonRows(0, -1)
              .filter((_, index) => updatedCells1.some((item) => { return ( item.__rowId === index && item.updatedCells.some(updatedCell => updatedCell.fieldName === '특이사항'));
              }))
              .map(item => ({
                ...item,
                ...this.params,
                '특이사항': item['특이사항']
              }));
            }
            const updatedCells2 = this.tab039000Grid6DP().getUpdatedCells();
            let tRows2 = [];
            if(!_.isEmpty(updatedCells1)){
              tRows2 = this.tab039000Grid6DP().getJsonRows(0, -1)
              .filter((_, index) => updatedCells2.some((item) => { return ( item.__rowId === index && item.updatedCells.some(updatedCell => updatedCell.fieldName === '특이사항'));
              }))
              .map(item => ({
                ...item,
                ...this.params,
                '특이사항': item['특이사항']
              }));
            }

            rows1 = [...tRows1, ...tRows2];*/

            params["update"].push(
              { queryId: queryId, data: rows }
            );
            /*if(rows1.length > 0){
              params["update"].push(
                { queryId: "M0003003_Update6", data: rows1 }
              );
            }*/
          }
        }else{
          if(action === 'start' || action === 'end'){
            let rows = null;
            if (['073'].includes(this.params['공정코드'])){
              rows = this.tab039000Grid5DP().getJsonRows(0, -1);
            }else{
              rows = this.tab039000Grid4DP().getJsonRows(0, -1);
            }
            
            if(_.isEmpty(rows) && action == 'end'){
              this.$toast("info", action == 'temp' ? "임시저장 대상이 없습니다." : (action == 'start' ? "작업시작 대상이 없습니다." : "작업종료 대상이 없습니다."));
              return;
            }

            let dateTimeArray = this.$utils.getDateAndTimeArray1();

            rows.push({
              ...this.params,
              code: this.params["공정코드"],
              ...(action === 'start' 
              ? { '작업시작': dateTimeArray[0], '시작시각': dateTimeArray[1] }
              : {}
              )
            });
            if(action === 'start'){
              queryId = "M0003003_Start";
            }else{
              queryId = "M0003003_End";
            }
            params["update"].push(
              (this.params['공정코드'] == '070' && action == 'end' ? { queryId: "M0003003_End", data: [{ ...this.params, 공정코드: '068', code: '068'}] } : {}),
              { queryId: queryId, data: rows }
            ); 
          }
        }
        let saveFunc = async () => {
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

    actionType(val){
      this.type = val;
      if(val == "양품"){
        this.defective["불량사유"] = null;
      }else{
        const current = this.tab039000Grid3GV().getCurrent();
        const column = current.column;
        const text = this.tab039000Grid3GV().layoutByColumn(column)?.displayText;
        let tValue = this.dynamic.layout1.filter(item => item.text == current.fieldName);
        this.defective["불량코드"] = tValue.length > 0 ? tValue[0].value : "";
        this.defective["불량사유"] = text;
      }
      if(this.isStartDisabled1){
        this.$refs.cellNoField?.focus();
      }
    },
    saveCallback1(){
      this.searchClick();
    },

    async cellNoInput() {
      if (!this.$utils.validateFields(this.params, ['T:작업자:작업자', 'C:Shift:shift', 'C:작업조:작업조'])) {
        return;
      }

      if (this.type === '불량' && !this.defective["불량사유"]) {
        return this.$toast('info', "불량사항을 선택하세요.");
      }

      const dateTime = this.$utils.getDateAndTimeArray1().join(" ");
      const baseData = {
        ...this.params,
        result: this.type,
        불량코드: this.type === '양품' ? null : this.defective["불량코드"],
        scrap: this.type === '양품' ? null : this.defective["불량사유"],
        작업자: this.params["작업자"],
        작업조: this.params["작업조"],
        근무조: this.params["shift"],
        작업시간: dateTime,
        step: this.params["차수"]
      };

      const filterByCellNo = (grid) => grid.getJsonRows(0, -1).filter(item => item.cellId === this.params1.cellNo);

      let rows = filterByCellNo(this.tab039000Grid4DP()).map(item => ({ ...item, ...baseData }));

      if (rows.length === 0) {
        let rows1 = filterByCellNo(this.tab039000Grid5DP()).map(item => ({ ...item, ...baseData }));
        let rows2 = filterByCellNo(this.tab039000Grid6DP()).map(item => ({ ...item, ...baseData }));

        if (this.type === '불량' && rows1.length > 0) {
          return this.confirmAndMove(rows1, "양품에 등록된 CELL입니다.<br>불량으로 이동하시겠습니까?", "M0003003_Update10", "M0003003_Update9");
        } 
        
        if (this.type === '양품' && rows2.length > 0) {
          return this.confirmAndMove(rows2, "불량에 등록된 CELL입니다.<br>양품으로 이동하시겠습니까?", "M0003003_Update10", "M0003003_Update9");
        }
        this.focusCellNoField();
        return this.$toast('info', rows1.length > 0 || rows2.length > 0 ? `${this.type}에 등록된 CELL 입니다.` : "등록할 수 없는 CELL 입니다.");
      }
      await this.saveData("M0003003_Update1", rows, this.type === '불량' ? "M0003003_Update2" : null);
      this.isHoldSch = true;
    },

    async confirmAndMove(rows, message, update1, update2) {
      this.$confirm("확인", message, async (confirm) => {
        if (confirm) {
          let params = { menuId: 'M0003003', update: [{ queryId: update1, data: rows }] };
          if (update2) params.update.push({ queryId: update2, data: rows });
          
          await this.$axios.api.saveData(params);
          this.searchClick(false);
          //this.focusCellNoField();
        }
      });
    },

    async saveData(update1, rows, update2 = null) {
      let params = { menuId: 'M0003003', update: [{ queryId: update1, data: rows }] };
      if (update2) params.update.push({ queryId: update2, data: rows });

      await this.$axios.api.saveData(params);
      this.searchClick(false);
      //this.focusCellNoField();
    },

    focusCellNoField() {
      this.$refs.cellNoField.focus();
      this.$refs.cellNoField.select();
    },

    handleEnter(event) {
      event.preventDefault();
      this.cellNoInput();
    },

    handleConfirm(params){},

    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },

    workerClick(){
      if(!_.isNil(this.params["shift"])){
        let params = {
            dialogTitle: "작업자 정보",
            height: 750,
            popUpSize: "lg",          
            gridJs: `WorkerPopup1.js`,
            search: { menuId: "M0003003", queryId: "M0003003_Sch17", queryParams: { majCode: '47', code: this.params["shift"].substring(0, 1) } }
        };	
        this.$refs.workerPopup.openDialog(params);			
      }
    },

    workerConfirm(val){
      this.params["작업자"] = val;
      this.$refs.workerPopup.closeDialog();		
    },

    actionRerun(){
      if (!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])) {
        return;
      }
      let saveFunc = async () => {
        let params = {
          "menuId": 'M0003003',
          "update": [{ queryId: "M0003003_RERUN", data: [{...this.params}] }],
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

    footerValueCallback(grid, column, footerIndex, columnFooter, value){
      let t투입수량 = this.$utils.numberValueOrDefault(this.params['투입수량']);
	    let t불량수량 = this.$utils.numberValueOrDefault(grid.getValue(0, column.name));
      return t투입수량 == 0 ? 0 : this.$utils.formatNumber(((t불량수량*100)/t투입수량), 2);
    },

    handleMouseDown(event) {
      const input = this.$refs.runNoField;
      if (input && input.value) {
        event.preventDefault();
        input.select();
      }
    },

    async checkDuplicateCells(action){
      let result2 = await this.$axios.api.search({menuId: "M0003003", queryId: (action == 'start' ? "M0003003_Sch23" : "M0003003_Sch24"), queryParams: this.params});
      if(!_.isNil(result2) && !_.isEmpty(result2)){

        let params = {
          dialogTitle: "중복 Cell_ID 리스트",					
          height: 300,
          width: 1800,
          gridJs: `CP0000000026.js`,
          btnConfirm: false,
          search: { menuId: "M0003003", queryId: (action == 'start' ? "M0003003_Sch23" : "M0003003_Sch24"), queryParams: this.params }
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

    errorPopupOpen(){
      if(this.type != '불량') return;
      if(!this.$utils.validateFields(this.params, ['C:공정:공정코드', 'T:RunNo:runNo'])){
        return;
      }
      this.$refs.errorSchPopup.openDialog({ ...this.params, line: 'D1UT', "자동여부": 0});
    },

    ErrorInput(item){
      this.defective["불량코드"] = item['불량코드'];
      this.defective["불량사유"] = item['불량명'];
      this.$refs.errorSchPopup.closeDialog();
      if(this.isStartDisabled1){
        this.$refs.cellNoField?.focus();
      }
    },

    textInputPopupOpen(){
      this.$refs.vlrRemarkInputPopup.openDialog({
        ...this.params        
      });
    },

    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    /*setCellStyleCallbackTab039000Grid4(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(this.params["공정코드"] == '068'){
        if((fieldName == '특이사항' || this.dynamic.layout1.filter(item => item.text == fieldName).length > 0) && !this.isStartDisabled && this.isEndDisabled){
          rtn.editable = true;
          rtn.styleName = "tl edit";        
        }else{
          rtn.editable = false;
          rtn.styleName = "tl";    
        }
      }
      return rtn
    },*/

    onDataLoadComplatedTab039000Grid4(grid) {
      this.notProgCnt = this.tab039000Grid4DP().getRowCount();
    },

    onDataLoadComplatedTab039000Grid5(grid) {
      this.successCnt = this.tab039000Grid5DP().getRowCount();
    },

    onDataLoadComplatedTab039000Grid6(grid) {
      this.errorCnt = this.tab039000Grid6DP().getRowCount();
    },

    setCellStyleCallbackTab039000Grid5(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      if(fieldName == '특이사항'){
        /*rtn.editable = true;*/
        rtn.styleName = "tl edit";        
      }
      return rtn
    },

    setCellStyleCallbackTab039000Grid3(grid, cell){
      let rtn = {};
      const text = grid.layoutByColumn(cell.index.fieldName).displayText;
      if(['072','069'].includes(this.params['공정코드'])){
        if (this.holdChk1 || this.holdChk2) {
          rtn.styleName = "tr red";
        }else{
          rtn.style = { background: '#FFFFFF' };          
        }
      }
      return rtn
    },

    setCellStyleCallbackTab039000Grid6(grid, cell){
      let rtn = {};
      const fieldName = cell.index.fieldName;
      let ds = grid.getDataSource();
      let jsonData = ds.getJsonRow(cell.index.itemIndex);
      if (this.holdChk1 && ["깨짐"].includes(jsonData["scrap"])) {
        if(fieldName == '맵핑유무'){
          rtn.styleName = "red";       
        }else{
          rtn.styleName = "tl red";       
        }
      }

      if (this.holdChk2 && ["유리이물"].includes(jsonData["scrap"])) {
        if(fieldName == '맵핑유무'){
          rtn.styleName = "red";       
        }else{
          rtn.styleName = "tl red";       
        }
      }
      
      if(fieldName == '특이사항'){
        /*rtn.editable = true;*/
        rtn.styleName = "tl edit";                
      }
      if (!rtn.styleName || rtn.styleName.indexOf("red") == -1) {
        rtn.style = { background: '#FFFFFF' };
      }
      return rtn
    },

    /*onCellClickedTab039000Grid3(grid, clickData) {
      if(clickData.cellType !== "data") return;
      const column = clickData.column;
      const text = grid.layoutByColumn(column).displayText;
      if(this.type == "불량" && text != '불량합계'){
        this.defective["불량코드"] = this.dynamic.layout1.filter(item => item.text == clickData.fieldName)[0].value;
        this.defective["불량사유"] = text;
      }
    },*/
    
    onCellClickedTab039000Grid4(grid, clickData) {
      if(clickData.cellType !== "data") return;
      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == 'cellId'){
          this.params1.cellNo = jsonData["cellId"];
      }
    },

    onRowCountChangedTab039000Grid4(provider, newCount) {
      if(newCount == 0){
        this.params1.cellNo = null;
      }
    },

    onCellClickedTab039000Grid5(grid, clickData) {
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '특이사항'){
        if(!this.isEditabled)return;

        this.$refs.cellQcRemarkInputPopup.openDialog({
          ...this.params, 
          ...jsonData,
        });
      }
      return true;
    },   

    onCellClickedTab039000Grid6(grid, clickData) {
      if(clickData.cellType !== "data") return;

      let ds = grid.getDataSource();
      let current = grid.getCurrent();
      let jsonData = ds.getJsonRow(current.dataRow);
      if(clickData.fieldName == '맵핑유무'){
        this.$refs.processingMapping2.openDialog({
          ...this.params, 
          ...jsonData,
          model: this.rows[0]["제품모델"],
          isEditabled: this.isEndDisabled,
          isFilm: false,
        });
      }else if(clickData.fieldName == '특이사항'){
        if(!this.isEditabled)return;

        this.$refs.cellQcRemarkInputPopup.openDialog({
          ...this.params, 
          ...jsonData,
        });
      }
      return true;
    },   
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
.cell-no{
  .form-control{
  background:#fff959 ;
  }
    label{
    padding: 15px!important;
  }
  label{top:-3px!important;}
  .form-control:not(:placeholder-shown) ~ label {
    top: 3px!important;
  }
}
.hold_wrap{
  border-radius:8px;
  background:#f5f5f5;
  padding:10px;
  text-align:center;
   .hold{
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 80px;
    background: #ff0000;
    font-size: 24px;
    font-weight:bold;
    border-radius: 7px;
    justify-content: center;
    color: #fff;
   }

}
.error{
  .rg-header, .rg-footer{
    background: #ffcccc;
  }
}
</style>
<style lang="scss" scoped>
::v-deep .d-flex{
  .btn-md{
    height:40px!important;
    width:120px !important;
    font-size: 16px!important;
    &.none{
      background: #fff959;      
    }
    &.good{
      background: #2f46c7;
      color: #fff;
    }
    &.error{
      background: #cc4827;
      color: #fff;
    }
  }
}
</style>
