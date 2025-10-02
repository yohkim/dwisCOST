<template>
  <div>
    <div class="search_box">
      <b-row class="search_area">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Step" v-model="params.step" ref="stepField" />
            <label for="floating">종류</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Type" v-model="params.type" ref="typeField" />
            <label for="floating">타입</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Model" v-model="params.model" ref="modelField" />
            <label for="floating">모델</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="CstNo" v-model="params.cstNo" ref="cstNoField" name="cstNo" data-group="params" @input="convertToUpperEnglish" @keydown.enter="handleEnter" />
            <label for="floating">CST NO</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Status" v-model="params.status" ref="statusField" />
            <label for="floating">상태</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="StatusValue" v-model="params.statusValue" ref="statusValueField" />
            <label for="floating">상태값</label>
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
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="main" @click="inspectionClick">반출신청</b-button>
          <b-button class="second" @click="changeCstStatus">카세트 상태 변경</b-button>
          <!-- <b-button class="second" @click="uploadClick">업로드</b-button> -->
          <b-button class="second" :disabled="isExcelExportDisabled" @click="excelClick">엑셀</b-button>
          <!-- <b-button class="main" @click="saveClick">저장</b-button> -->
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
    <UploadPopup ref="uploadPopup1" @closePopup="closePopup" />
    <CstChangeStatus ref="cstChangeStatusPopup" />
  </div>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import CstChangeStatus from '../../popup/CstChangeStatus.vue';

export default {
  name: 'TAB074002',
  props: {
    tabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {
    CstChangeStatus,
  },
  watch: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  data() {
    return {
      menuId: 'M0007005',
      searchQueryId: 'M0007005_Sch1',
      updateQueryId: 'M0007005_Update1',
      templateFileName: '카세트_마스터_업로드_template',
      params: {
        step: null,
        type: null,
        model: null,
        cstNo: null,
        status: null,
        statusValue: null,
      },
      cstGrid: null,
      cstRows: [],
      isProcessing: false,
      isExcelExportDisabled: true,
      timeFilter: [
        {
          name: '00:00~00:59',
          criteria: "(value >= '000000') and (value <= '005959')",
        },
        {
          name: '01:00~01:59',
          criteria: "(value >= '010000') and (value <= '015959')",
        },
        {
          name: '02:00~02:59',
          criteria: "(value >= '020000') and (value <= '025959')",
        },
        {
          name: '03:00~03:59',
          criteria: "(value >= '030000') and (value <= '035959')",
        },
        {
          name: '04:00~04:59',
          criteria: "(value >= '040000') and (value <= '045959')",
        },
        {
          name: '05:00~05:59',
          criteria: "(value >= '050000') and (value <= '055959')",
        },
        {
          name: '06:00~06:59',
          criteria: "(value >= '060000') and (value <= '065959')",
        },
        {
          name: '07:00~07:59',
          criteria: "(value >= '070000') and (value <= '075959')",
        },
        {
          name: '08:00~08:59',
          criteria: "(value >= '080000') and (value <= '085959')",
        },
        {
          name: '09:00~09:59',
          criteria: "(value >= '090000') and (value <= '095959')",
        },
        {
          name: '10:00~10:59',
          criteria: "(value >= '100000') and (value <= '105959')",
        },
        {
          name: '11:00~11:59',
          criteria: "(value >= '110000') and (value <= '115959')",
        },
        {
          name: '12:00~12:59',
          criteria: "(value >= '120000') and (value <= '125959')",
        },
        {
          name: '13:00~13:59',
          criteria: "(value >= '130000') and (value <= '135959')",
        },
        {
          name: '14:00~14:59',
          criteria: "(value >= '140000') and (value <= '145959')",
        },
        {
          name: '15:00~15:59',
          criteria: "(value >= '150000') and (value <= '155959')",
        },
        {
          name: '16:00~16:59',
          criteria: "(value >= '160000') and (value <= '165959')",
        },
        {
          name: '17:00~17:59',
          criteria: "(value >= '170000') and (value <= '175959')",
        },
        {
          name: '18:00~18:59',
          criteria: "(value >= '180000') and (value <= '185959')",
        },
        {
          name: '19:00~19:59',
          criteria: "(value >= '190000') and (value <= '195959')",
        },
        {
          name: '20:00~20:59',
          criteria: "(value >= '200000') and (value <= '205959')",
        },
        {
          name: '21:00~21:59',
          criteria: "(value >= '210000') and (value <= '215959')",
        },
        {
          name: '22:00~22:59',
          criteria: "(value >= '220000') and (value <= '225959')",
        },
        {
          name: '23:00~23:59',
          criteria: "(value >= '230000') and (value <= '235959')",
        },
      ],
    };
  },
  computed: {
    cstGridDataProvider() {
      return this.$refs.cstGrid.getGridDataProvider();
    },
    cstGridView() {
      return this.$refs.cstGrid.getGridView();
    },
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
    prodCtg() {
      return this.userAuthInfo.selectedProdCtg;
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.cstGridView.addColumnFilters('반입시간', this.timeFilter);
    this.cstGridView.addColumnFilters('최근세척시작시간', this.timeFilter);
    this.cstGridView.addColumnFilters('최근세척종료시간', this.timeFilter);
    this.cstGridView.addColumnFilters('반출시간', this.timeFilter);
    this.cstGridView.addColumnFilters('회수시간', this.timeFilter);
    this.cstGridView.addColumnFilters('최근점검시작시간', this.timeFilter);
    this.cstGridView.addColumnFilters('최근점검종료시간', this.timeFilter);
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB075001.js`));
    },
    convertToUpperEnglish(event) {
      const group = event.target.dataset.group; // params 또는 params1 판별
      const fieldName = event.target.name; // lotNo, serialNo 등을 가져옴
      if (group && this[group]) {
        this[group][fieldName] = this.$utils.korToEng(event.target.value); // 해당 객체의 필드 업데이트
      }
    },
    handleEnter(event) {
      event.preventDefault(); // 기본 이벤트 방지

      if (this.cstGridDataProvider.getRowCount() > 0) {
        this.findRow(); // cstNo 찾기
      } else {
        this.searchClick(); // 검색 실행

        this.$refs.cstNoField.focus();
        this.$refs.cstNoField.select();
      }
    },
    searchClick() {
      if (this.isProcessing) return;
      if (this.cstGridView != null) this.cstGridView.clearCurrent();
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();

        let params = {
          step: this.params.step,
          type: this.params.type,
          model: this.params.model,
          cstNo: this.params.cstNo,
          status: this.params.status,
          statusValue: this.params.statusValue,
        };

        let searchParam = [
          {
            menuId: this.menuId,
            queryId: this.searchQueryId,
            queryParams: params,
            target: this.cstRows,
          },
        ];
        let result = await this.$axios.api.searchAll(searchParam);
        if (result[0].length == 0) {
          this.isExcelExportDisabled = true;
          return;
        }
        this.isExcelExportDisabled = false;
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async saveClick() {
      this.cstGridView.commit();
      if (await this.saveData()) {
        this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.updateQueryId, data: saveData.update }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `변경된 ${saveData.update.length}건 저장되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    uploadClick() {
      let excelGrid = _.cloneDeep(require(`@web/m0007000/js/TAB075001.js`));
      excelGrid.options.display.fitStyle = 'none'; // 엑셀다운로드시 none 아니면 width 0이 됨.
      const options = {
        indicator: 'hidden',
      };
      this.$refs.uploadPopup1.openDialog({
        dialogTitle: '업로드 팝업',
        uploadApi: '/api/m0007000/m0007005/upload',
        headers: ['공장코드', '종류', '타입', '모델', 'cstNo', '열', '행', '위치', '카세트상태', '카세트상태값', '반입일자', '반입시간', '반입자', '최근세척시작일', '최근세척시작시간', '최근세척종료일', '최근세척종료시간', '세척작업자', '반출일', '반출시간', '반출부서', '반출자', '반출사유', '회수일', '회수시간', '회수자부서', '회수자', '최근점검시작일', '최근점검시작시간', '최근점검종료일', '최근점검종료시간', '점검작업자', '점검결과', '비고'],
        excelGrid,
        fileName: this.templateFileName,
        exportOptions: options,
      });
    },
    closePopup() {
      this.clearClick();
      this.searchClick();
    },
    changeCstStatus() {
      let params = {};
      params['worker'] = this.userAuthInfo.loginUserName;
      params['status'] = '대기';

      this.$refs.cstChangeStatusPopup.openDialog(params);
    },
    clearClick() {
      this.params.step = null;
      this.params.type = null;
      this.params.model = null;
      this.params.cstNo = null;
      this.params.status = null;
      this.params.statusValue = null;

      this.cstGridDataProvider.clearRows();
    },
    async excelClick() {
      const grid = this.cstGridView;
      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate();

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');

      const fileName = `CassetteMaster_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

      const options = {
        type: 'excel',
        target: 'local',
        fileName: fileName,
        progressMessage: '엑셀 Export중입니다.',
        indicator: 'hidden',
        done: function () {
          alert('엑셀 내보내기가 완료되었습니다!');
        },
      };

      grid.exportGrid(options);
    },
    async inspectionClick() {
      this.cstGridView.commit();
      if (await this.inspectionData()) {
        this.clearClick();
        this.searchClick();
      }
    },
    async inspectionData() {
      let result = false;

      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }

      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;

      rows.forEach((dataRow) => {
        this.cstGridDataProvider.setValue(dataRow, '카세트상태', '반출대기');
        this.cstGridDataProvider.setValue(dataRow, '카세트상태값', '부적합');
      });
      this.cstGridView.commit();
      let jsonRows = this.cstGridDataProvider.getJsonRows(0, -1);
      const updated = [];
      rows.forEach((dataRow) => {
        updated.push(jsonRows[dataRow]);
      });

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.updateQueryId, data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `선택된 CST_NO ${updated.length}건 반출대기 상태로 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    findRow() {
      if (_.isEmpty(this.params.cstNo)) return;

      let fields = ['cstNo'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: this.params.cstNo,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.cstGridView.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        if (this.cstGridView.getValue(index.itemIndex, '카세트상태') == '대기' || this.cstGridView.getValue(index.itemIndex, '카세트상태') == '반입' || this.cstGridView.getValue(index.itemIndex, '카세트상태') == '세척' || this.cstGridView.getValue(index.itemIndex, '카세트상태') == '점검') {
          this.cstGridView.checkRow(index.itemIndex, true);
          findCount++;
        }
      }

      if (findCount == 0 && this.cstGridDataProvider.getRowCount() > 0) {
        const message = `CST_NO을 찾을 수 없거나 대기, 반입, 세척, 점검 상태가 아닙니다.`;
        this.$toast('info', message);
      } else {
        // const message = `Cst No ${findCount}건이 선택되었습니다.`;
        // this.$toast('info', message);
      }

      this.params.cstNo = '';
      this.$refs.cstNoField.focus();
      this.$refs.cstNoField.select();
    },
    /********************************************************************************************************************************
     * 아래로 그리드 설정
     ********************************************************************************************************************************/
    setCellStyleCallbackCstGrid(grid, cell) {
      let rtn = {};
      let ds = grid.getDataSource();
      const fieldName = cell.index.fieldName;
      if (fieldName == 'cstNo' || fieldName == '최근점검시작일' || fieldName == '최근점검시작시간' || fieldName == '최근점검종료일' || fieldName == '최근점검종료시간' || fieldName == '점검작업자' || fieldName == '점검결과' || fieldName == '최근세척시작일' || fieldName == '최근세척시작시간' || fieldName == '최근세척종료일' || fieldName == '최근세척종료시간' || fieldName == '세척작업자') {
        rtn['renderer'] = {
          type: 'link',
          urlCallback: function (grid, cell) {},
          titleField: 'fieldName',
        };
      }
      return rtn;
    },

    onCellItemClickedCstGrid(grid, index, clickData) {
      if (clickData.type == 'link' && clickData.url) {
        let ds = grid.getDataSource();
        let current = grid.getCurrent();
        let jsonData = ds.getJsonRow(current.dataRow);
        // 권한은 나중에 추가.
        try {
          let tabMove = '';
          let moveTabId = '';
          if (clickData.fieldName == 'cstNo') {
            moveTabId = 'TAB075002';
            tabMove = 'TAB075002MenuMove';
          } else if (clickData.fieldName == '최근점검시작일' || clickData.fieldName == '최근점검시작시간' || clickData.fieldName == '최근점검종료일' || clickData.fieldName == '최근점검종료시간' || clickData.fieldName == '점검작업자' || clickData.fieldName == '점검결과') {
            moveTabId = 'TAB075003';
            tabMove = 'TAB075003MenuMove';
          } else if (clickData.fieldName == '최근세척시작일' || clickData.fieldName == '최근세척시작시간' || clickData.fieldName == '최근세척종료일' || clickData.ieldName == '최근세척종료시간' || clickData.fieldName == '세척작업자') {
            moveTabId = 'TAB075004';
            tabMove = 'TAB075004MenuMove';
          }
          this.$eventBus.emit('CstMasterTabMoveClick', {
            moveTabId: moveTabId,
            callback: () => {
              this.$eventBus.emit(tabMove, jsonData);
            },
          });
        } catch (error) {
          console.error('카세트 마스터 탭 이동중', error);
          return false;
        }

        return false;
      }
    },
  },
};
</script>
