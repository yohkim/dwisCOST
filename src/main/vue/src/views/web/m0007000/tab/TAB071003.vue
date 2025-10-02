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
      <div class="title">불출 입력 정보</div>
      <div class="row worker_info">
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="Department" v-model="dept" />
            <label for="floating">불출부서</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-80" id="floating" placeholder="ReleaseCharger" v-model="releaseCharger" />
            <label for="floating">불출담당자</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box material_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="fileAttach">시험성적서 조회</b-button>
          <b-button class="sub" @click="saveClick">임시저장</b-button>
          <b-button class="main" @click="inspectionClick">반입처리</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>
    <FileAttachPopup ref="fileAttachPopup1" />
  </v-container>
</template>

<script>
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import { RowState } from 'realgrid';

export default {
  name: 'TAB071003',
  props: {
    pTabId: {
      type: String, // props 타입을 문자열로 지정
      required: true, // 필수 prop으로 지정 (선택 사항)
    },
  },
  components: {},
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
      searchQueryId: 'M0007001_Sch3',
      updateQueryId: 'M0007001_Update3',
      inspectionQueryId: 'M0007001_U_Inspection3',
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
      releaseCharger: '',
      dept: '',
      isEditing: false,
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
      this.releaseCharger = this.userAuthInfo.loginUserName;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB071003.js`));
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
      this.isEditing = false;
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
        return;
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
      if (this.isEditing || saveData.update.length > 0) {
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
        if ('검사완료' == this.cstGridDataProvider.getValue(dataRow, '카세트상태') && !_.isEmpty(this.cstGridDataProvider.getValue(dataRow, '불출부서')) && !_.isEmpty(this.cstGridDataProvider.getValue(dataRow, '불출담당자')) && !_.isEmpty(this.cstGridDataProvider.getValue(dataRow, '불출일자')) && !_.isEmpty(this.cstGridDataProvider.getValue(dataRow, '불출시간'))) {
          updated.push(jsonRows[dataRow]);
        }
      });

      if (updated.length == 0) {
        this.$toast('info', '모두 대기 상태로 변경사항이 없습니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.inspectionQueryId, data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `검사완료 상태가 대기 상태로 ${updated.length}건 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    fileAttach() {
      let saveData = this.$refs.cstGrid.getSaveData();
      if (this.isEditing || saveData.update.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 임시저장 후 선택하세요.');
        return;
      }
      let rows = this.cstGridView.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다. 동일한 검사일자를 선택하세요.');
        return;
      }

      let inspectionDate = this.cstGridDataProvider.getValue(rows[0], '검사일자');
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
      let isModifyEnabled = false;
      console.log('curGroupId2=', curGroupId);
      this.$refs.fileAttachPopup1.openDialog({
        dialogTitle: '시험성적서 조회',
        groupId: curGroupId,
        isModifyEnabled: isModifyEnabled,
      });
    },
    closePopup() {
      this.clearClick();
      this.searchClick();
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
    onItemCheckedCstGrid(grid, itemIndex, checked) {
      if (checked) {
        if (_.isEmpty(grid.getValue(itemIndex, '불출부서'))) {
          if (_.isEmpty(this.dept) || _.isEmpty(this.releaseCharger)) {
            grid.checkItem(itemIndex, !checked);
            this.$toast('info', '불출부서와 불출담당자를 입력 후 다시 선택하세요.');
            return;
          }

          this.isEditing = true;

          grid.setValue(itemIndex, '불출부서', this.dept);
          grid.setValue(itemIndex, '불출담당자', this.releaseCharger);
          let current = new Date();
          let cDate = `${current.getFullYear()}${(current.getMonth() + 1).toString().padStart(2, '0')}${current.getDate().toString().padStart(2, '0')}`;
          let cTime = `${current.getHours().toString().padStart(2, '0')}${current.getMinutes().toString().padStart(2, '0')}${current.getSeconds().toString().padStart(2, '0')}`;
          grid.setValue(itemIndex, '불출일자', cDate);
          grid.setValue(itemIndex, '불출시간', cTime);
        }
      }
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
