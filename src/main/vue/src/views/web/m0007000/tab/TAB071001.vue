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
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="uploadClick">업로드</b-button>
          <b-button class="sub" @click="inspectionClick">검사신청</b-button>
          <b-button @click="deleteClick">삭제</b-button>
          <b-button class="main" @click="saveClick">저장</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="cstGrid" :uid="'cstGrid'" :rows="cstRows" style="height: 100%" />
      </div>
    </div>

    <UploadPopup ref="uploadPopup1" @closePopup="closePopup" />
  </v-container>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';

export default {
  props: {
    name: 'TAB071001',
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
      searchQueryId: 'M0007001_Sch1',
      updateQueryId: 'M0007001_Update1',
      deleteQueryId: 'M0007001_Delete1',
      inspectionQueryId: 'M0007001_U_Inspection1',
      templateFileNameMap: {
        TAB071000: '세정_카세트_대상_업로드_template',
        TAB071000_1: '강화_카세트_대상_업로드_template',
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
    this.cstGridView.setCheckableExpression("values['카세트상태'] = '불출대기'", true);
  },
  beforeUnmount() {},
  methods: {
    initialize() {
      var current = new Date();
      this.params.endDate = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`;
      var oneMonthAgo = new Date();
      oneMonthAgo.setMonth(current.getMonth() - 1);
      this.params.startDate = `${oneMonthAgo.getFullYear()}-${(oneMonthAgo.getMonth() + 1).toString().padStart(2, '0')}-${oneMonthAgo.getDate().toString().padStart(2, '0')}`;
    },
    initializeGrid() {
      this.cstGrid = _.cloneDeep(require(`@web/m0007000/js/TAB071001.js`));
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
    deleteClick() {
      this.cstGridView.commit();
      const checkedRows = this.cstGridView.getCheckedRows();
      if (checkedRows.length === 0) {
        this.$toast('info', '삭제할 행을 선택하세요.');
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (this.cstGridDataProvider.getRowState(itemIndex) === RowState.CREATED) {
            delItems.push(itemIndex);
          } else {
            this.cstGridDataProvider.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.cstGridDataProvider.removeRows(delItems);
      }
    },
    async saveClick() {
      this.cstGridView.commit();
      if (await this.saveData()) {
        this.clearParams();
        this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.delete.length <= 0 && saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.updateQueryId, data: saveData.update }],
        delete: [{ queryId: this.deleteQueryId, data: saveData.delete }],    
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', '저장되었습니다.');
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async inspectionClick() {
      let saveData = this.$refs.cstGrid.getSaveData();
      if (saveData.update.length > 0 || saveData.delete.length > 0) {
        this.$toast('info', '변경된 내용이 있습니다. 저장 후 선택하세요.');
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
        if ('불출대기' == this.cstGridDataProvider.getValue(dataRow, '카세트상태')) {
          updated.push(jsonRows[dataRow]);
        }
      });

      if (updated.length == 0) {
        this.$toast('info', '모두 불출대기 상태가 아닙니다.');
        return;
      }

      let param = {
        menuId: this.menuId,
        update: [{ queryId: this.inspectionQueryId, data: updated }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `검사대기 상태로 ${updated.length}건 변경되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    uploadClick() {
      let excelGrid = _.cloneDeep(require(`@web/m0007000/js/TAB071001Excel.js`));
      excelGrid.options.display.fitStyle = 'none'; // 엑셀다운로드시 none 아니면 width 0이 됨.
      this.$refs.uploadPopup1.openDialog({
        dialogTitle: '업로드 팝업',
        uploadApi: '/api/m0007000/m0007001/upload',
        headers: ['field1', 'field2', 'field3', 'field4', 'field5', 'field6', 'field7', 'field8', 'field9'],
        excelGrid,
        fileName: this.templateFileNameMap[this.pTabId],
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
    rowStyleCallbackCheckStatus(grid, item, fixed) {
      var ret = {};
      var status = grid.getValue(item.index, '카세트상태');
      if (status == '검사대기') {
        ret.editable = false;
      }

      return ret;
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
        if (this.cstGridView.getValue(index.itemIndex, '카세트상태') == '불출대기') {
          this.cstGridView.checkRow(index.itemIndex, true);
          findCount++;
        }
      }

      if (findCount == 0 && this.cstGridDataProvider.getRowCount() > 0) {
        const message = `Cst No을 찾을 수 없거나 불출 대기 상태가 아닙니다.`;
        this.$toast('info', message);
      } else {
        // const message = `Cst No ${findCount}건이 선택되었습니다.`;
        // this.$toast('info', message);
      }

      this.params.cstNo = '';
      this.$refs.cstNoField.focus();
      this.$refs.cstNoField.select();
    },
    onDataLoadComplatedCstGrid(grid) {},
  },
};
</script>
