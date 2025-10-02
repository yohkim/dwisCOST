/* * 제조 실적 관리 > LotNo 변경관리 */
<template>
  <div>
    <div class="worker_wrap">
      <div class="title">입력 정보</div>
      <div class="row worker_info">
        <b-col cols="1" style="width: 13% !important">
          <div class="form-floating">
            <select class="form-select label-90" id="floatingSelect" v-model="newLotSelectedModel" @change="onNewLotModelChange">
              <option v-for="model in modelList" :key="model.value" :value="model">{{ model.text }}</option>
            </select>
            <label for="floatingSelect" class="select">신Lot제품유형</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-60" id="floating" v-model="poNo" @click="popupPoNo" autocomplete="off" readonly />
            <label for="floating">PO NO</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-60" id="floating" v-model="productCode" autocomplete="off" disabled />
            <label for="floating">제품코드</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-60" id="floating" v-model="manager" @click="popupManager" autocomplete="off" readonly />
            <label for="floating">담당자</label>
          </div>
        </b-col>
        <b-col cols="2">
          <div class="form-floating">
            <input type="text" class="form-control label-60" id="floating" v-model="remarks" autocomplete="off" />
            <label for="floating">변환사유</label>
          </div>
        </b-col>
      </div>
    </div>
    <div class="grid_box search_onerow">
      <div class="left_box">
        <div class="btn_wrap ms-auto">
          <b-button @click="openChangeLotNoPopup" class="main">구LotNo 리스트 불러오기</b-button>
          <b-button @click="getLotList" class="main">신LotNo 리스트 불러오기</b-button>
          <b-button @click="deleteRow">삭제</b-button>
          <b-button @click="setAllChangeReason" :disabled="isDisabled" class="sub"><span></span>변환사유일괄적용</b-button>
          <b-button @click="processAddRow" :disabled="isDisabled" class="main"><span></span>처리</b-button>
        </div>
      </div>
      <div class="grid-border-none">
        <RealGrid ref="lotChangeGrid" :uid="'lotChangeGrid'" :rows="rows" style="height: 100%" />
      </div>
    </div>
    <CmDialog1 ref="cmDialog1M0004002" @confirm="handleConfirm" />
    <ChangeLotNoPopup ref="changeLotNoPopup" @confirm="handleOldLotNoConfirm" />
  </div>
</template>
<script>
import moment from 'moment';
import { RowState } from 'realgrid';
import ChangeLotNoPopup from '@web/popup/ChangeLotNoPopup.vue';

export default {
  name: 'DW_M0004002',
  props: {},
  components: { ChangeLotNoPopup },
  data() {
    return {
      modelList: [],
      oldLotSelectedModel: null,
      newLotSelectedModel: null,
      prevModel: null,
      curProcess: null,
      poNo: null,
      productCode: null,
      manager: null,
      remarks: null,
      lotChangeGrid: null,
      rows: [],
      newLotList: [],
      isDisabled: true,
    };
  },
  computed: {
    GV() {
      return this.$refs.lotChangeGrid.getGridView();
    },
    DP() {
      return this.$refs.lotChangeGrid.getGridDataProvider();
    },
  },
  created() {
    this.initializeGrid();
  },
  async mounted() {
    this.$eventBus.on('M0004002MenuMove', this.menuMove);
    this.getSelectOptions();
  },
  beforeUnmount() {
    this.$eventBus.off('M0004002MenuMove');
  },
  methods: {
    initPoNo() {
      this.poNo = null;
    },
    menuMove(data) {
      this.$nextTick(() => {});
    },
    async getSelectOptions() {
      let param = {
        menuId: 'M0004002',
        queryId: 'getModels',
        callback: (data) => {
          this.$utils.transformData(data, ['value', 'text'], ['코드', '제품유형'], this.modelList);
        },
      };
      await this.$axios.api.search(param);
    },
    async initializeGrid() {
      this.lotChangeGrid = _.cloneDeep(require(`@web/m0004000/js/TAB040004.js`));
    },
    deleteRow() {
      this.GV.commit();
      const checkedRows = this.GV.getCheckedRows();
      if (checkedRows.length > 0) {
        let delItems = [];
        checkedRows.forEach((itemIndex) => {
          if (this.DP.getRowState(itemIndex) === RowState.CREATED) {
            delItems.push(itemIndex);
          } else {
            this.DP.setRowState(itemIndex, RowState.DELETED);
          }
        });
        this.DP.removeRows(delItems);
      }
    },
    onNewLotModelChange() {
      if (!_.isEmpty(this.prevModel) && !_.isEmpty(this.newLotSelectedModel) && this.prevModel != this.newLotSelectedModel.text && !_.isEmpty(this.poNo)) {
        this.poNo = null;
        this.productCode = null;
        this.$toast('info', '신Lot제품유형이 변경되어 PO NO 재선택이 필요합니다.');
      }
      this.prevModel = this.newLotSelectedModel.text;
    },
    async getLotList() {
      this.GV.commit();
      let ret = true;
      let errorMsg = '';
      if (this.DP.getRowCount() <= 0) {
        ret = false;
        errorMsg += '구LotNo 리스트가 존재하지 않습니다.구LotNo 리스트 불러오기를 진행하세요.\n';
      }
      if (_.isEmpty(this.newLotSelectedModel) || _.isEmpty(this.newLotSelectedModel.text)) {
        ret = false;
        errorMsg += '신Lot제품유형을 선택하세요.\n';
      }

      if (_.isEmpty(this.poNo)) {
        ret = false;
        errorMsg += 'PO NO를 선택하세요.\n';
      }

      if (_.isEmpty(this.manager)) {
        ret = false;
        errorMsg += '담당자를 입력하세요.\n';
      }

      if (!ret) {
        this.$toast('info', errorMsg);
        return ret;
      }

      let rowCount = this.DP.getRowCount();

      let searchParams = {
        poNo: this.poNo,
        count: rowCount,
      };
      let param = {
        menuId: 'M0004002',
        queryId: 'getNewLotNoList',
        queryParams: searchParams,
        target: this.newLotList,
      };
      await this.$axios.api.search(param);

      let newLotListNotEmpty = [];

      if (this.newLotList != null) {
        this.newLotList.forEach((item) => {
          if (!_.isEmpty(item.lotNo)) newLotListNotEmpty.push(item);
        });
      }

      let date = this.getTodayDate();

      if (rowCount >= newLotListNotEmpty.length) {
        newLotListNotEmpty.forEach((item, index) => {
          this.DP.setValue(index, 'poNo', this.poNo);
          this.DP.setValue(index, '신lotNo', item.lotNo);
          this.DP.setValue(index, '처리수량', item['수량']);
          this.DP.setValue(index, '변경일자', date);
          this.DP.setValue(index, '담당자', this.manager);
          this.DP.setValue(index, '변환사유', this.remarks);
        });
      } else {
        for (let i = 0; i < rowCount; i++) {
          this.DP.setValue(i, 'poNo', this.poNo);
          this.DP.setValue(i, '신lotNo', newLotListNotEmpty[i]['lotNo']);
          this.DP.setValue(i, '처리수량', newLotListNotEmpty[i]['수량']);
          this.DP.setValue(i, '변경일자', date);
          this.DP.setValue(i, '담당자', this.manager);
          this.DP.setValue(i, '변환사유', this.remarks);
        }

        for (let i = rowCount; i < newLotListNotEmpty.length; i++) {
          this.DP.addRow({
            poNo: this.poNo,
            신lotNo: newLotListNotEmpty[i]['lotNo'],
            처리수량: newLotListNotEmpty[i]['수량'],
            변경일자: date,
            담당자: this.manager,
            변환사유: this.remarks,
          });
        }
      }

      if (this.DP.getRowCount() > 0) {
        await this.confirmAddRow();
        this.isDisabled = false;
      } else {
        this.$toast('info', '리스트가 존재하지 않습니다.\n구LotNo 리스트 불러오기, 입력 정보를 변경 후 신LotNo 리스트 불러오기를 다시 눌러주세요.');
        this.isDisabled = true;
      }
    },
    async confirmAddRow() {
      if (this.DP.getRowCount() > 0) {
        let jsonRows = this.DP.getJsonRows(0, -1);
        jsonRows.forEach(async (row, index) => {
          let params = {
            oldLotNo: row['구lotNo'],
            newLotNo: row['신lotNo'],
            process: row['공정코드'],
          };
          let searchParam = {
            menuId: 'M0004002',
            queryId: 'checkLotChangable',
            queryParams: params,
          };

          let result = await this.$axios.api.search(searchParam);
          if (result != null && result.length > 0) {
            this.DP.setValue(index, 'Lot변경가능여부', result[0]['lot변경가능여부']);
          }
        });
      } else {
        this.$toast('info', 'Lot변경가능여부 확인할 행이 없습니다.');
      }
    },
    async confirmRow(row, jsonRow) {
      let params = {
        oldLotNo: jsonRow['구lotNo'],
        newLotNo: jsonRow['신lotNo'],
        process: jsonRow['공정코드'],
      };
      let searchParam = {
        menuId: 'M0004002',
        queryId: 'checkLotChangable',
        queryParams: params,
      };

      let result = await this.$axios.api.search(searchParam);
      if (result != null && result.length > 0) {
        this.DP.setValue(row, '공정코드', this.curProcess);
        this.DP.setValue(row, '처리수량', result[0]['fromcell']);
        this.DP.setValue(row, 'Lot변경가능여부', result[0]['lot변경가능여부']);
        this.DP.setValue(row, '변경일자', this.getTodayDate());
        this.DP.setValue(row, '담당자', this.manager);
        this.DP.setValue(row, '변환사유', this.remarks);
      }

      if (this.DP.getRowCount() > 0) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    },
    setAllChangeReason() {
      this.GV.commit();
      let ret = true;
      let errorMsg = '';
      if (this.DP.getRowCount() <= 0) {
        ret = false;
        errorMsg += '변경 리스트가 존재하지 않아 변환사유가 일괄적용되지 않았습니다.\n';
      }
      if (_.isEmpty(this.remarks)) {
        ret = false;
        errorMsg += '입력 정보 변환사유를 입력 후 다시 일괄적용을 눌러주세요.';
      }

      if (!ret) {
        this.$toast('info', errorMsg);
        return ret;
      }

      let jsonRows = this.DP.getJsonRows(0, -1);
      jsonRows.forEach(async (row, index) => {
        this.DP.setValue(index, '변환사유', this.remarks);
      });
    },
    async processAddRow() {
      this.GV.commit();
      let jsonRows = this.DP.getJsonRows(0, -1);
      let isRemarksExist = true;
      jsonRows.forEach((row) => {
        var reason = row['Lot변경가능여부'];
        if (!_.isEmpty(reason) && !reason.includes('변경불가') && _.isEmpty(row['변환사유'])) {
          isRemarksExist = false;
        }
      });
      if (!isRemarksExist) {
        this.$toast('info', '변환 사유를 모두 입력해주세요.\n입력 정보에 변환사유는 변환사유일괄적용시 적용됩니다.');
        return;
      }

      if (this.DP.getRowCount() > 0) {
        this.$confirm('확인', 'Lot변경가능여부 확인된 행을 처리하시겠습니까?', async (confirm) => {
          if (confirm) {
            let rowList = [];
            let jsonRows = this.DP.getJsonRows(0, -1);
            //확인한 행만 저장
            jsonRows.forEach((row) => {
              if (!_.isEmpty(row['Lot변경가능여부']) && !row['Lot변경가능여부'].includes('변경불가')) {
                rowList.push(row);
              }
            });

            if (rowList.length > 0) {
              try {
                let params = [];
                rowList.forEach((elem) => {
                  params.push({
                    menuId: 'M0004002',
                    queryId: 'execLotChange',
                    queryParams: elem,
                  });
                });
                let resp = await this.$axios.api.searchAll(params);
                if (resp == null) {
                  this.$toast('info', '에러발생하여 처리되지 않았습니다.');
                } else {
                  const resultIndex = [];
                  let errorMsg = '';
                  resp.forEach((item, index) => {
                    if (!_.isEmpty(item) && item.length > 0 && !_.isEmpty(item[0].message)) resultIndex.push(index);
                    if (!_.isEmpty(item) && item.length > 0 && !_.isEmpty(item[0].errormessage)) errorMsg += item[0].errormessage + '\n';
                  });

                  this.$toast('info', resultIndex.length + '건 처리 완료되었습니다.');
                  if (!_.isEmpty(errorMsg)) {
                    this.$toast('error', errorMsg);
                  } else {
                    this.DP.clearRows();
                    this.isDisabled = true;
                  }
                }
              } catch {
                this.$toast('info', '에러발생. 다시 작업해주세요.');
              }
            } else {
              this.$toast('info', 'LotNo 변경 가능한 건이 없습니다.');
            }
          }
        });
      } else {
        this.$toast('info', '처리할 데이터가 없습니다.');
      }
    },
    handleConfirm(params) {
      let checkRow = params.gridView.getCheckedRows(true);
      if (checkRow.length === 0) {
        console.warn('체크된 행이 없습니다.');
        return;
      }

      let row = params.dataProvider.getJsonRow(checkRow[0]);
      let index = params.dataRow;

      // 유효성 검사
      if (!row) {
        console.error('유효하지 않은 행 데이터입니다.');
        return;
      }

      if (params.gridJs == 'CP0000000003.js') {
        this.poNo = row.poNo;
        this.productCode = row['제품코드'];
      } else if (params.gridJs == 'CP0000000004.js') {
        this.manager = row['작업자명'];
      }
    },
    async popupPoNo() {
      if (_.isEmpty(this.newLotSelectedModel) || _.isEmpty(this.newLotSelectedModel.value)) {
        this.$toast('info', '신Lot제품 유형을 선택하세요.');
        return;
      }
      const params = {
        dialogTitle: 'PO_NO 찾기',
        popUpSize: 'xl', //sm,lg,xl
        height: 500,
        gridJs: 'CP0000000003.js',
        search: {
          menuId: 'CMDIALOG',
          queryId: 'selectDwPoNoInfoMast',
          queryParams: { model: this.newLotSelectedModel.value },
        },
      };
      this.$refs.cmDialog1M0004002.openDialog(params);
    },
    async popupManager() {
      const params = {
        dialogTitle: '담당자 찾기',
        popUpSize: 'lg', //sm,lg,xl
        height: 500,
        gridJs: 'CP0000000004.js',
        search: {
          menuId: 'CMDIALOG',
          queryId: 'selectDwWorkerInfoMast',
          queryParams: {},
        },
      };
      this.$refs.cmDialog1M0004002.openDialog(params);
    },
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
      const day = String(today.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    },
    openChangeLotNoPopup() {
      this.GV.commit();
      this.$refs.changeLotNoPopup.openDialog();
    },
    handleOldLotNoConfirm(params) {
      if (params == null || params.selectedJson == null) {
        this.isDisabled = true;
        this.$toast('info', '선택한 구LotNo 리스트가 없습니다.');

        return;
      }

      this.DP.clearRows();

      params.selectedJson.forEach((item) => {
        this.curProcess = item['공정코드'];
        this.DP.addRow({
          공정코드: item['공정코드'],
          구lotNo: item.lotNo,
        });
      });

      if (this.DP.getRowCount() > 0) {
        this.isDisabled = false;
      } else {
        this.$toast('info', '선택한 구LotNo 리스트가 없습니다.');
        this.isDisabled = true;
      }
    },
    onDataLoadComplatedLotChangeGrid(grid) {},
    setRowStyleCallbackLotChangeGrid(grid, item, fixed) {
      var ret = {};
      var reason = grid.getValue(item.index, 'Lot변경가능여부');
      if (!_.isEmpty(reason) && reason.includes('변경불가')) {
        ret = 'red';
      }
      return ret;
    },
    onEditRowPastedLotChangeGrid(grid, itemIndex, row, fields, oldValues, newValues) {
      if (newValues.length >= 4 && !_.isEmpty(newValues[3])) {
        let ret = true;
        let errorMsg = '';
        if (_.isEmpty(this.poNo)) {
          ret = false;
          errorMsg += 'PO NO를 선택 후 신lotNo 복사 붙여넣기 하세요.\n';
        }
        if (_.isEmpty(this.manager)) {
          ret = false;
          errorMsg += '담당자를 선택 후 신lotNo 복사 붙여넣기 하세요.';
        }

        if (!ret) {
          this.$toast('info', errorMsg);
          grid.setValue(itemIndex, '신lotNo', oldValues[3]);
          return ret;
        }

        if (!_.isEmpty(this.poNo)) {
          grid.setValue(itemIndex, 'poNo', this.poNo);
        }
      }
      var jsonData = this.DP.getJsonRow(row);
      this.confirmRow(row, jsonData);
    },
    onCellEditedLotChangeGrid(grid, itemIndex, row, field) {
      grid.commit();
      let ds = grid.getDataSource();
      let fieldName = ds.getOrgFieldName(field);
      let jsonData = ds.getJsonRow(row);
      if (fieldName == '구lotNo' || fieldName == '신lotNo') {
        this.confirmRow(row, jsonData);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .worker_wrap {
  margin: 0px;
}
</style>
