<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle" no-close-on-backdrop :style="{zIndex: zIndex }" @close="closeDialog" centered>
    <div class="search_box mb-1">
      <b-row class="search_area">
        <b-col cols="3">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.charger">
              <option v-for="type in chargerList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">담당자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.approver">
              <option v-for="type in approverList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">승인자</label>
          </div>
        </b-col>
        <b-col cols="3" class="d-flex">
          <div class="form-floating">
            <select class="form-select label-60" id="floatingSelect" aria-label="Floating label select example" v-model="params.deleteReason">
              <option v-for="type in deleteReasonList" :key="type.value" :value="type">
                {{ type.text }}
              </option>
            </select>
            <label for="floatingSelect" class="select">삭제이유</label>
          </div>
          <b-button class="sub" @click="setAllDeleteReason">일괄적용</b-button>
        </b-col>
      </b-row>
    </div>
    <div class="rg-body mb-2">
      <table class="rg-table">
        <colgroup>
          <col span="2" style="width: 25%" />
          <col span="3" style="width: calc(50% / 3)" />
        </colgroup>
        <thead>
          <tr>
            <th rowspan="5">RUN NO</th>
            <th rowspan="5">ORIGIN NO</th>
            <th rowspan="3">수량</th>
            <th rowspan="3">남은수량</th>
            <th rowspan="3">삭제수량</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ params.runNo }}</td>
            <td>{{ params.originNo }}</td>
            <td>{{ params.qty }}</td>
            <td>{{ params.remainQty }}</td>
            <td>{{ params.deleteQty }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="grid_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button @click="cancelClick" :disabled="isButtonDisabled">취소</b-button>
          <b-button @click="saveClick" class="main ms-2">처리</b-button>
        </div>
      </div>
      <b-row class="row" style="height: 380px">
        <b-col cols="6" class="brd_r">
          <div class="grid-border-none brd_r">
            <RealGrid ref="grid1" :uid="'grid1'" :rows="grid1Rows" style="height: 100%" />
          </div>
        </b-col>
        <b-col cols="6">
          <div class="grid-border-none brd_l">
            <RealGrid ref="grid2" :uid="'grid2'" :rows="grid2Rows" style="height: 100%" />
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import { RowState } from 'realgrid';

export default {
  name: 'originMgtPopupPopup',
  setup() {},
  props: {},
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: '메뉴얼 수량수정',
        runNo: '',
        originNo: '',
        qty: 0,
        remainQty: 0,
        deleteQty: 0,
        charger: '',
        approver: '',
        deleteReason: '',
      },
      zIndex: 0,
      grid1: null,
      grid2: null,
      grid1Rows: [],
      grid2Rows: [],
      // newRowCnt:1,
      chargerList: [],
      approverList: [],
      deleteReasonList: [],
      saveButtonVisible: false,
      isButtonDisabled: true,
      qtyResult: { runNo: '', originNo: '', qty: 0, remainQty: 0, deleteQty: 0 },
    };
  },
  computed: {
    grid1View() {
      return this.$refs.grid1.getGridView();
    },
    grid2View() {
      return this.$refs.grid2.getGridView();
    },
    data1Provider() {
      return this.$refs.grid1.getGridDataProvider();
    },
    data2Provider() {
      return this.$refs.grid2.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.grid2View.checkBar.checkableCallback = this.checkableCallback;
  },
  methods: {
    initializeGrid() {
      this.grid1 = _.cloneDeep(require(`@web/popup/js/OriginMgtPopupGrid1.js`));
      this.grid2 = _.cloneDeep(require(`@web/popup/js/OriginMgtPopupGrid2.js`));
    },
    openDialog(params) {
      Object.assign(this.params, params);
      this.$nextTick(async () => {
        await this.$utils.getCommonCodeValueText(['58'], [this.chargerList]); //담당자
        await this.$utils.getCommonCodeValueText(['59'], [this.approverList]); //승인자
        await this.$utils.getCommonCodeValueText(['61'], [this.deleteReasonList]); //삭제이유

        this.grid1View.clearCurrent();
        this.data1Provider.clearRows();
        this.grid2View.clearCurrent();
        this.data2Provider.clearRows();

        const values = [];
        this.deleteReasonList.forEach((item) => {
          values.push(item.text);
        });
        this.grid2View.columnByName('remark').values = values;

        const splitOrigin = !_.isEmpty(this.params.originNo) ? this.params.originNo.split('-') : '';
        let lastIndex = splitOrigin.length - 1;
        const originNo = splitOrigin[lastIndex];

        let params = {
          runNo: !_.isEmpty(this.params.runNo) ? this.params.runNo : '',
          originNo: !_.isEmpty(originNo) ? originNo : '',
          runNoOriginNo: !_.isEmpty(this.params.originNo) ? this.params.originNo : '',
        };
        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_ManualQty_Sch1',
            queryParams: params,
            target: this.grid1Rows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_ManualQty_Sch2',
            queryParams: params,
            target: this.grid2Rows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_ManualQty_Sch3',
            queryParams: params,
            target: this.qtyResult,
          },
        ];

        await this.$axios.api.searchAll(searchParam);

        if (this.data1Provider.getRowCount() == 0 && this.data2Provider.getRowCount() == 0) {
          this.$alert('알림', '해당 ORIGIN_NO는 생산CELL이 없습니다.', () => {
            this.closeDialog();
          });
        }

        this.params.qty = this.qtyResult.qty;
        this.params.remainQty = this.qtyResult.remainQty;
        this.params.deleteQty = this.qtyResult.deleteQty;

        this.data2Provider.addRow({});
        this.setCellNoFocus(this.grid2View.getItemCount() - 1);

        this.isOpen = true;
      });
    },
    closeDialog() {
      this.grid1View.cancel();
      this.grid2View.cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    search() {
      this.$nextTick(async () => {
        this.grid1View.clearCurrent();
        this.data1Provider.clearRows();
        this.grid2View.clearCurrent();
        this.data2Provider.clearRows();

        const splitOrigin = !_.isEmpty(this.params.originNo) ? this.params.originNo.split('-') : '';
        let lastIndex = splitOrigin.length - 1;
        const originNo = splitOrigin[lastIndex];

        let params = {
          runNo: !_.isEmpty(this.params.runNo) ? this.params.runNo : '',
          originNo: !_.isEmpty(originNo) ? originNo : '',
          runNoOriginNo: !_.isEmpty(this.params.originNo) ? this.params.originNo : '',
        };
        let searchParam = [
          {
            menuId: 'M0003009',
            queryId: 'M0003009_ManualQty_Sch1',
            queryParams: params,
            target: this.grid1Rows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_ManualQty_Sch2',
            queryParams: params,
            target: this.grid2Rows,
          },
          {
            menuId: 'M0003009',
            queryId: 'M0003009_ManualQty_Sch3',
            queryParams: params,
            target: this.qtyResult,
          },
        ];

        await this.$axios.api.searchAll(searchParam);

        if (this.data1Provider.getRowCount() == 0 && this.data2Provider.getRowCount() == 0) {
          this.$alert('알림', '해당 ORIGIN_NO는 생산CELL이 없습니다.', () => {
            this.closeDialog();
          });
        }

        this.params.qty = this.qtyResult.qty;
        this.params.remainQty = this.qtyResult.remainQty;
        this.params.deleteQty = this.qtyResult.deleteQty;

        this.data2Provider.addRow({});
        this.setCellNoFocus(this.grid2View.getItemCount() - 1);
      });
    },
    setAllDeleteReason() {
      if (_.isEmpty(this.params.deleteReason) || _.isEmpty(this.params.deleteReason.text)) {
        this.$toast('info', '삭제이유를 선택 후 다시 일괄적용을 눌러주세요.');
        return;
      }

      let isEmptyCellId = true;
      let cnt = this.grid2View.getItemCount();
      for (let i = 0; i < cnt; i++) {
        let cellId = this.data2Provider.getValue(i, 'cellId');
        if (this.data2Provider.getRowState(i) === RowState.CREATED && !_.isEmpty(cellId)) {
          this.data2Provider.setValue(i, 'remark', this.params.deleteReason.text);
          isEmptyCellId = false;
        }
      }

      if (isEmptyCellId) {
        this.$toast('info', '입력된 CELL NO가 존재하지 않아 삭제이유가 일괄적용되지 않았습니다.');
        return;
      }
    },
    async saveClick() {
      this.grid2View.commit();
      let insert = this.checkAndGetSaveList();
      if (insert != null && insert.length > 0) {
        this.$confirm('확인', `${insert.length}셀 삭제 하시겠습니까?`, async (confirmed) => {
          if (confirmed) {
            if (await this.saveData(insert)) {
              this.search();
            }
          }
        });
      }
    },
    async cancelClick() {
      let rows = this.grid2View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return;
      }

      this.$confirm('확인', `${rows.length}셀 원복 하시겠습니까?`, async (confirmed) => {
        if (confirmed) {
          if (await this.cancelData()) {
            this.search();
          }
        }
      });
    },
    checkAndGetSaveList() {
      const empty = [];
      const insert = [];
      let saveData = this.$refs.grid2.getSaveData();
      if (saveData.insert.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return empty;
      }
      if (_.isEmpty(this.params.charger) || _.isEmpty(this.params.charger.text) || _.isEmpty(this.params.approver) || _.isEmpty(this.params.approver.text)) {
        this.$toast('info', '담당자와 승인자를 선택하고 다시 처리를 눌러주세요.');
        return empty;
      }

      let isEmptyReason = false;
      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item.cellId)) {
          insert.push(item);
          item.originNo = !_.isEmpty(this.params.originNo) ? this.params.originNo : '';
          item.charger = !_.isEmpty(this.params.charger) ? this.params.charger.text : '';
          item.approver = !_.isEmpty(this.params.approver) ? this.params.approver.text : '';
          if (_.isEmpty(item.remark)) {
            isEmptyReason = true;
          }
        }
      });

      if (insert.length <= 0) {
        this.$toast('info', '변경된 내용이 없습니다.');
        return empty;
      }

      if (isEmptyReason) {
        this.$toast('info', '삭제이유를 모두 입력 후 다시 처리를 눌러주세요.');
        return empty;
      }

      return insert;
    },
    async saveData(insert) {
      let result = false;
      let param = {
        menuId: 'M0003009',
        insert: [{ queryId: 'M0003009_ManualQty_Update', data: insert }],
      };

      const resp = await this.$axios.api.saveData(param);
      if (resp.status === 'success') {
        this.$toast('success', `${insert.length}건 처리되었습니다.`);
        result = true;
      } else {
        this.$toast('error', resp.message);
      }

      return result;
    },
    async cancelData() {
      let result = false;
      let rows = this.grid2View.getCheckedRows(false);
      if (rows.length == 0) {
        this.$toast('info', '체크된 내용이 없습니다.');
        return result;
      }

      const addItems = [];
      rows.forEach((dataRow) => {
        addItems.push(this.data2Provider.getValue(dataRow, 'cellId'));
      });
      if (addItems.length == 0) {
        this.$toast('info', '원복할 Cell이 없습니다.');
        return result;
      }
      let params = {
        originNo: !_.isEmpty(this.params.originNo) ? this.params.originNo : '',
        cellList: addItems.join(','),
      };

      let searchParam = {
        menuId: 'M0003009',
        queryId: 'M0003009_ManualQty_Cancel',
        queryParams: params,
        target: null,
      };

      const resp = await this.$axios.api.search(searchParam);
      if (resp != null && resp.length > 0 && !_.isNil(resp[0].errormessage)) {
        this.$toast('error', resp[0].errormessage);
      } else if (resp != null && resp.length > 0 && !_.isNil(resp[0].message)) {
        this.$toast('info', resp[0].message);
      } else {
        this.$toast('info', `${addItems.length}건 원복처리되었습니다.`);
        result = true;
      }

      return result;
    },
    setCellNoFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: 'cellId' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    setRemarkFocus(r) {
      this.grid2View.setCurrent({ dataRow: r, fieldName: 'remark' });
      setTimeout(() => {
        this.grid2View.showEditor();
      }, 100);
    },
    findRowInGrid1(cellId) {
      if (_.isEmpty(cellId)) return 0;

      let fields = ['cellId'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: cellId,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid1View.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    findRowInGrid2(cellId) {
      if (_.isEmpty(cellId)) return 0;

      let fields = ['cellId'];
      let startIndex = 0;
      let startFieldIndex = 0;
      let findCount = 0;
      while (true) {
        let options = {
          fields: fields,
          value: cellId,
          startIndex: startIndex,
          startFieldIndex: startFieldIndex,
          allFields: true,
          wrap: false,
          caseSensitive: false,
          partialMatch: false,
        };
        let index = this.grid2View.searchCell(options);
        if (index == null) break;

        startIndex = index.itemIndex + 1;
        startFieldIndex = 0;
        findCount++;
      }
      return findCount;
    },
    onRowsPastedGrid2(grid, items) {
      items.forEach((row) => {
        this.checkCellNo(grid, row);
      });
      let saveData = this.$refs.grid2.getSaveData();
      const insert = [];
      saveData.insert.forEach((item) => {
        if (!_.isEmpty(item.cellId)) {
          insert.push(item);
        }
      });
      this.params.remainQty = this.qtyResult.remainQty - insert.length;
      this.params.deleteQty = this.qtyResult.deleteQty + insert.length;
    },
    checkCellNo(grid, row) {
      let newValue = this.$utils.korToEng(grid.getValue(row, 'cellId'));
      grid.setValue(row, 'cellId', newValue);
      if (!_.isEmpty(newValue)) {
        let grid2FindCnt = this.findRowInGrid2(newValue);
        if (grid2FindCnt > 1) {
          this.$toast('info', `${row + 1}행 CELL NO는 중복되었습니다.`);
          grid.setValue(row, 'cellId', '');
        } else {
          let grid1FindCnt = this.findRowInGrid1(newValue);
          if (grid1FindCnt == 0) {
            this.$toast('info', `${row + 1}행 CELL NO가 왼쪽 List에 존재하지 않습니다.`);
            grid.setValue(row, 'cellId', '');
          } else {
          }
        }
      } else {
        grid.setValue(row, 1, '');
      }
    },
    onCellEditedGrid2(grid, itemIndex, row, field) {
      this.grid2View.commit();
      if (field == 0) {
        let newValue = this.$utils.korToEng(grid.getValue(row, field));
        grid.setValue(row, field, newValue);
        if (!_.isEmpty(newValue)) {
          let grid2FindCnt = this.findRowInGrid2(newValue);
          if (grid2FindCnt > 1) {
            this.$toast('info', '해당 CELL NO는 중복되었습니다.');
            grid.setValue(row, field, '');
            this.setCellNoFocus(row);
          } else {
            let grid1FindCnt = this.findRowInGrid1(newValue);
            if (grid1FindCnt == 0) {
              this.$toast('info', '해당 CELL NO가 왼쪽 List에 존재하지 않습니다.');
              grid.setValue(row, field, '');
              this.setCellNoFocus(row);
            } else {
              this.setRemarkFocus(row);
            }
          }
        } else {
          grid.setValue(row, 1, '');
        }
        let saveData = this.$refs.grid2.getSaveData();
        const insert = [];
        saveData.insert.forEach((item) => {
          if (!_.isEmpty(item.cellId)) {
            insert.push(item);
          }
        });
        this.params.remainQty = this.qtyResult.remainQty - insert.length;
        this.params.deleteQty = this.qtyResult.deleteQty + insert.length;
      } else {
        if (!_.isEmpty(grid.getValue(this.grid2View.getItemCount() - 1, 'cellId'))) {
          this.data2Provider.addRow({});
        }
        this.setCellNoFocus(this.grid2View.getItemCount() - 1);
      }
    },
    onItemCheckedGrid2(grid, itemIndex, checked) {
      let rows = this.grid2View.getCheckedRows(false);
      if (rows.length > 0) {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
      }
    },
    onItemAllCheckedGrid2(grid, checked) {
      let rows = this.grid2View.getCheckedRows(false);
      if (rows.length > 0) {
        this.isButtonDisabled = false;
      } else {
        this.isButtonDisabled = true;
      }
    },
    checkableCallback(dataSource, item) {
      if (item.rowState == 'created' || item.itemState == 'appending' || item.itemState == 'inserting') {
        return false;
      } else {
        return true;
      }
    },
    onDataLoadComplatedGrid1(grid) {},
    onDataLoadComplatedGrid2(grid) {},
  },
};
</script>
<style scoped>
.rg-body {
  border: 1px solid #b0bacc;
  border-bottom: 0 !important;
}
td,
th {
  text-align: center;
  padding: 4px;
}
td:last-child,
th:last-child {
  border-right: 0 !important;
}
th {
  border-top: none;
  border-right: 1px solid #d2d5da;
  border-bottom: 1px solid #d2d5da;
  border-left: none;
  height: 0px;
  background: #eef3f9;
}
.grid-border-none {
  height: 100% !important;
}
</style>
