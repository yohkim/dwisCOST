/** 포장/출하 > 내포장 > [MANUAL] PACK */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="3">
          <label class="ms-2"><input type="radio" v-bind:value="gubunList[0]" v-model="params.gubun" class="me-1" @change="changeGubun" />폐기분</label>
          <label class="ms-3 me-3"><input type="radio" v-bind:value="gubunList[1]" v-model="params.gubun" class="me-1" @change="changeGubun" />생성분</label>
          <label><input type="radio" v-bind:value="gubunList[2]" v-model="params.gubun" class="me-1" @change="changeGubun" />미생성</label>
        </b-col>

        <b-col cols="3" class="period">
          <div class="form-floating me-1">
						<date-picker label="시작일" v-model="srchInfo.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating ms-1">
						<date-picker label="시작일" v-model="srchInfo.endDate" />
            <label for="floatingPicker">종료일</label>
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

    <div class="grid_box search_onerow">
      <div class="worker_wrap">
        <div class="title" v-show="['미생성', '생성분'].includes(params.gubun)">입력 정보</div>
        <div class="row worker_info" v-show="['미생성', '생성분'].includes(params.gubun)">
          <b-col cols="2">
            <div class="form-floating">
              <select class="form-select form-select-sm label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.charger">
                <option v-for="type in chargerList" :key="type.value" :value="type">
                  {{ type.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">담당자</label>
            </div>
          </b-col>
          <b-col cols="2">
            <div class="form-floating">
              <select class="form-select form-select-sm label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.approver">
                <option v-for="type in approverList" :key="type.value" :value="type">
                  {{ type.text }}
                </option>
              </select>
              <label for="floatingSelect" class="select">승인자</label>
            </div>
          </b-col>
        </div>
        <div class="btn_wrap ms-auto">
          <b-button class="main" @click="creationClick" v-show="params.gubun == '미생성'">생성처리</b-button>
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(50% - 40px)">
        <RealGrid ref="packNoGrid" :uid="'packNoGrid'" :rows="packNoRows" style="height: 100%" class="brd_b" />
      </div>
      <div class="worker_wrap">
        <div class="title">입력 정보</div>
        <div class="row worker_info">
          <b-col cols="4" class="d-flex">
            <div class="form-floating" style="width: calc(100% - 60px)">
              <input autocomplete="off" type="text" class="form-control form-control-sm label-60" id="floating" placeholder="Dispose" v-model="params.disposeReason" />
              <label for="floating">폐기사유</label>
            </div>
            <b-button class="main ms-1" @click="disposeClick">폐기</b-button>
          </b-col>
          <b-col cols="4" class="d-flex">
            <div class="form-floating" style="width: calc(100% - 60px)">
              <input autocomplete="off" type="text" class="form-control form-control-sm label-60" id="floating" placeholder="Dispose" v-model="params.significant" />
              <label for="floating">특이사항</label>
            </div>
            <b-button class="main ms-1" @click="significantClick">저장</b-button>
          </b-col> 
          <b-col cols="1" class="d-flex" style="width: 450px;">       
            <b-button class="main ms-2"  @click="ShipWaitClick">샘플재작업 후 출하대기</b-button>
          </b-col> 
        </div>
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="printLabel">라벨인쇄</b-button>
          <b-button class="second" @click="popupLabelPreview">미리보기</b-button>
          <b-button class="second" :disabled="isExcelExportDisabled2" @click="excelClick2">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(50% - 40px)">
        <RealGrid ref="packNoGrid2" :uid="'packNoGrid2'" :rows="packNoRows2" style="height: 100%" />
      </div>
    </div>
    <PackBoxLabel ref="packBoxLabel" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { useM0003009 } from '@web/store/M0003009.js';
import PackBoxLabel from '@web/popup/PackBoxLabel.vue';

export default {
  name: 'DW_TAB044002',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: { PackBoxLabel },
  setup() {
		const srchInfo = useM0003009();
    const userAuthInfo = useUserAuthInfo();
    return { 
			srchInfo,
      userAuthInfo 
    };
  },
  watch: {},
  data() {
    return {
      packNoRows: [],
      packNoGrid: null,
      packNoRows2: [],
      packNoGrid2: null,
      params: {
        packNo: null,
        startDate: '',
        endDate: '',
        gubun: '미생성',
        charger: '',
        approver: '',
        disposeReason: '',
        significant: '',
      },
      isExcelExportDisabled: true,
      isExcelExportDisabled2: true,
      gubunList: ['폐기분', '생성분', '미생성'],
      isProcessing: false,
      isMainProcessing: false,
      chargerList: [],
      approverList: [],
      originNo: '',
      packState: '',
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    packNoGridView() {
      return this.$refs.packNoGrid.getGridView();
    },
    packNoGrid2View() {
      return this.$refs.packNoGrid2.getGridView();
    },
    data1Provider() {
      return this.$refs.packNoGrid.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.packNoGrid2.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.packNoGridView.setDisplayOptions({fitStyle: 'even'});
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.packNoGrid = _.cloneDeep(require(`@web/m0003000/js/TAB044001.js`));
      this.packNoGrid2 = _.cloneDeep(require(`@web/m0003000/js/TAB044002.js`));     
    },
    async getSelectOptions() {
      this.params.gubun = '미생성';
      this.packNoGridView.setCheckBar({ visible: true, exclusive: false });
      this.params.startDate = this.srchInfo.startDate; 
      this.params.endDate = this.srchInfo.endDate
      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      //this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      await this.$utils.getCommonCodeValueText(['58'], [this.chargerList]); //담당자
      await this.$utils.getCommonCodeValueText(['59'], [this.approverList]); //승인자
    },
    clearClick() {
      this.packNoGridView.resetFilters();
      this.packNoGrid2View.resetFilters();
      this.packNoGridView.clearCurrent();
      this.packNoGrid2View.clearCurrent();

      this.params.packNo = '';
      this.params.gubun = '미생성';
      this.packNoGridView.setCheckBar({ visible: true, exclusive: false });

      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      //this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.packNoGridView.resetFilters();
        this.packNoGrid2View.resetFilters();
        this.packNoGridView.clearCurrent();
        this.packNoGrid2View.clearCurrent();

        if (_.isEmpty(this.params.gubun)) {
          const message = `구분을 선택하세요`;
          this.$toast('info', message);
          return;
        }

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
          gubun: !_.isEmpty(this.params.gubun) ? this.params.gubun : '',
          prePackNo: null,
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch1',
            queryParams: params,
            target: this.packNoRows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch2',
            queryParams: params,
            target: this.packNoRows2,
          },
        ];

        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
        } else {
          this.isExcelExportDisabled = false;
        }
        if (result[0].length == 0) {
          this.isExcelExportDisabled2 = true;
        } else {
          this.isExcelExportDisabled2 = false;
        }
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
      const columnInfo = this.packNoGrid2View.getColumns().map(column => ({
        fieldName: column.fieldName,
        headerText: column.header.text || column.headerText,
        width: column.width,
        visible: column.visible
      }));

     // console.table(columnInfo);  // 테이블 형식으로 출력
      this.packNoGrid2View.onShowTooltip = this.onShowTooltip;
      
     // 다중 레벨 병합
      this.packNoGridView.checkBar.mergeRule = "values['originNo']" ;
    },
    searchPackNoClick(packNo) {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.packNoGridView.resetFilters();
        this.packNoGridView.clearCurrent();

        if (_.isEmpty(this.params.gubun)) {
          const message = `구분을 선택하세요`;
          this.$toast('info', message);
          return;
        }

        if (!this.$utils.validateStartDateEndDate(this.srchInfo.startDate, this.srchInfo.endDate)) {
          return;
        }

        let params = {
          packNo: packNo,
          startDate: !_.isEmpty(this.srchInfo.startDate) ? this.srchInfo.startDate.toString().replaceAll('-', '') : '',
          endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
          gubun: !_.isEmpty(this.params.gubun) ? this.params.gubun : '',
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch1',
            queryParams: params,
            target: this.packNoRows,
          },
        ];

        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
        } else {
          this.isExcelExportDisabled = false;
        }
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    changeGubun() {
      if (this.params.gubun == '미생성') {
        this.packNoGridView.setCheckBar({ visible: true, exclusive: false });
      } else {
        this.packNoGridView.setCheckBar({ visible: false, exclusive: false });
      }
      if (this.params.gubun == '폐기분')
        this.packNoGrid2View.setColumnProperty("폐기사유", "visible",  true);
      else 
        this.packNoGrid2View.setColumnProperty("폐기사유", "visible",  false);
      
      this.searchClick();
    },
    async creationClick() {
      if (this.isMainProcessing) return;
      this.isMainProcessing = true;

      this.$nextTick(async () => {
        let rows = this.packNoGridView.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        }

        let gubun = this.data1Provider.getValue(rows[0], '구분');
        if (gubun != '미생성') {
          this.$toast('info', '미생성으로 재조회 후 선택해주세요.');
          return;
        }

        if (_.isEmpty(this.params.charger) || _.isEmpty(this.params.charger.text) || _.isEmpty(this.params.approver) || _.isEmpty(this.params.approver.text)) {
          this.$toast('info', '담당자와 승인자를 선택하고 다시 생성처리를 눌러주세요.');
          return;
        }

        const items = [];
        rows.forEach((dataRow) => {
          let originNo = this.data1Provider.getValue(dataRow, 'originNo');
          if (!_.isEmpty(originNo)) {
            items.push(originNo);
          }
        });

        let params = {
          charger: !_.isEmpty(this.params.charger) ? this.params.charger.text : '',
          approver: !_.isEmpty(this.params.approver) ? this.params.approver.text : '',
          originList: items.join(','),
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeCreation',
          queryParams: params,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
          this.$toast('info', resp[0].message);
          this.packNoGridView.checkAll(false);
        } else {
          this.$toast('success', `${items.length}건이 생성처리 되었습니다.`);
          this.packNoGridView.checkAll(false);

          rows.forEach((dataRow) => {
            this.data1Provider.setValue(dataRow, 'packNo', resp[0].packNo);
            this.data1Provider.setValue(dataRow, 'boxNo', resp[0].boxNo);
          });

          this.searchClick();
        }
      });
      setTimeout(() => {
        this.isMainProcessing = false;
      }, 1000);
    },
    async disposeClick() {
      if (this.isMainProcessing) return;
      this.isMainProcessing = true;

      this.$nextTick(async () => {
        let rows = this.packNoGrid2View.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        } else if (rows.length != 1) {
          this.$toast('info', '한개만 선택해주세요');
          return;
        }

        if (_.isEmpty(this.params.disposeReason)) {
          this.$toast('info', '폐기사유를 입력 후 폐기를 눌러주세요.');
          return;
        }

        let packNo = this.data2Provider.getValue(rows[0], 'packQrno');

        let params = {
          reason: !_.isEmpty(this.params.disposeReason) ? this.params.disposeReason : '',
          packNo: !_.isEmpty(packNo) ? packNo : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeDispose',
          queryParams: params,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
          this.$toast('info', resp[0].message);
        } else {
          this.$toast('info', '폐기처리되었습니다.');
          this.searchClick();
        }
      });
      setTimeout(() => {
        this.isMainProcessing = false;
      }, 1000);
    },
    async significantClick() {
      if (this.isMainProcessing) return;
      this.isMainProcessing = true;

      this.$nextTick(async () => {
        let rows = this.packNoGrid2View.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        } else if (rows.length != 1) {
          this.$toast('info', '한개만 선택해주세요');
          return;
        }

        if (_.isEmpty(this.params.significant)) {
          this.$toast('info', '특이사항을 입력 후 저장을 눌러주세요.');
          return;
        }

        let packNo = this.data2Provider.getValue(rows[0], 'packQrno');
        // let boxNo = this.data2Provider.getValue(rows[0], '대포장Qrno');
        // let pack상태 = this.data2Provider.getValue(rows[0], 'pack상태');
        // let si의뢰일자 = this.data2Provider.getValue(rows[0], 'si의뢰일자');
        // let si의뢰차수 = this.data2Provider.getValue(rows[0], 'si의뢰차수');
        
        // if(pack상태 === 'SI 의뢰')
        //   packNo = si의뢰일자 + ' ' + si의뢰차수;
        // else if(pack상태 === '소포장 반출' || pack상태 === '창고 재고' || pack상태 === '출하 완료' )
        //   packNo = boxNo;

        // this.$toast('info', packNo+' '+pack상태+' '+si의뢰일자+' '+si의뢰차수); return;

        let params = {
          description: !_.isEmpty(this.params.significant) ? this.params.significant : '',
          packNo: !_.isEmpty(packNo) ? packNo : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeSignificant',
          queryParams: params,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
          this.$toast('info', resp[0].message);
        } else {
          this.$toast('info', '특이사항 저장되었습니다.');
          this.searchClick();
        }
      });
      setTimeout(() => {
        this.isMainProcessing = false;
      }, 1000);
    },
    async excelClick() {
      const grid = this.packNoGridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_PACK_NO관리1_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
    async excelClick2() {
      const grid = this.packNoGrid2View; // GridView 객체 확인
      var column = grid.columnByName("특이사항");

      column.displayCallback = null;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_PACK_NO관리2_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
      column.displayCallback = function(grid, index, value) {
        if (!value) return "";
        return value.length > 10 ? value.substring(0, 10) + "..." : value;
      };
    },
    async printLabel() {
      const grid = this.packNoGrid2View;
      const checkedRows = grid.getCheckedRows();

      if (checkedRows.length == 0) {
        this.$toast('info', '라벨인쇄할 행을 먼저 선택해주세요.');
        return;
      }
      const ds = grid.getDataSource();
      const row = ds.getJsonRow(checkedRows[0]);

      let param = {
        menuId: 'M0003009',
        queryId: 'M0003009_ExecGetPackLabel',
        queryParams: { packNo: row.packQrno },
      };
      let resp = await this.$axios.api.search(param);
      //console.log(resp);
      this.$refs.packBoxLabel.printLabel({ packInfo: resp[0] });
      //this.$refs.packBoxLabel.printLabel();
    },
    async popupLabelPreview() {
      const grid = this.packNoGrid2View;
      const checkedRows = grid.getCheckedRows();

      if (checkedRows.length == 0) {
        this.$toast('info', '라벨인쇄할 행을 먼저 선택해주세요.');
        return;
      }
      const ds = grid.getDataSource();
      const row = ds.getJsonRow(checkedRows[0]);

      let param = {
        menuId: 'M0003009',
        queryId: 'M0003009_ExecGetPackLabel',
        queryParams: { packNo: row.packQrno },
      };
      let resp = await this.$axios.api.search(param);
      //console.log(resp);
      this.$refs.packBoxLabel.openDialog({ packInfo: resp[0] });
      //this.$refs.packBoxLabel.openDialog();
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    onDataLoadComplatedPackNoGrid(grid) {
      grid.fitLayoutWidth(null);

      //editable column set minWidth
      grid.fitLayoutWidth('runNo', null, 140, true);
      grid.fitLayoutWidth('originNo', null, 160, true);
      grid.fitLayoutWidth('packNo', null, 240, true);
      grid.fitLayoutWidth('boxNo', null, 240, true);
      grid.fitLayoutWidth('작업일자', null, 150, true);
      grid.fitLayoutWidth('설비', null, 50, true);
      grid.fitLayoutWidth('처리시각', null, 150, true);
    },
    onDataLoadComplatedPackNoGrid2(grid) {
      //grid.fitLayoutWidth(null);

      // //editable column set minWidth
      //grid.fitLayoutWidth('packNo', null, 250, true);
      //grid.fitLayoutWidth('boxNo', null, 250, true);
      //grid.fitLayoutWidth(null);
  
      // 개별 컬럼 너비 조정 (최소 너비 설정)
      // grid.setColumnProperty("packNo", "minWidth", 250);
      // grid.setColumnProperty("boxNo", "minWidth", 250);
      
      // // fitLayoutWidth 정확한 파라미터 사용
      // grid.fitLayoutWidth("packNo", null, 250, true);
      // grid.fitLayoutWidth("boxNo", null, 250, true);
      
      // // 강제 리프레시 (필요시)
      // grid.refresh();
      grid.setFixedOptions(null); // 1. 고정 옵션 완전히 제거
      grid.setDisplayOptions({ fixedColCount: 0 }); // 2. 표시 옵션에서 고정 컬럼 수 0으로 설정

      // 3. 모든 컬럼의 개별 고정 속성 해제
      const columns = grid.getColumns();
      columns.forEach(col => {
        grid.setColumnProperty(col.name, "fixed", false);
      });

      grid.refresh();
    },
    setCellStyleCallbackPackNoGrid2(grid, cell) {
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      if (fieldName == 'packQrno') {
        rtn['renderer'] = {
          type: 'link',
          urlCallback: function (grid, cell) {},
          titleField: 'fieldName',
        };
      }
      return rtn;
    },

    onCellItemClickedPackNoGrid2(grid, index, clickData) {
      if (clickData.type == 'link' && clickData.url) {
        let ds = grid.getDataSource();
        var value = ds.getValue(clickData.dataRow, clickData.fieldName);
        this.packNoGridView.setCheckBar({ visible: false, exclusive: false });
        this.params.gubun = '생성분';
        try {
          this.searchPackNoClick(value);
        } catch (error) {
          console.error('내포장 실적 packNoGrid search', error);
          return false;
        }

        return false;
      }
    },
    onCellClickedPackNoGrid2(grid, clickData) {
      if (clickData.cellType != 'data' && clickData.cellType != 'check') return;
      
      const prod = grid.getDataSource();
      let row = prod.getJsonRow(clickData.dataRow);
      //if (clickData.cellType == "check") {   
          this.originNo = row.originNo1;
          this.packState = row.pack상태;
          //this.$toast('info',this.originNo);
     // }

      grid.checkItem(clickData.itemIndex, true, true);
    },
    async ShipWaitClick(){
      if(this.originNo === ''){
        this.$toast('warning','샘플재작업 후 출하대기로 보낼 PACK을 먼저 선택해주세요');
        return;
      } 

      if(this.packState !== 'SI 대기'){
        this.$toast('warning',`'SI 대기' 상태인 PACK을 선택해주세요`);
        return;
      } 

      if (_.isEmpty(this.params.charger) || _.isEmpty(this.params.charger.text) || _.isEmpty(this.params.approver) || _.isEmpty(this.params.approver.text)) {
        this.$toast('info', '담당자와 승인자를 선택하고 다시 생성처리를 눌러주세요.');
        return;
      }
      
        try {
        let params = {
          originNo: this.originNo
        };
        
        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ShipWait',
          queryParams: params,
          target: null,
        };

        // API 호출
        //const response = await this.$axios.api.search(searchParam);
        let resp = await this.$axios.api.search(searchParam);	   
        //let info = resp[0]; 
        if (!_.isNil(resp[0].message))
          this.$toast("info", resp[0].message);
        else if (!_.isNil(resp[0].errormessage))
          this.$toast("error", resp[0].errormessage);
        else if(resp[0].이전pack상태 !== '폐기'){
          this.packNoGrid2View.resetFilters();
          this.packNoGrid2View.clearCurrent();
            let params = {
              startDate: resp[0].발행일자,
              endDate: !_.isEmpty(this.srchInfo.endDate) ? this.srchInfo.endDate.toString().replaceAll('-', '') : '',
              gubun: !_.isEmpty(this.params.gubun) ? this.params.gubun : '',
              prePackNo: resp[0].이전packNo,
            };

            let searchParam = 
              {
                menuId: 'M0003009',
                queryId: resp[0].이전packNo.substr(24, 1)=='7' ? 'M0003009_Sch2' : 'M0003009_Sch4' ,
                queryParams: params,
                target: this.packNoRows2,
              };
            let result = await this.$axios.api.search(searchParam);
            // this.$nextTick(() => {
            //   this.packNoGrid2View.refresh(); // or whatever refresh method your grid has
            // }); 
            console.log(JSON.stringify(result[0], null, 2));
            this.$toast('warning', `이전 PACK이 "${resp[0].이전pack상태}" 상태 입니다 \n아래 이전 PACK을  먼저 "폐기" 해야 \n"샘플재작업 출하대기" 처리가 가능 합니다.\n이전 PACK_NO : ${resp[0].이전packNo}`);
          }
          else  { 
          this.$confirm(
          "확인",`선택하신 PACK_NO(${resp[0].packNo})를 \n 출하대기로 보내시겠습니까?`,async (confirm) => {
             if(confirm){
              let params = {
                packno: resp[0].packNo,
                charger: !_.isEmpty(this.params.charger) ? this.params.charger.text : '',
                approver: !_.isEmpty(this.params.approver) ? this.params.approver.text : '',
                // reqdate: resp[0].의뢰일자,
                // reqseq: resp[0].의뢰차수,
              };

              let searchParam = {
                menuId: 'M0003009',
                queryId: 'M0003009_PackOut',
                queryParams: params,
                target: null,
              };

              const rslt = await this.$axios.api.search(searchParam);
              if (rslt != null && rslt.length > 0 && !_.isNil(rslt[0].errormessage)) {
                this.$toast('error', rslt[0].errormessage);
              } else if (rslt != null && rslt.length > 0 && !_.isNil(rslt[0].message)) {
                this.$toast('info', rslt[0].message);
              } else {
                this.$toast('success', `PACK(${resp[0].packNo})을\n출하대기(소포장 반출)로 보냈습니다.`);
                this.searchClick();
              }  
            } 
          });
          
            //alert(`이전 PACK_NO(${resp[0].이전packNo})은 \nPACK상태가 "${resp[0].이전pack상태}" 이니 반드시 "폐기" 처리 하시기 바랍니다`);
            //this.$toast('warning', `이전 PACK_NO(${resp[0].이전packNo})은 \nPACK상태가 "${resp[0].이전pack상태}" 이니 반드시 "폐기" 처리 하시기 바랍니다`);
          //this.$toast('info', JSON.stringify(resp[0], null, 2));
        }
      } catch (error) {
        console.error('API 호출 에러:', error);
        this.$toast('error', `에러 발생: ${error.message}`);
      }
    },
    onShowTooltip(grid, index, value) {
    var column = index.column;
    var itemIndex = index.itemIndex;
    var tooltip = grid.getValue(itemIndex, column);
    if (column != column) return null;
    return tooltip;
   },	
   setRowStyleCallbackPackNoGrid2(grid, item, fixed) {
			var ret = {};
			var disposal = grid.getValue(item.index, 'disposal');
			if (disposal==='폐기필요') {
				ret.style = { background: '#faa7a7' }; //#FAFAD2
			 } 
			return ret;
		},
  }
};
</script>
<style lang="scss" scoped>
:deep .worker_wrap {
  margin: 0;
  border: 0;
  background: #ffffff;
  display: flex;
  width: 100%;
  font-size: 14px;
  color: #1c1c1c;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #bebebe;
  align-items: center;
  .form-select-sm,
  .form-control-sm {
    min-height: 34px;
    height: 34px;
    padding: 8px 25px;
  }
  label {
    padding: 0 10px;
    top: -1px;
  }
  .form-select:focus ~ label,
  .form-control:focus ~ label {
    top: 5px;
  }
}
</style>
