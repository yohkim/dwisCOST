/** 포장/출하 > 내포장 > [AUTO] PACK */
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
            <date-picker label="종료일" v-model="srchInfo.endDate" />
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
        <div class="title" v-show="params.gubun == '미생성'">입력 정보</div>
        <div class="row worker_info" v-show="params.gubun == '미생성'">
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
        <RealGrid ref="facPackNoGrid" :uid="'facPackNoGrid'" :rows="facPackNoRows" style="height: 100%" />
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
        </div>
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="printLabel">라벨인쇄</b-button>
          <b-button class="second" @click="popupLabelPreview">미리보기</b-button>
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick2">엑셀</b-button>
        </div>
      </div>
      <div class="grid-border-none" style="height: calc(50% - 40px)">
        <RealGrid ref="facPackNoGrid2" :uid="'facPackNoGrid2'" :rows="facPackNoRows2" style="height: 100%" :fitLayoutWidthEnable="false"/>
      </div>
    </div>
    <PackBoxLabel ref="packBoxLabel" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import PackBoxLabel from '@web/popup/PackBoxLabel.vue';
import { useM0003009 } from '@web/store/M0003009.js';

export default {
  name: 'DW_TAB044004',
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
      facPackNoRows: [],
      facPackNoGrid: null,
      facPackNoRows2: [],
      facPackNoGrid2: null,
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
    };
  },
  computed: {
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    facPackNoGridView() {
      return this.$refs.facPackNoGrid.getGridView();
    },
    facPackNoGrid2View() {
      return this.$refs.facPackNoGrid2.getGridView();
    },
    data1Provider() {
      return this.$refs.facPackNoGrid.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.facPackNoGrid2.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.facPackNoGrid = _.cloneDeep(require(`@web/m0003000/js/TAB044003.js`));
      this.facPackNoGrid2 = _.cloneDeep(require(`@web/m0003000/js/TAB044004.js`));
    },
    async getSelectOptions() {
      this.params.gubun = '미생성';
      this.facPackNoGridView.setCheckBar({ visible: true, exclusive: false });

      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      await this.$utils.getCommonCodeValueText(['58'], [this.chargerList]); //담당자
      await this.$utils.getCommonCodeValueText(['59'], [this.approverList]); //승인자
    },
    clearClick() {
      this.facPackNoGridView.resetFilters();
      this.facPackNoGrid2View.resetFilters();
      this.facPackNoGridView.clearCurrent();
      this.facPackNoGrid2View.clearCurrent();

      this.params.packNo = '';
      this.params.gubun = '미생성';
      this.packNoGridView.setCheckBar({ visible: true, exclusive: false });

      // var current = new Date();
      // this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      // var oneMonthAgo = new Date();
      // oneMonthAgo.setMonth(current.getMonth() - 1);
      // this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.facPackNoGridView.resetFilters();
        this.facPackNoGrid2View.resetFilters();
        this.facPackNoGridView.clearCurrent();
        this.facPackNoGrid2View.clearCurrent();

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
        };

        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch3',
            queryParams: params,
            target: this.facPackNoRows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_Sch4',
            queryParams: params,
            target: this.facPackNoRows2,
          },
        ];

        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
        } else {
          this.isExcelExportDisabled = false;
        }
        if (result[1].length == 0) {
          this.isExcelExportDisabled2 = true;
        } else {
          this.isExcelExportDisabled2 = false;
        }
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
      const columnInfo = this.facPackNoGrid2View.getColumns().map(column => ({
        fieldName: column.fieldName,
        headerText: column.header.text || column.headerText,
        width: column.width,
        visible: column.visible
      }));
      this.facPackNoGrid2View.onShowTooltip = this.onShowTooltip;
    },
    searchPackNoClick(packNo) {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.facPackNoGridView.resetFilters();
        this.facPackNoGridView.clearCurrent();

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
            queryId: 'M0003009_Sch3',
            queryParams: params,
            target: this.facPackNoRows,
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
        this.facPackNoGridView.setCheckBar({ visible: true, exclusive: true });
      } else {
        this.facPackNoGridView.setCheckBar({ visible: false, exclusive: true });
      }
      if (this.params.gubun == '폐기분')
        this.facPackNoGrid2View.setColumnProperty("폐기사유", "visible",  true);
      else 
        this.facPackNoGrid2View.setColumnProperty("폐기사유", "visible",  false);
      
      this.searchClick();
    },
    async creationClick() {
      if (this.isMainProcessing) return;
      this.isMainProcessing = true;

      this.$nextTick(async () => {
        let rows = this.facPackNoGridView.getCheckedRows(false);
        if (rows.length == 0) {
          this.$toast('info', '체크된 내용이 없습니다.');
          return;
        } else if (rows.length != 1) {
          this.$toast('info', '한개만 선택해주세요');
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

        let packNo = this.data1Provider.getValue(rows[0], 'packNo');

        let params = {
          charger: !_.isEmpty(this.params.charger) ? this.params.charger.text : '',
          approver: !_.isEmpty(this.params.approver) ? this.params.approver.text : '',
          packNo: !_.isEmpty(packNo) ? packNo : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeCreationAuto',
          queryParams: params,
          target: null,
        };

        const resp = await this.$axios.api.search(searchParam);
        if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
          this.$toast('error', resp[0].errormessage);
        } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
          this.$toast('info', resp[0].message);
        } else {
          this.$toast('success', '생성처리 되었습니다.');

          rows.forEach((dataRow) => {
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
        let rows = this.facPackNoGrid2View.getCheckedRows(false);
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
          queryId: 'M0003009_ExeDisposeAuto',
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
        let rows = this.facPackNoGrid2View.getCheckedRows(false);
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

        let params = {
          description: !_.isEmpty(this.params.significant) ? this.params.significant : '',
          packNo: !_.isEmpty(packNo) ? packNo : '',
        };

        let searchParam = {
          menuId: 'M0003009',
          queryId: 'M0003009_ExeSignificantAuto',
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
      const grid = this.facPackNoGridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_설비PACK관리1_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
      const grid = this.facPackNoGrid2View;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `포장/출하_내포장실적_설비PACK관리2_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
    async printLabel() {
      const grid = this.facPackNoGrid2View;
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
      const grid = this.facPackNoGrid2View;
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
    setCellStyleCallbackFacPackNoGrid2(grid, cell) {
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

    onCellItemClickedFacPackNoGrid2(grid, index, clickData) {
      if (clickData.type == 'link' && clickData.url) {
        let ds = grid.getDataSource();
        var value = ds.getValue(clickData.dataRow, clickData.fieldName);
        try {
          this.searchPackNoClick(value);
        } catch (error) {
          console.error('내포장 실적 packNoGrid search', error);
          return false;
        }

        return false;
      }
    },
  },
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
