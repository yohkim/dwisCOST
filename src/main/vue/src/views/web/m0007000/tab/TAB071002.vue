<template>
  <v-container>
    <div class="search_box">
      <b-row class="search_area">
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
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Charger" v-model="params.charger" ref="chargerField" />
            <label for="floating">담당자</label>
          </div>
        </b-col>
        <b-col cols="3" class="period">
          <div class="form-floating">
            <date-picker label="시작일" v-model="params.startDate" />
            <label for="floatingPicker">시작일</label>
          </div>
          ~
          <div class="form-floating">
            <date-picker label="종료일" v-model="params.endDate" />
            <label for="floatingPicker">종료일</label>
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
    <div class="worker_wrap">
      <div class="title">검사 입력 정보</div>
      <div class="row worker_info">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Department" v-model="dept" />
            <label for="floating">검사부서</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="InspectionCharger" v-model="inspectionCharger" />
            <label for="floating">검사자</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="fileAttach">시험성적서 첨부/조회</b-button>
          <b-button class="sub" @click="updateResultValue">검사결과 일괄업데이트</b-button>
          <b-button class="sub" @click="saveClick">임시저장</b-button>
          <b-button class="main" @click="inspectionClick">검사완료</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
    <FileAttachPopup ref="fileAttachPopup1" />
    <SelectUpdateValue ref="selectUpdateValue" @confirm="handleUpdateValueConfirm" />
  </v-container>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import SelectUpdateValue from '@web/popup/SelectUpdateValue.vue';
import { RowState } from 'realgrid';

export default {
  name: 'TAB071002',
  props: {
    pTabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: { SelectUpdateValue },
  watch: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  data() {
    return {
      stepMap: {
        TAB071000: '세정',
        TAB071000_1: '강화',
      },
      menuId: 'M0007001',
      searchQueryId: 'M0007001_Sch2',
      updateQueryId: 'M0007001_Update2',
      inspectionQueryId: 'M0007001_U_Inspection2',
      fileAttachGroupIdPrefixMap: {
        TAB071000: 'M0007001_세정_검사',
        TAB071000_1: 'M0007001_강화_검사',
      },
      params: {
        type: null,
        model: null,
        cstNo: null,
        charger: null,
        startDate: '',
        endDate: '',
      },
      cstGrid: null,
      cstRows: [],
      inspectionCharger: '',
      dept: '',
      isProcessing: false,
    };
  },
  computed: {
    cstGridDataProvider() {
      return this.$refs.cstGrid.getGridDataProvider();
    },
    cstGridView() {
      return this.$refs.cstGrid.getGridView();
    },
  },
  created() {
    this.initialize();
    this.initializeGrid();
  },
  mounted() {
    this.cstGridView.setRowStyleCallback(this.rowStyleCallbackCheckStatus);
    //this.cstGridView.setCheckableExpression("values['카세트상태'] = '검사대기'", true);
  },
  beforeUnmount() {},
  methods: {
    initialize() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneMonthAgo = new Date();
      oneMonthAgo.setMonth(current.getMonth() - 1);
      this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.dept = this.userAuthInfo.loginUserDeptName;
      this.inspectionCharger = this.userAuthInfo.loginUserName;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB071002.js`));
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
        if (!this.$utils.validateStartDateEndDate(this.params.startDate, this.params.endDate)) {
          return;
        }

        this.cstGridView.commit();
        this.cstGridDataProvider.clearRows();

        let params = {
          step: this.stepMap[this.pTabId],
          type: this.params.type,
          model: this.params.model,
          cstNo: this.params.cstNo,
          charger: this.params.charger,
          startDate: this.params.startDate.toString().replaceAll('-', ''),
          endDate: this.params.endDate.toString().replaceAll('-', ''),
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
          return;
        }
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async saveClick() {
      this.cstGridView.commit();
      if (await this.saveData()) {
        // this.clearParams();
        // this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return result;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.updateQueryId, data: saveData.update }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '저장되었습니다.');
        result = true;
        let stateRows = this.cstGridDataProvider.getAllStateRows();
        stateRows.updated.forEach((dataRow) => {
          this.cstGridDataProvider.setRowState(dataRow, RowState.NONE);
        });
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async inspectionClick() {
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 임시저장 후 선택하세요.');
        return;
      }
      this.cstGridView.commit();
      if (await this.inspectionData()) {
        this.clearParams();
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

      let jsonRows = this.cstGridDataProvider.getJsonRows(0, -1);
      const updated = [];
      rows.forEach((dataRow) => {
        if ('검사대기' == this.cstGridDataProvider.getValue(dataRow, '카세트상태') && ('OK' == this.cstGridDataProvider.getValue(dataRow, '검사결과') || 'NG' == this.cstGridDataProvider.getValue(dataRow, '검사결과'))) {
          updated.push(jsonRows[dataRow]);
        }
      });

      if (updated.length == 0) {
        this.$toast('info', '검사대기 상태 아니거나 검사결과가 입력되지 않았습니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.inspectionQueryId, data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `OK건은 검사완료, NG건은 불출대기 상태로 ${updated.length}건 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    fileAttach() {
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 임시저장 후 선택하세요.');
        return;
      }

      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다. 동일한 검사일자를 선택하세요.');
        return;
      }

      let inspectionDate = this.cstGridDataProvider.getValue(rows[0], '검사일자');
      if (_.isEmpty(inspectionDate)) {
        this.$toast('info', '검사 일자가 있는 행을 선택하세요.');
        return;
      }

      var isSameDate = true;
      rows.forEach((dataRow) => {
        if (inspectionDate != this.cstGridDataProvider.getValue(dataRow, '검사일자')) {
          isSameDate = false;
        }
      });

      if (!isSameDate) {
        this.$toast('info', '동일한 검사일자를 선택하세요.');
        return;
      }

      let curGroupId = this.fileAttachGroupIdPrefixMap[this.pTabId] + '_' + inspectionDate;
      console.log('curGroupId=', curGroupId);
      this.$refs.fileAttachPopup1.openDialog({
        dialogTitle: '시험성적서 첨부/조회',
        groupId: curGroupId,
      });
    },
    closePopup() {
      this.clearClick();
      this.searchClick();
    },
    updateResultValue() {
      this.cstGridView.clearCurrent();
      this.cstGridView.commit();

      let rows = this.cstGridView.getCheckedRows(false);
      let jsonRows = this.cstGridDataProvider.getJsonRows(0, -1);
      const updated = [];
      rows.forEach((dataRow) => {
        if ('검사대기' == this.cstGridDataProvider.getValue(dataRow, '카세트상태')) {
          updated.push(jsonRows[dataRow]);
        }
      });

      if (rows.length == 0 || updated.length == 0) {
        this.$toast('info', '검사대기 상태인 건을 선택해주세요.');
        return;
      }

      if (_.isEmpty(this.dept) || _.isEmpty(this.inspectionCharger)) {
        this.$toast('info', '검사부서와 검사자를 입력 후 버튼을 클릭하세요.');
        return;
      }

      let params = {
        popUpSize: 'sm',
        popUpTitle: '검사결과 일괄업데이트 선택',
        tabId: 'TAB071002',
        gridJs: 'TAB071002Popup',
      };
      this.$refs.selectUpdateValue.openDialog(params);
    },
    handleUpdateValueConfirm(params) {
      let batchResult = params.jsonRows[0]['검사결과'];

      let rows = this.cstGridView.getCheckedRows(false);
      const updated = [];
      rows.forEach((dataRow) => {
        if ('검사대기' == this.cstGridDataProvider.getValue(dataRow, '카세트상태')) {
          updated.push(dataRow);
        }
      });
      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;

      updated.forEach((dataRow) => {
        this.cstGridDataProvider.setValue(dataRow, '검사부서', this.dept);
        this.cstGridDataProvider.setValue(dataRow, '검사자', this.inspectionCharger);
        this.cstGridDataProvider.setValue(dataRow, '검사일자', cDate);
        this.cstGridDataProvider.setValue(dataRow, '검사시간', cTime);
        this.cstGridDataProvider.setValue(dataRow, '검사결과', batchResult);
      });

      if (updated.length > 0) {
        this.$toast('info', `검사대기 상태 ${updated.length}건이 검사결과 ${batchResult}로 변경되었습니다.`);
      }
    },
    clearParams() {
      this.params.type = null;
      this.params.model = null;
      this.params.cstNo = null;
      this.params.charger = null;
    },
    clearClick() {
      this.clearParams();

      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneMonthAgo = new Date();
      oneMonthAgo.setMonth(current.getMonth() - 1);
      this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;

      this.cstGridDataProvider.clearRows();
    },
    rowStyleCallbackCheckStatus(grid, item, fixed) {
      var ret = {};
      var status = grid.getValue(item.index, '카세트상태');
      if (status == '검사완료') {
        ret.editable = false;
      }

      return ret;
    },
    onGetEditValueCstGrid(grid, index, result) {
      if (index.column === '검사결과' && result['value']) {
        if (_.isEmpty(this.dept) || _.isEmpty(this.inspectionCharger)) {
          result.value = '';
          this.$toast('info', '검사부서와 검사자를 입력 후 다시 검사결과를 변경하세요.');
          return;
        }
        grid.setValue(index.itemIndex, '검사부서', this.dept);
        grid.setValue(index.itemIndex, '검사자', this.inspectionCharger);
        let current = new Date();
        let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
        let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
        grid.setValue(index.itemIndex, '검사일자', cDate);
        grid.setValue(index.itemIndex, '검사시간', cTime);
      }
    },
    onEditRowPastedCstGrid(grid, itemIndex, row, fields, oldValues, newValues) {
      if (_.isEmpty(this.dept) || _.isEmpty(this.inspectionCharger)) {
        this.$toast('info', '검사부서와 검사자를 입력 후 다시 검사결과를 변경하세요.');
        grid.setValue(itemIndex, '검사결과', '');
        return;
      }
      let current = new Date();
      let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
      let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;

      fields.forEach((index) => {
        let fieldName = this.cstGridDataProvider.getFieldName(index);
        let fieldValue = newValues[index];
        if (fieldName === '검사결과' && (fieldValue == 'OK' || fieldValue == 'NG')) {
          grid.setValue(itemIndex, '검사부서', this.dept);
          grid.setValue(itemIndex, '검사자', this.inspectionCharger);
          grid.setValue(itemIndex, '검사일자', cDate);
          grid.setValue(itemIndex, '검사시간', cTime);
        }
      });
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

        this.cstGridView.checkRow(index.itemIndex, true);
        findCount++;
      }

      if (findCount == 0 && this.cstGridDataProvider.getRowCount() > 0) {
        const message = `Cst No을 찾을 수 없습니다.`;
        this.$toast('info', message);
      } else {
        // const message = `Cst No ${findCount}건이 선택되었습니다.`;
        // this.$toast('info', message);
      }

      this.params.cstNo = '';
      this.$refs.cstNoField.focus();
      this.$refs.cstNoField.select();
    },
  },
};
</script>
