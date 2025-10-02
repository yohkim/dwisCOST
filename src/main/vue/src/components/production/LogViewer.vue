/** * 설비 로그 조회 */
<template>
  <div>
    <div class="search_box" style="align-items: flex-end !important">
      <b-row class="search_area">
        <b-col cols="2">
          <div class="form-floating prc_name">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="curProcess" @change="onProcessChange">
              <option v-for="(item, index) in processList" :key="index" :value="item.sysResourceId">
                {{ item.sysResourceName }}
              </option>
            </select>
            <label for="floatingSelect" class="select">공정명</label>
          </div>
        </b-col>

        <b-col cols="3" class="period" style="width: 18% !important">
          <div class="form-floating me-1">
            <date-picker label="시작일" v-model="params.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
            <date-picker label="종료일" v-model="params.endDate" />
            <label for="floatingPicker">종료일</label>
          </div>
        </b-col>

        <b-col cols="1" v-if="tabAreaMap[tabId] == 'Front' || curProcess == '067'" style="width: 15.2% !important">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" v-model="params.model" :disabled="isDisabled || isLogGubunDisabled">
              <option v-for="model in modelList" :key="model.value" :value="model">
                {{ model.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">제품유형</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Front' || curProcess == '067'">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" v-model="params.workType" :disabled="isDisabled || isLogGubunDisabled">
              <option v-for="type in workTypeList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">작업구분</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Front'">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="PoNo" v-model="params.poNo" :disabled="isDisabled" ref="poNoField" name="poNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'poNo')" />
            <label for="floating">PoNo</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Front'">
          <div class="form-floating lot_run_num">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="LotNo" v-model="params.lotNo" :disabled="isDisabled" ref="lotNoField" name="lotNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'lotNo')" />
            <label for="floating">LotNo</label>
          </div>
        </b-col>

        <b-col cols="2">
          <div class="form-floating lot_run_num" v-bind:class="{ ' mt-2': tabAreaMap[tabId] == 'Front' }">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="RunNo" v-model="params.runNo" :disabled="isDisabled" ref="runNoField" name="runNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'runNo')" />
            <label for="floating">RunNo</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Front'">
          <div class="form-floating mt-2">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="PanelID" v-model="params.panelId" :disabled="isDisabled" ref="panelIdField" name="panelId" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'panelId')" />
            <label for="floating">PanelID</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Front'">
          <div class="form-floating mt-2">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="GlassId" v-model="params.glassId" :disabled="isDisabled" ref="glassIdField" name="glassId" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter($event, 'glassId')" />
            <label for="floating">GlassId</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Front' || curProcess == '067'">
          <div class="form-floating" v-bind:class="{ ' mt-2': tabAreaMap[tabId] == 'Front' }">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.facility" :disabled="isDisabled || isLogGubunDisabled">
              <option v-for="type in facilityList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">설비호기</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="curProcess == '067'">
          <div class="form-floating mt-2">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.logGubun" :disabled="isDisabled" @change="onLogGubunChange">
              <option v-for="type in logGubunList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">로그구분</label>
          </div>
        </b-col>

        <b-col cols="2" v-if="tabAreaMap[tabId] == 'Rework' && curProcess == '022'">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.reworkFacility" :disabled="isDisabled" @change="onReworkGubunChange">
              <option v-for="type in reworkFacilityList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">설비</label>
          </div>
        </b-col>
      </b-row>

      <div class="btn_area refresh ms-2">
        <b-button class="refresh" @click="clearClick" />
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>

    <div v-if="curProcess != '073'" class="grid_box" v-bind:class="{ ' search_tworow': tabAreaMap[tabId] == 'Front' || curProcess == '067', ' search_onerow': tabAreaMap[tabId] != 'Front' && curProcess != '067' }">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
          <div class="form-floating me-1" v-if="curProcess == '067' && params.logGubun.value == 2 && hasAuthEdit">
            <input type="number" min="1" max="999" style="width: 60px" class="form-control-sm" id="floating" placeholder="" v-model="addRowCount" @input="checkLimitation" />
          </div>
          <b-button class="sub" v-bind:class="{ ' ms-1 me-1': curProcess == '067' && params.logGubun.value == 2 && hasAuthEdit }" v-if="(gridCanBeAddedMap[curProcess] || (curProcess == '067' && params.logGubun.value == 2)) && hasAuthEdit" @click="addClick">추가</b-button>
          <b-button v-bind:class="{ ' ms-1': curProcess == '067' && params.logGubun.value == 2 && hasAuthEdit }" v-if="(gridCanBeDeletedMap[curProcess] || (curProcess == '067' && params.logGubun.value == 2)) && hasAuthEdit" @click="delClick">삭제</b-button>
          <b-button class="main" v-if="(gridEditableMap[curProcess] || (curProcess == '067' && params.logGubun.value == 2)) && hasAuthEdit" @click="saveClick">저장</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="logGrid" :uid="'logGrid'" :rows="logRows" style="height: 100%" />
      </div>
    </div>

    <div v-if="curProcess == '073'">
      <b-tabs v-model="activeTab" class="four_depth_tab">
        <b-tab title="CellValidInfo"></b-tab>
        <b-tab title="CellInspInfo"></b-tab>
        <b-tab title="CellTrackInfo"></b-tab>
        <b-tab title="PackInfo"></b-tab>
        <b-tab title="TrayDetailInfo"></b-tab>
        <b-tab title="TrayInfo"></b-tab>
        <b-tab title="S-LINE(이물제거벨트파일)"></b-tab>
        <b-tab title="S-LINE(이물제거Packing파일)"></b-tab>
        <b-tab title="S-LINE(이물제거파일)"></b-tab>
      </b-tabs>
      <div class="four_d_box">
        <TabLogViewer ref="tabLog0" table="CellValidInfo" v-show="activeTab == 0" />
        <TabLogViewer ref="tabLog1" table="CellInspInfo" v-show="activeTab == 1" />
        <TabLogViewer ref="tabLog2" table="CellTrackInfo" v-show="activeTab == 2" />
        <TabLogViewer ref="tabLog3" table="PackInfo" v-show="activeTab == 3" />
        <TabLogViewer ref="tabLog4" table="TrayDetailInfo" v-show="activeTab == 4" />
        <TabLogViewer ref="tabLog5" table="TrayInfo" v-show="activeTab == 5" />
        <TabLogViewer ref="tabLog6" table="SLineBelt" v-show="activeTab == 6" />
        <TabLogViewer ref="tabLog7" table="SLinePacking" v-show="activeTab == 7" />
        <TabLogViewer ref="tabLog8" table="SLine" v-show="activeTab == 8" />
      </div>
    </div>
  </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import TabLogViewer from './TabLogViewer.vue';

export default {
  name: 'DW_LogViewer',
  props: {
    parentId: {
      type: String,
      required: true,
    },
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: { TabLogViewer },
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  watch: {},
  data() {
    return {
      activeTab: 0,
      tabAreaMap: {
        TAB020000: 'Front',
        TAB024000: 'Back#1',
        TAB034000: 'Back#2 Cassette QC',
        TAB041000: 'Back#2 Cell QC',
        TAB049100: 'Rework',
      },
      gridSrcMap: {
        '': 'R0000000',
        '010': 'R0003005_1', //Front 적층
        '023': 'R0003001_1', //Back#1 박리
        '027': 'R0003001_2', //Back#1 박리 후 세정
        '033': 'R0003001_3', //Back#1 bTP
        '035': 'R0003001_2', //Back#1 재세정?
        '037': 'R0003001_4', //Back#1 전환적
        //'040': 'R0003001_5', //Back#1 강화 no log file
        '043': 'R0003001_6', //Back#1 후환적
        '047': 'R0003001_2', //Back#1 강화 후 세정
        '050': 'R0003001_3', //Back#1 aTP
        '059': 'R0003001_2', //재세정 ??
        //'054': 'R0003002_1', //Back#2 Cassette QC M-FQC - no 설비로그
        '055': 'R0003002_2', //Back#2 Cassette QC ISM
        '056': 'R0003002_3', //Back#2 Cassette QC AGB
        '058': 'R0003001_2', //Back#2 Cassette QC 검사 후 세정 실적
        '061': 'R0003002_4', //Back#2 Cassette QC PFL
        '067': 'R0003002_5', //Back#2 Cassette QC BFL default
        '067_1': 'R0003002_5', //Back#2 Cassette QC BFL Run_No별
        '067_2': 'R0003002_6', //Back#2 Cassette QC BFL 상세
        '067_3': 'R0003002_7', //Back#2 Cassette QC BFL 중복CELL(현재상세랑..동일한듯)
        '068': 'R0003003_1', //Back#2 Cell QC ECI
        '070': 'R0003003_1', //Back#2 Cell QC VRS
        '072': 'R0003003_2', //Back#2 Cell QC 필름 포장 검사(목시 추정)
        '073': 'R0003003_3', //Back#2 Cell QC 이물제거 default
        '022': 'R0003008_1', //Rework 필름박리
        '022_1': 'R0003008_1', //Rework 필름박리 DPF 설비
        '022_2': 'R0003008_2', //Rework 필름박리 적재기#5
      },
      gridViewSrcMap: {
        '': 'R0000000',
        '010': 'R0003005_1', //Front 적층
        '023': 'R0003001_1_View', //Back#1 박리
        '027': 'R0003001_2', //Back#1 박리 후 세정
        '033': 'R0003001_3', //Back#1 bTP
        '035': 'R0003001_2', //Back#1 재세정?
        '037': 'R0003001_4_View', //Back#1 전환적
        //'040': 'R0003001_5', //Back#1 강화 no log file
        '043': 'R0003001_6_View', //Back#1 후환적
        '047': 'R0003001_2', //Back#1 강화 후 세정
        '050': 'R0003001_3', //Back#1 aTP
        '059': 'R0003001_2', //재세정 ??
        //'054': 'R0003002_1', //Back#2 Cassette QC M-FQC - no 설비로그
        '055': 'R0003002_2_View', //Back#2 Cassette QC ISM
        '056': 'R0003002_3_View', //Back#2 Cassette QC AGB
        '058': 'R0003001_2', //Back#2 Cassette QC 검사 후 세정 실적
        '061': 'R0003002_4_View', //Back#2 Cassette QC PFL
        '067': 'R0003002_5', //Back#2 Cassette QC BFL default
        '067_1': 'R0003002_5', //Back#2 Cassette QC BFL Run_No별
        '067_2': 'R0003002_6_View', //Back#2 Cassette QC BFL 상세
        '067_3': 'R0003002_7', //Back#2 Cassette QC BFL 중복CELL(현재상세랑..동일한듯)
        '068': 'R0003003_1_View', //Back#2 Cell QC ECI
        '070': 'R0003003_1_View', //Back#2 Cell QC VRS
        '072': 'R0003003_2', //Back#2 Cell QC 필름 포장 검사(목시 추정)
        '073': 'R0003003_3', //Back#2 Cell QC 이물제거 default
        '022': 'R0003008_1', //Rework 필름박리
        '022_1': 'R0003008_1_View', //Rework 필름박리 DPF 설비
        '022_2': 'R0003008_2_View', //Rework 필름박리 적재기#5
      },
      gridEditableMap: {
        '': false,
        '010': false, //Front 적층
        '023': true, //Back#1 박리
        '027': false, //Back#1 박리 후 세정
        '033': false, //Back#1 bTP
        '035': false, //Back#1 재세정?
        '037': true, //Back#1 전환적
        '040': false, //Back#1 강화 no log file
        '043': true, //Back#1 후환적
        '047': false, //Back#1 강화 후 세정
        '050': false, //Back#1 aTP
        '059': false, //재세정 ??
        '054': false, //Back#2 Cassette QC M-FQC - no 설비로그
        '055': true, //Back#2 Cassette QC ISM
        '056': true, //Back#2 Cassette QC AGB
        '058': false, //Back#2 Cassette QC 검사 후 세정 실적
        '061': true, //Back#2 Cassette QC PFL
        '067': false, //Back#2 Cassette QC BFL -'067_2' true
        '068': true, //Back#2 Cell QC ECI
        '070': true, //Back#2 Cell QC VRS
        '072': false, //Back#2 Cell QC 필름 포장 검사(목시 추정)
        '073': false, //Back#2 Cell QC 이물제거 default
        '022': true, //Rework 필름박리
      },
      gridCanBeAddedMap: {
        '061': true, //Back#2 Cassette QC PFL
        // '067': false, //Back#2 Cassette QC BFL -'067_2' true
      },
      gridCanBeDeletedMap: {
        '055': true, //Back#2 Cassette QC ISM
        '056': true, //Back#2 Cassette QC AGB
        '061': true, //Back#2 Cassette QC PFL
        // '067': false, //Back#2 Cassette QC BFL -'067_2' true
        '068': true, //Back#2 Cell QC ECI
        '070': true, //Back#2 Cell QC VRS
      },
      menuIdMap: {
        '010': 'R0003005',
        '023': 'R0003001',
        '027': 'R0003001',
        '033': 'R0003001',
        '035': 'R0003001',
        '037': 'R0003001',
        '040': 'R0003001',
        '043': 'R0003001',
        '047': 'R0003001',
        '050': 'R0003001',
        '059': 'R0003001',
        '054': 'R0003002',
        '055': 'R0003002',
        '056': 'R0003002',
        '058': 'R0003001',
        '061': 'R0003002',
        '067': 'R0003002',
        '068': 'R0003003',
        '070': 'R0003003',
        '072': 'R0003003',
        '073': 'R0003003',
        '022': 'R0003008',
      },
      queryIdMap: {
        '010': 'R0003005_Sch1',
        '023': 'R0003001_Sch1',
        '027': 'R0003001_Sch2',
        '033': 'R0003001_Sch3',
        '035': 'R0003001_Sch2',
        '037': 'R0003001_Sch4',
        '040': 'R0003001_Sch5',
        '043': 'R0003001_Sch6',
        '047': 'R0003001_Sch2',
        '050': 'R0003001_Sch8',
        '059': 'R0003001_Sch2',
        '054': 'R0003002_Sch1',
        '055': 'R0003002_Sch2',
        '056': 'R0003002_Sch3',
        '058': 'R0003001_Sch2',
        '061': 'R0003002_Sch4',
        '067': 'R0003002_Sch5',
        '067': 'R0003002_Sch5', //Back#2 Cassette QC BFL default
        '067_1': 'R0003002_Sch5', //Back#2 Cassette QC BFL Run_No별
        '067_2': 'R0003002_Sch5_2', //Back#2 Cassette QC BFL 상세
        '067_3': 'R0003002_Sch5', //Back#2 Cassette QC BFL 중복CELL(현재상세랑..동일한듯)
        '068': 'R0003003_Sch1',
        '070': 'R0003003_Sch1',
        '072': 'R0003003_Sch2',
        '073': 'R0003003_Sch3',
        '022': 'R0003008_Sch1',
        '022_1': 'R0003008_Sch1',
        '022_2': 'R0003008_Sch2',
      },
      saveQueryIdMap: {
        '023': 'R0003001_Update1',
        '037': 'R0003001_Update4',
        '043': 'R0003001_Update6',
        '055': 'R0003002_Update2',
        '056': 'R0003002_Update3',
        '061': 'R0003002_Update4',
        '067': 'R0003002_Update5',
        '068': 'R0003003_Update1',
        '070': 'R0003003_Update1',
        '022_1': 'R0003008_Update1',
        '022_2': 'R0003008_Update2',
      },
      insertQueryIdMap: {
        '061': 'R0003002_Insert4',
        '067': 'R0003002_Insert5',
      },
      deleteQueryIdMap: {
        '055': 'R0003002_Delete2',
        '056': 'R0003002_Delete3',
        '061': 'R0003002_Delete4',
        '067': 'R0003002_Delete5',
        '068': 'R0003003_Delete1',
        '070': 'R0003003_Delete1',
      },
      evIdMap: {
        '068': '1',
        '070': '2',
      },
      logRows: [],
      logGrid: null,
      params: {
        model: null,
        workType: null,
        lotNo: null,
        runNo: null,
        poNo: null,
        panelId: null,
        glassId: null,
        facility: null,
        startDate: '',
        endDate: '',
        logGubun: { value: '1', text: 'Run_No별' },
        reworkFacility: { value: '1', text: 'DPF 설비' },
      },
      isDisabled: true,
      isLogGubunDisabled: false,
      isExcelExportDisabled: true,
      processList: [],
      modelList: [], // Example product types
      workTypeList: [], // Example work types
      facilityList: [],
      logGubunList: [
        { value: '1', text: 'Run_No별' },
        { value: '2', text: '상세' },
        { value: '3', text: '중복CELL' },
      ],
      reworkFacilityList: [
        { value: '1', text: 'DPF 설비' },
        { value: '2', text: '적재기#5' },
      ],
      curProcess: '', //default
      isProcessing: false,
      hasAuthEdit: this.userAuthInfo.getRoleList.includes('R010'),
      addRowCount: 1,
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    logGridView() {
      return this.$refs.logGrid.getGridView();
    },
    logGridDataProvider() {
      return this.$refs.logGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeMenu();
    this.initializeGrid();
  },
  async mounted() {
    console.log('this.tabIdMenuMove', this.tabId + 'MenuMove');
    this.$eventBus.on(this.tabId + 'MenuMove', this.menuMove);
    this.getSelectOptions();
  },
  beforeUnmount() {
    this.$eventBus.off(this.tabId + 'MenuMove');
  },
  methods: {
    menuMove(data) {
      this.$nextTick(() => {
        //currently, menuMove support only front 적층(010)
        this['curProcess'] = '010';
        this.onProcessChange();
        if (!_.isEmpty(data['panelId'])) this.params.panelId = data['panelId'];
        if (!_.isEmpty(data['glassId'])) this.params.glassId = data['glassId'];

        if (!_.isEmpty(data['작업시작'])) {
          const year = parseInt(data['작업시작'].slice(0, 4), 10);
          var current = new Date(year, 0, 1);
          this.params.startDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-01`;
          var lastDate = new Date(current.getFullYear(), 12, 0);
          this.params.endDate = `${lastDate.getFullYear()}-${String(lastDate.getMonth() + 1).padStart(2, '0')}-${lastDate.getDate()}`;
        }
        this.searchClick();
      });
    },
    initializeMenu() {
      // this.processList = this.$utils.fetchAuthorizedMenuProcesses(this.menuList, this.tabId);
      this.processList = this.userAuthInfo.getTabInfoListBySRI(this.parentId, this.tabId);
    },
    initializeGrid() {
      if (this.hasAuthEdit) {
        if (_.isEmpty(this.curProcess) || _.isEmpty(this.gridSrcMap[this.curProcess])) {
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridSrcMap[''] + `.js`));
        } else if (this.curProcess == '067' && !_.isEmpty(this.params.logGubun)) {
          let srcKey = this.curProcess + '_' + this.params.logGubun.value;
          // console.log(srcKey);
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridSrcMap[srcKey] + `.js`));
        } else if (this.tabAreaMap[this.tabId] == 'Rework' && this.curProcess == '022' && !_.isEmpty(this.params.reworkFacility)) {
          let srcKey = this.curProcess + '_' + this.params.reworkFacility.value;
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridSrcMap[srcKey] + `.js`));
        } else {
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridSrcMap[this.curProcess] + `.js`));
        }
      } else {
        if (_.isEmpty(this.curProcess) || _.isEmpty(this.gridViewSrcMap[this.curProcess])) {
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridViewSrcMap[''] + `.js`));
        } else if (this.curProcess == '067' && !_.isEmpty(this.params.logGubun)) {
          let srcKey = this.curProcess + '_' + this.params.logGubun.value;
          // console.log(srcKey);
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridViewSrcMap[srcKey] + `.js`));
        } else if (this.tabAreaMap[this.tabId] == 'Rework' && this.curProcess == '022' && !_.isEmpty(this.params.reworkFacility)) {
          let srcKey = this.curProcess + '_' + this.params.reworkFacility.value;
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridViewSrcMap[srcKey] + `.js`));
        } else {
          this.logGrid = _.cloneDeep(require(`./js/` + this.gridViewSrcMap[this.curProcess] + `.js`));
        }
      }
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleEnter(event, inputName) {
      event.preventDefault(); // 기본 이벤트 방지
      this.searchClick(); // 검색 실행
      if (inputName == 'poNo') {
        this.$refs.poNoField.focus();
        this.$refs.poNoField.select();
      }
      if (inputName == 'lotNo') {
        this.$refs.lotNoField.focus();
        this.$refs.lotNoField.select();
      }
      if (inputName == 'runNo') {
        this.$refs.runNoField.focus();
        this.$refs.runNoField.select();
      }
      if (inputName == 'panelId') {
        this.$refs.panelIdField.focus();
        this.$refs.panelIdField.select();
      }
      if (inputName == 'glassId') {
        this.$refs.glassIdField.focus();
        this.$refs.glassIdField.select();
      }
    },
    setParamsFromInput(lotNo, runNo, process) {
      //lotNo, runNo 없거나 lotNo/runNo 와 process 동일시 유지
      if (_.isEmpty(lotNo) && _.isEmpty(runNo) && !_.isEmpty(process) && process == this.curProcess) return;
      if (!_.isEmpty(lotNo) && !_.isEmpty(process) && lotNo === this.params.lotNo && process == this.curProcess) return;
      if (!_.isEmpty(runNo) && !_.isEmpty(process) && runNo === this.params.runNo && process == this.curProcess) return;

      if (!_.isEmpty(lotNo)) this.params.lotNo = lotNo;
      if (!_.isEmpty(runNo)) this.params.runNo = runNo;
      if (!_.isEmpty(process)) {
        this.curProcess = process;
        this.onProcessChange();
      }
    },
    onProcessChange() {
      this.isDisabled = false;
      this.addRowCount = 1;
      if (this.curProcess == '067' && !_.isEmpty(this.params.logGubun) && this.params.logGubun.value == 2) {
        this.isLogGubunDisabled = true;
      } else {
        this.isLogGubunDisabled = false;
      }
      this.getSelectFacilityOptions();
      this.beforeSearchChangeGrid();
    },
    beforeSearchChangeGrid() {
      if (this.$refs.logGrid != null) this.$refs.logGrid.destroy();
      this.initializeGrid();
      if (this.logGrid != null && this.$refs.logGrid != null) this.$refs.logGrid.created();
    },
    onLogGubunChange(evt) {
      this.beforeSearchChangeGrid();
      if (!_.isEmpty(this.params.logGubun) && this.params.logGubun.value == 2) {
        this.isLogGubunDisabled = true;
      } else {
        this.isLogGubunDisabled = false;
      }
    },
    onReworkGubunChange(evt) {
      this.beforeSearchChangeGrid();
    },
    async getSelectOptions() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      this.params.startDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      if (this.tabAreaMap[this.tabId] != 'Front' && this.tabAreaMap[this.tabId] != 'Back#2 Cassette QC') return;

      let param = [
        {
          menuId: 'M0003007',
          queryId: 'getModels',
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['코드', '제품유형'], this.modelList);
          },
        },
        {
          menuId: 'M0003007',
          queryId: 'getWorkTypes',
          callback: (data) => {
            this.$utils.transformData(data, ['value', 'text'], ['코드', '작업구분'], this.workTypeList);
          },
        },
      ];
      await this.$axios.api.searchAll(param);
    },
    async getSelectFacilityOptions() {
      if (this.tabAreaMap[this.tabId] != 'Front' && this.curProcess != '067') return;

      let queryParams = { code: this.curProcess };
      this.params.facility = { value: '', text: '' };

      let param = {
        menuId: 'R0003005',
        queryId: 'getFacility',
        queryParams: queryParams,
        callback: (data) => {
          this.$utils.transformData(data, ['value', 'text'], ['설비번호', '설비약명'], this.facilityList);
        },
      };
      await this.$axios.api.search(param);
    },
    clearClick() {
      this.curProcess = '';
      this.isDisabled = true;

      this.params.model = { value: '', text: '' };
      this.params.workType = { value: '', text: '' };
      this.params.lotNo = null;
      this.params.runNo = null;
      this.params.poNo = null;
      this.params.panelId = null;
      this.params.glassId = null;
      this.params.facility = { value: '', text: '' };
      this.params.logGubun = { value: '1', text: 'Run_No별' };

      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      this.params.startDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;

      if (this.$refs.logGrid != null) this.$refs.logGrid.destroy();
      this.initializeGrid();
      if (this.$refs.logGrid != null) this.$refs.logGrid.created();

      this.addRowCount = 1;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.beforeSearchChangeGrid();
      this.isProcessing = true;

      this.$nextTick(async () => {
        if (this.curProcess === '') {
          const message = `공정(을)를 선택하세요`;
          this.$toast('info', message);
          return;
        }
        if (this.curProcess == '067' && _.isEmpty(this.params.logGubun)) {
          const message = `로그구분을 선택하세요`;
          this.$toast('info', message);
          return;
        }

        if (_.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) && !this.$utils.validateStartDateEndDate(this.params.startDate, this.params.endDate, 7)) {
          return;
        }

        if (_.isEmpty(this.gridSrcMap[this.curProcess])) {
          const message = `선택된 공정에 해당 하는 로그가 없습니다.`;
          this.$toast('info', message);
          return;
        }

        let startDate = _.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) ? this.params.startDate.toString().replaceAll('-', '') + ' 000000' : '';
        let endDate = _.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) ? this.params.endDate.toString().replaceAll('-', '') + ' 235959' : '';

        let startDateType = _.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) ? this.params.startDate.toString() + ' 00:00:00' : '';
        let endDateType = _.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) ? this.params.endDate.toString() + ' 23:59:59' : '';

        let startDateOnly = _.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) ? this.params.startDate.toString().replaceAll('-', '') : '';
        let endDateOnly = _.isEmpty(this.params.poNo) && _.isEmpty(this.params.lotNo) && _.isEmpty(this.params.runNo) && _.isEmpty(this.params.panelId) && _.isEmpty(this.params.glassId) ? this.params.endDate.toString().replaceAll('-', '') : '';

        if (this.curProcess == '067' && !_.isEmpty(this.params.logGubun) && this.params.logGubun.value != 2) {
          startDate = this.params.startDate.toString().replaceAll('-', '');
          endDate = this.params.endDate.toString().replaceAll('-', '');
        }

        let params = {
          modelCode: this.params.model != null ? this.params.model.value : '',
          workCode: this.params.workType != null ? this.params.workType.value : '',
          poNo: this.params.poNo != null ? this.params.poNo : '',
          lotNo: this.params.lotNo != null ? this.params.lotNo : '',
          runNo: this.params.runNo != null ? this.params.runNo : '',
          panelId: this.params.panelId != null ? this.params.panelId : '',
          glassId: this.params.glassId != null ? this.params.glassId : '',
          facilityCode: this.params.facility != null ? this.params.facility.value : '',
          startDate: startDate,
          endDate: endDate,
          startDateType: startDateType,
          endDateType: endDateType,
          startDateOnly: startDateOnly,
          endDateOnly: endDateOnly,
          processCode: this.curProcess,
          logGubun: this.params.logGubun != null ? this.params.logGubun.value : '',
          evId: this.evIdMap[this.curProcess] != null ? this.evIdMap[this.curProcess] : '',
        };

        if (this.curProcess == '073') {
          this.$refs.tabLog0.searchClick(params);
          this.$refs.tabLog1.searchClick(params);
          this.$refs.tabLog2.searchClick(params);
          this.$refs.tabLog3.searchClick(params);
          this.$refs.tabLog4.searchClick(params);
          this.$refs.tabLog5.searchClick(params);
          this.$refs.tabLog6.searchClick(params);
          this.$refs.tabLog7.searchClick(params);
          this.$refs.tabLog8.searchClick(params);
          return;
        }

        let queryIdKey = this.curProcess;
        if (this.tabAreaMap[this.tabId] == 'Rework' && this.curProcess == '022' && !_.isEmpty(this.params.reworkFacility)) {
          queryIdKey = this.curProcess + '_' + this.params.reworkFacility.value;
        } else if (this.curProcess == '067' && !_.isEmpty(this.params.logGubun) && this.params.logGubun.value == 2) {
          queryIdKey = this.curProcess + '_' + this.params.logGubun.value;
        }

        let searchParam = {
          menuId: this.menuIdMap[this.curProcess],
          queryId: this.queryIdMap[queryIdKey],
          queryParams: params,
          target: this.logRows,
        };

        let result = await this.$axios.api.search(searchParam);
        if (result != null && result.length == 0) {
          this.isExcelExportDisabled = true;
          return;
        }
        this.isExcelExportDisabled = false;
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    delClick() {
      if (this.logGrid == null || this.$refs.logGrid == null) return;
      this.$refs.logGrid.getGridView().commit();
      const checkedRows = this.$refs.logGrid.getGridView().getCheckedRows(false);
      if (checkedRows.length === 0) {
        this.$toast('info', '삭제할 행을 선택하십시요!');
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (this.$refs.logGrid.getGridDataProvider().getRowState(itemIndex) === RowState.CREATED) {
            delItems.push(itemIndex);
          } else {
            this.$refs.logGrid.getGridDataProvider().setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.$refs.logGrid.getGridDataProvider().removeRows(delItems);
      }
    },
    async saveClick() {
      if (this.logGrid == null || this.$refs.logGrid == null) return;
      this.$refs.logGrid.getGridView().commit();
      if (await this.saveData()) {
        this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.logGrid.getSaveData();
      if (saveData.count <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      let param = {
        menuId: this.menuIdMap[this.curProcess],
      };

      let saveQueryId;
      if (saveData.update.length > 0 && (this.gridEditableMap[this.curProcess] || (this.curProcess == '067' && this.params.logGubun.value == '2')) && !_.isEmpty(this.saveQueryIdMap[this.curProcess])) {
        saveQueryId = this.saveQueryIdMap[this.curProcess];
        param['update'] = [{ queryId: saveQueryId, data: saveData.update }];
      } else if (saveData.update.length > 0 && this.gridEditableMap[this.curProcess] && this.curProcess == '022' && !_.isEmpty(this.params.reworkFacility)) {
        let queryIdKey = this.curProcess + '_' + this.params.reworkFacility.value;
        saveQueryId = this.saveQueryIdMap[queryIdKey];
        param['update'] = [{ queryId: saveQueryId, data: saveData.update }];       
      }

      let deleteQueryId;
      if (saveData.delete.length > 0 && (this.gridCanBeDeletedMap[this.curProcess] || (this.curProcess == '067' && this.params.logGubun.value == '2')) && !_.isEmpty(this.deleteQueryIdMap[this.curProcess])) {
        deleteQueryId = this.deleteQueryIdMap[this.curProcess];
        param['delete'] = [{ queryId: deleteQueryId, data: saveData.delete }];
      }

      let insertQueryId;
      if (saveData.insert.length > 0 && (this.gridCanBeAddedMap[this.curProcess] || (this.curProcess == '067' && this.params.logGubun.value == '2')) && !_.isEmpty(this.insertQueryIdMap[this.curProcess])) {
        insertQueryId = this.insertQueryIdMap[this.curProcess];
        param['insert'] = [{ queryId: insertQueryId, data: saveData.insert }];
      }

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '저장되었습니다.');
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async addClick() {
      if (this.logGrid == null || this.$refs.logGrid == null) return;
      this.$refs.logGrid.getGridView().commit();
      let rows = this.$refs.logGrid.getGridView().getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      } else if (rows.length != 1) {
        this.$toast('info', '한개만 선택해주세요');
        return;
      }
      let item = this.$refs.logGrid.getGridDataProvider().getJsonRow(rows[0]);
      item.seqId = null;

      if (this.curProcess == '067' && this.params.logGubun.value == '2') {
        for (let i = 1; i <= this.addRowCount; i++) {
          this.$refs.logGrid.getGridDataProvider().insertRow(rows[0] + i, item);
        }
      } else {
        this.$refs.logGrid.getGridDataProvider().insertRow(rows[0] + 1, item);
      }
    },
    checkLimitation(e) {
      let value = e.target.value;
      this.addRowCount = value.slice(0, 3);
    },
    async excelClick() {
      if (this.logGrid == null || this.$refs.logGrid == null) return;
      const grid = this.$refs.logGrid.getGridView();

      let index = this.processList.findIndex((e) => e.sysResourceId === this.curProcess);
      let curProcessName = this.processList.at(index).sysResourceName;

      if (this.curProcess == '067' && !_.isEmpty(this.params.logGubun)) {
        curProcessName += '_' + this.params.logGubun.text;
      }

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `LogList_${curProcessName}_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
    onDataLoadComplatedLogGrid(grid) {
      grid.fitLayoutWidth(null);

      //editable column set minWidth
      if (this.curProcess == '037' || this.curProcess == '043') grid.fitLayoutWidth('runNo', null, 150, true);
      if (this.curProcess == '023') grid.fitLayoutWidth('lotNo', null, 150, true);
      if (this.curProcess == '068' || this.curProcess == '070') grid.fitLayoutWidth('cellId', null, 280, true);

      if (this.curProcess == '055') {
        grid.fitLayoutWidth('시작시간', null, 150, true);
        grid.fitLayoutWidth('종료시간', null, 150, true);
      }

      if (this.curProcess == '056') {
        grid.fitLayoutWidth('startTime', null, 150, true);
        grid.fitLayoutWidth('endTime', null, 150, true);
      }

      if (this.curProcess == '022' && !_.isEmpty(this.params.reworkFacility) && this.params.reworkFacility.value == 1) {
        grid.fitLayoutWidth('시작시각', null, 150, true);
        grid.fitLayoutWidth('종료시각', null, 150, true);
        grid.fitLayoutWidth('cellNo', null, 280, true);
        grid.fitLayoutWidth('cstNo', null, 120, true);
      }

      if (this.curProcess == '022' && !_.isEmpty(this.params.reworkFacility) && this.params.reworkFacility.value == 2) {
        grid.fitLayoutWidth('cellNo', null, 280, true);
        grid.fitLayoutWidth('startTime', null, 150, true);
        grid.fitLayoutWidth('endTime', null, 150, true);
      }

      if (this.curProcess == '067' && this.params.logGubun.value == '2') {
        grid.fitLayoutWidth('runNo', null, 150, true);
        grid.fitLayoutWidth('시작시각', null, 150, true);
        grid.fitLayoutWidth('종료시각', null, 150, true);
        grid.fitLayoutWidth('설비호기', null, 90, true);
        grid.fitLayoutWidth('근무조', null, 90, true);
        grid.fitLayoutWidth('작업자', null, 90, true);
        grid.fitLayoutWidth('cstNo', null, 120, true);
        grid.fitLayoutWidth('cellNo', null, 280, true);
        grid.fitLayoutWidth('scrap위치', null, 140, true);
        grid.fitLayoutWidth('scrap', null, 100, true);
        grid.fitLayoutWidth('filmQr', null, 220, true);
      }
      if (this.curProcess == '061') {
        grid.fitLayoutWidth('runId', null, 150, true);
        grid.fitLayoutWidth('startTime', null, 150, true);
        grid.fitLayoutWidth('endTime', null, 150, true);
        grid.fitLayoutWidth('설비호기', null, 90, true);
        grid.fitLayoutWidth('근무조', null, 90, true);
        grid.fitLayoutWidth('작업자', null, 90, true);
        grid.fitLayoutWidth('cstNo', null, 120, true);
        grid.fitLayoutWidth('cstSu', null, 80, true);
        grid.fitLayoutWidth('cst행열', null, 80, true);
        grid.fitLayoutWidth('cellId', null, 280, true);
        grid.fitLayoutWidth('tableNo상', null, 120, true);
        grid.fitLayoutWidth('tableNo하', null, 120, true);
        grid.fitLayoutWidth('trayId', null, 160, true);
        grid.fitLayoutWidth('trayPoketNo', null, 120, true);
      }
    },
    setCellStyleCallbackLogGrid(grid, cell) {
      let ret = {};
      if (this.gridCanBeAddedMap[this.curProcess]) {
        if ((cell.index.fieldName == 'cstNo' || cell.index.fieldName == 'cellId' || cell.index.fieldName == 'mcrReadingId' || cell.index.fieldName == 'mcrWrite') && (cell.item.rowState == 'created' || cell.item.itemState == 'appending' || cell.item.itemState == 'inserting')) {
          ret.editable = true;
          if (isNaN(cell.value)) {
            ret.styleName = 'edit tl';
          } else {
            ret.styleName = 'edit tr';
          }
        }
      }
      return ret;
    },
    setRowStyleCallbackLogGrid(grid, item, fixed) {
      var ret = {};
      if (item.rowState == 'created') ret.style = { background: '#dfc1e8' };
      return ret;
    },
  },
};
</script>
