/** * 자재관리 > 자재 마스터 > 자재 마스터 */
<template>
  <div>
    <div class="search_box">
      <b-row class="search_area"> </b-row>
      <div class="btn_area">
        <b-button @click="searchClick">
          <span class="ico_search"></span>
          조회
        </b-button>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button class="second" @click="excelClick">엑셀</b-button>
          <b-button class="sub" @click="addClick">추가</b-button>
          <b-button @click="delClick">삭제</b-button>
          <b-button class="main" @click="saveClick">저장</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="matMasterGrid" :uid="'matMasterGrid'" :step="'1'" :rows="gridRows" style="height: 100%" />
      </div>
    </div>
    <MatMasterPopup ref="matMasterPopup" @confirm="popupConfirm" />
  </div>
</template>

<script>
import { RowState } from 'realgrid';
import { useUserAuthInfo } from '@store/auth/userAuthInfo';
import MatMasterPopup from '@web/popup/MatMasterPopup.vue';
var clickState = null;

export default {
  name: 'TAB001701',
  props: {},
  components: {
    MatMasterPopup,
  },
  watch: {},
  setup() {
    const userAuthInfo = useUserAuthInfo();
    return { userAuthInfo };
  },
  data() {
    return {
      matMasterGrid: null,
      gridRows: [],
      isProcessing: false,
      menuId: 'M0001010',
      unitList: [],
      glassMatList: [],
      glassThickList: [],
      productSpecList: [],
      vendorList: [],
      validateEnable: false,
      clickedDataRow: -1,
      clickedFieldName: '',
      majCodeMap: {
        자재단위: '01',
        자재재질: '09',
        자재두께: '11',
        자재규격: '34',
      },
      useColumnMap: {
        자재단위: 'code',
        자재재질: 'codeName',
        자재두께: 'codeName',
        자재규격: 'codeName',
      },
    };
  },
  computed: {
    gridView() {
      return this.$refs.matMasterGrid.getGridView();
    },
    dataProvider() {
      return this.$refs.matMasterGrid.getGridDataProvider();
    },
    menuList() {
      return this.userAuthInfo.getSysResourceMap.childSysResc;
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.getSelectOptions();
  },
  beforeUnmount() {},
  methods: {
    initializeGrid() {
      this.matMasterGrid = _.cloneDeep(require(`@web/m0001000/js/TAB001701.js`));
    },
    async getSelectOptions() {
      // await this.$utils.getCommonCodeValueText(['01'], [this.unitList]); //단위
      // await this.$utils.getCommonCodeValueText(['09'], [this.glassMatList]); //글라스재질
      // await this.$utils.getCommonCodeValueText(['11'], [this.glassThickList]); //글라스두께
      // await this.$utils.getCommonCodeValueText(['34'], [this.productSpecList]); //제품규격

      // let param = { menuId: 'M0006003', queryId: 'getVendorMstList', queryParams: null, target: this.vendorList };
      // await this.$axios.api.search(param);

      // this.gridView.columnByName('자재단위').values = [...this.unitList.map((v) => v.value)];
      // this.gridView.columnByName('자재단위').labels = [...this.unitList.map((v) => v.value + ' ' + v.text)];

      // this.gridView.columnByName('자재재질').values = [...this.glassMatList.map((v) => v.text)];

      // this.gridView.columnByName('자재두께').values = [...this.glassThickList.map((v) => v.text)];

      // this.gridView.columnByName('자재규격').values = [...this.productSpecList.map((v) => v.text)];

      // this.gridView.columnByName('매입처').values = [...this.vendorList.map((v) => v['거래처코드'])];
      // this.gridView.columnByName('매입처').labels = [...this.vendorList.map((v) => v['거래처코드'] + ' ' + v['거래처명'])];
    },
    searchClick() {
      if (this.isProcessing) return;
      this.isProcessing = true;

      this.$nextTick(async () => {
        this.gridView.commit();
        this.dataProvider.clearRows();

        let params = {};

        let searchParam = {
          menuId: this.menuId,
          queryId: 'M0001010_Sch1',
          queryParams: params,
          target: this.gridRows,
        };

        await this.$axios.api.search(searchParam);
      });
      setTimeout(() => {
        this.isProcessing = false;
      }, 1000);
    },
    async saveClick() {
      this.gridView.commit();
      if (await this.saveData()) {
        this.searchClick();
      }
    },
    async saveData() {
      let result = false;
      let saveData = this.$refs.matMasterGrid.getSaveData();

      if (saveData.delete.length <= 0 && saveData.insert.length <= 0 && saveData.update.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return false;
      }

      this.validateEnable = true;
      let ret = this.gridView.validateCells(null, false);
      this.validateEnable = false;
      if (!_.isEmpty(ret)) {
        return false;
      }

      let param = {
        menuId: this.menuId,
        delete: [{ queryId: 'M0001010_Delete1', data: saveData.delete }],
        insert: [{ queryId: 'M0001010_Insert1', data: saveData.insert }],
        update: [{ queryId: 'M0001010_Update1', data: saveData.update }],
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
    addClick() {
      this.gridView.commit();
      this.addRow();
    },
    addRow() {
      this.dataProvider.addRow({ 단가: 0, 공급단위: 0, 사용량Cell: 0, 사용여부: 1 });
      let itemIdx = this.gridView.getItemCount() - 1;
      this.gridView.setCurrent({ itemIndex: itemIdx });
    },
    delClick() {
      this.gridView.commit();
      const checkedRows = this.gridView.getCheckedRows();
      if (checkedRows.length === 0) {
        this.$toast('info', '삭제할 행을 선택하십시요!');
      } else {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (this.dataProvider.getRowState(itemIndex) === RowState.CREATED) {
            delItems.push(itemIndex);
          } else {
            this.dataProvider.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.dataProvider.removeRows(delItems);
      }
    },
    popupConfirm(val) {
      this.dataProvider.setValue(this.clickedDataRow, this.clickedFieldName, val);
      this.$refs.matMasterPopup.closeDialog();
    },
    async excelClick() {
      const grid = this.gridView;

      const now = new Date();
      const yyyymmdd = this.$utils.getTodayDate('');

      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const fileName = `자재_마스터_${yyyymmdd}_${hours}${minutes}${seconds}.xlsx`;

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
    findRowInGrid(matCode) {
      if (_.isEmpty(matCode)) return 0;

      let fields = ['자재코드'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: matCode,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.gridView.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    onValidateColumnMatMasterGrid(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if (!this.validateEnable) return error;

      if (this.$utils.containsValue(['자재코드', '자재품명', '단가', '공급단위', '사용량Cell', '사용여부'], column.fieldName)) {
        if (_.isNil(value)) {
          error.level = 'warning';
          error.message = '필수 입력입니다.';
        }
      }

      if (this.$utils.containsValue(['자재단위'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 2) {
          error.level = 'warning';
          error.message = '2글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['매입처'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 5) {
          error.level = 'warning';
          error.message = '5글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['자재코드', '호환코드'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 6) {
          error.level = 'warning';
          error.message = '6글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['납기'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 10) {
          error.level = 'warning';
          error.message = '10글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['pCode', '자재재질', '자재두께'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 20) {
          error.level = 'warning';
          error.message = '20글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['사용처'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 30) {
          error.level = 'warning';
          error.message = '30글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['자재규격', '비고'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 50) {
          error.level = 'warning';
          error.message = '50글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['자재품명'], column.fieldName)) {
        if (!_.isEmpty(value) && value.length > 60) {
          error.level = 'warning';
          error.message = '60글자까지 입력가능합니다.';
        }
      }

      if (this.$utils.containsValue(['자재코드'], column.fieldName)) {
        if (!_.isNil(value) && this.findRowInGrid(value) > 1) {
          error.level = 'error';
          error.message = '자재코드 중복되었습니다. 중복이 허용되지 않습니다.';
        }
      }

      return error;
    },
    onCellClickedMatMasterGrid(grid, clickData) {
      clearTimeout(clickState);
      if (clickData.cellType !== 'data') return;

      clickState = setTimeout(() => {
        this.clickedDataRow = clickData.dataRow;
        this.clickedFieldName = clickData.fieldName;

        let clickedValue = this.dataProvider.getValue(clickData.dataRow, clickData.fieldName);

        if (this.$utils.containsValue(['자재재질', '자재두께', '자재규격', '자재단위'], clickData.fieldName)) {
          let params = {
            dialogTitle: `${clickData.fieldName} 선택`,
            popUpSize: 'lg',
            gridJs: `MatMasterPopup.js`,
            clickedValue: clickedValue,
            useColumn: this.useColumnMap[clickData.fieldName],
            search: { menuId: 'M0006002', queryId: 'getGrid2Data', queryParams: { majCode: this.majCodeMap[clickData.fieldName] } },
          };
          this.$refs.matMasterPopup.openDialog(params);
        } else if (this.$utils.containsValue(['매입처'], clickData.fieldName)) {
          let params = {
            dialogTitle: `${clickData.fieldName} 선택`,
            popUpSize: 'lg',
            gridJs: `MatMasterPopup2.js`,
            clickedValue: clickedValue,
            useColumn: '거래처코드',
            search: { menuId: 'M0006003', queryId: 'getVendorMstList', queryParams: null },
          };
          this.$refs.matMasterPopup.openDialog(params);
        }
      }, 200);
    },
    onCellDblClickedMatMasterGrid(grid, clickData) {
      clearTimeout(clickState);
    },
    ClearClickState() {
      clearTimeout(clickState);
      clickState = null;
    },
    onDataLoadComplatedMatMasterGrid(grid) {},
  },
};
</script>
