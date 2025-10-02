<template>
  <b-modal class="dw_mes" v-model="isOpen" hide-footer size="xl" :title="params.dialogTitle" modal-class="cstChangeStatus" no-close-on-backdrop :style="{ zIndex: zIndex }" @close="closeDialog" centered>
    <div class="search_box mb-1">
      <b-row class="search_area">
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="" v-model="params.worker" />
            <label for="floating">작업자</label>
          </div>
        </b-col>
        <b-col cols="3">
          <div class="form-floating">
            <input autocomplete="off" type="text" class="form-control label-60" id="floating" placeholder="" v-model="params.status" :disabled="true" />
            <label for="floating">상태</label>
          </div>
        </b-col>
      </b-row>
    </div>
    <div class="grid_box">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <input autocomplete="off" type="number" class="form-control mx-2 text-center" style="width: 60px; height: 28px" v-model.number="newRowCnt" :min="1" />
          <b-button class="sub" @click="addRowClick">행추가</b-button>
          <!-- <b-button @click="delRowClick" class="ms-2">삭제</b-button> -->
          <b-button class="main" @click="saveClick">저장</b-button>
        </div>
      </div>
      <RealGrid ref="grid" :uid="'grid'" class="grid-border-none" :rows="cstChangStatusRows" style="height: 200px" />
    </div>
    <div class="bttn_wrap">
      <b-button block @click="closeDialog">닫기</b-button>
    </div>
  </b-modal>
</template>

<script>
import { RowState } from 'realgrid';

export default {
  name: 'CstChangeStatusPopup',
  setup() {},
  props: {},
  data() {
    return {
      isOpen: false,
      params: {
        dialogTitle: '카세트 상태 변경',
        worker: '',
        status: '대기',
      },
      zIndex: 0,
      rwList: [],
      cstChangStatusRows: [],
      grid: null,
      newRowCnt: 1,
    };
  },
  computed: {},
  created() {
    this.initializeGrid();
  },
  mounted() {
    this.gv().columnByName('cstNo').styleCallback = this.cellStyleCallback;
    this.gv().onValidateColumn = this.onValidateColumn;
  },
  methods: {
    openDialog(params) {
      Object.assign(this.params, params);
      this.isOpen = true;
      this.dp().setRows([]);
    },
    closeDialog() {
      this.gv().cancel();
      this.$zIndexManager.release();
      //this.zIndex = 0;
      this.isOpen = false;
    },
    gv() {
      return this.$refs[['grid']].getGridView();
    },
    dp() {
      return this.$refs['grid'].getGridDataProvider();
    },
    initializeGrid() {
      this.grid = _.cloneDeep(require(`@web/popup/js/CstChangeStatus.js`));
    },
    cellStyleCallback(grid, model) {
      let rtn = {};
      rtn['editable'] = model.item.rowState === RowState.CREATED;
      return rtn;
    },
    setCstNoFocus(r) {
      this.gv().setCurrent({ dataRow: r, fieldName: 'cstNo' });
      setTimeout(() => {
        this.gv().showEditor();
      }, 100);
    },
    addRowClick() {
      this.gv().commit();
      this.dp().setRows([]);
      for (let i = 0; i < this.newRowCnt; i++) {
        this.dp().addRow({});
      }
      // this.setCellIdFocus(0);
    },
    delRowClick() {
      let sr = this.gv().getSelectedItems(true);
      if (_.isEmpty(sr)) {
        this.$toast('info', '선택된 정보가 없습니다.');
        return;
      }
      this.dp().removeRow(sr[0]);
      //db 삭제여부 확인 필요
    },
    async saveClick() {
      //console.log(this.params);
      this.gv().commit();
      if (!this.$utils.validateFields(this.params, ['T:작업자:worker', 'S:상태:status'])) {
        return;
      }
      let rslt = this.gv().validateCells(null, false);

      if (rslt === null) {
        this.$confirmYesOrNo('선택', '저장 하시겠습니까?', (confirmed) => {
          if (confirmed) {
            this.save();
          }
        });
      }
    },
    async save() {
      if (_.isEmpty(this.dp().getDistinctValues('cstNo'))) return;
      let cstList = this.dp().getDistinctValues('cstNo').join(';');
      this.params['cstList'] = cstList;
      let param = { menuId: 'M0007005', queryId: 'execSaveCstChangeList', queryParams: this.params, target: this.cstChangStatusRows };
      await this.$axios.api.search(param).then(() => {
        this.$toast('info', '저장되었습니다.');
      });
    },
    onValidateColumn(grid, column, inserting, value, itemIndex, dataRow) {
      let error = {};
      if (column.fieldName === 'cstNo') {
        if (value === null || _.isEmpty(value)) {
          error.level = 'warning';
          error.message = 'Cst No 는 필수 입력입니다.';
          this.$toast('warn', itemIndex + '행 Cst No 는 필수 입력입니다.');
        }
      }
      return error;
    },
    onRowsPastedGrid(grid, items) {
      items.forEach((el) => {
        let newValue = this.$utils.korToEng(grid.getValue(el, 'cstNo'));
        grid.setValue(el, 'cstNo', newValue);
        this.checkCstNoByPasted(el, grid.getValue(el, 'cstNo'));
      });
    },
    async checkCstNoByPasted(row, cstNo) {
      this.params['cstNo'] = cstNo;
      //console.log("this.params:::",this.params);
      let param = { menuId: 'M0007005', queryId: 'searchCstNo', queryParams: this.params, target: null };
      let rslt = await this.$axios.api.search(param);
      let info = rslt[0];
      if (_.isEmpty(info) || info.length == 0) {
        this.$toast('warning', row + 1 + '행 ' + '카세트 마스터에 존재하지 않는 CST_NO 입니다.');
      } else {
        this.dp().setValue(row, '카세트상태', this.params.status);
      }
    },
    onCellEditedGrid(grid, itemIndex, row, field) {
      this.gv().commit();
      let newValue = this.$utils.korToEng(grid.getValue(row, 'cstNo'));
      grid.setValue(row, 'cstNo', newValue);
      this.checkCstNo(row, grid.getValue(row, 'cstNo'));
    },
    async checkCstNo(row, cstNo) {
      this.params['cstNo'] = cstNo;
      //console.log("this.params:::",this.params);
      let param = { menuId: 'M0007005', queryId: 'searchCstNo', queryParams: this.params, target: null };
      let rslt = await this.$axios.api.search(param);
      let info = rslt[0];
      if (_.isEmpty(info) || info.length == 0) {
        this.$toast('warning', '카세트 마스터에 존재하지 않는 CST_NO 입니다.');
        this.setCstNoFocus(row);
      } else {
        this.dp().setValue(row, '카세트상태', this.params.status);

        if (row + 1 < this.dp().getRowCount()) {
          //다음 로우가 있다면
          let ci = this.dp().getValue(row + 1, 'cstNo');
          if (ci === undefined) {
            this.setCstNoFocus(row + 1);
          }
        }
      }
    },
  },
};
</script>
<style>
.cstChangeStatus {
  top: 80px !important;
}
</style>
